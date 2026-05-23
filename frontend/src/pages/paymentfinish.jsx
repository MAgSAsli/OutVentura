import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

const statusConfig = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  },
  pending: {
    label: 'Menunggu Konfirmasi',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  },
  paid: {
    label: 'Pembayaran Berhasil',
    color: 'bg-green-50 border-green-200 text-[#00AA5B]',
  },
  lunas: {
    label: 'Lunas',
    color: 'bg-green-50 border-green-200 text-[#00AA5B]',
  },
  batal: {
    label: 'Pembayaran Dibatalkan',
    color: 'bg-red-50 border-red-200 text-red-600',
  },
  expired: {
    label: 'Pembayaran Kedaluwarsa',
    color: 'bg-red-50 border-red-200 text-red-600',
  },
};

const PaymentFinish = () => {
  const [searchParams] = useSearchParams();
  const [transaksi, setTransaksi] = useState(null);
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return undefined;

    let active = true;

    api.get(`/transaksi/payment/${orderId}`)
      .then(res => {
        if (active) setTransaksi(res.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00AA5B] border-t-transparent" />
      </div>
    );
  }

  const status = statusConfig[transaksi?.status] || statusConfig.pending_payment;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border max-w-md w-full p-8 text-center">
        <div className={`border rounded-xl px-4 py-3 mb-6 font-bold ${status.color}`}>
          {status.label}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Status Pembayaran</h1>
        <p className="text-sm text-gray-500 mb-6">
          {orderId || 'Order ID tidak ditemukan'}
        </p>

        {transaksi && (
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">No. Transaksi</span>
              <span className="font-bold text-gray-800">#{transaksi.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Bayar</span>
              <span className="font-extrabold text-[#00AA5B]">
                Rp {Number(transaksi.total_harga).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {transaksi?.status === 'pending_payment' && transaksi.payment_redirect_url && (
            <button
              onClick={() => window.location.assign(transaksi.payment_redirect_url)}
              className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
            >
              Lanjut Bayar
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

export default PaymentFinish;
