
import React, { useState, useEffect } from 'react';
import { Language, NewsArticle, User } from './types';
import Layout from './components/Layout';
import Home from './components/Home';
import NewsDetail from './components/NewsDetail';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { BartaAPI } from './services/api';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('bn');
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'article'>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Session Recovery
    const token = localStorage.getItem('barta_jwt');
    if (token) {
      BartaAPI.getUserFromToken(token).then(user => {
        if (user) setCurrentUser(user);
        else localStorage.removeItem('barta_jwt'); // Token invalid or expired
      });
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const handleSelectArticle = async (article: NewsArticle) => {
    setIsLoading(true);
    // 1. Increment views
    await BartaAPI.incrementViews(article.id);
    
    // 2. Auto-translate if needed
    const processed = await BartaAPI.translateArticle(article, lang);
    
    setSelectedArticle(processed);
    setCurrentView('article');
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageToggle = async (newLang: Language) => {
    setLang(newLang);
    if (selectedArticle) {
      setIsLoading(true);
      const translated = await BartaAPI.translateArticle(selectedArticle, newLang);
      setSelectedArticle(translated);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি লগ আউট করতে চান?' : 'Logout?')) {
      localStorage.removeItem('barta_jwt');
      setCurrentUser(null);
      setCurrentView('home');
    }
  };

  return (
    <Layout 
      lang={lang} 
      setLang={handleLanguageToggle} 
      isDark={isDark} 
      setIsDark={setIsDark} 
      setView={(v) => {
        setCurrentView(v);
        if (v !== 'article') setSelectedArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {currentView === 'home' && (
          <Home lang={lang} onSelectArticle={handleSelectArticle} />
        )}
        
        {currentView === 'article' && selectedArticle && (
          <NewsDetail 
            article={selectedArticle} 
            lang={lang} 
            onBack={() => { setCurrentView('home'); setSelectedArticle(null); }} 
          />
        )}

        {currentView === 'admin' && (
          currentUser ? (
            <AdminDashboard user={currentUser} onLogout={handleLogout} lang={lang} />
          ) : (
            <Login lang={lang} onLoginSuccess={(user) => setCurrentUser(user)} />
          )
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </Layout>
  );
};

export default App;
