
import { NewsArticle, User, UserRole, CategoryType } from '../types';

const STORAGE_KEYS = {
  ARTICLES: 'barta24_articles_v1',
  USERS: 'barta24_users_v1',
  CURRENT_USER: 'barta24_current_user_v1'
};

// Fixed Admin credentials for production-ready simulation
// In a real backend, these would be in a protected database table
const FIXED_ADMIN: User = {
  id: 'admin_primary_001',
  name: 'প্রধান সম্পাদক', // Chief Editor
  email: 'admin@barta24.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=b91c1c&color=fff'
};

const FIXED_ADMIN_PASS = 'barta24@admin'; // Realistic fixed password

class DB {
  private static instance: DB;
  
  private constructor() {
    this.initialize();
  }

  public static getInstance(): DB {
    if (!DB.instance) DB.instance = new DB();
    return DB.instance;
  }

  private initialize() {
    // Initialize Articles if not present
    if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify([]));
    }
    
    // Ensure the fixed admin is always in the user "table"
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    const adminExists = users.some(u => u.email === FIXED_ADMIN.email);
    if (!adminExists) {
      users.push(FIXED_ADMIN);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  // Articles Methods
  async getArticles(): Promise<NewsArticle[]> {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    const articles: NewsArticle[] = data ? JSON.parse(data) : [];
    // Sort by most recent first
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async saveArticle(article: NewsArticle): Promise<void> {
    const articles = await this.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index > -1) {
      articles[index] = { ...article, publishedAt: article.publishedAt || new Date().toISOString() };
    } else {
      articles.push({ ...article, publishedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }

  async deleteArticle(id: string): Promise<void> {
    const articles = await this.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered));
  }

  // Auth Methods
  async getCurrentUser(): Promise<User | null> {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  async login(email: string, password?: string): Promise<User | null> {
    // In this implementation, we check against our fixed secure credentials
    if (email === FIXED_ADMIN.email && password === FIXED_ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(FIXED_ADMIN));
      return FIXED_ADMIN;
    }
    return null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export const db = DB.getInstance();
