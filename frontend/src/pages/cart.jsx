import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">🛒</div>
      <h2 className="text-xl font-bold text-gray-700">Keranjang Kosong</h2>
      <p className="text-gray-400 text-sm">Yuk, tambahkan alat outdoor favoritmu!</p>
      <Link to="/products" className="bg-[#00AA5B] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition">
        Mulai Belanja
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Sewa</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Item List */}
          <div className="flex-1 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-xl border shadow-sm p-4 flex gap-4 items-center">
                <img src={item.gambar} alt={item.nama_alat} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.nama_alat}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.kategori}</p>
                  <p className="text-[#00AA5B] font-bold mt-1">
                    Rp {item.harga.toLocaleString()}/hari × {item.jumlah}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">Rp {(item.harga * item.jumlah).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 text-xs mt-2 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Ringkasan Sewa</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="line-clamp-1 flex-1 mr-2">{item.nama_alat} ×{item.jumlah}</span>
                    <span className="shrink-0">Rp {(item.harga * item.jumlah).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Total/hari</span>
                <span className="text-[#00AA5B]">Rp {total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">*Total dihitung berdasarkan jumlah hari sewa</p>
              <Link
                to="/checkout"
                className="block w-full mt-4 bg-[#00AA5B] hover:bg-green-700 text-white text-center font-bold py-3 rounded-xl transition"
              >
                Lanjut ke Checkout
              </Link>
              <Link
                to="/products"
                className="block w-full mt-2 text-center text-[#00AA5B] text-sm font-semibold hover:underline"
              >
                + Tambah Alat Lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
