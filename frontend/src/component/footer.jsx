export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-extrabold mb-2">
            Out<span className="text-green-400">Ventura</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Platform penyewaan alat outdoor terpercaya. Petualanganmu, perlengkapan kami.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
            <li><a href="/products" className="hover:text-green-400 transition">Katalog Alat</a></li>
            <li><a href="/cart" className="hover:text-green-400 transition">Keranjang</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Akun</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/login" className="hover:text-green-400 transition">Masuk</a></li>
            <li><a href="/register" className="hover:text-green-400 transition">Daftar</a></li>
            <li><a href="/admin/login" className="hover:text-green-400 transition">Admin</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
        © 2025 OutVentura. All rights reserved.
      </div>
    </footer>
  );
}
