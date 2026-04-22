import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { parseArticleFile, type Article } from './articles';

const fixture = path.join(__dirname, 'fixtures/sample-article.mdx');

describe('parseArticleFile', () => {
  it('parses frontmatter and body', () => {
    const article = parseArticleFile(fixture);
    expect(article.title).toBe('Testartikel');
    expect(article.kicker).toBe('Digital');
    expect(article.dek).toBe('Dies ist eine Kurzbeschreibung.');
    expect(article.date).toBe('2026-04-20');
    expect(article.slug).toBe('testartikel');
    expect(article.image).toBe('/generated/2026-04-20-testartikel.jpg');
    expect(article.body).toContain('## Einleitung');
    expect(article.body).toContain('Dies ist der Hauptteil.');
  });

  it('throws on missing frontmatter fields', () => {
    expect(() => parseArticleFile('/nonexistent.mdx')).toThrow();
  });
});
