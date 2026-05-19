import { db } from "../config/config.js";

export const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM penyewa WHERE email=?",
    [email]
  );
  return rows[0];
};

export const create = async (data) => {
  const [res] = await db.query(
    `INSERT INTO penyewa (nama, email, password, telepon, alamat)
     VALUES (?, ?, ?, ?, ?)`,
    [data.nama, data.email, data.password, data.no_hp, data.alamat]
  );
  return res.insertId;
};
