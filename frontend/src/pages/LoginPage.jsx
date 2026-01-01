import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { notification } from 'antd';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);

      login(data.user, data.token);

      notification.success({
        message: 'Giriş Başarılı',
        description: 'Kimlik doğrulandı. Yönlendiriliyorsunuz.',
        placement: 'topRight',
      });

      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      notification.error({
        message: 'Giriş Başarısız',
        description: err.response?.data?.error || err.message || 'Bağlantı hatası.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-md p-8 bg-[#111111] border border-[#262626] rounded-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">TaskFlow</h1>
          <p className="text-slate-500 mt-2 font-medium">Yazılım yöneticileri için hassas yönetim.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">İş E-postası</label>
            <input
              type="email"
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
              placeholder="hasan@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Şifre</label>
            <input
              type="password"
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
            Giriş Yap
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Hesabın yok mu? <Link to="/register" className="text-white font-bold underline">Profil oluştur</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;