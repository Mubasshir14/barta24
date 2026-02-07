
import { NewsArticle, CategoryType } from './types';

export const CATEGORIES = [
  { id: CategoryType.National, bn: 'জাতীয়', en: 'National' },
  { id: CategoryType.International, bn: 'আন্তর্জাতিক', en: 'International' },
  { id: CategoryType.Politics, bn: 'রাজনীতি', en: 'Politics' },
  { id: CategoryType.Sports, bn: 'খেলা', en: 'Sports' },
  { id: CategoryType.Entertainment, bn: 'বিনোদন', en: 'Entertainment' },
  { id: CategoryType.Technology, bn: 'প্রযুক্তি', en: 'Technology' },
  { id: CategoryType.Campus, bn: 'ক্যাম্পাস', en: 'Campus' },
  { id: CategoryType.Education, bn: 'শিক্ষা', en: 'Education' },
  { id: CategoryType.Opinion, bn: 'মতামত', en: 'Opinion' },
];

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: { bn: 'সারাদেশে শীতের দাপট, তাপমাত্রা আরও কমার আভাস', en: 'Winter wave across the country, temperature may drop further' },
    excerpt: { bn: 'দেশের উত্তরাঞ্চলে হিমেল হাওয়ায় বিপর্যস্ত জনজীবন। আবহাওয়া অফিস জানিয়েছে...', en: 'Public life disrupted by chilly winds in northern regions. The weather office says...' },
    content: { bn: 'বিস্তারিত সংবাদ এখানে...', en: 'Full news details here...' },
    category: CategoryType.National,
    // Fix: Replaced 'author' with 'authorId' and 'authorName' and added 'status'
    authorId: 'admin-1',
    authorName: 'রিপোর্ট প্রতিবেদক',
    status: 'published',
    publishedAt: new Date().toISOString(),
    image: 'https://picsum.photos/seed/winter/800/450',
    tags: ['শীত', 'আবহাওয়া'],
    views: 1250,
    isBreaking: true,
    isFeatured: true
  },
  {
    id: '2',
    title: { bn: 'ক্যাম্পাসে নতুন নীতিমালা নিয়ে শিক্ষার্থীদের বিক্ষোভ', en: 'Students protest over new campus policies' },
    excerpt: { bn: 'বিশ্ববিদ্যালয় প্রশাসনের নতুন সিদ্ধান্তের প্রতিবাদে সাধারণ শিক্ষার্থীরা মানববন্ধন করেছে।', en: 'General students formed a human chain protesting the new decision of the university administration.' },
    content: { bn: 'বিস্তারিত সংবাদ এখানে...', en: 'Full news details here...' },
    category: CategoryType.Campus,
    // Fix: Replaced 'author' with 'authorId' and 'authorName' and added 'status'
    authorId: 'admin-1',
    authorName: 'ক্যাম্পাস প্রতিনিধি',
    status: 'published',
    publishedAt: new Date().toISOString(),
    image: 'https://picsum.photos/seed/campus/800/450',
    tags: ['শিক্ষা', 'ক্যাম্পাস'],
    views: 840,
    isBreaking: true
  },
  {
    id: '3',
    title: { bn: 'চ্যাম্পিয়ন্স লিগে রিয়াল মাদ্রিদের বড় জয়', en: 'Real Madrid secures big win in Champions League' },
    excerpt: { bn: 'শেষ মুহূর্তের গোলে জয় নিশ্চিত করল স্প্যানিশ জায়ান্টরা।', en: 'The Spanish giants secured victory with a last-minute goal.' },
    content: { bn: 'বিস্তারিত সংবাদ এখানে...', en: 'Full news details here...' },
    category: CategoryType.Sports,
    // Fix: Replaced 'author' with 'authorId' and 'authorName' and added 'status'
    authorId: 'admin-1',
    authorName: 'ক্রীড়া ডেস্ক',
    status: 'published',
    publishedAt: new Date().toISOString(),
    image: 'https://picsum.photos/seed/sports/800/450',
    tags: ['ফুটবল', 'রিয়াল মাদ্রিদ'],
    views: 2100
  },
  {
    id: '4',
    title: { bn: 'বাজেট ২০২৫: শিক্ষা খাতে বরাদ্দ বাড়ানোর প্রস্তাব', en: 'Budget 2025: Proposal to increase allocation in education sector' },
    excerpt: { bn: 'আসন্ন বাজেটে শিক্ষার মানোন্নয়নে বিশেষ গুরুত্ব দেওয়ার দাবি উঠেছে।', en: 'Demands have been made to give special importance to the development of education quality in the upcoming budget.' },
    content: { bn: 'বিস্তারিত সংবাদ এখানে...', en: 'Full news details here...' },
    category: CategoryType.Politics,
    // Fix: Replaced 'author' with 'authorId' and 'authorName' and added 'status'
    authorId: 'admin-1',
    authorName: 'অর্থনীতি ডেস্ক',
    status: 'published',
    publishedAt: new Date().toISOString(),
    image: 'https://picsum.photos/seed/budget/800/450',
    tags: ['বাজেট', 'শিক্ষা'],
    views: 1560
  }
];
