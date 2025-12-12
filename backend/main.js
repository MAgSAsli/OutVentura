const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// === DATABASE POOL ===
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "outdoor",
  connectionLimit: 10
});

// Test koneksi awal
db.getConnection((err, conn) => {
  if (err) {
    console.log("❌ Database gagal koneksi:", err);
    return;
  }
  console.log("✅ Terhubung ke database OUTDOOR");
  conn.release();
});

// ================================================================
// ====================== ROUTES UNTUK ALAT =======================
// ================================================================

// GET semua alat
app.get("/api/alat", (req, res) => {
  const query = "SELECT * FROM alat";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET alat by ID
app.get("/api/alat/:id", (req, res) => {
  db.query("SELECT * FROM alat WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Alat tidak ditemukan" });
    res.json(results[0]);
  });
});

// ADD alat
app.post("/api/alat", (req, res) => {
  const { nama_alat, kategori, harga, stok, deskripsi, gambar } = req.body;

  const q = `
    INSERT INTO alat (nama_alat, kategori, harga, stok, deskripsi, gambar)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(q, [nama_alat, kategori, harga, stok, deskripsi, gambar], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Alat berhasil ditambahkan!", id: result.insertId });
  });
});

// EDIT alat
app.put("/api/alat/:id", (req, res) => {
  const { nama_alat, kategori, harga, stok, deskripsi, gambar } = req.body;

  const q = `
    UPDATE alat SET nama_alat=?, kategori=?, harga=?, stok=?, deskripsi=?, gambar=?
    WHERE id=?
  `;

  db.query(q, [nama_alat, kategori, harga, stok, deskripsi, gambar, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Data alat berhasil diupdate" });
  });
});

// DELETE alat
app.delete("/api/alat/:id", (req, res) => {
  db.query("DELETE FROM alat WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Alat berhasil dihapus" });
  });
});

// ================================================================
// ===================== ROUTES UNTUK PENYEWA =====================
// ================================================================

// GET semua penyewa
app.get('/api/penyewa', (req, res) => {
  const q = "SELECT id, nama, email, telepon, alamat FROM penyewa";

  db.query(q, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});


app.post("/api/penyewa/register", async (req, res) => {
  const { nama, email, telepon, alamat, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO penyewa (nama, email, telepon, alamat, password) VALUES (?, ?, ?, ?, ?)",
      [nama, email, telepon, alamat, hashed],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Registrasi berhasil!", id: result.insertId });
      }
    );
  } catch (e) {
    res.status(500).json(e);
  }
});

// LOGIN penyewa
app.post("/api/penyewa/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM penyewa WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Password salah" });

    res.json({ message: "Login berhasil", id: user.id, nama: user.nama });
  });
});

// ================================================================
// ===================== ROUTES UNTUK TRANSAKSI ===================
// ================================================================

// UPDATE stok alat sesuai jumlah
function updateStok(connection, id, jumlah) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE alat SET stok = stok - ? WHERE id = ?",
      [jumlah, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

app.post("/api/transaksi", (req, res) => {
  const { id_penyewa, cartItems, total_harga, tanggal_mulai, tanggal_selesai, id_pegawai = null } = req.body;

  const tanggal_transaksi = new Date().toISOString().split("T")[0];
  const jumlah_hari = Math.ceil((new Date(tanggal_selesai) - new Date(tanggal_mulai)) / (1000 * 60 * 60 * 24));

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json(err);

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json(err);
      }

      const q =
        "INSERT INTO transaksi (id_penyewa, id_pegawai, tanggal_transaksi, total_harga, status) VALUES (?, ?, ?, ?, 'pending')";

      connection.query(
        q,
        [id_penyewa, id_pegawai, tanggal_transaksi, total_harga],
        (err, result) => {
          if (err) {
            connection.rollback(() => connection.release());
            return res.status(500).json(err);
          }

          const transId = result.insertId;

          const detailPromises = cartItems.map((item) => {
            const subtotal = item.harga * jumlah_hari * item.jumlah;

            return new Promise((resolve, reject) => {
              connection.query(
                "INSERT INTO detail_transaksi (id_transaksi, id_alat, jumlah, harga_satuan, subtotal) VALUES (?, ?, ?, ?, ?)",
                [transId, item.id, item.jumlah, item.harga, subtotal],
                (err) => {
                  if (err) return reject(err);

                  updateStok(connection, item.id, item.jumlah)
                    .then(resolve)
                    .catch(reject);
                }
              );
            });
          });

          Promise.all(detailPromises)
            .then(() => {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => connection.release());
                  return res.status(500).json(err);
                }
                connection.release();
                res.status(201).json({ message: "Transaksi berhasil!", id: transId });
              });
            })
            .catch(() => {
              connection.rollback(() => connection.release());
              res.status(500).json({ message: "Gagal menyimpan detail transaksi" });
            });
        }
      );
    });
  });
});

// GET semua transaksi
app.get("/api/transaksi", (req, res) => {
  const q = `
    SELECT 
      t.*, 
      p.nama AS nama_penyewa,
      GROUP_CONCAT(a.nama_alat) AS alat_dipinjam
    FROM transaksi t
    JOIN penyewa p ON t.id_penyewa = p.id
    LEFT JOIN detail_transaksi dt ON t.id = dt.id_transaksi
    LEFT JOIN alat a ON dt.id_alat = a.id
    GROUP BY t.id
  `;

  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// ================================================================
// ======================== ROUTES PEGAWAI ========================
// ================================================================

app.get('/api/pegawai', (req, res) => {
  db.query('SELECT id, nama, email, jabatan FROM pegawai', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});


app.post("/api/pegawai/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM pegawai WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: "Pegawai tidak ditemukan" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Password salah" });

    res.json({ message: "Login admin berhasil", id: user.id, nama: user.nama });
  });
});

// ================================================================

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
