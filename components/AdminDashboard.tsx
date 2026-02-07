
import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, FileText, LogOut, 
  Trash2, Edit3, Save, X, Upload, Eye, Languages, Sparkles, Loader2
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
  const [activeTab, setActiveTab] = useState<'articles' | 'stats'>('articles');
  const [editorLangTab, setEditorLangTab] = useState<Language>('bn');
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
      alert(lang === 'bn' ? 'আগে বাংলা কন্টেন্ট লিখুন' : 'Please write Bengali content first');
      return;
    }

    setIsTranslating(true);
    try {
      const [enTitle, enExcerpt, enContent] = await Promise.all([
        translateText(currentEdit.title.bn, 'bn', 'en'),
        translateText(currentEdit.excerpt?.bn || '', 'bn', 'en'),
        translateText(currentEdit.content.bn, 'bn', 'en')
      ]);

      setCurrentEdit({
        ...currentEdit,
        title: { ...currentEdit.title, en: enTitle },
        excerpt: { ...currentEdit.excerpt, en: enExcerpt },
        content: { ...currentEdit.content, en: enContent }
      } as any);
      
      setEditorLangTab('en');
    } catch (error) {
      console.error("AI Translation failed", error);
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
    if (confirm('Delete this article?')) {
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
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-3 p-4 rounded ${activeTab === 'articles' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <FileText size={18}/> {lang === 'bn' ? 'নিউজ ম্যানেজমেন্ট' : 'News Management'}
          </button>
        </nav>
      </aside>

      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {currentEdit.id ? 'Edit Article' : 'New Article'}
              </h2>
              <button type="button" onClick={() => setIsEditing(false)} className="hover:text-red-700 transition-colors">
                <X size={24}/>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Media & Meta */}
              <div className="lg:col-span-4 space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                  {currentEdit.image ? (
                    <>
                      <img src={currentEdit.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white text-[10px] font-black">CHANGE IMAGE</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center opacity-30">
                      <Upload className="mx-auto mb-2" />
                      <p className="font-black text-[10px]">UPLOAD COVER IMAGE</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-gray-500">Category</label>
                    <select 
                      className="w-full p-3 border-2 border-black dark:border-gray-700 bg-transparent font-bold outline-none"
                      value={currentEdit.category}
                      onChange={e => setCurrentEdit({...currentEdit, category: e.target.value as CategoryType})}
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id} className="dark:bg-gray-800">{c.en}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                      <input 
                        type="checkbox" 
                        checked={currentEdit.isBreaking} 
                        onChange={e => setCurrentEdit({...currentEdit, isBreaking: e.target.checked})}
                        className="w-4 h-4 accent-red-700"
                      />
                      Breaking News
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                      <input 
                        type="checkbox" 
                        checked={currentEdit.isFeatured} 
                        onChange={e => setCurrentEdit({...currentEdit, isFeatured: e.target.checked})}
                        className="w-4 h-4 accent-red-700"
                      />
                      Featured Story
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                   <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setEditorLangTab('bn')}
                        className={`text-xs font-black uppercase tracking-widest pb-1 transition-all ${editorLangTab === 'bn' ? 'text-red-700 border-b-2 border-red-700' : 'opacity-30'}`}
                      >
                        Bengali
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditorLangTab('en')}
                        className={`text-xs font-black uppercase tracking-widest pb-1 transition-all ${editorLangTab === 'en' ? 'text-red-700 border-b-2 border-red-700' : 'opacity-30'}`}
                      >
                        English
                      </button>
                   </div>
                   
                   <button 
                    type="button"
                    disabled={isTranslating}
                    onClick={handleAutoTranslate}
                    className="flex items-center gap-2 text-[10px] font-black uppercase bg-gray-100 dark:bg-gray-700 px-3 py-1.5 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                   >
                     {isTranslating ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                     Auto-Translate to English
                   </button>
                </div>

                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Headline ({editorLangTab === 'bn' ? 'Bengali' : 'English'})</label>
                    <input 
                      placeholder={editorLangTab === 'bn' ? 'শিরোনাম লিখুন...' : 'Enter Headline...'}
                      className="w-full p-4 border-2 border-black dark:border-gray-700 bg-transparent font-bold text-xl outline-none focus:border-red-700"
                      value={currentEdit.title?.[editorLangTab] || ''}
                      onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, [editorLangTab]: e.target.value} as any})}
                      required={editorLangTab === 'bn'}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Short Excerpt</label>
                    <textarea 
                      placeholder={editorLangTab === 'bn' ? 'সংক্ষিপ্ত সারসংক্ষেপ...' : 'Short summary...'}
                      rows={2}
                      className="w-full p-4 border-2 border-black dark:border-gray-700 bg-transparent font-bold outline-none focus:border-red-700"
                      value={currentEdit.excerpt?.[editorLangTab] || ''}
                      onChange={e => setCurrentEdit({...currentEdit, excerpt: {...currentEdit.excerpt, [editorLangTab]: e.target.value} as any})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">Main Content</label>
                    <textarea 
                      placeholder={editorLangTab === 'bn' ? 'বিস্তারিত সংবাদ...' : 'Full article content...'}
                      rows={10}
                      className="w-full p-4 border-2 border-black dark:border-gray-700 bg-transparent font-medium outline-none focus:border-red-700"
                      value={currentEdit.content?.[editorLangTab] || ''}
                      onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, [editorLangTab]: e.target.value} as any})}
                      required={editorLangTab === 'bn'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t-2 border-black dark:border-gray-700">
              <button type="submit" className="bg-red-700 text-white font-black py-4 px-12 uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3 active:scale-95 shadow-lg">
                <Save size={20}/> Publish to Barta24
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="border-2 border-black dark:border-gray-600 px-8 py-4 font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-4 border-black dark:border-gray-700 pb-4">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Newsroom</h1>
              <button 
                onClick={() => { setIsEditing(true); setCurrentEdit({ category: CategoryType.National, title: {bn: '', en: ''}, excerpt: {bn: '', en: ''}, content: {bn: '', en: ''} }); }}
                className="bg-red-700 text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-black shadow-lg"
              >
                <PlusCircle size={16}/> New Story
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-black dark:border-gray-700 font-black text-[10px] uppercase">
                  <tr>
                    <th className="p-4">News</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-bold text-sm">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center opacity-30 italic">No news articles found</td>
                    </tr>
                  ) : articles.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex gap-4 items-center">
                          <img src={a.image} className="w-12 h-8 object-cover border border-black dark:border-gray-700 shrink-0" />
                          <div>
                            <span className="line-clamp-1">{a.title[lang]}</span>
                            <div className="flex gap-2 mt-1">
                               {a.isBreaking && <span className="bg-red-100 text-red-700 text-[8px] px-1 py-0.5 rounded uppercase">Breaking</span>}
                               {a.isFeatured && <span className="bg-blue-100 text-blue-700 text-[8px] px-1 py-0.5 rounded uppercase">Featured</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase">{a.category}</span></td>
                      <td className="p-4 flex items-center gap-1 opacity-50"><Eye size={14}/> {a.views}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => { setIsEditing(true); setCurrentEdit(a); setEditorLangTab('bn'); }} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Edit3 size={14}/> Edit
                          </button>
                          <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline flex items-center gap-1">
                            <Trash2 size={14}/> Delete
                          </button>
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
