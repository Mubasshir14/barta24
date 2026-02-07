
import { translateText } from './gemini';
import { NewsArticle, User, Language, CategoryType } from '../types';
import { dbStore } from './database';

/**
 * 🚀 PRODUCTION API SERVICE
 * -------------------------
 * Handles Supabase and LocalStorage Fallback
 */

const getEnv = (key: string) => {
  // Check for Vite's import.meta.env first, then process.env
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
  if (metaEnv && metaEnv[key]) return metaEnv[key];
  return (typeof process !== 'undefined' && process.env && process.env[key]) || '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL'); 
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY'); 

// Check if we should use Mock/Local DB
const isMockMode = !SUPABASE_URL || !SUPABASE_KEY;

export const BartaAPI = {
  // --- PUBLIC NEWS ENDPOINTS ---
  
  async getLatestNews(limit = 20): Promise<NewsArticle[]> {
    if (isMockMode) {
      console.log("Running in Mock Mode (LocalStorage)");
      const articles = await dbStore.queryArticles();
      return articles.slice(0, limit);
    }
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc&limit=${limit}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      if (!res.ok) throw new Error('Fetch Error');
      const data = await res.json();
      return data.map(this.mapSupabaseToNews);
    } catch (e) {
      console.error("News Load Failed, falling back to mock:", e);
      return await dbStore.queryArticles();
    }
  },

  async incrementViews(id: string): Promise<void> {
    if (isMockMode) return;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&select=views`, {
        headers: { 'apikey': SUPABASE_KEY }
      });
      const data = await res.json();
      if (data?.[0]) {
        await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
          method: 'PATCH',
          headers: { 
            'apikey': SUPABASE_KEY, 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({ views: (data[0].views || 0) + 1 })
        });
      }
    } catch (e) {}
  },

  // --- AUTH ---
  async login(email: string, pass: string): Promise<{user: User, token: string} | null> {
    if (isMockMode) {
      const user = await dbStore.validateAdmin(email, pass);
      if (user) {
        localStorage.setItem('barta_jwt', 'mock_token_123');
        return { user, token: 'mock_token_123' };
      }
      throw new Error("Invalid login credentials (Mock Mode)");
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || "Authentication failed");

    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.full_name || email.split('@')[0],
      email: data.user.email,
      role: data.user.user_metadata?.role || 'admin'
    };
    localStorage.setItem('barta_jwt', data.access_token);
    return { user, token: data.access_token };
  },

  async getUserFromToken(token: string): Promise<User | null> {
    if (isMockMode && token === 'mock_token_123') {
       return await dbStore.validateAdmin('admin@barta24.com', 'barta24@admin');
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return null;
      return {
        id: data.id,
        name: data.user_metadata?.full_name || data.email.split('@')[0],
        email: data.email,
        role: data.user_metadata?.role || 'admin'
      };
    } catch { return null; }
  },

  // --- CMS ---
  async createNews(data: Partial<NewsArticle>, user: User): Promise<NewsArticle> {
    if (isMockMode) {
      const articles = await dbStore.queryArticles();
      const newArt: NewsArticle = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title || { bn: '', en: '' },
        excerpt: data.excerpt || { bn: '', en: '' },
        content: data.content || { bn: '', en: '' },
        category: data.category || CategoryType.National,
        authorId: user.id,
        authorName: user.name,
        publishedAt: new Date().toISOString(),
        image: data.image || 'https://picsum.photos/seed/news/800/450',
        tags: [],
        views: 0,
        isBreaking: !!data.isBreaking,
        isFeatured: !!data.isFeatured,
        status: 'published'
      };
      articles.push(newArt);
      await dbStore.commitArticles(articles);
      return newArt;
    }

    const token = localStorage.getItem('barta_jwt');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        title_bn: data.title?.bn,
        title_en: data.title?.en || '',
        excerpt_bn: data.excerpt?.bn || '',
        excerpt_en: data.excerpt?.en || '',
        content_bn: data.content?.bn,
        content_en: data.content?.en || '',
        category: data.category,
        author_id: user.id,
        author_name: user.name,
        image: data.image,
        is_breaking: !!data.isBreaking,
        is_featured: !!data.isFeatured,
        status: 'published'
      })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Storage failed');
    return this.mapSupabaseToNews(result[0]);
  },

  async updateNews(id: string, data: Partial<NewsArticle>): Promise<void> {
    if (isMockMode) {
      const articles = await dbStore.queryArticles();
      const idx = articles.findIndex(a => a.id === id);
      if (idx > -1) {
        articles[idx] = { ...articles[idx], ...data };
        await dbStore.commitArticles(articles);
      }
      return;
    }
    const token = localStorage.getItem('barta_jwt');
    await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title_bn: data.title?.bn,
        title_en: data.title?.en,
        excerpt_bn: data.excerpt?.bn,
        excerpt_en: data.excerpt?.en,
        content_bn: data.content?.bn,
        content_en: data.content?.en,
        category: data.category,
        image: data.image,
        is_breaking: data.isBreaking,
        is_featured: data.isFeatured
      })
    });
  },

  async deleteNews(id: string): Promise<void> {
    if (isMockMode) {
      const articles = await dbStore.queryArticles();
      await dbStore.commitArticles(articles.filter(a => a.id !== id));
      return;
    }
    const token = localStorage.getItem('barta_jwt');
    await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${token}`
      }
    });
  },

  mapSupabaseToNews(db: any): NewsArticle {
    return {
      id: db.id,
      title: { bn: db.title_bn, en: db.title_en || '' },
      excerpt: { bn: db.excerpt_bn, en: db.excerpt_en || '' },
      content: { bn: db.content_bn, en: db.content_en || '' },
      category: db.category as CategoryType,
      authorId: db.author_id,
      authorName: db.author_name,
      publishedAt: db.published_at,
      image: db.image || 'https://picsum.photos/seed/news/800/450',
      tags: [],
      views: db.views || 0,
      isBreaking: db.is_breaking,
      isFeatured: db.is_featured,
      status: (db.status as any) || 'published'
    };
  },

  async translateArticle(article: NewsArticle, to: Language): Promise<NewsArticle> {
    const from: Language = to === 'bn' ? 'en' : 'bn';
    if (article.title[to] && article.content[to] && article.title[to].length > 5) return article;
    
    try {
      const [newTitle, newExcerpt, newContent] = await Promise.all([
        translateText(article.title[from], from, to),
        translateText(article.excerpt[from], from, to),
        translateText(article.content[from], from, to)
      ]);
      return {
        ...article,
        title: { ...article.title, [to]: newTitle },
        excerpt: { ...article.excerpt, [to]: newExcerpt },
        content: { ...article.content, [to]: newContent }
      };
    } catch (e) {
      return article;
    }
  }
};
