import { db } from "../config/config.js";

export const findAll = async () => {
  const result = await db.query(
    "SELECT id, nama, email, telepon, alamat, created_at, updated_at FROM penyewa ORDER BY id DESC"
  );

  return result.rows;
};

export const findById = async (id) => {
  const result = await db.query(
    "SELECT id, nama, email, telepon, alamat, created_at, updated_at FROM penyewa WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const findByEmail = async (email) => {
  // Include password for authentication
  const result = await db.query(
    "SELECT id, nama, email, password, telepon, alamat, created_at, updated_at FROM penyewa WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

export const create = async (data) => {
  const result = await db.query(
    `INSERT INTO penyewa (nama, email, password, telepon, alamat, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, nama, email, telepon, alamat, created_at, updated_at`,
    [
      data.nama,
      data.email,
      data.password,
      data.telepon || data.no_hp || null,
      data.alamat,
    ]
  );

  return result.rows[0];
};

export const update = async (id, data) => {
  const result = await db.query(
    `UPDATE penyewa
     SET nama = $1, email = $2, telepon = $3, alamat = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, nama, email, telepon, alamat, created_at, updated_at`,
    [data.nama, data.email, data.telepon, data.alamat, id]
  );

  return result.rows[0];
};

export const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM penyewa WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rows[0];
};
