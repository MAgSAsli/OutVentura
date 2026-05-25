import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import useCart from '../hooks/useCart';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const searchQuery = (searchParams.get('q') || '').trim();
  const normalizedSearch = searchQuery.toLowerCase();

  useEffect(() => {
    api.get('/alat')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Ambil kategori unik dari data
  const categories = ['Semua', ...new Set(products.map(p => p.kategori))];

  // Filter
  let filtered = products.filter(p => {
    if (activeKategori !== 'Semua' && p.kategori !== activeKategori) return false;
    if (normalizedSearch) {
      const searchableText = [
        p.nama_alat,
        p.kategori,
        p.deskripsi,
      ].filter(Boolean).join(' ').toLowerCase();

      if (!searchableText.includes(normalizedSearch)) return false;
    }
    return true;
  });

  // Sort
  if (sortBy === 'harga-asc') filtered = [...filtered].sort((a, b) => a.harga - b.harga);
  if (sortBy === 'harga-desc') filtered = [...filtered].sort((a, b) => b.harga - a.harga);
  if (sortBy === 'nama') filtered = [...filtered].sort((a, b) => a.nama_alat.localeCompare(b.nama_alat));
  if (sortBy === 'stok') filtered = [...filtered].sort((a, b) => b.stok - a.stok);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">

        {/* Sidebar Filter */}
        <aside className="w-52 shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Kategori</h3>
            <ul className="space-y-1">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <li key={i} className="animate-pulse h-8 bg-gray-100 rounded-lg" />
                  ))
                : categories.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveKategori(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          activeKategori === cat
                            ? 'bg-[#00AA5B] text-white font-semibold'
                            : 'text-gray-600 hover:bg-green-50 hover:text-[#00AA5B]'
                        }`}
                      >
                        {cat}
                        <span className={`float-right text-xs ${activeKategori === cat ? 'text-green-100' : 'text-gray-400'}`}>
                          {cat === 'Semua' ? products.length : products.filter(p => p.kategori === cat).length}
                        </span>
                      </button>
                    </li>
                  ))
              }
            </ul>

            <hr className="my-4" />

            <h3 className="font-bold text-gray-800 mb-3 text-sm">Stok</h3>
            <ul className="space-y-1">
              {[
                { label: 'Semua Stok', value: 'all' },
                { label: 'Tersedia', value: 'available' },
              ].map(opt => (
                <li key={opt.value}>
                  <button
                    onClick={() => setSortBy(opt.value === 'available' ? 'stok' : 'default')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      (opt.value === 'available' && sortBy === 'stok') || (opt.value === 'all' && sortBy === 'default')
                        ? 'bg-[#00AA5B] text-white font-semibold'
                        : 'text-gray-600 hover:bg-green-50 hover:text-[#00AA5B]'
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {searchQuery ? `Hasil: "${searchQuery}"` : activeKategori === 'Semua' ? 'Semua Alat Outdoor' : activeKategori}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{filtered.length} produk ditemukan</p>
            </div>

            {/* Sort + Mobile Filter */}
            <div className="flex gap-2">
              {/* Mobile kategori */}
              <select
                className="md:hidden border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#00AA5B]"
                value={activeKategori}
                onChange={e => setActiveKategori(e.target.value)}
              >
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>

              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#00AA5B]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="default">Urutkan</option>
                <option value="harga-asc">Harga: Termurah</option>
                <option value="harga-desc">Harga: Termahal</option>
                <option value="nama">Nama A-Z</option>
                <option value="stok">Stok Terbanyak</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {(activeKategori !== 'Semua' || searchQuery) && (
            <div className="flex gap-2 flex-wrap mb-4">
              {activeKategori !== 'Semua' && (
                <span className="flex items-center gap-1 bg-green-100 text-[#00AA5B] text-xs font-semibold px-3 py-1 rounded-full">
                  {activeKategori}
                  <button onClick={() => setActiveKategori('Semua')} className="ml-1 hover:text-green-800">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="flex items-center gap-1 bg-green-100 text-[#00AA5B] text-xs font-semibold px-3 py-1 rounded-full">
                  "{searchQuery}"
                  <button onClick={() => navigate('/products')} className="ml-1 hover:text-green-800">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm p-3">
                  <div className="h-36 bg-gray-200 rounded-lg mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 font-semibold">Tidak ada produk ditemukan</p>
              <button onClick={() => { setActiveKategori('Semua'); navigate('/products'); }}
                className="mt-4 text-[#00AA5B] text-sm font-semibold hover:underline">
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group">
                  <Link to={`/products/${p.id}`}>
                    <div className="relative overflow-hidden">
                      <img src={p.gambar} alt={p.nama_alat} className="h-36 w-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 left-2 bg-[#00AA5B] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {p.kategori}
                      </span>
                      {p.stok === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Stok Habis</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={`/products/${p.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 hover:text-[#00AA5B]">
                        {p.nama_alat}
                      </h3>
                    </Link>
                    <p className="text-[#00AA5B] font-bold text-sm">
                      Rp {p.harga.toLocaleString()}<span className="text-gray-400 font-normal">/hari</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Stok: {p.stok}</p>
                    <button
                      onClick={() => addToCart(p, 1)}
                      disabled={p.stok === 0}
                      className="w-full mt-3 bg-[#00AA5B] hover:bg-green-700 text-white text-sm py-1.5 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
