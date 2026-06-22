import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

const statusMap = {
  settlement: { label: 'Pembayaran Berhasil', icon: '✅', color: 'text-[#00AA5B]', bg: 'bg-green-50 border-green-200' },
  capture:    { label: 'Pembayaran Berhasil', icon: '✅', color: 'text-[#00AA5B]', bg: 'bg-green-50 border-green-200' },
  pending:    { label: 'Menunggu Pembayaran', icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  deny:       { label: 'Pembayaran Ditolak',  icon: '❌', color: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  expire:     { label: 'Pembayaran Kedaluwarsa', icon: '⌛', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  cancel:     { label: 'Pembayaran Dibatalkan', icon: '🚫', color: 'text-red-600',  bg: 'bg-red-50 border-red-200' },
};

const PaymentFinish = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const statusCode = searchParams.get('status_code');
  const [transaksi, setTransaksi] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  const statusInfo = statusMap[transactionStatus] || {
    label: 'Status Tidak Diketahui',
    icon: '❓',
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200',
  };

  useEffect(() => {
    if (!orderId) return;
    api.get(`/transaksi/payment/${orderId}`)
      .then(res => setTransaksi(res.data.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border max-w-md w-full p-8 text-center">

        {/* Icon status */}
        <div className="text-5xl mb-4">{statusInfo.icon}</div>
        <h1 className={`text-2xl font-extrabold mb-1 ${statusInfo.color}`}>
          {statusInfo.label}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {transactionStatus === 'settlement' || transactionStatus === 'capture'
            ? 'Terima kasih! Pembayaran kamu telah dikonfirmasi.'
            : transactionStatus === 'pending'
            ? 'Pembayaran kamu sedang diproses, harap tunggu.'
            : 'Silakan coba lagi atau hubungi kami jika ada masalah.'}
        </p>

        {/* Detail */}
        <div className={`rounded-xl border p-4 text-left space-y-3 mb-6 ${statusInfo.bg}`}>
          {orderId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-800 text-xs break-all">{orderId}</span>
            </div>
          )}
          {statusCode && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status Code</span>
              <span className="font-semibold text-gray-800">{statusCode}</span>
            </div>
          )}
          {!loading && transaksi && (
            <>
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
            </>
          )}
          {loading && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#00AA5B] border-t-transparent" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            to="/riwayat"
            className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition block text-center"
          >
            Lihat Riwayat Transaksi
          </Link>
          <Link
            to="/"
            className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition block text-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFinish;
