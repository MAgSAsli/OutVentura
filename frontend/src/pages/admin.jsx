import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  pending_payment: { label: 'Menunggu Bayar', color: 'bg-yellow-100 text-yellow-700' },
  lunas: { label: 'Lunas', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid', color: 'bg-blue-100 text-blue-700' },
  dipinjam: { label: 'Dipinjam', color: 'bg-purple-100 text-purple-700' },
  selesai: { label: 'Selesai', color: 'bg-green-100 text-[#00AA5B]' },
  batal: { label: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-600' },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('alat');
  const [alat, setAlat] = useState([]);
  const [transaksi, setTransaksi] = useState([]);
  const [laporan, setLaporan] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const adminRef = useRef(admin);

  const fetchAlat = useCallback(() => api.get('/alat').then(res => setAlat(res.data.data ?? res.data)), []);
  const fetchTransaksi = useCallback(() => api.get('/transaksi').then(res => setTransaksi(res.data.data ?? res.data)), []);
  const fetchLaporan = useCallback((t) => api.get(`/transaksi/laporan?tahun=${t}`).then(res => setLaporan(res.data.data ?? res.data)), []);

  useEffect(() => {
    if (!adminRef.current) { navigate('/admin/login'); return; }
    Promise.all([fetchAlat(), fetchTransaksi(), fetchLaporan(tahun)]).finally(() => setLoading(false));
  }, [navigate, fetchAlat, fetchTransaksi, fetchLaporan, tahun]);

  useEffect(() => { fetchLaporan(tahun); }, [tahun, fetchLaporan]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm('Hapus alat ini?')) return;
    await api.delete(`/alat/${id}`);
    fetchAlat();
  };

  const handleStatusChange = async (id, status) => {
    await api.patch(`/transaksi/${id}/status`, { status });
    fetchTransaksi();
  };

  const handleEditSave = async () => {
    await api.put(`/alat/${editItem.id}`, editItem);
    setEditItem(null);
    fetchAlat();
  };

  const handleAddClick = () => {
    setNewItem({
      nama_alat: '',
      kategori: '',
      harga: '',
      stok: '',
      deskripsi: '',
      gambar: '',
    });
  };

  const handleAddSave = async () => {
    const payload = {
      ...newItem,
      nama_alat: newItem.nama_alat.trim(),
      kategori: newItem.kategori.trim(),
      deskripsi: newItem.deskripsi.trim(),
      gambar: newItem.gambar.trim(),
      harga: Number(newItem.harga),
      stok: Number(newItem.stok),
    };

    if (!payload.nama_alat || !payload.kategori || !payload.gambar) {
      alert('Nama alat, kategori, dan URL gambar wajib diisi.');
      return;
    }

    if (!Number.isFinite(payload.harga) || payload.harga < 0 || !Number.isInteger(payload.stok) || payload.stok < 0) {
      alert('Harga dan stok harus berupa angka yang valid.');
      return;
    }

    await api.post('/alat', payload);
    setNewItem(null);
    fetchAlat();
  };

  const stats = [
    { label: 'Total Alat',       value: alat.length,                                        icon: '🏕️' },
    { label: 'Stok Habis',       value: alat.filter(a => a.stok === 0).length,               icon: '❌' },
    { label: 'Total Transaksi',  value: transaksi.length,                                    icon: '🧾' },
    { label: 'Pending',          value: transaksi.filter(t => ['pending', 'pending_payment'].includes(t.status)).length, icon: '⏳' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Modal Edit */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Edit Alat</h3>
            <div className="space-y-3">
              {[
                { label: 'Nama Alat',   key: 'nama_alat', type: 'text' },
                { label: 'Kategori',    key: 'kategori',  type: 'text' },
                { label: 'Harga/hari',  key: 'harga',     type: 'number' },
                { label: 'Stok',        key: 'stok',      type: 'number' },
                { label: 'URL Gambar',  key: 'gambar',    type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={editItem[f.key] || ''}
                    onChange={e => setEditItem({ ...editItem, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Deskripsi</label>
                <textarea
                  rows={2}
                  value={editItem.deskripsi || ''}
                  onChange={e => setEditItem({ ...editItem, deskripsi: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditItem(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Batal</button>
              <button onClick={handleEditSave} className="flex-1 bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah */}
      {newItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Tambah Alat</h3>
            <div className="space-y-3">
              {[
                { label: 'Nama Alat',   key: 'nama_alat', type: 'text' },
                { label: 'Kategori',    key: 'kategori',  type: 'text' },
                { label: 'Harga/hari',  key: 'harga',     type: 'number' },
                { label: 'Stok',        key: 'stok',      type: 'number' },
                { label: 'URL Gambar',  key: 'gambar',    type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={newItem[f.key] || ''}
                    onChange={e => setNewItem({ ...newItem, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Deskripsi</label>
                <textarea
                  rows={2}
                  value={newItem.deskripsi || ''}
                  onChange={e => setNewItem({ ...newItem, deskripsi: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setNewItem(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Batal</button>
              <button onClick={handleAddSave} className="flex-1 bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-[#00AA5B] text-white px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard Admin</h1>
          <p className="text-green-100 text-sm mt-0.5">Halo, {admin?.nama} 👋</p>
        </div>
        <button onClick={handleLogout} className="bg-white text-[#00AA5B] text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-50 transition">
          Keluar
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border shadow-sm p-4">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 w-fit mb-6">
          {['alat', 'transaksi', 'laporan'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                tab === t ? 'bg-white text-[#00AA5B] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'alat' ? '🏕️ Kelola Alat' : t === 'transaksi' ? '🧾 Transaksi' : '📊 Laporan'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#00AA5B] border-t-transparent" />
          </div>
        ) : tab === 'alat' ? (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-800">Daftar Alat</h2>
              <button onClick={handleAddClick} className="bg-[#00AA5B] hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                + Tambah Alat
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Alat</th>
                    <th className="px-6 py-3 text-left">Kategori</th>
                    <th className="px-6 py-3 text-left">Harga/hari</th>
                    <th className="px-6 py-3 text-left">Stok</th>
                    <th className="px-6 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alat.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.gambar} alt={item.nama_alat} className="w-10 h-10 object-cover rounded-lg" />
                          <span className="font-medium text-gray-800">{item.nama_alat}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-[#00AA5B] text-xs font-semibold px-2 py-1 rounded-full">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">Rp {item.harga.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${item.stok > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {item.stok}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button onClick={() => setEditItem(item)} className="text-blue-500 hover:text-blue-700 font-semibold transition">Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 font-semibold transition">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : tab === 'transaksi' ? (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-bold text-gray-800">Semua Transaksi</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Penyewa</th>
                    <th className="px-6 py-3 text-left">Tanggal</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transaksi.map(t => {
                    const status = statusConfig[t.status] || statusConfig.pending;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-400 font-mono">#{t.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{t.nama_penyewa}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-700">Rp {Number(t.total_harga).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={t.status}
                            onChange={e => handleStatusChange(t.id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-[#00AA5B]"
                          >
                            <option value="pending">Pending</option>
                            <option value="pending_payment">Menunggu Bayar</option>
                            <option value="lunas">Lunas</option>
                            <option value="paid">Paid</option>
                            <option value="dipinjam">Dipinjam</option>
                            <option value="selesai">Selesai</option>
                            <option value="batal">Batal</option>
                            <option value="expired">Expired</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ===== TAB LAPORAN ===== */
          <div className="space-y-6">
            {/* Filter Tahun */}
            <div className="bg-white rounded-xl border shadow-sm p-5 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Laporan Bulanan</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Tahun:</label>
                <select
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00AA5B]"
                >
                  {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            {laporan.length > 0 && (() => {
              const totalPendapatan = laporan.reduce((s, r) => s + Number(r.total_pendapatan), 0);
              const totalTrx = laporan.reduce((s, r) => s + Number(r.total_transaksi), 0);
              const totalSelesai = laporan.reduce((s, r) => s + Number(r.selesai), 0);
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString()}`, icon: '💰', color: 'text-[#00AA5B]' },
                    { label: 'Total Transaksi', value: totalTrx, icon: '🧾', color: 'text-blue-600' },
                    { label: 'Transaksi Selesai', value: totalSelesai, icon: '✅', color: 'text-green-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border shadow-sm p-5">
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label} tahun {tahun}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Tabel Bulanan */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Bulan</th>
                    <th className="px-6 py-3 text-left">Total Transaksi</th>
                    <th className="px-6 py-3 text-left">Pending</th>
                    <th className="px-6 py-3 text-left">Lunas</th>
                    <th className="px-6 py-3 text-left">Selesai</th>
                    <th className="px-6 py-3 text-left">Batal</th>
                    <th className="px-6 py-3 text-left">Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporan.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">Tidak ada data untuk tahun {tahun}</td></tr>
                  ) : laporan.map(row => (
                    <tr key={row.bulan} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800">{BULAN[row.bulan - 1]}</td>
                      <td className="px-6 py-4 text-gray-700">{row.total_transaksi}</td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{row.pending}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{row.lunas}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-[#00AA5B] text-xs font-bold px-2 py-0.5 rounded-full">{row.selesai}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{row.batal}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#00AA5B]">Rp {Number(row.total_pendapatan).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
