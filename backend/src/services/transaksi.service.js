import * as repo from "../repo/repo.transaksi.js";
import {
  createSnapTransaction,
  mapPaymentStatus,
  verifyNotificationSignature,
} from "./midtrans.service.js";

const PAID_AT_STATUSES = ["capture", "settlement"];

const parseRentalDate = (value, fieldName) => {
  if (!value) throw new Error(`${fieldName} wajib diisi`);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${fieldName} tidak valid`);

  return date;
};

const normalizeCartItems = (cartItems) => {
  if (!cartItems || cartItems.length === 0) throw new Error("Cart kosong");

  const itemsById = new Map();

  for (const item of cartItems) {
    const jumlah = Number(item.jumlah);
    const id_alat = item.id_alat == null ? "" : String(item.id_alat).trim();

    if (!id_alat) throw new Error("Alat tidak valid");
    if (!Number.isInteger(jumlah) || jumlah <= 0) {
      throw new Error("Jumlah alat tidak valid");
    }

    const existing = itemsById.get(id_alat);
    itemsById.set(id_alat, {
      id_alat,
      jumlah: (existing?.jumlah || 0) + jumlah,
    });
  }

  return [...itemsById.values()];
};

const getCheckoutItems = async (conn, cartItems, jumlah_hari) => {
  const alatRows = await repo.findAlatByIds(conn, cartItems.map((item) => item.id_alat));
  const alatById = new Map(alatRows.map((alat) => [String(alat.id), alat]));

  return cartItems.map((item) => {
    const alat = alatById.get(String(item.id_alat));
    if (!alat) throw new Error("Alat tidak ditemukan");

    const harga = Number(alat.harga);
    if (!Number.isFinite(harga) || harga < 0) throw new Error("Harga alat tidak valid");

    const subtotal = harga * item.jumlah * jumlah_hari;
    return {
      id_alat: item.id_alat,
      nama_alat: alat.nama_alat,
      jumlah: item.jumlah,
      harga,
      subtotal,
      harga_sewa: harga * jumlah_hari,
    };
  });
};

const buildPaymentPayload = ({ order_id, total_harga, items, penyewa }) => ({
  transaction_details: {
    order_id,
    gross_amount: total_harga,
  },
  item_details: items.map((item) => ({
    id: String(item.id_alat),
    price: item.harga_sewa,
    quantity: item.jumlah,
    name: item.nama_alat,
  })),
  customer_details: {
    first_name: penyewa.nama,
    email: penyewa.email,
    phone: penyewa.telepon || undefined,
    billing_address: penyewa.alamat ? { address: penyewa.alamat } : undefined,
  },
});

const buildOrderId = (transaksiId) => `OUTVENTURA-${transaksiId}-${Date.now()}`;

const parseGrossAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) throw new Error("Gross amount Midtrans tidak valid");

  return Math.round(amount);
};

const parsePaidAt = (notification) => {
  if (!PAID_AT_STATUSES.includes(notification.transaction_status)) return null;

  const value = notification.settlement_time || notification.transaction_time;
  if (!value) return new Date();

  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const toPaymentResponse = ({ transaksi, snap, order_id }) => ({
  transaksi_id: transaksi.id,
  total_harga: Number(transaksi.total_harga),
  jumlah_hari: Number(transaksi.jumlah_hari),
  tanggal_mulai: transaksi.tanggal_mulai,
  tanggal_selesai: transaksi.tanggal_selesai,
  status: transaksi.status,
  payment_order_id: order_id,
  payment_token: snap.token,
  payment_redirect_url: snap.redirect_url,
});

export const createTransaksi = async (data) => {
  const {
    id_penyewa,
    id_pegawai = null,
    cartItems,
    tanggal_mulai,
    tanggal_selesai
  } = data;

  if (!id_penyewa) throw new Error("Penyewa tidak valid");

  const items = normalizeCartItems(cartItems);
  const start = parseRentalDate(tanggal_mulai, "Tanggal mulai");
  const end = parseRentalDate(tanggal_selesai, "Tanggal selesai");
  if (end <= start) throw new Error("Tanggal sewa tidak valid");

  const jumlah_hari = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const tanggal_transaksi = new Date().toISOString().split("T")[0];

  let conn;
  try {
    conn = await repo.withTransaction();
    const penyewa = await repo.findPenyewaById(conn, id_penyewa);
    if (!penyewa) throw new Error("Penyewa tidak ditemukan");

    const checkoutItems = await getCheckoutItems(conn, items, jumlah_hari);
    const total_harga = checkoutItems.reduce((total, item) => total + item.subtotal, 0);
    const transaksiId = await repo.insertTransaksi(conn, {
      id_penyewa,
      id_pegawai,
      tanggal_transaksi,
      tanggal_mulai,
      tanggal_selesai,
      total_harga,
      status: "pending_payment",
    });

    for (const item of checkoutItems) {
      await repo.insertDetail(conn, {
        id_transaksi: transaksiId,
        id_alat: item.id_alat,
        jumlah: item.jumlah,
        harga_satuan: item.harga,
        subtotal: item.subtotal,
      });
      await repo.updateStok(conn, item.id_alat, item.jumlah);
    }

    const order_id = buildOrderId(transaksiId);
    const snap = await createSnapTransaction(
      buildPaymentPayload({
        order_id,
        total_harga,
        items: checkoutItems,
        penyewa,
      })
    );
    const transaksi = await repo.updatePaymentInfo(conn, transaksiId, {
      status: "pending_payment",
      payment_order_id: order_id,
      payment_token: snap.token,
      payment_redirect_url: snap.redirect_url,
    });

    await repo.upsertPayment(conn, {
      id_transaksi: transaksiId,
      order_id,
      gross_amount: total_harga,
      transaction_status: "pending",
      raw_response: snap,
    });

    await repo.commit(conn);
    conn = null;
    return toPaymentResponse({ transaksi, snap, order_id });
  } catch (error) {
    if (conn) await repo.rollback(conn);
    throw error;
  }
};

export const getRiwayat = async (id_penyewa) => {
  const transaksi = await repo.findByPenyewa(id_penyewa);
  return transaksi;
};

export const getDetailTransaksi = async (id_transaksi) => {
  return repo.findDetailById(id_transaksi);
};

export const getAllTransaksi = async () => {
  return repo.findAllTransaksi();
};

export const updateStatus = async (id, status) => {
  if (!repo.VALID_STATUSES.includes(status)) throw new Error("Status tidak valid");

  if (!repo.RELEASE_STOCK_STATUSES.includes(status)) {
    const updated = await repo.updateStatus(id, status);
    if (!updated) throw new Error("Transaksi tidak ditemukan");

    return updated;
  }

  let conn;
  try {
    conn = await repo.withTransaction();
    const transaksi = await repo.findTransaksiByIdForUpdate(conn, id);
    if (!transaksi) throw new Error("Transaksi tidak ditemukan");

    if (!repo.RELEASE_STOCK_STATUSES.includes(transaksi.status)) {
      await repo.restoreStokByTransaksi(conn, id);
    }

    const updated = await repo.updateStatusInTransaction(conn, id, status);
    await repo.commit(conn);
    conn = null;

    return updated;
  } catch (error) {
    if (conn) await repo.rollback(conn);
    throw error;
  }
};

export const getLaporanBulanan = async (tahun) => {
  const selectedYear = Number(tahun);
  if (!Number.isInteger(selectedYear)) throw new Error("Tahun tidak valid");

  return repo.getLaporanBulanan(selectedYear);
};

export const getPaymentStatus = async (order_id) => {
  if (!order_id) throw new Error("Order ID tidak valid");

  const transaksi = await repo.findByPaymentOrderId(order_id);
  if (!transaksi) throw new Error("Transaksi pembayaran tidak ditemukan");

  return transaksi;
};

export const handlePaymentNotification = async (notification) => {
  verifyNotificationSignature(notification);

  const status = mapPaymentStatus(notification);
  if (!status) {
    return { ignored: true, order_id: notification.order_id };
  }

  let conn;
  try {
    conn = await repo.withTransaction();
    const updated = await repo.updateFromPaymentNotification(conn, {
      order_id: notification.order_id,
      transaction_id: notification.transaction_id,
      gross_amount: parseGrossAmount(notification.gross_amount),
      payment_type: notification.payment_type,
      transaction_status: notification.transaction_status,
      fraud_status: notification.fraud_status,
      raw_response: notification,
      status,
      paid_at: parsePaidAt(notification),
    });

    await repo.commit(conn);
    conn = null;

    return updated;
  } catch (error) {
    if (conn) await repo.rollback(conn);
    throw error;
  }
};
