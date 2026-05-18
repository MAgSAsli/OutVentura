import { db } from "../config/config.js";

export const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM alat");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM alat WHERE id=?", [id]);
  return rows[0];
};

export const create = async (data) => {
  const [res] = await db.query(
    `INSERT INTO alat (nama_alat, kategori, harga, stok, deskripsi, gambar)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.nama_alat, data.kategori, data.harga, data.stok, data.deskripsi, data.gambar]
  );
  return res.insertId;
};

export const update = async (id, data) => {
  await db.query(
    `UPDATE alat SET nama_alat=?, kategori=?, harga=?, stok=?, deskripsi=?, gambar=?
     WHERE id=?`,
    [data.nama_alat, data.kategori, data.harga, data.stok, data.deskripsi, data.gambar, id]
  );
};

export const remove = async (id) => {
  await db.query("DELETE FROM alat WHERE id=?", [id]);
};
