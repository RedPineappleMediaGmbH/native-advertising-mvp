import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

const BASE = 'https://tagesblick.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const categories = [...new Set(articles.map(a => a.kicker.toLowerCase()))];

  return [
    { url: BASE, lastModified: new Date(), priority: 1.0 },
    ...categories.map(cat => ({
      url: `${BASE}/kategorie/${cat}`,
      priority: 0.5,
    })),
    ...articles.map(a => ({
      url: `${BASE}/artikel/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.8,
    })),
  ];
}
