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
  imageCredit?: string;
  imageCreditUrl?: string;
  sponsored?: boolean;
  advertiser?: string;
}

const REQUIRED_FIELDS: (keyof Omit<Article, 'body'>)[] = [
  'title', 'kicker', 'dek', 'date', 'slug', 'image',
];

export function parseArticleFile(filePath: string): Article {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  // gray-matter auto-coerces unquoted ISO dates to Date objects
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof data[field] !== 'string' || !data[field]) {
      throw new Error(`Frontmatter field "${field}" is missing or has invalid type in ${filePath}`);
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
    ...(typeof data.imageCredit === 'string' && data.imageCredit && { imageCredit: data.imageCredit }),
    ...(typeof data.imageCreditUrl === 'string' && data.imageCreditUrl && { imageCreditUrl: data.imageCreditUrl }),
    ...(data.sponsored === true && { sponsored: true }),
    ...(typeof data.advertiser === 'string' && data.advertiser && { advertiser: data.advertiser }),
  };
}

const CONTENT_DIR = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  const articles: Article[] = [];
  for (const f of files) {
    try {
      articles.push(parseArticleFile(path.join(CONTENT_DIR, f)));
    } catch (err) {
      console.warn(`Skipping malformed article ${f}:`, err);
    }
  }
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string): Article | null {
  return getAllArticles().find(a => a.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug);
}

export function getArticlesByKicker(kicker: string): Article[] {
  return getAllArticles().filter(
    a => a.kicker.toLowerCase() === kicker.toLowerCase()
  );
}
