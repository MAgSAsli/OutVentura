
```md
# OutVentura

OutVentura adalah aplikasi web full-stack untuk penyewaan alat outdoor. Pengguna dapat melihat katalog alat, memasukkan alat ke keranjang, checkout sewa berdasarkan tanggal, membayar melalui Midtrans, melihat riwayat transaksi, dan admin dapat mengelola alat serta status transaksi.

## Live Server

Aplikasi sudah dapat diakses melalui:

```txt
https://out-ventura-vpiw.vercel.app/
```

Halaman login admin:

```txt
https://out-ventura-vpiw.vercel.app/admin/login
```

## Informasi Login

Gunakan akun berikut untuk masuk ke dashboard admin sesuai role yang tersedia di database production:

| Role | Email | Password | Halaman Login |
|---|---|---|---|
|  Owner | `owner@outventura.com` | `owner123` | `/admin/login` |
|  Admin | `admin@outventura.com` | `admin123` | `/admin/login` |
|  Staff | `staff@outventura.com` | `staff123` | `/admin/login` |

Catatan: backend melakukan autentikasi ke tabel `pegawai`, sehingga email dan password harus sudah terdaftar di tabel tersebut.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | Supabase PostgreSQL |
| Payment Gateway | Midtrans Snap Redirect |
| Auth | bcrypt |
| Runtime | Node.js >= 18 |

## Fitur Utama

- Katalog alat outdoor
- Detail produk
- Keranjang sewa
- Checkout berdasarkan tanggal mulai dan tanggal selesai
- Perhitungan durasi sewa dan total harga
- Integrasi Midtrans Snap Redirect
- Webhook notifikasi pembayaran Midtrans
- Riwayat transaksi penyewa
- Dashboard admin
- Laporan transaksi bulanan
- Manajemen status transaksi
- Auto restore stok saat transaksi batal atau expired

## Struktur Proyek

```txt
OutVentura/
├── backend/
│   ├── src/
│   │   ├── config/          # Koneksi database
│   │   ├── controller/      # Handler HTTP request
│   │   ├── repo/            # Query database
│   │   ├── routes/          # Definisi endpoint API
│   │   ├── services/        # Business logic
│   │   ├── app.js
│   │   └── server.js
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 202605230001_initial_schema.sql
│   │   └── README.md
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── component/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## Prasyarat

- Node.js 18 atau lebih baru
- Akun Supabase
- Akun Midtrans
- Database schema sudah dijalankan di Supabase

## Setup Database Supabase

1. Buka Supabase Dashboard.
2. Masuk ke project kamu.
3. Buka SQL Editor.
4. Copy isi file:

```txt
backend/supabase/migrations/202605230001_initial_schema.sql
```

5. Jalankan query tersebut.

Schema utama yang digunakan aplikasi:

- `penyewa`
- `pegawai`
- `alat`
- `transaksi`
- `detail_transaksi`
- `payments`

View yang digunakan:

- `vw_riwayat_transaksi`
- `vw_laporan_bulanan`

## Setup Backend

Masuk ke folder backend:

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
PORT=7070
DATABASE_URL=postgresql://user:password@host:5432/postgres

MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key

FRONTEND_URL=http://localhost:5173
```

Keterangan:

- `DATABASE_URL` diambil dari connection string Supabase.
- `MIDTRANS_IS_PRODUCTION=false` untuk sandbox.
- `MIDTRANS_IS_PRODUCTION=true` untuk production.
- `MIDTRANS_SERVER_KEY` hanya dipakai backend, jangan taruh di frontend.
- `FRONTEND_URL` dipakai untuk callback finish dari Midtrans.

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di:

```txt
http://localhost:7070
```

## Setup Frontend

Masuk ke folder frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

API frontend mengarah ke:

```txt
http://localhost:7070/api
```

Konfigurasi ada di:

```txt
frontend/src/api.js
```

## Setup Midtrans

OutVentura memakai Midtrans Snap Redirect.

Flow pembayaran:

1. User checkout dari frontend.
2. Backend membuat transaksi dengan status `pending_payment`.
3. Backend request Snap transaction ke Midtrans.
4. Midtrans mengembalikan `token` dan `redirect_url`.
5. User klik `Bayar Sekarang`.
6. User diarahkan ke halaman pembayaran Midtrans.
7. Midtrans mengirim webhook ke backend.
8. Backend update status transaksi.

Webhook URL untuk Midtrans:

```txt
https://domain-backend-kamu/api/transaksi/payment/notification
```

Jika masih lokal, gunakan tunnel seperti ngrok:

```bash
ngrok http 7070
```

Lalu pasang URL seperti ini di dashboard Midtrans:

```txt
https://xxxx.ngrok-free.app/api/transaksi/payment/notification
```

Finish redirect URL diarahkan ke frontend:

```txt
http://localhost:5173/payment/finish
```

Di production, set:

```env
FRONTEND_URL=https://domain-frontend-kamu
MIDTRANS_IS_PRODUCTION=true
```

## Status Transaksi

Status yang digunakan:

| Status | Keterangan |
|---|---|
| `pending` | Menunggu konfirmasi manual |
| `pending_payment` | Menunggu pembayaran |
| `paid` | Pembayaran berhasil dari Midtrans |
| `lunas` | Lunas secara manual/admin |
| `dipinjam` | Barang sedang dipinjam |
| `selesai` | Transaksi selesai |
| `batal` | Transaksi dibatalkan |
| `expired` | Pembayaran kedaluwarsa |

Mapping webhook Midtrans:

| Midtrans Status | OutVentura Status |
|---|---|
| `settlement` | `paid` |
| `capture` + fraud accept | `paid` |
| `capture` + fraud challenge | `pending_payment` |
| `pending` | `pending_payment` |
| `expire` | `expired` |
| `cancel` | `batal` |
| `deny` | `batal` |
| `failure` | `batal` |

Jika transaksi menjadi `batal` atau `expired`, stok alat dikembalikan otomatis.

## API Endpoints

Base URL:

```txt
http://localhost:7070/api
```

### Alat

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/alat` | Ambil semua alat |
| GET | `/alat/:id` | Ambil detail alat |
| POST | `/alat` | Tambah alat |
| PUT | `/alat/:id` | Update alat |
| DELETE | `/alat/:id` | Hapus alat |

### Penyewa

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/penyewa/register` | Registrasi penyewa |
| POST | `/penyewa/login` | Login penyewa |

### Pegawai/Admin

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/pegawai/login` | Login admin |

### Transaksi

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/transaksi` | Checkout dan buat pembayaran Midtrans |
| GET | `/transaksi` | Ambil semua transaksi untuk admin |
| GET | `/transaksi/laporan?tahun=2026` | Laporan bulanan |
| GET | `/transaksi/penyewa/:id_penyewa` | Riwayat penyewa |
| GET | `/transaksi/:id_transaksi/detail` | Detail transaksi |
| PATCH | `/transaksi/:id/status` | Update status transaksi |
| GET | `/transaksi/payment/:order_id` | Cek status pembayaran |
| POST | `/transaksi/payment/notification` | Webhook Midtrans |

Contoh payload checkout:

```json
{
  "id_penyewa": 1,
  "cartItems": [
    {
      "id_alat": 1,
      "jumlah": 2
    }
  ],
  "tanggal_mulai": "2026-05-24",
  "tanggal_selesai": "2026-05-26"
}
```

Response checkout berisi URL pembayaran:

```json
{
  "message": "Transaksi berhasil",
  "data": {
    "transaksi_id": 1,
    "total_harga": 100000,
    "jumlah_hari": 2,
    "tanggal_mulai": "2026-05-24",
    "tanggal_selesai": "2026-05-26",
    "status": "pending_payment",
    "payment_order_id": "OUTVENTURA-1-...",
    "payment_token": "...",
    "payment_redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/..."
  }
}
```

## Halaman Frontend

| Route | Halaman |
|---|---|
| `/` | Home |
| `/products` | Daftar produk |
| `/products/:id` | Detail produk |
| `/cart` | Keranjang |
| `/checkout` | Checkout |
| `/checkout/sukses` | Checkout berhasil dan tombol bayar |
| `/payment/finish` | Halaman callback selesai pembayaran |
| `/riwayat` | Riwayat transaksi penyewa |
| `/login` | Login penyewa |
| `/register` | Register penyewa |
| `/admin/login` | Login admin |
| `/admin` | Dashboard admin |

## Validasi Lokal

Backend syntax check:

```bash
cd backend
node --check src/server.js
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend build:

```bash
cd frontend
npm run build
```

## Troubleshooting

### Port backend 7070 sudah dipakai

Error:

```txt
EADDRINUSE: address already in use :::7070
```

Cek PID:

```powershell
netstat -ano | findstr :7070
```

Matikan proses:

```powershell
taskkill /PID <PID_NYA> /F
```

### Port frontend 5173 sudah dipakai

Cek PID:

```powershell
netstat -ano | findstr :5173
```

Matikan proses:

```powershell
taskkill /PID <PID_NYA> /F
```

### Webhook Midtrans tidak masuk saat lokal

Gunakan ngrok:

```bash
ngrok http 7070
```

Lalu update Notification URL di dashboard Midtrans:

```txt
https://xxxx.ngrok-free.app/api/transaksi/payment/notification
```

### Jangan commit file `.env`

File `.env` berisi secret database dan Midtrans. Pastikan hanya `.env.example` yang masuk repository.

## Tim Pengembang

| Nama | Role |
|---|---|
| Moch. Agil Sugiarto | Backend Developer |
| Wahyu Syahrun Ramadhan | Project Manager |
| M Alfi Syahri | Frontend Developer and UI/UX |
| M Reihan Ersa Putra | Frontend Developer and UI/UX |

## License

ISC
```
