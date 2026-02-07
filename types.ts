export type Language = 'bn' | 'en';

export type UserRole = 'admin' | 'editor' | 'reporter' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface NewsArticle {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  category: CategoryType;
  authorId: string;
  authorName: string;
  publishedAt: string;
  image: string;
  tags: string[];
  views: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  status: 'published' | 'draft' | 'archived';
}

export enum CategoryType {
  Politics = 'Politics',
  National = 'National',
  International = 'International',
  Sports = 'Sports',
  Entertainment = 'Entertainment',
  Technology = 'Technology',
  Opinion = 'Opinion',
  Education = 'Education',
  Campus = 'Campus',
  Economy = 'Economy',
  Lifestyle = 'Lifestyle',
  Job = 'Job',
  Health = 'Health',
  Science = 'Science',
  Environment = 'Environment',
  Law = 'Law',
  Religion = 'Religion',
  Literature = 'Literature',
  Special = 'Special',
  Crime = 'Crime',
  Agriculture = 'Agriculture',
  Travel = 'Travel',
  Auto = 'Auto',
  Multimedia = 'Multimedia',
  Corporate = 'Corporate',
  Probash = 'Probash',
  Feature = 'Feature'
}