import { db } from "../config/config.js";

export const findByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM penyewa WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

export const create = async (data) => {
  const result = await db.query(
    `INSERT INTO penyewa (nama, email, password, telepon, alamat)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      data.nama,
      data.email,
      data.password,
      data.telepon || data.no_hp || null,
      data.alamat,
    ]
  );

  return result.rows[0].id;
};