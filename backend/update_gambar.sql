-- Update gambar produk dengan URL dari Unsplash
-- Kategori: Camping (Tenda, Sleeping Bag, Matras)
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500' WHERE nama_alat LIKE '%Tenda%';
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500' WHERE nama_alat LIKE '%Sleeping Bag%';
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=500' WHERE nama_alat LIKE '%Matras%';

-- Kategori: Peralatan Masak
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500' WHERE nama_alat LIKE '%Kompor%';

-- Kategori: Hiking (Sepatu, Carrier, Trekking Pole)
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' WHERE nama_alat LIKE '%Sepatu Hiking Pria%';
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500' WHERE nama_alat LIKE '%Sepatu Hiking Wanita%';
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500' WHERE nama_alat LIKE '%Carrier%';
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500' WHERE nama_alat LIKE '%Trekking Pole%';

-- Kategori: Apparel
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=500' WHERE nama_alat LIKE '%Jas Hujan%';

-- Kategori: Peralatan Cahaya
UPDATE alat SET gambar = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500' WHERE nama_alat LIKE '%Senter%';
