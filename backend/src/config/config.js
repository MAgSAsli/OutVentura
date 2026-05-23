import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.query("SELECT NOW()")
  .then(() => {
    console.log("✅ Supabase PostgreSQL connected");
  })
  .catch((err) => {
    console.error("❌ Supabase DB Error:", err.message);
  });