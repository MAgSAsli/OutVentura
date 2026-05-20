import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCart from "../hooks/useCart";

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.jumlah, 0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${search}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-[#00AA5B] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-extrabold tracking-tight shrink-0">
          Out<span className="text-green-200">Ventura</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            placeholder="Cari alat outdoor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg text-sm outline-none text-gray-800"
          />
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-r-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </form>

        {/* Cart */}
        <Link to="/cart" className="relative text-white flex flex-col items-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm7 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
          <span className="text-xs mt-0.5">Keranjang</span>
        </Link>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/riwayat" className="text-white text-sm font-medium hidden md:block hover:text-green-200 transition">
              Riwayat
            </Link>
            <span className="text-white text-sm font-medium hidden md:block">{user.nama}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-[#00AA5B] text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-50 transition"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="flex gap-2 shrink-0">
            <Link to="/login" className="bg-white text-[#00AA5B] text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-50 transition">
              Masuk
            </Link>
            <Link to="/register" className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-800 transition hidden md:block">
              Daftar
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 text-sm text-green-100 py-1.5 overflow-x-auto">
          <Link to="/" className="hover:text-white transition shrink-0">Home</Link>
          <Link to="/products" className="hover:text-white transition shrink-0">Semua Alat</Link>
        </div>
      </div>
    </header>
  );
}
