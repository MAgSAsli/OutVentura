# Supabase Schema - OutVentura

Folder ini berisi schema database PostgreSQL untuk Supabase.

## Cara pakai cepat

1. Buka Supabase Dashboard.
2. Masuk ke project kamu.
3. Buka menu **SQL Editor**.
4. Copy isi file `migrations/202605230001_initial_schema.sql`.
5. Klik **Run**.

## Catatan penting

- Schema ini memakai PostgreSQL, bukan MySQL.
- Kolom `penyewa.telepon` sengaja dipakai karena backend OutVentura saat ini melakukan insert ke kolom `telepon`.
- Tabel inti yang dipakai aplikasi sekarang:
  - `penyewa`
  - `pegawai`
  - `alat`
  - `transaksi`
  - `detail_transaksi`
- Tabel tambahan untuk pengembangan portfolio:
  - `payments`
  - `wishlist`
  - `reviews`
  - `chat_sessions`
  - `chat_messages`

## Cara simpan ke GitHub

```bash
git add supabase/migrations/202605230001_initial_schema.sql supabase/README.md
git commit -m "chore: add supabase database schema"
git push
```
