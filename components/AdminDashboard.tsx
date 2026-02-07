
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   PlusCircle, FileText, LogOut, 
//   Trash2, Edit3, Save, X, Upload, Eye, Sparkles, Loader2
// } from 'lucide-react';
// import { BartaAPI } from '../services/api';
// import { translateText } from '../services/gemini';
// import { NewsArticle, User, CategoryType, Language } from '../types';
// import { CATEGORIES } from '../constants';

// interface AdminDashboardProps {
//   user: User;
//   onLogout: () => void;
//   lang: Language;
// }

// const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, lang }) => {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentEdit, setCurrentEdit] = useState<Partial<NewsArticle>>({});
//   const [isTranslating, setIsTranslating] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => { loadData(); }, []);

//   const loadData = async () => {
//     const data = await BartaAPI.getLatestNews(100);
//     setArticles(data);
//   };

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setCurrentEdit({ ...currentEdit, image: reader.result as string });
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAutoTranslate = async () => {
//     if (!currentEdit.title?.bn || !currentEdit.content?.bn) {
//       alert('প্রথমে বাংলা কন্টেন্ট লিখুন।');
//       return;
//     }

//     setIsTranslating(true);
//     try {
//       const [enTitle, enExcerpt, enContent] = await Promise.all([
//         translateText(currentEdit.title.bn, 'bn', 'en'),
//         translateText(currentEdit.excerpt?.bn || '', 'bn', 'en'),
//         translateText(currentEdit.content.bn, 'bn', 'en')
//       ]);

//       setCurrentEdit({
//         ...currentEdit,
//         title: { ...currentEdit.title, en: enTitle },
//         excerpt: { ...currentEdit.excerpt, en: enExcerpt },
//         content: { ...currentEdit.content, en: enContent }
//       } as any);
//     } catch (error) {
//       console.error("AI Translation failed", error);
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentEdit.id) {
//       await BartaAPI.updateNews(currentEdit.id, currentEdit);
//     } else {
//       await BartaAPI.createNews(currentEdit, user);
//     }
//     setIsEditing(false);
//     setCurrentEdit({});
//     loadData();
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('আর্টিকেলটি মুছে ফেলতে চান?')) {
//       await BartaAPI.deleteNews(id);
//       loadData();
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
//       <aside className="lg:w-64 space-y-4">
//         <div className="bg-red-700 text-white p-6 rounded shadow-lg">
//           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Active</p>
//           <p className="font-black text-lg mt-1">{user.name}</p>
//           <button onClick={onLogout} className="mt-6 flex items-center gap-2 text-xs font-bold hover:opacity-70">
//             <LogOut size={14}/> SIGN OUT
//           </button>
//         </div>
//         <nav className="flex flex-col gap-1 font-bold text-sm">
//           <button className="flex items-center gap-3 p-4 rounded bg-black text-white">
//             <FileText size={18}/> News Management
//           </button>
//         </nav>
//       </aside>

//       <div className="flex-1">
//         {isEditing ? (
//           <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 p-8 space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
//             <div className="flex justify-between items-center border-b-2 border-black dark:border-gray-700 pb-4">
//               <h2 className="text-2xl font-black uppercase tracking-tighter">
//                 {currentEdit.id ? 'Edit Article' : 'New Article'}
//               </h2>
//               <button type="button" onClick={() => setIsEditing(false)} className="hover:text-red-700 transition-colors">
//                 <X size={24}/>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
//                 {currentEdit.image ? <img src={currentEdit.image} className="w-full h-full object-cover" /> : <Upload className="opacity-30" />}
//                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
//               </div>
//               <div className="md:col-span-2 grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-[10px] font-black uppercase mb-1">Category</label>
//                   <select 
//                     className="w-full p-3 border-2 border-black dark:border-gray-700 bg-transparent font-bold outline-none"
//                     value={currentEdit.category}
//                     onChange={e => setCurrentEdit({...currentEdit, category: e.target.value as CategoryType})}
//                   >
//                     {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.en}</option>)}
//                   </select>
//                 </div>
//                 <div className="flex flex-col justify-center gap-2">
//                   <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
//                     <input type="checkbox" checked={currentEdit.isBreaking} onChange={e => setCurrentEdit({...currentEdit, isBreaking: e.target.checked})} /> Breaking
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
//                     <input type="checkbox" checked={currentEdit.isFeatured} onChange={e => setCurrentEdit({...currentEdit, isFeatured: e.target.checked})} /> Featured
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-8">
//               <div className="flex justify-center">
//                 <button type="button" disabled={isTranslating} onClick={handleAutoTranslate} className="bg-black text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-red-700 disabled:opacity-50">
//                   {isTranslating ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} AI Translate (BN to EN)
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//                 <div className="space-y-6 bg-gray-50 dark:bg-gray-900/40 p-6 border-l-4 border-red-700">
//                   <h3 className="text-sm font-black uppercase text-red-700">Bengali (বাংলা)</h3>
//                   <input placeholder="শিরোনাম..." className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-bold text-lg outline-none" value={currentEdit.title?.bn || ''} onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, bn: e.target.value} as any})} required />
//                   <textarea placeholder="বিস্তারিত সংবাদ..." rows={12} className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-medium outline-none" value={currentEdit.content?.bn || ''} onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, bn: e.target.value} as any})} required />
//                 </div>
//                 <div className="space-y-6 bg-gray-50 dark:bg-gray-900/40 p-6 border-l-4 border-blue-700">
//                   <h3 className="text-sm font-black uppercase text-blue-700">English Version</h3>
//                   <input placeholder="Headline..." className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-bold text-lg outline-none" value={currentEdit.title?.en || ''} onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, en: e.target.value} as any})} />
//                   <textarea placeholder="Full article content..." rows={12} className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-medium outline-none" value={currentEdit.content?.en || ''} onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, en: e.target.value} as any})} />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-4 pt-4">
//               <button type="submit" className="bg-red-700 text-white font-black py-4 px-12 uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3 shadow-lg">
//                 <Save size={20}/> Publish Story
//               </button>
//               <button type="button" onClick={() => setIsEditing(false)} className="border-2 border-black px-8 py-4 font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center border-b-4 border-black pb-4">
//               <h1 className="text-3xl font-black uppercase">Newsroom</h1>
//               <button onClick={() => { setIsEditing(true); setCurrentEdit({ category: CategoryType.National, title: {bn: '', en: ''}, excerpt: {bn: '', en: ''}, content: {bn: '', en: ''} }); }} className="bg-red-700 text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-black">
//                 <PlusCircle size={16}/> New Story
//               </button>
//             </div>
//             <div className="bg-white dark:bg-gray-800 border-2 border-black overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-black text-[10px] uppercase font-black">
//                   <tr><th className="p-4">Article</th><th className="p-4">Category</th><th className="p-4">Views</th><th className="p-4 text-right">Actions</th></tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-bold text-sm">
//                   {articles.map(a => (
//                     <tr key={a.id} className="hover:bg-gray-50">
//                       <td className="p-4 flex gap-4 items-center"><img src={a.image} className="w-12 h-8 object-cover border border-black/10" /> <span className="line-clamp-1">{a.title.bn}</span></td>
//                       <td className="p-4"><span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase">{a.category}</span></td>
//                       <td className="p-4 opacity-50"><Eye size={14} className="inline mr-1"/> {a.views}</td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-3">
//                           <button onClick={() => { setIsEditing(true); setCurrentEdit(a); }} className="text-blue-600 hover:underline">Edit</button>
//                           <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Delete</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, FileText, LogOut, 
  Trash2, Edit3, Save, X, Upload, Eye, Sparkles, Loader2
} from 'lucide-react';
import { BartaAPI } from '../services/api';
import { translateText } from '../services/gemini';
import { NewsArticle, User, CategoryType, Language } from '../types';
import { CATEGORIES } from '../constants';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, lang }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Partial<NewsArticle>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await BartaAPI.getLatestNews(100);
    setArticles(data);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentEdit({ ...currentEdit, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAutoTranslate = async () => {
    if (!currentEdit.title?.bn || !currentEdit.content?.bn) {
      alert('প্রথমে বাংলা কন্টেন্ট লিখুন।');
      return;
    }

    setIsTranslating(true);
    try {
      // 🔄 Sequential translation to avoid rate limits
      const enTitle = await translateText(currentEdit.title.bn, 'bn', 'en');
      const enExcerpt = await translateText(currentEdit.excerpt?.bn || '', 'bn', 'en');
      const enContent = await translateText(currentEdit.content.bn, 'bn', 'en');

      setCurrentEdit(prev => ({
        ...prev,
        title: { ...prev.title, en: enTitle } as any,
        excerpt: { ...prev.excerpt, en: enExcerpt } as any,
        content: { ...prev.content, en: enContent } as any
      }));
      
      alert('অনুবাদ সফল হয়েছে!');
    } catch (error) {
      console.error("AI Translation failed", error);
      alert('অনুবাদে সমস্যা হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEdit.id) {
      await BartaAPI.updateNews(currentEdit.id, currentEdit);
    } else {
      await BartaAPI.createNews(currentEdit, user);
    }
    setIsEditing(false);
    setCurrentEdit({});
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('আর্টিকেলটি মুছে ফেলতে চান?')) {
      await BartaAPI.deleteNews(id);
      loadData();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
      <aside className="lg:w-64 space-y-4">
        <div className="bg-red-700 text-white p-6 rounded shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Active</p>
          <p className="font-black text-lg mt-1">{user.name}</p>
          <button onClick={onLogout} className="mt-6 flex items-center gap-2 text-xs font-bold hover:opacity-70">
            <LogOut size={14}/> SIGN OUT
          </button>
        </div>
        <nav className="flex flex-col gap-1 font-bold text-sm">
          <button className="flex items-center gap-3 p-4 rounded bg-black text-white">
            <FileText size={18}/> News Management
          </button>
        </nav>
      </aside>

      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 p-8 space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {currentEdit.id ? 'Edit Article' : 'New Article'}
              </h2>
              <button type="button" onClick={() => setIsEditing(false)} className="hover:text-red-700 transition-colors">
                <X size={24}/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
                {currentEdit.image ? <img src={currentEdit.image} className="w-full h-full object-cover" /> : <Upload className="opacity-30" />}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Category</label>
                  <select 
                    className="w-full p-3 border-2 border-black dark:border-gray-700 bg-transparent font-bold outline-none"
                    value={currentEdit.category}
                    onChange={e => setCurrentEdit({...currentEdit, category: e.target.value as CategoryType})}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.en}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input type="checkbox" checked={currentEdit.isBreaking} onChange={e => setCurrentEdit({...currentEdit, isBreaking: e.target.checked})} /> Breaking
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input type="checkbox" checked={currentEdit.isFeatured} onChange={e => setCurrentEdit({...currentEdit, isFeatured: e.target.checked})} /> Featured
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-center">
                <button 
                  type="button" 
                  disabled={isTranslating} 
                  onClick={handleAutoTranslate} 
                  className="bg-black text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isTranslating ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} 
                  {isTranslating ? 'Translating...' : 'AI Translate (BN to EN)'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6 bg-gray-50 dark:bg-gray-900/40 p-6 border-l-4 border-red-700">
                  <h3 className="text-sm font-black uppercase text-red-700">Bengali (বাংলা)</h3>
                  <input placeholder="শিরোনাম..." className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-bold text-lg outline-none" value={currentEdit.title?.bn || ''} onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, bn: e.target.value} as any})} required />
                  <textarea placeholder="বিস্তারিত সংবাদ..." rows={12} className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-medium outline-none" value={currentEdit.content?.bn || ''} onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, bn: e.target.value} as any})} required />
                </div>
                <div className="space-y-6 bg-gray-50 dark:bg-gray-900/40 p-6 border-l-4 border-blue-700">
                  <h3 className="text-sm font-black uppercase text-blue-700">English Version</h3>
                  <input placeholder="Headline..." className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-bold text-lg outline-none" value={currentEdit.title?.en || ''} onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, en: e.target.value} as any})} />
                  <textarea placeholder="Full article content..." rows={12} className="w-full p-4 border-2 border-black bg-white dark:bg-gray-800 font-medium outline-none" value={currentEdit.content?.en || ''} onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, en: e.target.value} as any})} />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-red-700 text-white font-black py-4 px-12 uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3 shadow-lg">
                <Save size={20}/> Publish Story
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="border-2 border-black px-8 py-4 font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
              <h1 className="text-3xl font-black uppercase">Newsroom</h1>
              <button onClick={() => { setIsEditing(true); setCurrentEdit({ category: CategoryType.National, title: {bn: '', en: ''}, excerpt: {bn: '', en: ''}, content: {bn: '', en: ''} }); }} className="bg-red-700 text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-black">
                <PlusCircle size={16}/> New Story
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 border-2 border-black overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-black text-[10px] uppercase font-black">
                  <tr><th className="p-4">Article</th><th className="p-4">Category</th><th className="p-4">Views</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-bold text-sm">
                  {articles.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 flex gap-4 items-center"><img src={a.image} className="w-12 h-8 object-cover border border-black/10" /> <span className="line-clamp-1">{a.title.bn}</span></td>
                      <td className="p-4"><span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase">{a.category}</span></td>
                      <td className="p-4 opacity-50"><Eye size={14} className="inline mr-1"/> {a.views}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => { setIsEditing(true); setCurrentEdit(a); }} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;