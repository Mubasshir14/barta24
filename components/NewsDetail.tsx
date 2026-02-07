
import React, { useEffect, useState } from 'react';
import { Share2, Clock, Eye, Facebook, Twitter, Link, ArrowLeft, MessageSquare } from 'lucide-react';
import { NewsArticle, Language } from '../types';
import AdSlot from './AdSlot';
import SEO from './SEO';

interface NewsDetailProps {
  article: NewsArticle;
  lang: Language;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ article, lang, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  return (
    <>
      <SEO article={article} lang={lang} type="article" />
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center gap-2 font-bold text-red-700 hover:underline mb-4">
          <ArrowLeft size={18} /> {lang === 'bn' ? 'ফিরে যান' : 'Back to News'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <header className="space-y-4">
              <span className="bg-red-700 text-white px-3 py-1 text-xs font-bold uppercase rounded">{article.category}</span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight text-gray-900 dark:text-white">
                {article.title[lang]}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm opacity-70 border-y py-3 border-gray-100 dark:border-gray-800">
                {/* <span className="font-bold text-red-700">{article.authorName}</span> */}
                <span className="flex items-center gap-1"><Clock size={16} /> {new Date(article.publishedAt).toLocaleString()}</span>
                <span className="flex items-center gap-1"><Eye size={16} /> {article.views} Views</span>
                <div className="flex gap-4 ml-auto">
                  <button className="text-blue-600 hover:scale-110 transition"><Facebook size={20} /></button>
                  <button className="text-sky-400 hover:scale-110 transition"><Twitter size={20} /></button>
                  <button className="text-gray-500 hover:scale-110 transition" onClick={() => navigator.clipboard.writeText(window.location.href)}><Link size={20} /></button>
                </div>
              </div>
            </header>

            <figure className="space-y-2">
              <img src={article.image} alt={article.title[lang]} className="w-full rounded-xl shadow-lg border border-gray-100 dark:border-gray-800" />
              <figcaption className="text-xs opacity-60 italic text-center">ছবি: বার্তা২৪ সংগ্রহ</figcaption>
            </figure>

            <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-lg">
               <p className="font-bold mb-4 text-xl border-l-4 border-red-700 pl-4">{article.excerpt[lang]}</p>
               <div className="whitespace-pre-wrap">
                 {article.content[lang]}
               </div>
               <AdSlot type="in-article" />
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} /> {lang === 'bn' ? 'মন্তব্য করুন' : 'Comments'}
              </h3>
              <div className="space-y-4">
                <textarea 
                  className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none bg-transparent`}
                  rows={4}
                  placeholder={lang === 'bn' ? 'আপনার মতামত লিখুন...' : 'Write your comment here...'}
                ></textarea>
                <button className="bg-red-700 text-white px-8 py-2 rounded font-bold hover:bg-red-800 transition">
                  {lang === 'bn' ? 'মন্তব্য পোস্ট করুন' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <AdSlot type="sidebar" />
            <div className="sticky top-24 space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold border-b-2 border-red-700 pb-2 mb-4 uppercase text-sm tracking-widest">
                  {lang === 'bn' ? 'আরও পড়ুন' : 'Read More'}
                </h3>
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 cursor-pointer group">
                      <img src={`https://picsum.photos/seed/${i+10}/100/100`} className="w-20 h-20 object-cover rounded shadow-sm" />
                      <div>
                        <h4 className="text-sm font-bold leading-snug group-hover:text-red-700 transition-colors">সম্পর্কিত খবর শিরোনাম এখানে থাকবে...</h4>
                        <span className="text-[10px] opacity-60 uppercase font-bold">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;
