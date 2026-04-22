import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Article {
  title: string;
  kicker: string;
  dek: string;
  date: string;
  slug: string;
  image: string;
  body: string;
}

const REQUIRED_FIELDS: (keyof Omit<Article, 'body'>)[] = [
  'title', 'kicker', 'dek', 'date', 'slug', 'image',
];

export function parseArticleFile(filePath: string): Article {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (typeof data[field] !== 'string' || !data[field]) {
      throw new Error(`Missing required frontmatter field "${field}" in ${filePath}`);
    }
  }

  return {
    title: data.title,
    kicker: data.kicker,
    dek: data.dek,
    date: data.date,
    slug: data.slug,
    image: data.image,
    body: content.trim(),
  };
}

const CONTENT_DIR = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(f => parseArticleFile(path.join(CONTENT_DIR, f)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find(a => a.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug);
}
