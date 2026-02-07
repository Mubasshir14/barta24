
import React, { useState } from 'react';
import { BartaAPI } from '../services/api';
import { User } from '../types';
import { Lock, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  lang: 'bn' | 'en';
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await BartaAPI.login(email, password);
      if (result) {
        onLoginSuccess(result.user);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("Email not confirmed")) {
        setError(lang === 'bn' 
          ? 'আপনার ইমেইল ভেরিফাই করা হয়নি। দয়া করে ইনবক্স চেক করুন।' 
          : 'Email not confirmed. Please check your inbox.');
      } else if (msg.includes("Invalid login credentials")) {
        setError(lang === 'bn' 
          ? 'ইমেল বা পাসওয়ার্ড ভুল।' 
          : 'Invalid email or password.');
      } else {
        setError(msg || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8 border-b-2 border-red-700 pb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-red-700">
          {lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Console'}
        </h2>
        <p className="text-[11px] font-bold opacity-50 mt-2 uppercase tracking-tight">
          Verify through Database
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-all"
              placeholder="editor@barta24.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-300" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-700 p-3">
            <p className="text-red-700 dark:text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-4 uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (lang === 'bn' ? 'লগইন করুন' : 'Secure Log In')}
        </button>
      </form>
    </div>
  );
};

export default Login;
