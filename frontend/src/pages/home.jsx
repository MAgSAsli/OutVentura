import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import useCart from "../hooks/useCart";

const MotionDiv = motion.div;

const Home = () => {
  const [alat, setAlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    api.get("/alat")
      .then((res) => setAlat(res.data.data ?? res.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", ...new Set(alat.map(item => item.kategori))];

  const filtered = activeCategory === "Semua"
    ? alat
    : alat.filter((item) => item.kategori === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00AA5B] to-green-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Sewa Alat Outdoor<br />
              <span className="text-green-100">Kapan Saja, Di Mana Saja</span>
            </h1>
            <p className="text-green-100 text-lg mb-6">
              Lengkapi petualanganmu dengan peralatan outdoor berkualitas. Harga terjangkau, stok selalu tersedia.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-[#00AA5B] font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition shadow-lg"
            >
              Lihat Semua Alat →
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-3 gap-3 text-center">
              {["🏕️ Tenda", "🎒 Carrier", "🛌 Sleeping Bag", "🔥 Kompor", "🗺️ Matras", "⛏️ Perlengkapan"].map((item) => (
                <div key={item} className="bg-white/20 backdrop-blur rounded-xl p-3 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">✅ Stok Terjamin</span>
          <span className="flex items-center gap-2">🚚 Pengiriman Cepat</span>
          <span className="flex items-center gap-2">🔒 Transaksi Aman</span>
          <span className="flex items-center gap-2">💬 Layanan 24 Jam</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition ${
                activeCategory === cat
                  ? "bg-[#00AA5B] text-white border-[#00AA5B]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#00AA5B] hover:text-[#00AA5B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {activeCategory === "Semua" ? "Semua Alat" : activeCategory}
          </h2>
          <Link to="/products" className="text-[#00AA5B] text-sm font-semibold hover:underline">
            Lihat Semua →
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm p-3">
                <div className="h-36 bg-gray-200 rounded-lg mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {filtered.map((item) => (
              <MotionDiv
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden group"
              >
                <Link to={`/products/${item.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.nama_alat}
                      className="h-36 w-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-[#00AA5B] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {item.kategori}
                    </span>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/products/${item.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 hover:text-[#00AA5B]">
                      {item.nama_alat}
                    </h3>
                  </Link>
                  <p className="text-[#00AA5B] font-bold text-sm">
                    Rp {item.harga.toLocaleString()}<span className="text-gray-400 font-normal">/hari</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Stok: {item.stok}</p>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="w-full mt-3 bg-[#00AA5B] hover:bg-green-700 text-white text-sm py-1.5 rounded-lg font-semibold transition"
                  >
                    + Keranjang
                  </button>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        )}
      </div>
    </div>
  );
};

export default Home;
