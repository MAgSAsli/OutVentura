import { db } from "../config/config.js";

export const findAll = async () => {
  const result = await db.query(
    "SELECT id, nama, email, created_at, updated_at FROM pegawai ORDER BY id DESC"
  );

  return result.rows;
};

export const findByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM pegawai WHERE email = $1",
    [email]
  );

  return result.rows[0];
};
