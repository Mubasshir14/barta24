
import React, { useEffect, useState } from 'react';
import { Clock, Eye, ChevronRight, Hash } from 'lucide-react';
import { NewsArticle, Language, CategoryType } from '../types';
import { BartaAPI } from '../services/api';
import AdSlot from './AdSlot';
import SEO from './SEO';

interface HomeProps {
  lang: Language;
  selectedCategory: CategoryType | null;
  onSelectArticle: (a: NewsArticle) => void;
}

const Home: React.FC<HomeProps> = ({ lang, selectedCategory, onSelectArticle }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await BartaAPI.getLatestNews(100);
      setArticles(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-40">
      <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const filteredArticles = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  if (filteredArticles.length === 0) return (
    <div className="text-center py-40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex justify-center mb-4 opacity-20"><Hash size={48}/></div>
      <p className="text-xl font-bold opacity-30 uppercase tracking-widest">
        {lang === 'bn' ? `${selectedCategory} বিভাগে কোনো সংবাদ পাওয়া যায়নি` : `No articles found in ${selectedCategory}`}
      </p>
    </div>
  );

  const featured = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const others = filteredArticles.filter(a => a.id !== featured.id);
  const breaking = articles.filter(a => a.isBreaking);

  return (
    <>
      <SEO lang={lang} type="website" />
      <div className="space-y-10">
        <AdSlot type="header" />

        {/* Category Indicator */}
        {selectedCategory && (
          <div className="flex items-center gap-2 border-l-4 border-red-700 pl-4 py-2 bg-gray-50 dark:bg-gray-800/50">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{lang === 'bn' ? 'বিভাগ' : 'CATEGORY'}:</span>
            <h2 className="text-2xl font-black uppercase text-red-700">{selectedCategory}</h2>
          </div>
        )}

        {/* Breaking News Ticker */}
        {!selectedCategory && (
          <div className="bg-black text-white h-10 flex items-center overflow-hidden font-bold text-sm shadow-lg">
            <div className="bg-red-700 h-full px-6 flex items-center whitespace-nowrap z-10 shrink-0 uppercase tracking-tighter">
              {lang === 'bn' ? 'ব্রেকিং নিউজ' : 'BREAKING NEWS'}
            </div>
            <div className="flex-1 whitespace-nowrap overflow-hidden">
              <div className="inline-block animate-ticker pl-[100%]">
                {(breaking.length > 0 ? breaking : articles).map(a => (
                  <span key={a.id} className="mx-10 cursor-pointer hover:text-red-500 transition" onClick={() => onSelectArticle(a)}>
                    • {a.title[lang]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-9 space-y-12">
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lead Story */}
              <div className="md:col-span-2 group cursor-pointer border-b-4 border-black dark:border-gray-700 pb-8" onClick={() => onSelectArticle(featured)}>
                <div className="relative aspect-video overflow-hidden mb-6 rounded-sm shadow-md">
                  <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={featured.title[lang]} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-700 text-white text-[10px] px-2 py-1 uppercase font-black tracking-widest">{featured.category}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight group-hover:text-red-700 transition-colors">
                  {featured.title[lang]}
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed line-clamp-3">
                  {featured.excerpt[lang]}
                </p>
              </div>

              {/* Secondary Stories */}
              {others.slice(0, 8).map(art => (
                <div key={art.id} className="flex flex-col gap-4 group cursor-pointer border-b md:border-b-0 border-gray-100 dark:border-gray-800 pb-6" onClick={() => onSelectArticle(art)}>
                  <div className="aspect-video overflow-hidden rounded-sm shadow-sm">
                    <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={art.title[lang]} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-snug group-hover:text-red-700 transition-colors">{art.title[lang]}</h3>
                    <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="text-red-700">{art.category}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(art.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AdSlot type="in-article" />
          </main>

          <aside className="lg:col-span-3 space-y-10">
            <div className="border-t-4 border-red-700 pt-4">
              <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">{lang === 'bn' ? 'জনপ্রিয় সংবাদ' : 'TRENDING'}</h3>
              <div className="space-y-8">
                {[...articles].sort((a,b) => b.views - a.views).slice(0, 6).map((art, i) => (
                  <div key={art.id} className="flex gap-4 group cursor-pointer" onClick={() => onSelectArticle(art)}>
                    <span className="text-3xl font-black text-gray-200 dark:text-gray-800 group-hover:text-red-700 transition-colors italic">{i+1}</span>
                    <p className="text-sm font-bold leading-snug group-hover:underline">{art.title[lang]}</p>
                  </div>
                ))}
              </div>
            </div>

            <AdSlot type="sidebar" />
          </aside>
        </div>
        
        <AdSlot type="footer" />
      </div>
    </>
  );
};

export default Home;
