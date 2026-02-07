
import { NewsArticle, User, CategoryType } from '../types';

const DB_KEYS = {
  ARTICLES: 'barta24_db_articles',
  USERS: 'barta24_db_users',
  SESSION: 'barta24_db_session'
};

// Fixed Production Admin
const PRIMARY_ADMIN: User = {
  id: 'usr_admin_001',
  name: 'প্রধান সম্পাদক',
  email: 'admin@barta24.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=b91c1c&color=fff'
};

const PRIMARY_ADMIN_PASS = 'barta24@admin';

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(DB_KEYS.ARTICLES)) {
      localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([PRIMARY_ADMIN]));
    }
  }

  async queryArticles(): Promise<NewsArticle[]> {
    const data = localStorage.getItem(DB_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  }

  async commitArticles(articles: NewsArticle[]): Promise<void> {
    localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify(articles));
  }

  async validateAdmin(email: string, pass: string): Promise<User | null> {
    if (email === PRIMARY_ADMIN.email && pass === PRIMARY_ADMIN_PASS) {
      return PRIMARY_ADMIN;
    }
    return null;
  }
}

export const dbStore = new MockDatabase();
