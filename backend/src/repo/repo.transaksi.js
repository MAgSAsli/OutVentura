import { db } from "../config/config.js";

export const withTransaction = async () => {
  const conn = await db.getConnection();
  await conn.beginTransaction();
  return conn;
};

export const commit = async (conn) => {
  await conn.commit();
  conn.release();
};

export const rollback = async (conn) => {
  await conn.rollback();
  conn.release();
};

export const insertTransaksi = async (conn, data) => {
  const [result] = await conn.query(
    `INSERT INTO transaksi 
     (id_penyewa, id_pegawai, tanggal_transaksi, total_harga, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [
      data.id_penyewa,
      data.id_pegawai,
      data.tanggal_transaksi,
      data.total_harga
    ]
  );
  return result.insertId;
};

export const insertDetail = async (conn, data) => {
  await conn.query(
    `INSERT INTO detail_transaksi
     (id_transaksi, id_alat, jumlah, harga_satuan, subtotal)
     VALUES (?, ?, ?, ?, ?)`,
    Object.values(data)
  );
};

export const updateStok = async (conn, id_alat, jumlah) => {
  await conn.query(
    `UPDATE alat SET stok = stok - ? WHERE id = ?`,
    [jumlah, id_alat]
  );
};

export const findByPenyewa = async (id_penyewa) => {
  const [rows] = await db.query(
    `SELECT t.*, 
      GROUP_CONCAT(a.nama_alat SEPARATOR ', ') AS nama_alat_list
     FROM transaksi t
     LEFT JOIN detail_transaksi dt ON dt.id_transaksi = t.id
     LEFT JOIN alat a ON a.id = dt.id_alat
     WHERE t.id_penyewa = ?
     GROUP BY t.id
     ORDER BY t.tanggal_transaksi DESC`,
    [id_penyewa]
  );
  return rows;
};

export const findDetailById = async (id_transaksi) => {
  const [rows] = await db.query(
    `SELECT dt.*, a.nama_alat, a.gambar, a.kategori
     FROM detail_transaksi dt
     JOIN alat a ON a.id = dt.id_alat
     WHERE dt.id_transaksi = ?`,
    [id_transaksi]
  );
  return rows;
};

export const findAllTransaksi = async () => {
  const [rows] = await db.query(
    `SELECT t.*, p.nama AS nama_penyewa
     FROM transaksi t
     JOIN penyewa p ON p.id = t.id_penyewa
     ORDER BY t.tanggal_transaksi DESC`
  );
  return rows;
};

export const getLaporanBulanan = async (tahun) => {
  const [rows] = await db.query(
    `SELECT 
       MONTH(tanggal_transaksi) AS bulan,
       COUNT(*) AS total_transaksi,
       SUM(total_harga) AS total_pendapatan,
       SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) AS selesai,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'lunas' THEN 1 ELSE 0 END) AS lunas,
       SUM(CASE WHEN status = 'batal' THEN 1 ELSE 0 END) AS batal
     FROM transaksi
     WHERE YEAR(tanggal_transaksi) = ?
     GROUP BY MONTH(tanggal_transaksi)
     ORDER BY bulan ASC`,
    [tahun]
  );
  return rows;
};

export const updateStatus = async (id, status) => {
  await db.query(`UPDATE transaksi SET status = ? WHERE id = ?`, [status, id]);
};
