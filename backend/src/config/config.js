import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

db.getConnection()
  .then((conn) => {
    console.log("✅ DB connected as:", process.env.DB_USER);
    conn.release();
  })
  .catch((err) => console.error("❌ DB Error:", err.message));
