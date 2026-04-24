import { describe, it, expect } from 'vitest';
import { buildArticleJsonLd } from './article-json-ld';
import type { Article } from './articles';

const editorial: Article = {
  title: 'Test Artikel',
  kicker: 'Digital',
  dek: 'Kurzbeschreibung.',
  date: '2026-04-20',
  slug: 'test-artikel',
  image: '/generated/2026-04-20-test.jpg',
  body: 'body',
};

const sponsored: Article = {
  ...editorial,
  sponsored: true,
  advertiser: 'Brand GmbH',
};

const URL = 'https://tagesblick.net/artikel/test-artikel';

describe('buildArticleJsonLd', () => {
  it('uses NewsArticle type for editorial articles', () => {
    const ld = buildArticleJsonLd(editorial, URL);
    expect(ld['@type']).toBe('NewsArticle');
  });

  it('uses Article type for sponsored articles', () => {
    const ld = buildArticleJsonLd(sponsored, URL);
    expect(ld['@type']).toBe('Article');
  });

  it('adds sponsor object when sponsored and advertiser are set', () => {
    const ld = buildArticleJsonLd(sponsored, URL);
    expect(ld.sponsor).toEqual({ '@type': 'Organization', name: 'Brand GmbH' });
  });

  it('omits sponsor for editorial articles', () => {
    const ld = buildArticleJsonLd(editorial, URL);
    expect(ld.sponsor).toBeUndefined();
  });

  it('resolves relative image paths to absolute URLs', () => {
    const ld = buildArticleJsonLd(editorial, URL);
    expect(ld.image).toBe('https://tagesblick.net/generated/2026-04-20-test.jpg');
  });

  it('keeps absolute image URLs unchanged', () => {
    const article = { ...editorial, image: 'https://images.unsplash.com/photo.jpg' };
    const ld = buildArticleJsonLd(article, URL);
    expect(ld.image).toBe('https://images.unsplash.com/photo.jpg');
  });

  it('includes required schema.org fields', () => {
    const ld = buildArticleJsonLd(editorial, URL);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld.headline).toBe('Test Artikel');
    expect(ld.description).toBe('Kurzbeschreibung.');
    expect(ld.datePublished).toBe('2026-04-20');
    expect(ld.inLanguage).toBe('de');
    expect(ld.url).toBe(URL);
    expect(ld.publisher).toEqual({
      '@type': 'Organization',
      name: 'Tagesblick',
      url: 'https://tagesblick.net',
    });
  });
});
