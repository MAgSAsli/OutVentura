import { db } from "../config/config.js";

export const findByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM pegawai WHERE email = $1",
    [email]
  );

  return result.rows[0];
};