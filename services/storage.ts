
const PREFIX = 'barta24_';

export const storage = {
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${PREFIX}${key}`, serializedValue);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Error reading from localStorage, using default', e);
      return defaultValue;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clearSession(): void {
    this.remove('jwt');
    this.remove('user');
  }
};

// Common keys used in the app
export const STORAGE_KEYS = {
  TOKEN: 'jwt',
  USER: 'user',
  THEME: 'is_dark',
  LANG: 'lang',
  BOOKMARKS: 'bookmarks',
  CACHE_ARTICLES: 'cached_news'
};
