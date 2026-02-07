
import { translateText } from './gemini';
import { NewsArticle, User, Language, CategoryType } from '../types';

/**
 * 🚀 PRODUCTION API SERVICE
 * -------------------------
 * Robust detection of environment variables for Supabase
 */

const getEnv = (key: string): string => {
  // Access import.meta.env safely
  const metaEnv = (import.meta as any).env || {};
  
  // Try exactly as provided by Vite (Uppercase VITE_)
  if (metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
  
  // Try the specific typo seen in production (Vite_ instead of VITE_)
  if (metaEnv[`Vite_${key}`]) return metaEnv[`Vite_${key}`];
  
  // Try direct key
  if (metaEnv[key]) return metaEnv[key];
  
  // Try process.env as fallback for some build environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`VITE_${key}`] || 
           process.env[`Vite_${key}`] || 
           process.env[key] || 
           '';
  }
  
  return '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL'); 
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY'); 

export const BartaAPI = {
  // --- AUTHENTICATION ---
  
  async login(email: string, pass: string): Promise<{user: User, token: string} | null> {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Configuration Missing:", { url: !!SUPABASE_URL, key: !!SUPABASE_KEY });
      throw new Error("Supabase Configuration Missing! Please check Vercel environment variables. Ensure names are VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ email, password: pass })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      if (data.error === 'invalid_grant' || data.error === 'invalid_credentials') {
        throw new Error("Invalid email or password.");
      }
      throw new Error(data.error_description || data.message || "Authentication failed");
    }

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
    if (!SUPABASE_URL || !SUPABASE_KEY) return null;
    
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (!res.ok) return null;
      
      return {
        id: data.id,
        name: data.user_metadata?.full_name || data.email.split('@')[0],
        email: data.email,
        role: data.user_metadata?.role || 'admin'
      };
    } catch { 
      return null; 
    }
  },

  // --- PUBLIC NEWS ENDPOINTS ---
  
  async getLatestNews(limit = 20): Promise<NewsArticle[]> {
    if (!SUPABASE_URL || !SUPABASE_KEY) return [];
    
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc&limit=${limit}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.map(this.mapSupabaseToNews);
    } catch (e) {
      console.error("News Load Failed:", e);
      return [];
    }
  },

  async incrementViews(id: string): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
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

  // --- CMS ---
  
  async createNews(data: Partial<NewsArticle>, user: User): Promise<NewsArticle> {
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
