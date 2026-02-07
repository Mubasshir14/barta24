
import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, FileText, LayoutDashboard, LogOut, 
  Trash2, Edit3, Save, X, Upload, Eye 
} from 'lucide-react';
import { BartaAPI } from '../services/api';
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
          <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-8 space-y-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center border-b-2 border-black pb-4">
              <h2 className="text-2xl font-black uppercase">Article Editor</h2>
              <button type="button" onClick={() => setIsEditing(false)}><X/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
                >
                  {currentEdit.image ? (
                    <img src={currentEdit.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center opacity-30">
                      <Upload className="mx-auto mb-2" />
                      <p className="font-black text-xs">UPLOAD COVER IMAGE</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Category</label>
                  <select 
                    className="w-full p-3 border-2 border-black font-bold outline-none"
                    value={currentEdit.category}
                    onChange={e => setCurrentEdit({...currentEdit, category: e.target.value as CategoryType})}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.en}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <input 
                  placeholder="Headline (Bengali)"
                  className="w-full p-4 border-2 border-black font-bold text-xl outline-none"
                  value={currentEdit.title?.bn || ''}
                  onChange={e => setCurrentEdit({...currentEdit, title: {...currentEdit.title, bn: e.target.value} as any})}
                  required
                />
                <textarea 
                  placeholder="Short Excerpt"
                  rows={3}
                  className="w-full p-4 border-2 border-black font-bold outline-none"
                  value={currentEdit.excerpt?.bn || ''}
                  onChange={e => setCurrentEdit({...currentEdit, excerpt: {...currentEdit.excerpt, bn: e.target.value} as any})}
                />
                <textarea 
                  placeholder="Detailed News Content"
                  rows={8}
                  className="w-full p-4 border-2 border-black font-medium outline-none"
                  value={currentEdit.content?.bn || ''}
                  onChange={e => setCurrentEdit({...currentEdit, content: {...currentEdit.content, bn: e.target.value} as any})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="bg-red-700 text-white font-black py-4 px-12 uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3">
              <Save size={20}/> Publish to Barta24
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
              <h1 className="text-3xl font-black uppercase">Newsroom</h1>
              <button 
                onClick={() => { setIsEditing(true); setCurrentEdit({ category: CategoryType.National }); }}
                className="bg-red-700 text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-black"
              >
                <PlusCircle size={16}/> New Story
              </button>
            </div>

            <div className="bg-white border-2 border-black overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-black font-black text-[10px] uppercase">
                  <tr>
                    <th className="p-4">News</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stats</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold text-sm">
                  {articles.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 flex gap-4 items-center">
                        <img src={a.image} className="w-12 h-8 object-cover border border-black" />
                        <span className="line-clamp-1">{a.title[lang]}</span>
                      </td>
                      <td className="p-4"><span className="text-[10px] bg-black text-white px-2 py-0.5">{a.category}</span></td>
                      <td className="p-4 flex items-center gap-1 opacity-50"><Eye size={14}/> {a.views}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => { setIsEditing(true); setCurrentEdit(a); }} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline">Delete</button>
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
