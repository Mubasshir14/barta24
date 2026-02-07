
import { NewsArticle } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const dbStore = {
  async getCachedArticles(): Promise<NewsArticle[]> {
    return storage.get<NewsArticle[]>(STORAGE_KEYS.CACHE_ARTICLES, []);
  },


  async cacheArticles(articles: NewsArticle[]): Promise<void> {
    const toCache = articles.slice(0, 50);
    storage.set(STORAGE_KEYS.CACHE_ARTICLES, toCache);
  },

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


  async clearAll(): Promise<void> {
    storage.remove(STORAGE_KEYS.CACHE_ARTICLES);
    storage.remove(STORAGE_KEYS.BOOKMARKS);
  }
};
