import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { notification } from 'antd';

const RegisterPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(fullname, email, password);
      notification.success({
        message: 'Kayıt Başarılı!',
        description: 'Şimdi giriş yapabilirsin!'
      });
      navigate('/login');
    } catch (err) {
      notification.error({ message: 'Hata', description: err });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-md p-8 bg-[#111111] border border-[#262626] rounded-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">TaskFlow</h1>
          <p className="text-slate-500 mt-2 font-medium">Mühendis profilini oluştur</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ad Soyad</label>
            <input
              type="text"
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
              placeholder="Hasan Yılmaz"
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">E-posta</label>
            <input
              type="email"
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
              placeholder="hasan@taskflow.com"
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
            Hesap Oluştur
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Zaten üye misin? <Link to="/login" className="text-white font-bold underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;