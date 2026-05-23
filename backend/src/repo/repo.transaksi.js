import { db } from "../config/config.js";

export const VALID_STATUSES = [
  "pending",
  "lunas",
  "selesai",
  "batal",
  "pending_payment",
  "paid",
  "dipinjam",
  "expired",
];

export const RELEASE_STOCK_STATUSES = ["batal", "expired"];

export const withTransaction = async () => {
  const conn = await db.connect();

  try {
    await conn.query("BEGIN");
  } catch (error) {
    conn.release();
    throw error;
  }

  return conn;
};

export const commit = async (conn) => {
  await conn.query("COMMIT");
  conn.release();
};

export const rollback = async (conn) => {
  try {
    await conn.query("ROLLBACK");
  } finally {
    conn.release();
  }
};

export const insertTransaksi = async (conn, data) => {
  const result = await conn.query(
    `INSERT INTO transaksi
     (id_penyewa, id_pegawai, tanggal_transaksi, tanggal_mulai, tanggal_selesai, total_harga, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      data.id_penyewa,
      data.id_pegawai,
      data.tanggal_transaksi,
      data.tanggal_mulai,
      data.tanggal_selesai,
      data.total_harga,
      data.status || "pending",
    ]
  );
  return result.rows[0].id;
};

export const findPenyewaById = async (conn, id_penyewa) => {
  const result = await conn.query(
    `SELECT id, nama, email, telepon, alamat
     FROM penyewa
     WHERE id = $1`,
    [id_penyewa]
  );

  return result.rows[0];
};

export const findAlatByIds = async (conn, ids) => {
  const result = await conn.query(
    `SELECT id, nama_alat, harga, stok
     FROM alat
     WHERE id = ANY($1::bigint[])`,
    [ids]
  );

  return result.rows;
};

export const insertDetail = async (conn, data) => {
  await conn.query(
    `INSERT INTO detail_transaksi
     (id_transaksi, id_alat, jumlah, harga_satuan, subtotal)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      data.id_transaksi,
      data.id_alat,
      data.jumlah,
      data.harga_satuan,
      data.subtotal,
    ]
  );
};

export const updatePaymentInfo = async (conn, id, data) => {
  const result = await conn.query(
    `UPDATE transaksi
     SET status = $1,
         payment_order_id = $2,
         payment_token = $3,
         payment_redirect_url = $4
     WHERE id = $5
     RETURNING *`,
    [
      data.status,
      data.payment_order_id,
      data.payment_token,
      data.payment_redirect_url,
      id,
    ]
  );

  return result.rows[0];
};

export const upsertPayment = async (conn, data) => {
  const result = await conn.query(
    `INSERT INTO payments
       (id_transaksi, order_id, transaction_id, gross_amount, payment_type, transaction_status, fraud_status, raw_response)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (order_id)
     DO UPDATE SET
       transaction_id = EXCLUDED.transaction_id,
       gross_amount = EXCLUDED.gross_amount,
       payment_type = EXCLUDED.payment_type,
       transaction_status = EXCLUDED.transaction_status,
       fraud_status = EXCLUDED.fraud_status,
       raw_response = EXCLUDED.raw_response
     RETURNING *`,
    [
      data.id_transaksi,
      data.order_id,
      data.transaction_id || null,
      data.gross_amount,
      data.payment_type || null,
      data.transaction_status,
      data.fraud_status || null,
      data.raw_response || {},
    ]
  );

  return result.rows[0];
};

export const updateStok = async (conn, id_alat, jumlah) => {
  const result = await conn.query(
    `UPDATE alat
     SET stok = stok - $1
     WHERE id = $2
       AND stok >= $1
     RETURNING id`,
    [jumlah, id_alat]
  );

  if (result.rowCount === 0) {
    throw new Error("Stok alat tidak mencukupi atau alat tidak ditemukan");
  }
};

export const findByPenyewa = async (id_penyewa) => {
  const result = await db.query(
    `SELECT *
     FROM vw_riwayat_transaksi
     WHERE id_penyewa = $1
     ORDER BY tanggal_transaksi DESC, id DESC`,
    [id_penyewa]
  );

  return result.rows;
};

export const findDetailById = async (id_transaksi) => {
  const result = await db.query(
    `SELECT dt.*, a.nama_alat, a.gambar, a.kategori
     FROM detail_transaksi dt
     JOIN alat a ON a.id = dt.id_alat
     WHERE dt.id_transaksi = $1
     ORDER BY dt.id ASC`,
    [id_transaksi]
  );

  return result.rows;
};

export const findAllTransaksi = async () => {
  const result = await db.query(
    `SELECT t.*, p.nama AS nama_penyewa
     FROM vw_riwayat_transaksi t
     JOIN penyewa p ON p.id = t.id_penyewa
     ORDER BY t.tanggal_transaksi DESC, t.id DESC`
  );

  return result.rows;
};

export const findByPaymentOrderId = async (order_id) => {
  const result = await db.query(
    `SELECT t.*, p.nama AS nama_penyewa, pay.transaction_status, pay.fraud_status
     FROM transaksi t
     JOIN penyewa p ON p.id = t.id_penyewa
     LEFT JOIN payments pay ON pay.order_id = t.payment_order_id
     WHERE t.payment_order_id = $1`,
    [order_id]
  );

  return result.rows[0];
};

export const findTransaksiByIdForUpdate = async (conn, id) => {
  const result = await conn.query(
    `SELECT *
     FROM transaksi
     WHERE id = $1
     FOR UPDATE`,
    [id]
  );

  return result.rows[0];
};

export const restoreStokByTransaksi = async (conn, id_transaksi) => {
  await conn.query(
    `UPDATE alat a
     SET stok = a.stok + dt.jumlah
     FROM (
       SELECT id_alat, SUM(jumlah)::int AS jumlah
       FROM detail_transaksi
       WHERE id_transaksi = $1
       GROUP BY id_alat
     ) dt
     WHERE a.id = dt.id_alat`,
    [id_transaksi]
  );
};

export const getLaporanBulanan = async (tahun) => {
  const result = await db.query(
    `SELECT *
     FROM vw_laporan_bulanan
     WHERE tahun = $1
     ORDER BY bulan ASC`,
    [tahun]
  );

  return result.rows;
};

export const updateStatus = async (id, status) => {
  const result = await db.query(
    `UPDATE transaksi
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

export const updateStatusInTransaction = async (conn, id, status) => {
  const result = await conn.query(
    `UPDATE transaksi
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

export const updateFromPaymentNotification = async (conn, data) => {
  const transaksi = await conn.query(
    `SELECT id, status
     FROM transaksi
     WHERE payment_order_id = $1
     FOR UPDATE`,
    [data.order_id]
  );

  if (transaksi.rowCount === 0) {
    throw new Error("Transaksi pembayaran tidak ditemukan");
  }

  const shouldRestoreStock =
    RELEASE_STOCK_STATUSES.includes(data.status) &&
    !RELEASE_STOCK_STATUSES.includes(transaksi.rows[0].status);

  if (shouldRestoreStock) {
    await restoreStokByTransaksi(conn, transaksi.rows[0].id);
  }

  await upsertPayment(conn, {
    id_transaksi: transaksi.rows[0].id,
    order_id: data.order_id,
    transaction_id: data.transaction_id,
    gross_amount: data.gross_amount,
    payment_type: data.payment_type,
    transaction_status: data.transaction_status,
    fraud_status: data.fraud_status,
    raw_response: data.raw_response,
  });

  const result = await conn.query(
    `UPDATE transaksi
     SET status = $1,
         payment_method = $2,
         paid_at = COALESCE($3, paid_at)
     WHERE id = $4
     RETURNING *`,
    [
      data.status,
      data.payment_type || null,
      data.paid_at || null,
      transaksi.rows[0].id,
    ]
  );

  return result.rows[0];
};
