
import { NewsArticle } from '../types';
import { storage, STORAGE_KEYS } from './storage';

/**
 * 🗄️ DATABASE SERVICE (Local Cache Layer)
 * ---------------------------------------
 * This manages locally stored data to provide instant loading 
 * and offline support for previously fetched news.
 */

export const dbStore = {
  /**
   * ক্যাশ থেকে আর্টিকেলগুলো সংগ্রহ করে
   */
  async getCachedArticles(): Promise<NewsArticle[]> {
    return storage.get<NewsArticle[]>(STORAGE_KEYS.CACHE_ARTICLES, []);
  },

  /**
   * নতুন আর্টিকেলগুলো ক্যাশে সেভ করে (Performance Optimization)
   */
  async cacheArticles(articles: NewsArticle[]): Promise<void> {
    // Keep only the latest 50 articles in local cache to save space
    const toCache = articles.slice(0, 50);
    storage.set(STORAGE_KEYS.CACHE_ARTICLES, toCache);
  },

  /**
   * বুকমার্ক ম্যানেজমেন্ট
   */
  async toggleBookmark(articleId: string): Promise<void> {
    const bookmarks = storage.get<string[]>(STORAGE_KEYS.BOOKMARKS, []);
    const index = bookmarks.indexOf(articleId);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(articleId);
    }
    
    storage.set(STORAGE_KEYS.BOOKMARKS, bookmarks);
  },

  async isBookmarked(articleId: string): Promise<boolean> {
    const bookmarks = storage.get<string[]>(STORAGE_KEYS.BOOKMARKS, []);
    return bookmarks.includes(articleId);
  },

  /**
   * ডাটাবেস রিসেট (লগআউট বা সিস্টেম ক্লিনিং এর জন্য)
   */
  async clearAll(): Promise<void> {
    storage.remove(STORAGE_KEYS.CACHE_ARTICLES);
    storage.remove(STORAGE_KEYS.BOOKMARKS);
  }
};
