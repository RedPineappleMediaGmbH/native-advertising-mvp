# Tagesblick SEO — Full Foundation Design

**Date:** 2026-04-23  
**Goal:** Make all articles — especially native advertorials — findable in organic search results.  
**Driver:** Sales requirement that native advertorials appear in Google like t-online advertorials do.

---

## Context

tagesblick.net is a Next.js 15 App Router site deployed on Vercel. Articles (editorial and native advertorials) are MDX files served at `/artikel/[slug]`. The site currently has:

- Basic `title` + `description` metadata only
- No sitemap, no robots.txt
- No Open Graph tags
- No structured data (JSON-LD)
- No canonical URLs

All article pages are server-rendered — good foundation for indexing.

---

## Approach

Option B: Full SEO foundation. Covers all pages with proper metadata, structured data, sitemap, and robots.txt. Native advertorials use a `sponsored: true` frontmatter flag to generate different JSON-LD schema from editorial articles.

---

## Section 1 — Data Model

Add two optional fields to article MDX frontmatter:

```yaml
sponsored: true          # marks content as paid/native advertising
advertiser: "Brand GmbH" # advertiser name for JSON-LD sponsor field
```

Update `lib/articles.ts`:

- Add `sponsored?: boolean` and `advertiser?: string` to the `Article` interface
- `parseArticleFile` reads both fields; both default to absent for editorial articles
- No changes required to existing MDX files — all existing articles are treated as editorial

**Rule:** `advertiser` is only meaningful when `sponsored: true`. Both fields are optional.

---

## Section 2 — Metadata Foundation (`app/layout.tsx`)

Changes to the root `metadata` export:

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

`metadataBase` is required for Next.js to resolve relative image paths in OG tags to absolute URLs. All child pages override these defaults with their own richer metadata.

---

## Section 3 — Article Page SEO (`app/artikel/[slug]/page.tsx`)

### 3a. Enhanced `generateMetadata`

```ts
export async function generateMetadata({ params }) {
  const article = getArticleBySlug(slug);
  return {
    title: `${article.title} — Tagesblick`,
    description: article.dek,
    alternates: { canonical: `/artikel/${article.slug}` },
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
```

Sponsored articles use identical metadata — the paid-content signal belongs in structured data, not meta tags.

### 3b. JSON-LD Structured Data

A small `ArticleJsonLd` server component renders a `<script type="application/ld+json">` block inside the article page.

**Editorial articles** (`sponsored` absent or `false`):
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "...",
  "description": "...",
  "image": "...",
  "datePublished": "YYYY-MM-DD",
  "inLanguage": "de",
  "publisher": {
    "@type": "Organization",
    "name": "Tagesblick",
    "url": "https://tagesblick.net"
  }
}
```

**Native advertorials** (`sponsored: true`):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "image": "...",
  "datePublished": "YYYY-MM-DD",
  "inLanguage": "de",
  "publisher": {
    "@type": "Organization",
    "name": "Tagesblick",
    "url": "https://tagesblick.net"
  },
  "sponsor": {
    "@type": "Organization",
    "name": "Brand GmbH"
  }
}
```

The component lives at `components/seo/article-json-ld.tsx` and receives the `Article` object as a prop.

---

## Section 4 — Sitemap + robots

### `app/sitemap.ts`

Generates `/sitemap.xml` via Next.js App Router metadata file convention.

```ts
import { getAllArticles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const categories = [...new Set(articles.map(a => a.kicker.toLowerCase()))];

  return [
    { url: 'https://tagesblick.net', lastModified: new Date(), priority: 1.0 },
    ...categories.map(cat => ({
      url: `https://tagesblick.net/kategorie/${cat}`,
      priority: 0.5,
    })),
    ...articles.map(a => ({
      url: `https://tagesblick.net/artikel/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.8,
    })),
  ];
}
```

Sponsored articles get the same priority as editorial — both should be indexed equally.

### `app/robots.ts`

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tagesblick.net/sitemap.xml',
  };
}
```

---

## Section 5 — Category + Homepage Metadata

### `app/kategorie/[category]/page.tsx`

Add `generateMetadata`:
```ts
{
  title: `${category} — Tagesblick`,
  description: `Aktuelle ${category}-Nachrichten auf Tagesblick.`,
  alternates: { canonical: `/kategorie/${category}` },
  openGraph: { type: 'website' },
}
```

### `app/page.tsx`

Add canonical and OG image using the newest article's image (fetched at build time from `getAllArticles()[0]`):
```ts
{
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    images: [{ url: newestArticle.image, width: 1200, height: 630 }],
  },
}
```

---

## Files Changed

| File | Change |
|---|---|
| `lib/articles.ts` | Add `sponsored?: boolean`, `advertiser?: string` to `Article` interface and `parseArticleFile` |
| `app/layout.tsx` | `metadataBase`, OG defaults, fix description |
| `app/artikel/[slug]/page.tsx` | Enhanced `generateMetadata`, render `ArticleJsonLd` |
| `components/seo/article-json-ld.tsx` | New component — JSON-LD for `NewsArticle` / sponsored `Article` |
| `app/kategorie/[category]/page.tsx` | Add `generateMetadata` |
| `app/page.tsx` | Add canonical + OG image |
| `app/sitemap.ts` | New file |
| `app/robots.ts` | New file |

---

## Out of Scope

- Google Search Console verification tag (operational, not code)
- Google News eligibility (`news_keywords`, `NewsMediaOrganization` schema)
- `noindex` for any page — all content stays indexable
- Changes to the `/advertorial` page (client-side demo, redirects to `/artikel`)
