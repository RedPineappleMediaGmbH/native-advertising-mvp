# Tagesblick SEO — Full Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full SEO foundation for tagesblick.net so all articles — especially native advertorials — appear in organic search results with rich structured data.

**Architecture:** Extend the Article data model with optional `sponsored`/`advertiser` fields, build a pure `buildArticleJsonLd` function (testable with Vitest), wire a thin React component into the article page, add OG + canonical metadata to all pages, and generate `sitemap.xml` + `robots.txt` via Next.js App Router metadata conventions.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest, Bun

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/articles.ts` | Modify | Add `sponsored?`, `advertiser?` to Article type and parser |
| `lib/fixtures/sample-sponsored-article.mdx` | Create | Fixture for sponsored article tests |
| `lib/article-json-ld.ts` | Create | Pure function: builds JSON-LD object from Article |
| `lib/article-json-ld.test.ts` | Create | Unit tests for JSON-LD builder |
| `lib/articles.test.ts` | Modify | Add tests for new frontmatter fields |
| `components/seo/article-json-ld.tsx` | Create | Thin React component: renders JSON-LD script tag |
| `app/layout.tsx` | Modify | Add metadataBase, OG defaults, fix description |
| `app/artikel/[slug]/page.tsx` | Modify | Enhanced generateMetadata + render ArticleJsonLd |
| `app/sitemap.ts` | Create | Dynamic sitemap.xml via Next.js metadata convention |
| `app/robots.ts` | Create | robots.txt allowing all crawlers + sitemap reference |
| `app/kategorie/[category]/page.tsx` | Modify | Add canonical + openGraph to existing generateMetadata |
| `app/page.tsx` | Modify | Add generateMetadata with canonical + OG image |

---

### Task 1: Extend Article data model

**Files:**
- Modify: `lib/articles.ts`
- Modify: `lib/articles.test.ts`
- Create: `lib/fixtures/sample-sponsored-article.mdx`

- [ ] **Step 1: Create sponsored article fixture**

Create `lib/fixtures/sample-sponsored-article.mdx`:

```mdx
---
title: "Entdecken Sie die besten Reiseziele 2026"
kicker: "Reise"
dek: "Von Lissabon bis Tokio — die schönsten Destinationen des Jahres."
date: "2026-04-20"
slug: "beste-reiseziele-2026"
image: "/generated/2026-04-20-beste-reiseziele-2026.jpg"
sponsored: true
advertiser: "Airwander GmbH"
---

## Einleitung

Dies ist ein gesponserter Artikel.
```

- [ ] **Step 2: Write failing tests for new fields**

Append these two `it` blocks inside the existing `describe('parseArticleFile')` block in `lib/articles.test.ts`:

```ts
const sponsoredFixture = path.join(__dirname, 'fixtures/sample-sponsored-article.mdx');

it('parses sponsored and advertiser fields', () => {
  const article = parseArticleFile(sponsoredFixture);
  expect(article.sponsored).toBe(true);
  expect(article.advertiser).toBe('Airwander GmbH');
});

it('editorial article has no sponsored or advertiser field', () => {
  const article = parseArticleFile(fixture);
  expect(article.sponsored).toBeUndefined();
  expect(article.advertiser).toBeUndefined();
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: FAIL — `article.sponsored` is `undefined`, `article.advertiser` is `undefined`.

- [ ] **Step 4: Extend the Article interface**

In `lib/articles.ts`, update the `Article` interface:

```ts
export interface Article {
  title: string;
  kicker: string;
  dek: string;
  date: string;
  slug: string;
  image: string;
  body: string;
  sponsored?: boolean;
  advertiser?: string;
}
```

- [ ] **Step 5: Extend parseArticleFile return statement**

In `lib/articles.ts`, replace the `return { ... }` in `parseArticleFile` with:

```ts
return {
  title: data.title,
  kicker: data.kicker,
  dek: data.dek,
  date: data.date,
  slug: data.slug,
  image: data.image,
  body: content.trim(),
  ...(data.sponsored === true && { sponsored: true }),
  ...(typeof data.advertiser === 'string' && data.advertiser && { advertiser: data.advertiser }),
};
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add lib/articles.ts lib/articles.test.ts lib/fixtures/sample-sponsored-article.mdx && git commit -m "feat: add sponsored and advertiser fields to Article data model"
```

---

### Task 2: Build JSON-LD helper and React component

**Files:**
- Create: `lib/article-json-ld.ts`
- Create: `lib/article-json-ld.test.ts`
- Create: `components/seo/article-json-ld.tsx`

- [ ] **Step 1: Write failing tests**

Create `lib/article-json-ld.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: FAIL — `buildArticleJsonLd` not found.

- [ ] **Step 3: Implement the JSON-LD builder**

Create `lib/article-json-ld.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: All tests PASS.

- [ ] **Step 5: Create the React component**

Create `components/seo/article-json-ld.tsx`:

```tsx
import { buildArticleJsonLd } from '@/lib/article-json-ld';
import type { Article } from '@/lib/articles';

interface Props {
  article: Article;
  url: string;
}

export default function ArticleJsonLd({ article, url }: Props) {
  const jsonLd = buildArticleJsonLd(article, url);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 6: Verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add lib/article-json-ld.ts lib/article-json-ld.test.ts components/seo/article-json-ld.tsx && git commit -m "feat: add JSON-LD builder and ArticleJsonLd component"
```

---

### Task 3: Update layout.tsx metadata foundation

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the metadata export**

In `app/layout.tsx`, replace lines 21–24:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://tagesblick.net'),
  title: 'Tagesblick — Nachrichten & Hintergründe',
  description: 'Nachrichten, Hintergründe und Reportagen aus Deutschland und der Welt.',
  openGraph: {
    siteName: 'Tagesblick',
    locale: 'de_DE',
    type: 'website',
  },
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/layout.tsx && git commit -m "feat: add metadataBase, OG defaults, and real description to root layout"
```

---

### Task 4: Enhance article page — metadata + JSON-LD

**Files:**
- Modify: `app/artikel/[slug]/page.tsx`

- [ ] **Step 1: Replace the file contents**

Full replacement of `app/artikel/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BackBar from '@/components/advertorial/back-bar';
import { getAllSlugs, getArticleBySlug } from '@/lib/articles';
import { BRANDS } from '@/components/brands';
import ArticleJsonLd from '@/components/seo/article-json-ld';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Tagesblick`,
    description: article.dek,
    alternates: { canonical: `/artikel/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      section: article.kicker,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return notFound();

  const brand = BRANDS.find(b => b.id === 'tagesblick')!;
  const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

  return (
    <div className="adv">
      <ArticleJsonLd article={article} url={`https://tagesblick.net/artikel/${slug}`} />
      <BackBar brand={brand} href="/" category={article.kicker} />
      <div className="adv-wrap">
        <div className="adv-meta">
          <span className="kicker">{article.kicker}</span>
          <span>·</span>
          <span>{new Date(article.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <h1 className="adv-title" style={serif}>{article.title}</h1>
        <p className="lead" style={serif}>{article.dek}</p>
        <figure style={{ margin: '28px 0 24px' }}>
          <img src={article.image} alt={article.title} style={{ width: '100%', display: 'block', borderRadius: 3 }} />
        </figure>
        <div className="article-body" style={serif}>
          <MDXRemote source={article.body} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests and verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit && bun run test
```

Expected: No TypeScript errors, all tests pass.

- [ ] **Step 3: Start dev server and confirm JSON-LD renders**

```bash
cd ~/Desktop/native-advertising-mvp && bun run dev &
sleep 6
curl -s "http://localhost:3000/artikel/bayerische-maschinenbauer-suchen-nach-us-zollen-neue-markte-in-asien" | grep -c 'application/ld+json'
kill %1
```

Expected output: `1` (one JSON-LD script tag present in the HTML).

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add "app/artikel/[slug]/page.tsx" && git commit -m "feat: add OG metadata, canonical URL and JSON-LD to article pages"
```

---

### Task 5: Add sitemap.xml

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Create the sitemap file**

Create `app/sitemap.ts`:

```ts
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
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd ~/Desktop/native-advertising-mvp && bun run dev &
sleep 6
curl -s http://localhost:3000/sitemap.xml | head -20
kill %1
```

Expected: XML output starting with `<?xml` containing `<loc>https://tagesblick.net/artikel/...` entries.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/sitemap.ts && git commit -m "feat: add dynamic sitemap.xml covering home, categories and all articles"
```

---

### Task 6: Add robots.txt

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: Create the robots file**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tagesblick.net/sitemap.xml',
  };
}
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd ~/Desktop/native-advertising-mvp && bun run dev &
sleep 6
curl -s http://localhost:3000/robots.txt
kill %1
```

Expected output:
```
User-agent: *
Allow: /

Sitemap: https://tagesblick.net/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/robots.ts && git commit -m "feat: add robots.txt with sitemap reference"
```

---

### Task 7: Enhance category page metadata

**Files:**
- Modify: `app/kategorie/[category]/page.tsx`

- [ ] **Step 1: Add canonical and openGraph to existing generateMetadata**

In `app/kategorie/[category]/page.tsx`, replace the existing `generateMetadata` function (lines 13–20) with:

```ts
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = NAV_CATEGORIES.find(c => c.toLowerCase() === category) ?? category;
  return {
    title: `${label} — Tagesblick`,
    description: `Alle ${label}-Artikel auf Tagesblick.`,
    alternates: { canonical: `/kategorie/${category}` },
    openGraph: { type: 'website' as const },
  };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add "app/kategorie/[category]/page.tsx" && git commit -m "feat: add canonical URL and openGraph to category pages"
```

---

### Task 8: Add homepage metadata

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the file contents**

Full replacement of `app/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import HomeView from '@/components/home/home-view';
import type { FeedItem } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const articles = getAllArticles();
  const hero = articles[0];
  return {
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      ...(hero && {
        images: [{ url: hero.image, width: 1200, height: 630, alt: hero.title }],
      }),
    },
  };
}

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'heute';
  if (diffDays === 1) return 'gestern';
  return `vor ${diffDays} Tagen`;
}

export default function HomePage() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const feedArticles = rest.slice(0, 5);

  const feed: FeedItem[] = feedArticles.map(a => ({
    kicker: a.kicker,
    title: a.title,
    dek: a.dek,
    meta: relativeTime(a.date),
    img: a.image,
    href: `/artikel/${a.slug}`,
  }));

  const sponsored: FeedItem = {
    sponsored: true,
    partner: 'easyJet',
    kicker: 'Anzeige',
    title: 'Fünf europäische Städte, die Sie diesen Sommer für unter 50€ erreichen können',
    dek: 'Lissabon, Porto, Athen, Krakau, Valletta — wir zeigen, welche Destinationen 2026 das beste Preis-Erlebnis bieten.',
    meta: 'Präsentiert von easyJet',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  };

  const feedWithAd: FeedItem[] = feed.length >= 2
    ? [...feed.slice(0, 2), sponsored, ...feed.slice(2)]
    : [...feed, sponsored];

  return <HomeView feed={feedWithAd} hero={hero} />;
}
```

- [ ] **Step 2: Run full build**

```bash
cd ~/Desktop/native-advertising-mvp && bun run build
```

Expected: Build completes with no errors. Output routes include `/sitemap.xml`, `/robots.txt`, `/artikel/[slug]`, `/kategorie/[category]`.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/page.tsx && git commit -m "feat: add canonical URL and OG hero image to homepage"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run full test suite**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: All tests pass.

- [ ] **Step 2: Full production build**

```bash
cd ~/Desktop/native-advertising-mvp && bun run build
```

Expected: No errors. All pages compile cleanly.

- [ ] **Step 3: Smoke-test key pages**

```bash
cd ~/Desktop/native-advertising-mvp && bun run start &
sleep 4
echo "--- robots.txt ---" && curl -s http://localhost:3000/robots.txt
echo "--- sitemap entry count ---" && curl -s http://localhost:3000/sitemap.xml | grep -c '<loc>'
echo "--- article JSON-LD ---" && curl -s "http://localhost:3000/artikel/bayerische-maschinenbauer-suchen-nach-us-zollen-neue-markte-in-asien" | grep -o '"@type":"NewsArticle"'
echo "--- article OG image ---" && curl -s "http://localhost:3000/artikel/bayerische-maschinenbauer-suchen-nach-us-zollen-neue-markte-in-asien" | grep -o 'og:image'
kill %1
```

Expected:
- robots.txt shows `Allow: /` and `Sitemap: https://tagesblick.net/sitemap.xml`
- sitemap has more than 10 `<loc>` entries
- article page contains `"@type":"NewsArticle"`
- article page contains `og:image`
