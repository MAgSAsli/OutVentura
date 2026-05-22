import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginAdmin = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/pegawai/login', data);
      localStorage.setItem('admin', JSON.stringify(res.data));
      navigate('/admin');
    } catch {
      alert("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#00AA5B]">OutVentura</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🔐</div>
            <h2 className="text-xl font-bold text-gray-800">Login Admin</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="admin@outventura.com"
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
              {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
