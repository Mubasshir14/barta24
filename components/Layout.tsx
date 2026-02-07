
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { Language } from '../types';
import { CATEGORIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  setView: (v: 'home' | 'admin' | 'article') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, isDark, setIsDark, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 🚀 Global Adsterra Scripts Integration
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = 'https://pl28670495.effectivegatecpm.com/d6/bc/09/d6bc09ec53bc6b1a73af2ae8fe686afd.js';
    popunderScript.async = true;
    document.body.appendChild(popunderScript);

    const socialBarScript = document.createElement('script');
    socialBarScript.type = 'text/javascript';
    socialBarScript.src = 'https://pl28670506.effectivegatecpm.com/02/da/16/02da166f85b905449e74f00b5bc4106c.js';
    socialBarScript.async = true;
    document.body.appendChild(socialBarScript);

    return () => {
      document.body.removeChild(popunderScript);
      document.body.removeChild(socialBarScript);
    };
  }, []);

  const t = {
    search: { bn: 'খুঁজুন...', en: 'Search...' },
  };

  return (
    <div className={`${isDark ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen flex flex-col font-bn`}>
      {/* Top Bar */}
      <div className="bg-red-700 text-white py-1.5 px-4 text-[11px] font-bold">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>{new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 border-red-500 uppercase">
              <button 
                onClick={() => setLang('bn')} 
                className={`px-1.5 transition ${lang === 'bn' ? 'underline decoration-2 underline-offset-4' : 'opacity-70'}`}
              >BN</button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-1.5 transition ${lang === 'en' ? 'underline decoration-2 underline-offset-4' : 'opacity-70'}`}
              >EN</button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b shadow-sm py-4`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 
              onClick={() => { setView('home'); window.scrollTo(0,0); }} 
              className="text-4xl font-black text-red-700 cursor-pointer tracking-tighter select-none"
            >
              বার্তা<span className="text-gray-900 dark:text-white">২৪</span>
            </h1>
          </div>

          <nav className="hidden lg:flex items-center gap-6 font-bold text-[13px] uppercase tracking-tight">
            {CATEGORIES.slice(0, 8).map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="hover:text-red-700 transition-colors">
                {cat[lang]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <input 
                type="text" 
                placeholder={t.search[lang]}
                className={`pl-8 pr-4 py-1.5 text-xs border focus:ring-1 focus:ring-red-500 outline-none w-48 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              />
              <Search className="absolute left-2.5 text-gray-400" size={14} />
            </div>
            <button onClick={() => setIsDark(!isDark)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-50 lg:hidden ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <div className="p-4 border-b flex justify-between items-center bg-red-700 text-white">
            <span className="font-black text-xl">মেনু</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={28} /></button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-y-6 text-lg font-bold">
            {CATEGORIES.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} onClick={() => setIsMenuOpen(false)} className="hover:text-red-700 border-b border-gray-100 pb-2">
                {cat[lang]}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-200'} border-t mt-12 py-16`}>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-black text-red-700 mb-6">বার্তা২৪</h2>
            <p className="text-[13px] opacity-70 leading-relaxed max-w-xs">
              {lang === 'bn' 
                ? 'সত্যের সন্ধানে নির্ভীক পদযাত্রা। আধুনিক সংবাদ মাধ্যম হিসেবে আমরা সর্বদা নিরপেক্ষ তথ্য পৌঁছে দিই আপনার হাতের মুঠোয়।' 
                : 'Fearless march in search of truth. As a modern news medium, we always deliver unbiased information to your fingertips.'}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-red-700 inline-block">বিভাগসমূহ</h3>
            <ul className="grid grid-cols-1 gap-2.5 text-[13px] font-bold">
              {CATEGORIES.slice(0, 6).map(c => <li key={c.id} className="hover:text-red-700 cursor-pointer">{c[lang]}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-red-700 inline-block">কোম্পানি</h3>
            <ul className="flex flex-col gap-2.5 text-[13px] font-bold opacity-80">
              <li>আমাদের সম্পর্কে</li>
              <li>গোপনীয়তা নীতি</li>
              <li>বিজ্ঞাপন দিন</li>
              <li>যোগাযোগ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-red-700 inline-block">নিউজলেটার</h3>
            <div className="flex mt-2">
              <input type="email" placeholder="ইমেইল" className={`px-4 py-2 text-sm w-full ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border outline-none`} />
              <button className="bg-red-700 text-white px-5 py-2 text-sm font-bold hover:bg-red-800">যুক্ত হন</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-[11px] opacity-50 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} BARTA24. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
