import { db } from "../config/config.js";

export const findAll = async () => {
  const result = await db.query(
    "SELECT id, nama, email, nomor_telepon, role, created_at, updated_at FROM pegawai ORDER BY id DESC"
  );

  return result.rows;
};

export const findById = async (id) => {
  const result = await db.query(
    "SELECT id, nama, email, nomor_telepon, role, created_at, updated_at FROM pegawai WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const findByEmail = async (email) => {
  // Include password for authentication purposes
  const result = await db.query(
    "SELECT id, nama, email, password, role, created_at, updated_at FROM pegawai WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

export const create = async (data) => {
  const { nama, email, password, nomor_telepon } = data;

  const result = await db.query(
    `INSERT INTO pegawai (nama, email, password, nomor_telepon, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, nama, email, nomor_telepon, role, created_at, updated_at`,
    [nama, email, password, nomor_telepon, "pegawai"]
  );

  return result.rows[0];
};

export const update = async (id, data) => {
  const { nama, email, nomor_telepon } = data;

  const result = await db.query(
    `UPDATE pegawai 
     SET nama = $1, email = $2, nomor_telepon = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, nama, email, nomor_telepon, role, created_at, updated_at`,
    [nama, email, nomor_telepon, id]
  );

  return result.rows[0];
};

export const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM pegawai WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rows[0];
};
