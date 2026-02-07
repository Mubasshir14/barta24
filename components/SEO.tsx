
import React from 'react';
import { NewsArticle, Language } from '../types';

interface SEOProps {
  article?: NewsArticle;
  lang: Language;
  type: 'website' | 'article';
  title?: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ article, lang, type, title, description }) => {
  const siteName = "Barta24 | বার্তা২৪";
  const seoTitle = article ? `${article.title[lang]} | ${siteName}` : (title || siteName);
  const seoDesc = article ? article.excerpt[lang] : (description || "নির্ভীক সাংবাদিকতা ও আধুনিক সংবাদ পোর্টাল");
  const url = window.location.href;
  const image = article?.image || "https://barta24.com/og-image.jpg";

  // JSON-LD for Google News
  const structuredData = article ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title[lang],
    "image": [article.image],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": [{
      "@type": "Person",
      "name": article.authorName,
      "url": url
    }]
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": url
  };

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDesc} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </>
  );
};

export default SEO;
