import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const statusConfig = {
  pending:  { label: 'Menunggu Konfirmasi', color: 'bg-yellow-100 text-yellow-700' },
  lunas:    { label: 'Lunas', color: 'bg-blue-100 text-blue-700' },
  selesai:  { label: 'Selesai', color: 'bg-green-100 text-[#00AA5B]' },
  batal:    { label: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
};

const Riwayat = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get(`/transaksi/penyewa/${user.id}`)
      .then(res => setTransaksi(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleDetail = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!details[id]) {
      const res = await api.get(`/transaksi/${id}/detail`);
      setDetails(prev => ({ ...prev, [id]: res.data }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl border p-5 h-24" />
            ))}
          </div>
        ) : transaksi.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 font-semibold">Belum ada transaksi</p>
            <Link to="/products" className="mt-4 inline-block text-[#00AA5B] font-semibold hover:underline">
              Mulai Sewa Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transaksi.map(t => {
              const status = statusConfig[t.status] || statusConfig.pending;
              const isExpanded = expandedId === t.id;

              return (
                <div key={t.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  {/* Header transaksi */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">#{t.id}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        {t.nama_alat_list && (
                          <p className="text-sm text-gray-700 font-medium mt-1 line-clamp-1">{t.nama_alat_list}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-[#00AA5B]">Rp {Number(t.total_harga).toLocaleString()}</p>
                        <button
                          onClick={() => toggleDetail(t.id)}
                          className="text-xs text-[#00AA5B] font-semibold mt-1 hover:underline"
                        >
                          {isExpanded ? 'Sembunyikan ▲' : 'Lihat Detail ▼'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detail items */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 px-5 py-4">
                      {!details[t.id] ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#00AA5B] border-t-transparent" />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {details[t.id].map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <img src={item.gambar} alt={item.nama_alat} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{item.nama_alat}</p>
                                <p className="text-xs text-gray-400">{item.kategori} · ×{item.jumlah} unit</p>
                              </div>
                              <p className="text-sm font-bold text-gray-700">
                                Rp {Number(item.subtotal).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;
