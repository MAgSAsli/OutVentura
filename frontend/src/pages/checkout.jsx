import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import api from '../api';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [dates, setDates] = useState({ mulai: '', selesai: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const jumlahHari = dates.mulai && dates.selesai
    ? Math.max(1, Math.ceil((new Date(dates.selesai) - new Date(dates.mulai)) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPerHari = cart.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
  const totalKeseluruhan = totalPerHari * jumlahHari;

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    if (!dates.mulai || !dates.selesai) { alert("Pilih tanggal mulai dan selesai"); return; }
    if (new Date(dates.selesai) <= new Date(dates.mulai)) { alert("Tanggal selesai harus setelah tanggal mulai"); return; }

    const payload = {
      id_penyewa: user.id,
      cartItems: cart.map(item => ({ id_alat: item.id, jumlah: item.jumlah, harga: item.harga })),
      tanggal_mulai: dates.mulai,
      tanggal_selesai: dates.selesai,
    };

    try {
      setLoading(true);
      const res = await api.post('/transaksi', payload);
      clearCart();
      navigate('/checkout/sukses', { state: res.data.data });
    } catch (error) {
      alert(error.response?.data?.message || "Gagal melakukan transaksi, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form */}
          <div className="flex-1 space-y-4">
            {/* User Info */}
            {user && (
              <div className="bg-white rounded-xl border shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-3">Informasi Penyewa</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Nama:</span> {user.nama}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </div>
            )}

            {/* Tanggal */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-4">Tanggal Sewa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Tanggal Mulai</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B]"
                    onChange={(e) => setDates({ ...dates, mulai: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Tanggal Selesai</label>
                  <input
                    type="date"
                    min={dates.mulai || new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B]"
                    onChange={(e) => setDates({ ...dates, selesai: e.target.value })}
                  />
                </div>
              </div>
              {jumlahHari > 0 && (
                <p className="mt-3 text-sm text-[#00AA5B] font-semibold">
                  ✅ Durasi sewa: {jumlahHari} hari
                </p>
              )}
            </div>

            {/* Item List */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h3 className="font-bold text-gray-700 mb-3">Alat yang Disewa</h3>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.gambar} alt={item.nama_alat} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.nama_alat}</p>
                      <p className="text-xs text-gray-400">×{item.jumlah} unit</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      Rp {(item.harga * item.jumlah).toLocaleString()}/hari
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pembayaran</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total/hari</span>
                  <span>Rp {totalPerHari.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span>{jumlahHari > 0 ? `${jumlahHari} hari` : '-'}</span>
                </div>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800">
                <span>Total Bayar</span>
                <span className="text-[#00AA5B] text-lg">
                  {jumlahHari > 0 ? `Rp ${totalKeseluruhan.toLocaleString()}` : '-'}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full mt-5 bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Sewa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
