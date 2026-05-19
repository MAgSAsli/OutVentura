import * as repo from "../repo/repo.transaksi.js";

export const createTransaksi = async (data) => {
  const {
    id_penyewa,
    id_pegawai = null,
    cartItems,
    tanggal_mulai,
    tanggal_selesai
  } = data;

  if (!cartItems || cartItems.length === 0) throw new Error("Cart kosong");

  const start = new Date(tanggal_mulai);
  const end = new Date(tanggal_selesai);
  if (end <= start) throw new Error("Tanggal sewa tidak valid");

  const jumlah_hari = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const total_harga = cartItems.reduce((total, item) => total + item.harga * item.jumlah * jumlah_hari, 0);
  const tanggal_transaksi = new Date().toISOString().split("T")[0];

  let conn;
  try {
    conn = await repo.withTransaction();
    const transaksiId = await repo.insertTransaksi(conn, { id_penyewa, id_pegawai, tanggal_transaksi, total_harga });

    for (const item of cartItems) {
      const subtotal = item.harga * item.jumlah * jumlah_hari;
      await repo.insertDetail(conn, { id_transaksi: transaksiId, id_alat: item.id_alat, jumlah: item.jumlah, harga_satuan: item.harga, subtotal });
      await repo.updateStok(conn, item.id_alat, item.jumlah);
    }

    await repo.commit(conn);
    return { transaksi_id: transaksiId, total_harga, jumlah_hari, tanggal_mulai, tanggal_selesai };
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
  const valid = ['pending', 'lunas', 'selesai', 'batal'];
  if (!valid.includes(status)) throw new Error("Status tidak valid");
  return repo.updateStatus(id, status);
};

export const getLaporanBulanan = async (tahun) => {
  return repo.getLaporanBulanan(tahun);
};
