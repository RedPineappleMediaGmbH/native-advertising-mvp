import type { Article } from './articles';

const BASE = 'https://tagesblick.net';

interface JsonLd {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  inLanguage: string;
  url: string;
  publisher: { '@type': string; name: string; url: string };
  sponsor?: { '@type': string; name: string };
}

export function buildArticleJsonLd(article: Article, url: string): JsonLd {
  const image = article.image.startsWith('http') ? article.image : `${BASE}${article.image}`;

  const ld: JsonLd = {
    '@context': 'https://schema.org',
    '@type': article.sponsored ? 'Article' : 'NewsArticle',
    headline: article.title,
    description: article.dek,
    image,
    datePublished: article.date,
    inLanguage: 'de',
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Tagesblick',
      url: BASE,
    },
  };

  if (article.sponsored && article.advertiser) {
    ld.sponsor = { '@type': 'Organization', name: article.advertiser };
  }

  return ld;
}
