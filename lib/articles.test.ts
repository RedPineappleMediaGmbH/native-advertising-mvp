import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { parseArticleFile, getAllArticles, getArticleBySlug } from './articles';

const fixture = path.join(__dirname, 'fixtures/sample-article.mdx');

describe('parseArticleFile', () => {
  it('parses frontmatter and body from a valid article', () => {
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

  it('throws when a required field is missing', () => {
    const tmp = path.join(os.tmpdir(), 'missing-kicker.mdx');
    fs.writeFileSync(tmp, `---\ntitle: "Test"\ndate: "2026-04-20"\nslug: "test"\ndek: "test"\nimage: "/img.jpg"\n---\nBody`);
    expect(() => parseArticleFile(tmp)).toThrow('kicker');
    fs.unlinkSync(tmp);
  });

  it('coerces unquoted date strings from gray-matter Date objects', () => {
    const tmp = path.join(os.tmpdir(), 'unquoted-date.mdx');
    fs.writeFileSync(tmp, `---\ntitle: "Test"\nkicker: "Sport"\ndek: "test"\ndate: 2026-04-20\nslug: "test"\nimage: "/img.jpg"\n---\nBody`);
    const article = parseArticleFile(tmp);
    expect(article.date).toBe('2026-04-20');
    fs.unlinkSync(tmp);
  });
});

describe('getAllArticles', () => {
  it('returns articles sorted by date descending', () => {
    const articles = getAllArticles();
    for (let i = 0; i < articles.length - 1; i++) {
      expect(articles[i].date >= articles[i + 1].date).toBe(true);
    }
  });
});

describe('getArticleBySlug', () => {
  it('returns null for a slug that does not exist', () => {
    expect(getArticleBySlug('nonexistent-slug-xyz')).toBeNull();
  });
});
