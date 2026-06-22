import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const CheckoutSukses = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const strukRef = useRef();
  const [barcodeSuffix] = useState(() => Date.now().toString().slice(-6));

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }
  }, [state, navigate]);

  if (!state) return null;

  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handlePrint = () => {
    const isi = strukRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Struk OutVentura - #${state.transaksi_id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #111;
              background: #fff;
              padding: 24px;
              max-width: 320px;
              margin: 0 auto;
            }
            .logo {
              text-align: center;
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .logo span { color: #00AA5B; }
            .subtitle {
              text-align: center;
              font-size: 10px;
              color: #555;
              margin-bottom: 12px;
            }
            .divider {
              border: none;
              border-top: 1px dashed #aaa;
              margin: 10px 0;
            }
            .title {
              text-align: center;
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 11px;
            }
            .row .label { color: #555; }
            .row .value { font-weight: bold; text-align: right; }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              font-weight: 900;
              margin-top: 4px;
            }
            .total-row .value { color: #00AA5B; }
            .status-box {
              text-align: center;
              border: 1px dashed #f59e0b;
              border-radius: 4px;
              padding: 6px;
              font-size: 11px;
              color: #b45309;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #888;
              margin-top: 12px;
              line-height: 1.6;
            }
            .barcode {
              text-align: center;
              font-size: 9px;
              letter-spacing: 3px;
              color: #aaa;
              margin-top: 8px;
            }
            @media print {
              body { padding: 0; }
              @page { size: 80mm auto; margin: 8mm; }
            }
          </style>
        </head>
        <body>${isi}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4">

        {/* Card Sukses */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-[#00AA5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Pemesanan Berhasil!</h1>
          <p className="text-gray-400 text-sm mb-6">Terima kasih, pesanan kamu sudah dibuat.</p>

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
              <span className="font-semibold text-gray-800">
                {new Date(state.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tanggal Selesai</span>
              <span className="font-semibold text-gray-800">
                {new Date(state.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-gray-700">Total Bayar</span>
              <span className="font-extrabold text-[#00AA5B] text-lg">Rp {Number(state.total_harga).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
            <span className="text-yellow-500 text-lg">⏳</span>
            <p className="text-sm text-yellow-700 font-medium">Status: <span className="font-bold">Menunggu Konfirmasi</span></p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handlePrint}
              className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              🖨️ Cetak Struk PDF
            </button>
            <Link to="/riwayat" className="w-full border border-[#00AA5B] text-[#00AA5B] font-bold py-3 rounded-xl hover:bg-green-50 transition block text-center">
              Lihat Riwayat Transaksi
            </Link>
            <Link to="/" className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition block text-center">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Template Struk (hidden, hanya untuk print) */}
        <div ref={strukRef} style={{ display: 'none' }}>
          <div className="logo">Out<span>Ventura</span></div>
          <div className="subtitle">Platform Sewa Alat Outdoor Terpercaya</div>
          <div className="subtitle">Jl. Outdoor No. 1, Indonesia</div>
          <hr className="divider" />
          <div className="title">Struk Penyewaan</div>
          <hr className="divider" />
          <div className="row">
            <span className="label">No. Transaksi</span>
            <span className="value">#{state.transaksi_id}</span>
          </div>
          <div className="row">
            <span className="label">Tanggal Cetak</span>
            <span className="value">{tanggalCetak}</span>
          </div>
          <hr className="divider" />
          <div className="row">
            <span className="label">Tanggal Mulai</span>
            <span className="value">
              {new Date(state.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="row">
            <span className="label">Tanggal Selesai</span>
            <span className="value">
              {new Date(state.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="row">
            <span className="label">Durasi Sewa</span>
            <span className="value">{state.jumlah_hari} hari</span>
          </div>
          <hr className="divider" />
          <div className="row">
            <span className="label">Subtotal</span>
            <span className="value">Rp {Number(state.total_harga).toLocaleString()}</span>
          </div>
          <div className="total-row">
            <span>TOTAL BAYAR</span>
            <span className="value">Rp {Number(state.total_harga).toLocaleString()}</span>
          </div>
          <hr className="divider" />
          <div className="status-box">⏳ Status: Menunggu Konfirmasi</div>
          <hr className="divider" />
          <div className="footer">
            Terima kasih telah menyewa di OutVentura!<br />
            Simpan struk ini sebagai bukti pemesanan.<br />
            Hubungi kami jika ada pertanyaan.
          </div>
          <div className="barcode">
            {'|'.repeat(30)}<br />
            TRX-{state.transaksi_id}-{barcodeSuffix.current}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSukses;
