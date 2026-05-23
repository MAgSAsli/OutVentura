import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CheckoutSukses = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const paymentUrl = state?.payment_redirect_url;

  useEffect(() => {
    if (!state) navigate('/');
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border max-w-md w-full p-8 text-center">
        {/* Icon sukses */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-[#00AA5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Pemesanan Berhasil!</h1>
        <p className="text-gray-400 text-sm mb-6">Terima kasih, pesanan kamu sudah dibuat.</p>

        {/* Ringkasan */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">No. Transaksi</span>
            <span className="font-bold text-gray-800">#{state.transaksi_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Durasi Sewa</span>
            <span className="font-semibold text-gray-800">{state.jumlah_hari} hari</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tanggal Mulai</span>
            <span className="font-semibold text-gray-800">{new Date(state.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tanggal Selesai</span>
            <span className="font-semibold text-gray-800">{new Date(state.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-bold text-gray-700">Total Bayar</span>
            <span className="font-extrabold text-[#00AA5B] text-lg">Rp {Number(state.total_harga).toLocaleString()}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
          <span className="text-yellow-500 text-lg">⏳</span>
          <p className="text-sm text-yellow-700 font-medium">Status: <span className="font-bold">Menunggu Pembayaran</span></p>
        </div>

        <div className="flex flex-col gap-2">
          {paymentUrl && (
            <button
              onClick={() => window.location.assign(paymentUrl)}
              className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
            >
              Bayar Sekarang
            </button>
          )}
          <Link to="/riwayat" className="w-full border border-[#00AA5B] text-[#00AA5B] font-bold py-3 rounded-xl hover:bg-green-50 transition">
            Lihat Riwayat Transaksi
          </Link>
          <Link to="/" className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSukses;
