import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ nama: '', email: '', no_hp: '', alamat: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/penyewa/register', formData);
      const result = res.data;
      localStorage.setItem('user', JSON.stringify(result.user ?? result));
      if (result.token) localStorage.setItem('token', result.token);
      alert("Registrasi berhasil! Silahkan login.");
      navigate('/login');
    } catch {
      alert("Registrasi gagal, email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, value) => setFormData({ ...formData, [key]: value });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#00AA5B]">OutVentura</h1>
          <p className="text-gray-500 text-sm mt-1">Buat akun dan mulai petualanganmu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Buat Akun Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Nama Lengkap</label>
              <input type="text" placeholder="Nama lengkap" required
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => field('nama', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input type="email" placeholder="contoh@email.com" required
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => field('email', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">No. Telepon</label>
              <input type="text" placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => field('no_hp', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Alamat</label>
              <textarea placeholder="Alamat lengkap" rows={2}
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B] resize-none"
                onChange={(e) => field('alamat', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <input type="password" placeholder="Minimal 8 karakter" required
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => field('password', e.target.value)} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 mt-2">
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#00AA5B] font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
