import { db } from "../config/config.js";

export const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM pegawai WHERE email=?",
    [email]
  );
  return rows[0];
};
