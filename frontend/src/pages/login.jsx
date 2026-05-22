import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/penyewa/login', data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch {
      alert("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#00AA5B]">OutVentura</h1>
          <p className="text-gray-500 text-sm mt-1">Platform Sewa Alat Outdoor Terpercaya</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Masuk ke Akun</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="contoh@email.com"
                required
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                required
                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-[#00AA5B] focus:ring-1 focus:ring-[#00AA5B]"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#00AA5B] font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
