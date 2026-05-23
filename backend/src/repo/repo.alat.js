import { db } from "../config/config.js";

export const findAll = async () => {
  const result = await db.query("SELECT * FROM alat ORDER BY id DESC");
  return result.rows;
};

export const findById = async (id) => {
  const result = await db.query("SELECT * FROM alat WHERE id = $1", [id]);
  return result.rows[0];
};

export const create = async (data) => {
  const result = await db.query(
    `INSERT INTO alat (nama_alat, kategori, harga, stok, deskripsi, gambar)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [
      data.nama_alat,
      data.kategori,
      data.harga,
      data.stok,
      data.deskripsi,
      data.gambar,
    ]
  );

  return result.rows[0].id;
};

export const update = async (id, data) => {
  await db.query(
    `UPDATE alat
     SET nama_alat = $1,
         kategori = $2,
         harga = $3,
         stok = $4,
         deskripsi = $5,
         gambar = $6
     WHERE id = $7`,
    [
      data.nama_alat,
      data.kategori,
      data.harga,
      data.stok,
      data.deskripsi,
      data.gambar,
      id,
    ]
  );
};

export const remove = async (id) => {
  await db.query("DELETE FROM alat WHERE id = $1", [id]);
};