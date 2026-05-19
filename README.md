# 🏕️ OutVentura — Sistem Penyewaan Alat Outdoor

OutVentura adalah aplikasi web full-stack untuk penyewaan alat outdoor. Pengguna dapat melihat katalog alat, menambahkan ke keranjang, dan melakukan transaksi sewa secara online.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MySQL |
| HTTP Client | Axios |
| Auth | bcrypt |

---

## 📁 Struktur Proyek

```
OutVentura/
├── backend/
│   └── src/
│       ├── config/         # Koneksi database
│       ├── controller/     # Handler request HTTP
│       ├── routes/         # Definisi endpoint API
│       ├── services/       # Business logic
│       └── repo/           # Query database
└── frontend/
    └── src/
        ├── animations/     # Framer Motion variants
        ├── component/      # Komponen reusable (Header, Footer, dll)
        ├── context/        # CartContext (React Context API)
        ├── hooks/          # Custom hooks (useCart)
        ├── layout/         # Layout wrapper
        └── pages/          # Halaman utama aplikasi
```

---

## ⚙️ Instalasi & Menjalankan

### Prasyarat
- Node.js >= 18
- MySQL

### 1. Clone Repository

```bash
git clone https://github.com/magsasli/OutVentura.git
cd OutVentura
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=outdoor
PORT=7070
```

Jalankan backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`, backend di `http://localhost:7070`.

---

## 🗄️ Skema Database

```sql
CREATE TABLE penyewa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  no_hp VARCHAR(20),
  alamat TEXT
);

CREATE TABLE pegawai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE alat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_alat VARCHAR(100),
  kategori VARCHAR(50),
  harga INT,
  stok INT,
  deskripsi TEXT,
  gambar VARCHAR(255)
);

CREATE TABLE transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_penyewa INT,
  id_pegawai INT,
  tanggal_transaksi DATE,
  total_harga INT,
  status ENUM('pending', 'lunas', 'selesai') DEFAULT 'pending',
  FOREIGN KEY (id_penyewa) REFERENCES penyewa(id),
  FOREIGN KEY (id_pegawai) REFERENCES pegawai(id)
);

CREATE TABLE detail_transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_transaksi INT,
  id_alat INT,
  jumlah INT,
  harga_satuan INT,
  subtotal INT,
  FOREIGN KEY (id_transaksi) REFERENCES transaksi(id),
  FOREIGN KEY (id_alat) REFERENCES alat(id)
);
```

---

## 🔌 API Endpoints

### Alat
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/alat` | Ambil semua alat |
| GET | `/api/alat/:id` | Ambil alat by ID |
| POST | `/api/alat` | Tambah alat baru |
| PUT | `/api/alat/:id` | Update alat |
| DELETE | `/api/alat/:id` | Hapus alat |

### Penyewa
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/penyewa/register` | Registrasi penyewa |
| POST | `/api/penyewa/login` | Login penyewa |

### Pegawai
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/pegawai/login` | Login pegawai/admin |

### Transaksi
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/transaksi` | Buat transaksi baru |

---

## 📄 Halaman Frontend

| Route | Halaman |
|---|---|
| `/` | Home — katalog alat |
| `/products` | Daftar semua produk |
| `/products/:id` | Detail produk |
| `/cart` | Keranjang sewa |
| `/checkout` | Form checkout & konfirmasi sewa |
| `/login` | Login penyewa |
| `/register` | Registrasi penyewa |
| `/admin` | Dashboard admin |

---

## 👥 Tim Pengembang

| Nama | Role | GitHub |
|---|---|---|
| Moch. Agil Sugiarto | Backend Developer | [@magsasli](https://github.com/magsasli) |
| Wahyu Syahrun Ramadhan | Project Manager | — |
| M Alfi Syahri | Frontend Developer & UI/UX | — |
| M Reihan Ersa Putra | Frontend Developer & UI/UX | — |

---

## 📝 License

ISC
