# Tagesblick Editorial Publishing System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate tagesblick.net with 3–5 AI-generated German editorial articles per day, published automatically via GitHub Actions and Vercel.

**Architecture:** Articles are MDX files in `content/articles/`, rendered by a new dynamic route `/artikel/[slug]` and surfaced on the home feed. A Node.js script calls Claude (topics + article text) and Gemini Imagen (hero images), writes files, commits, and pushes. GitHub Actions runs it on a daily cron. Design is locked; only content infrastructure is added.

**Tech Stack:** Next.js 16 (App Router), TypeScript, React 19, `gray-matter` (frontmatter), `next-mdx-remote` (MDX rendering), `@anthropic-ai/sdk`, `@google/genai`, `tsx` (script runner), `vitest` (tests).

**Reference Spec:** `docs/superpowers/specs/2026-04-22-tagesblick-editorial-system-design.md`

---

## File Structure

**New files:**
- `content/articles/.gitkeep` — marker for content dir
- `public/generated/.gitkeep` — marker for image dir
- `lib/articles.ts` — read + parse MDX article files
- `lib/articles.test.ts` — tests for the reader
- `app/artikel/[slug]/page.tsx` — dynamic article route
- `content/articles/2026-04-20-ezb-zinspolitik.mdx` — seed article (Wirtschaft)
- `content/articles/2026-04-21-usb-c-eu-standard.mdx` — seed article (Digital)
- `content/articles/2026-04-21-bundesliga-30-spieltag.mdx` — seed article (Sport)
- `scripts/generate-articles.ts` — main generation script
- `scripts/lib/claude.ts` — Claude API wrapper
- `scripts/lib/gemini.ts` — Gemini Imagen wrapper
- `scripts/lib/mdx-writer.ts` — writes MDX files to disk
- `scripts/lib/slug.ts` — slug utility
- `scripts/lib/slug.test.ts` — tests for slug utility
- `.github/workflows/daily-articles.yml` — cron workflow
- `.claude/skills/tagesblick-article/SKILL.md` — on-demand article skill
- `.claude/skills/tagesblick-daily/SKILL.md` — daily batch skill
- `.env.example` — env var template
- `vitest.config.ts` — test runner config

**Modified files:**
- `package.json` — add dependencies and scripts
- `app/page.tsx` — swap hardcoded `FEED` for `getArticles()`
- `components/home/feed-card.tsx` — keep rendering logic, remove hardcoded `FEED` export, accept `href` prop for linking
- `.gitignore` — add `.env.local`

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
cd /Users/andregomesfaria/Desktop/native-advertising-mvp
npm install gray-matter next-mdx-remote @anthropic-ai/sdk @google/genai
```

- [ ] **Step 2: Install dev dependencies**

Run:
```bash
npm install -D tsx vitest dotenv @types/node
```

- [ ] **Step 3: Add scripts to `package.json`**

Open `package.json` and update the `scripts` section to:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "generate": "tsx scripts/generate-articles.ts"
  },
```

- [ ] **Step 4: Verify install**

Run: `npm run build`
Expected: build succeeds (the new deps are installed, no new code uses them yet so no behavior change).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add MDX, AI SDKs, and tsx/vitest for content pipeline"
```

---

## Task 2: Vitest Config and Directory Scaffolding

**Files:**
- Create: `vitest.config.ts`
- Create: `content/articles/.gitkeep`
- Create: `public/generated/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 2: Create content + image directories with `.gitkeep`**

Run:
```bash
mkdir -p content/articles public/generated
touch content/articles/.gitkeep public/generated/.gitkeep
```

- [ ] **Step 3: Add `.env.local` to `.gitignore`**

Check the current `.gitignore` with `cat .gitignore`. Make sure `.env*` patterns are present. The current file already contains `.env*`, so no edit needed. If not, append:

```
.env.local
.env*.local
```

- [ ] **Step 4: Create `.env.example`**

Create file `.env.example`:

```
# Anthropic API key for article text generation
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini API key for Imagen image generation
GEMINI_API_KEY=AIza...

# Optional: override default models
# ANTHROPIC_TEXT_MODEL=claude-sonnet-4-6
# ANTHROPIC_TOPIC_MODEL=claude-haiku-4-5
# GEMINI_IMAGE_MODEL=imagen-3.0-generate-001
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts content/articles/.gitkeep public/generated/.gitkeep .env.example
git commit -m "chore: scaffold content dirs, vitest config, env example"
```

---

## Task 3: Slug Utility (TDD)

**Files:**
- Create: `scripts/lib/slug.ts`
- Test: `scripts/lib/slug.test.ts`

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/slug.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(toSlug('EZB hält an vorsichtiger Zinspolitik fest')).toBe('ezb-halt-an-vorsichtiger-zinspolitik-fest');
  });

  it('transliterates German umlauts', () => {
    expect(toSlug('Fünf europäische Städte Österreich')).toBe('funf-europaische-stadte-osterreich');
  });

  it('handles ß', () => {
    expect(toSlug('Weiße Straße')).toBe('weisse-strasse');
  });

  it('strips punctuation', () => {
    expect(toSlug('Bundesliga: 30. Spieltag — Favoritendämmerung')).toBe('bundesliga-30-spieltag-favoritendammerung');
  });

  it('collapses repeated dashes', () => {
    expect(toSlug('Hello --- world')).toBe('hello-world');
  });

  it('trims leading/trailing dashes', () => {
    expect(toSlug('  -Hello World-  ')).toBe('hello-world');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- scripts/lib/slug.test.ts`
Expected: FAIL with "Cannot find module './slug'".

- [ ] **Step 3: Implement `toSlug`**

Create `scripts/lib/slug.ts`:

```ts
const UMLAUT_MAP: Record<string, string> = {
  ä: 'a', ö: 'o', ü: 'u', Ä: 'a', Ö: 'o', Ü: 'u', ß: 'ss',
};

export function toSlug(input: string): string {
  const transliterated = input
    .split('')
    .map(c => UMLAUT_MAP[c] ?? c)
    .join('');

  return transliterated
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npm test -- scripts/lib/slug.test.ts`
Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/slug.ts scripts/lib/slug.test.ts
git commit -m "feat: add German-aware slug utility"
```

---

## Task 4: Article Type + Reader Library (TDD)

**Files:**
- Create: `lib/articles.ts`
- Create: `lib/articles.test.ts`
- Create: `lib/fixtures/sample-article.mdx` (test fixture)

- [ ] **Step 1: Create test fixture**

Create `lib/fixtures/sample-article.mdx`:

```mdx
---
title: "Testartikel"
kicker: "Digital"
dek: "Dies ist eine Kurzbeschreibung."
date: "2026-04-20"
slug: "testartikel"
image: "/generated/2026-04-20-testartikel.jpg"
---

## Einleitung

Dies ist der erste Absatz.

## Hauptteil

Dies ist der Hauptteil.
```

- [ ] **Step 2: Write the failing tests**

Create `lib/articles.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- lib/articles.test.ts`
Expected: FAIL with "Cannot find module './articles'".

- [ ] **Step 4: Implement `lib/articles.ts`**

Create `lib/articles.ts`:

```ts
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
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- lib/articles.test.ts`
Expected: both tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/articles.ts lib/articles.test.ts lib/fixtures/sample-article.mdx
git commit -m "feat: add MDX article reader with frontmatter validation"
```

---

## Task 5: Seed Content Articles

**Files:**
- Create: `content/articles/2026-04-20-ezb-zinspolitik.mdx`
- Create: `content/articles/2026-04-21-usb-c-eu-standard.mdx`
- Create: `content/articles/2026-04-21-bundesliga-30-spieltag.mdx`

- [ ] **Step 1: Create first seed article (Wirtschaft)**

Create `content/articles/2026-04-20-ezb-zinspolitik.mdx`:

```mdx
---
title: "EZB hält an vorsichtiger Zinspolitik fest — Lagarde dämpft Erwartungen"
kicker: "Wirtschaft"
dek: "Die Notenbank belässt den Leitzins unverändert und verweist auf hartnäckige Kerninflation."
date: "2026-04-20"
slug: "ezb-zinspolitik"
image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85"
---

Die Europäische Zentralbank hat bei ihrer jüngsten Ratssitzung keine Änderung des Leitzinses vorgenommen. EZB-Präsidentin Christine Lagarde verwies auf eine weiterhin hartnäckige Kerninflation im Euroraum und dämpfte Erwartungen an baldige Zinssenkungen.

## Vorsichtiger Kurs trotz Entspannung bei Energiepreisen

Während die Gesamtinflation zuletzt auf 2,4 Prozent zurückging, liegt die Kerninflation — also Preissteigerungen ohne Energie und Nahrungsmittel — weiterhin bei 3,1 Prozent. "Wir sind noch nicht am Ziel", so Lagarde auf der Pressekonferenz in Frankfurt.

## Uneinigkeit im Rat

Nach Angaben aus Notenbankkreisen gab es im EZB-Rat eine kontroverse Debatte. Einige Mitglieder plädierten für eine erste Zinssenkung im Juni, andere verwiesen auf Lohnentwicklungen im Dienstleistungssektor, die für weiter erhöhten Inflationsdruck sorgen könnten.

## Ausblick

Marktteilnehmer rechnen mit einer ersten Zinssenkung frühestens im dritten Quartal. Die nächste Sitzung des EZB-Rats findet am 6. Juni statt.
```

- [ ] **Step 2: Create second seed article (Digital)**

Create `content/articles/2026-04-21-usb-c-eu-standard.mdx`:

```mdx
---
title: "Neuer EU-Standard: USB-C wird Pflicht auch für Laptops ab 2027"
kicker: "Digital"
dek: "Brüssel erweitert die Vereinheitlichung — was Hersteller und Verbraucher jetzt wissen müssen."
date: "2026-04-21"
slug: "usb-c-eu-standard"
image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85"
---

Die Europäische Kommission hat die Ausweitung der USB-C-Pflicht auf Laptops und weitere Elektronikgeräte beschlossen. Ab dem 1. Januar 2027 müssen alle in der EU verkauften tragbaren Computer mit einem einheitlichen USB-C-Ladeanschluss ausgestattet sein.

## Hintergrund der Entscheidung

Bereits seit Ende 2024 gilt die USB-C-Pflicht für Smartphones, Tablets und Kopfhörer. Nach Angaben der Kommission spart die Vereinheitlichung europäischen Verbrauchern jährlich rund 250 Millionen Euro und reduziert Elektroschrott um etwa 11.000 Tonnen.

## Reaktionen der Hersteller

Die Reaktionen sind gemischt. Während Hersteller wie Lenovo und HP die Entscheidung begrüßen, äußerte sich Apple kritisch. Das Unternehmen verwies auf eigene MagSafe-Technologien, die weiterhin als Zusatzanschluss erlaubt bleiben.

## Was Verbraucher beachten sollten

Laptops, die vor 2027 gekauft werden, sind nicht betroffen. Für Neuanschaffungen ab 2027 gilt: Das Netzteil kann optional separat gekauft werden — ein Schritt, den die Kommission explizit fördert.
```

- [ ] **Step 3: Create third seed article (Sport)**

Create `content/articles/2026-04-21-bundesliga-30-spieltag.mdx`:

```mdx
---
title: "Bundesliga: Favoritendämmerung am 30. Spieltag"
kicker: "Sport"
dek: "Drei Topspiele am Wochenende — wir zeigen die taktischen Entscheidungen, auf die es ankommt."
date: "2026-04-21"
slug: "bundesliga-30-spieltag"
image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=85"
---

Am 30. Spieltag der Bundesliga droht den Titelfavoriten ein schwieriges Wochenende. Drei Topspiele stehen auf dem Programm, und in allen drei Begegnungen geht es um entscheidende Punkte im Kampf um Meisterschaft und Europapokalplätze.

## Bayern München vs. Borussia Dortmund

Der Klassiker am Samstagabend entscheidet möglicherweise die Meisterschaft. Drei Punkte Vorsprung trennen Bayern und Leverkusen an der Tabellenspitze — eine Niederlage gegen Dortmund könnte den Meistertraum beenden.

## RB Leipzig vs. Bayer Leverkusen

Leverkusen reist nach Leipzig mit der Chance, an die Tabellenspitze zu springen. Trainer Xabi Alonso plant laut Medienberichten eine taktische Umstellung, um der aggressiven Pressingstruktur Leipzigs entgegenzuwirken.

## Stuttgart vs. Frankfurt

Im Kampf um Platz vier und damit die Champions-League-Qualifikation kommt es in Stuttgart zum direkten Duell. Beide Teams trennt nur ein Punkt — ein Sieg wäre richtungsweisend für die letzten vier Spieltage.
```

- [ ] **Step 4: Verify reader picks them up**

Run:
```bash
npx tsx -e "import('./lib/articles').then(m => console.log(m.getAllArticles().map(a => ({slug: a.slug, date: a.date, kicker: a.kicker}))))"
```

Expected: prints 3 articles, sorted by date descending.

- [ ] **Step 5: Commit**

```bash
git add content/articles/*.mdx
git commit -m "content: add 3 seed editorial articles"
```

---

## Task 6: Dynamic Article Route

**Files:**
- Create: `app/artikel/[slug]/page.tsx`

- [ ] **Step 1: Create the article page**

Create `app/artikel/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useBrand } from '@/components/brand-context';
import PubTopbar from '@/components/home/pub-topbar';
import PubFooter from '@/components/home/pub-footer';
import { getAllSlugs, getArticleBySlug } from '@/lib/articles';
import { BRANDS } from '@/components/brands';

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
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const brand = BRANDS.find(b => b.id === 'tagesblick')!;
  const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

  return (
    <>
      <PubTopbar brand={brand} />
      <div className="adv">
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
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <Link href="/" style={{ color: 'var(--pub-accent)', fontWeight: 600 }}>← Zurück zur Startseite</Link>
          </div>
        </div>
      </div>
      <PubFooter brand={brand} />
    </>
  );
}
```

- [ ] **Step 2: Add minimal CSS for the article body**

Open `app/globals.css` and append these rules at the end of the file:

```css
/* Article body (reuses advertorial typography) */
.article-body h2 { font-size: 22px; font-weight: 700; margin: 32px 0 12px; line-height: 1.3; }
.article-body h3 { font-size: 18px; font-weight: 700; margin: 24px 0 10px; line-height: 1.35; }
.article-body p  { font-size: 17px; line-height: 1.7; margin: 16px 0; }
.article-body ul, .article-body ol { font-size: 17px; line-height: 1.7; margin: 16px 0 16px 22px; }
.article-body li { margin: 6px 0; }
.article-body strong { font-weight: 700; }
.article-body a { color: var(--pub-accent); text-decoration: underline; text-underline-offset: 3px; }
```

- [ ] **Step 3: Verify the route works**

Run:
```bash
npm run dev
```

Open `http://localhost:3000/artikel/ezb-zinspolitik` in a browser. Expected: the article renders with kicker, title, dek, hero image, body with H2 sections, and a back link. Kill the dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/artikel/[slug]/page.tsx app/globals.css
git commit -m "feat: add dynamic article route /artikel/[slug]"
```

---

## Task 7: Update Home Feed to Read from Content

**Files:**
- Modify: `components/home/feed-card.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Remove hardcoded FEED array and add optional `href` prop**

Open `components/home/feed-card.tsx`. Replace the entire file with:

```tsx
'use client';

import Link from 'next/link';

export interface FeedItem {
  kicker: string;
  title: string;
  dek: string;
  meta: string;
  img: string;
  label?: string;
  sponsored?: boolean;
  partner?: string;
  href?: string;
}

export default function FeedCard({ item, onOpenAdvertorial }: { item: FeedItem; onOpenAdvertorial: () => void }) {
  if (item.sponsored) {
    return (
      <article className="card sponsored" onClick={onOpenAdvertorial}>
        <div className="anzeige-row">
          <span className="lbl">Anzeige</span>
          <span className="by">Präsentiert von {item.partner}</span>
        </div>
        <div className="thumb" style={{ overflow: 'hidden' }}>
          <img
            src={item.img}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
        <div className="body">
          <h3 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{item.title}</h3>
          <p>{item.dek}</p>
          <div className="partner-row">
            <span className="partner-logo" style={{ background: '#ff6600' }}>eJ</span>
            <span>easyJet · Paid Post</span>
          </div>
        </div>
      </article>
    );
  }

  const inner = (
    <>
      <div className="thumb" style={{ overflow: 'hidden' }}>
        <img
          src={item.img}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {item.label && <span className="kicker">{item.label}</span>}
      </div>
      <div className="body">
        <h3 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{item.title}</h3>
        <p>{item.dek}</p>
        <div className="meta">
          <span style={{ color: 'var(--pub-accent)', fontWeight: 700 }}>{item.kicker}</span>
          <span>·</span>
          <span>{item.meta}</span>
        </div>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="card" style={{ color: 'inherit', textDecoration: 'none' }}>
        {inner}
      </Link>
    );
  }

  return <article className="card">{inner}</article>;
}
```

- [ ] **Step 2: Rewrite `app/page.tsx` to read from content**

Open `app/page.tsx`. Replace the entire file with:

```tsx
import { getAllArticles } from '@/lib/articles';
import HomeView from '@/components/home/home-view';
import type { FeedItem } from '@/components/home/feed-card';

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'heute';
  if (diffDays === 1) return 'gestern';
  return `vor ${diffDays} Tagen`;
}

export default function HomePage() {
  const articles = getAllArticles().slice(0, 5);

  const feed: FeedItem[] = articles.map(a => ({
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

  return <HomeView feed={feedWithAd} />;
}
```

- [ ] **Step 3: Extract client-side `HomeView` component**

Create `components/home/home-view.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import PubTopbar from '@/components/home/pub-topbar';
import BreakingTicker from '@/components/home/breaking-ticker';
import HeroArticle from '@/components/home/hero-article';
import FeedCard, { type FeedItem } from '@/components/home/feed-card';
import Sidebar from '@/components/home/sidebar';
import PubFooter from '@/components/home/pub-footer';

export default function HomeView({ feed }: { feed: FeedItem[] }) {
  const router = useRouter();
  const { brand } = useBrand();
  useCtaToast();

  return (
    <>
      <PubTopbar brand={brand} />
      <main className="home">
        <BreakingTicker />
        <div>
          <HeroArticle />
          <div className="feed">
            {feed.map((item, i) => (
              <FeedCard
                key={i}
                item={item}
                onOpenAdvertorial={() => router.push('/advertorial')}
              />
            ))}
          </div>
        </div>
        <Sidebar />
      </main>
      <PubFooter brand={brand} />
    </>
  );
}
```

- [ ] **Step 4: Verify the home page renders from content**

Run: `npm run dev`

Open `http://localhost:3000`. Expected: the feed now shows the 3 seed articles (EZB, USB-C, Bundesliga) plus the easyJet sponsored card at position 3. Clicking a real article navigates to `/artikel/<slug>` and renders the full article. The easyJet card still opens `/advertorial`.

Kill the dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add components/home/feed-card.tsx components/home/home-view.tsx app/page.tsx
git commit -m "feat: home feed reads articles from content dir, cards link to article pages"
```

---

## Task 8: Claude API Wrapper

**Files:**
- Create: `scripts/lib/claude.ts`

- [ ] **Step 1: Implement topic and article generation**

Create `scripts/lib/claude.ts`:

```ts
import Anthropic from '@anthropic-ai/sdk';

const CATEGORIES = ['Wirtschaft', 'Panorama', 'Digital', 'Sport', 'Reise', 'Eilmeldung'] as const;
export type Category = typeof CATEGORIES[number];

export interface TopicSpec {
  category: Category;
  topic: string;
  angle: string;
}

export interface GeneratedArticle {
  title: string;
  dek: string;
  body: string;
}

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey });
}

const TOPIC_MODEL = process.env.ANTHROPIC_TOPIC_MODEL ?? 'claude-haiku-4-5';
const TEXT_MODEL = process.env.ANTHROPIC_TEXT_MODEL ?? 'claude-sonnet-4-6';

export async function pickTopics(count: number, dateSeed: string): Promise<TopicSpec[]> {
  const anthropic = client();
  const prompt = `Du bist Redakteur bei der deutschen Online-Zeitung Tagesblick. Erzeuge ${count} plausible, aktuelle Nachrichtenthemen für heute (${dateSeed}), je eines pro Kategorie. Wähle aus: ${CATEGORIES.join(', ')}.

Regeln:
- Themen müssen plausibel klingen und aktuell wirken, aber KEINE realen Ereignisse oder reale Personen erfinden, die nicht existieren
- Jedes Thema muss eine andere Kategorie haben
- Vermeide wiederkehrende Themen wie "KI" oder "Bitcoin" es sei denn der Blickwinkel ist frisch
- Der Blickwinkel (angle) muss konkret sein, nicht generisch

Antworte ausschließlich als JSON-Array in dieser Form:
[{"category":"Wirtschaft","topic":"kurze Themenbezeichnung","angle":"konkreter journalistischer Blickwinkel in einem Satz"}]`;

  const response = await anthropic.messages.create({
    model: TOPIC_MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('');
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Topic response had no JSON array:\n${text}`);

  const parsed = JSON.parse(match[0]) as TopicSpec[];
  return parsed.slice(0, count);
}

export async function writeArticle(spec: TopicSpec): Promise<GeneratedArticle> {
  const anthropic = client();
  const prompt = `Du schreibst einen redaktionellen Artikel für die deutsche Online-Zeitung Tagesblick.

Kategorie: ${spec.category}
Thema: ${spec.topic}
Blickwinkel: ${spec.angle}

Regeln:
- Sprache: Deutsch
- Tonfall: neutral, sachlich, seriös — wie FAZ, Zeit, Tagesspiegel
- Länge: 400-600 Wörter im Fließtext (ohne Titel und Teaser)
- Struktur: Einleitungsabsatz (kein H2), dann 2-3 Zwischenüberschriften (## markdown) mit je 1-2 Absätzen
- KEINE erfundenen konkreten Zahlen, Quellen oder Zitate realer Personen. Wenn eine Aussage einer Quelle bedarf, formuliere allgemein ("Branchenbeobachter", "Marktteilnehmer")
- KEINE KI-Floskeln ("In der heutigen schnelllebigen Welt...", "Es ist wichtig zu beachten...")
- KEINE Emojis, keine Bulletpoint-Listen (außer wenn inhaltlich zwingend)

Antworte als JSON:
{
  "title": "prägnanter Titel, max. 90 Zeichen",
  "dek": "ein Satz Teaser für die Startseite, max. 140 Zeichen",
  "body": "Markdown-Fließtext mit ## Zwischenüberschriften"
}`;

  const response = await anthropic.messages.create({
    model: TEXT_MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Article response had no JSON:\n${text}`);

  const parsed = JSON.parse(match[0]) as GeneratedArticle;
  if (!parsed.title || !parsed.dek || !parsed.body) {
    throw new Error(`Article response missing fields: ${JSON.stringify(parsed)}`);
  }
  return parsed;
}
```

- [ ] **Step 2: Smoke test the API connection**

First make sure `.env.local` exists with a valid `ANTHROPIC_API_KEY`. Then run:

```bash
npx tsx -e "
import { config } from 'dotenv';
config({ path: '.env.local' });
import('./scripts/lib/claude').then(async m => {
  const topics = await m.pickTopics(2, '2026-04-22');
  console.log(JSON.stringify(topics, null, 2));
});
"
```

Expected: prints 2 topic specs with different categories.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/claude.ts
git commit -m "feat: add Claude API wrapper for topic selection and article writing"
```

---

## Task 9: Gemini Imagen Wrapper

**Files:**
- Create: `scripts/lib/gemini.ts`

- [ ] **Step 1: Implement image generation**

Create `scripts/lib/gemini.ts`:

```ts
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'imagen-3.0-generate-001';

function client(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  return new GoogleGenAI({ apiKey });
}

export interface ImageGenInput {
  title: string;
  category: string;
  outPath: string;
}

function buildPrompt(title: string, category: string): string {
  return `Editorial news photograph illustrating the following German news article.

Category: ${category}
Title: ${title}

Style: realistic documentary photography, neutral lighting, appropriate for a serious newspaper. No text overlays. No logos. 16:9 aspect.`;
}

export async function generateHeroImage(input: ImageGenInput): Promise<void> {
  const ai = client();
  const prompt = buildPrompt(input.title, input.category);

  const result = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
    },
  });

  const generated = result.generatedImages?.[0];
  if (!generated?.image?.imageBytes) {
    throw new Error(`Imagen returned no image for "${input.title}"`);
  }

  const buffer = Buffer.from(generated.image.imageBytes, 'base64');
  fs.mkdirSync(path.dirname(input.outPath), { recursive: true });
  fs.writeFileSync(input.outPath, buffer);
}
```

- [ ] **Step 2: Smoke test image generation**

With `.env.local` containing a valid `GEMINI_API_KEY`, run:

```bash
npx tsx -e "
import { config } from 'dotenv';
config({ path: '.env.local' });
import('./scripts/lib/gemini').then(async m => {
  await m.generateHeroImage({
    title: 'EZB hält Zinsen stabil',
    category: 'Wirtschaft',
    outPath: 'public/generated/test-smoke.jpg',
  });
  console.log('wrote public/generated/test-smoke.jpg');
});
"
```

Expected: file `public/generated/test-smoke.jpg` exists and is a valid JPEG image.

Clean up after verifying:
```bash
rm public/generated/test-smoke.jpg
```

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/gemini.ts
git commit -m "feat: add Gemini Imagen wrapper for hero image generation"
```

---

## Task 10: MDX Writer

**Files:**
- Create: `scripts/lib/mdx-writer.ts`

- [ ] **Step 1: Implement the writer**

Create `scripts/lib/mdx-writer.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';

export interface MdxArticleInput {
  title: string;
  kicker: string;
  dek: string;
  date: string;
  slug: string;
  image: string;
  body: string;
}

function escapeFrontmatterString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function renderMdx(input: MdxArticleInput): string {
  const fm = [
    '---',
    `title: "${escapeFrontmatterString(input.title)}"`,
    `kicker: "${escapeFrontmatterString(input.kicker)}"`,
    `dek: "${escapeFrontmatterString(input.dek)}"`,
    `date: "${input.date}"`,
    `slug: "${input.slug}"`,
    `image: "${input.image}"`,
    '---',
    '',
    input.body.trim(),
    '',
  ].join('\n');
  return fm;
}

export function writeArticleFile(contentDir: string, input: MdxArticleInput): string {
  const fileName = `${input.date}-${input.slug}.mdx`;
  const filePath = path.join(contentDir, fileName);
  fs.mkdirSync(contentDir, { recursive: true });
  fs.writeFileSync(filePath, renderMdx(input), 'utf8');
  return filePath;
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/lib/mdx-writer.ts
git commit -m "feat: add MDX article writer utility"
```

---

## Task 11: Main Generate Script

**Files:**
- Create: `scripts/generate-articles.ts`

- [ ] **Step 1: Implement the orchestrator**

Create `scripts/generate-articles.ts`:

```ts
#!/usr/bin/env node
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { pickTopics, writeArticle, type TopicSpec } from './lib/claude';
import { generateHeroImage } from './lib/gemini';
import { writeArticleFile } from './lib/mdx-writer';
import { toSlug } from './lib/slug';

loadEnv({ path: '.env.local' });

const ARTICLES_PER_RUN = Number(process.env.TAGESBLICK_ARTICLES_PER_RUN ?? '4');
const CONTENT_DIR = path.join(process.cwd(), 'content/articles');
const IMAGE_DIR_PUBLIC = '/generated';
const IMAGE_DIR_FS = path.join(process.cwd(), 'public/generated');

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function generateOne(date: string, spec: TopicSpec): Promise<void> {
  console.log(`[${spec.category}] writing article: ${spec.topic}`);
  const article = await writeArticle(spec);
  const slug = toSlug(article.title);
  const imageFilename = `${date}-${slug}.jpg`;
  const imageFsPath = path.join(IMAGE_DIR_FS, imageFilename);
  const imagePublicPath = `${IMAGE_DIR_PUBLIC}/${imageFilename}`;

  console.log(`[${spec.category}] generating image`);
  await generateHeroImage({
    title: article.title,
    category: spec.category,
    outPath: imageFsPath,
  });

  const mdxPath = writeArticleFile(CONTENT_DIR, {
    title: article.title,
    kicker: spec.category,
    dek: article.dek,
    date,
    slug,
    image: imagePublicPath,
    body: article.body,
  });
  console.log(`[${spec.category}] wrote ${mdxPath}`);
}

async function main(): Promise<void> {
  const date = today();
  console.log(`Generating ${ARTICLES_PER_RUN} articles for ${date}`);

  const topics = await pickTopics(ARTICLES_PER_RUN, date);
  console.log(`Picked ${topics.length} topics:`);
  topics.forEach(t => console.log(`  - [${t.category}] ${t.topic}`));

  let successful = 0;
  const failures: Array<{ spec: TopicSpec; error: unknown }> = [];
  for (const spec of topics) {
    try {
      await generateOne(date, spec);
      successful++;
    } catch (error) {
      console.error(`FAILED for [${spec.category}] ${spec.topic}:`, error);
      failures.push({ spec, error });
    }
  }

  console.log(`\nSummary: ${successful}/${topics.length} articles generated successfully`);
  if (failures.length > 0) {
    console.log(`Failures:`);
    failures.forEach(f => console.log(`  - [${f.spec.category}] ${f.spec.topic}`));
  }
  if (successful === 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Smoke test end-to-end (generates real articles!)**

Set a small batch size for the test:
```bash
TAGESBLICK_ARTICLES_PER_RUN=1 npm run generate
```

Expected: one MDX file in `content/articles/` named like `2026-04-22-<slug>.mdx` and one JPEG in `public/generated/`.

Verify in browser with `npm run dev` and check `http://localhost:3000`. The new article should appear in the feed. Click it to verify the article page renders. Then kill the dev server.

If the smoke test produced an article you don't want to keep, delete it:
```bash
# only if the test article is unwanted
ls content/articles/
# rm content/articles/<the-test-file>.mdx
# rm public/generated/<the-test-image>.jpg
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-articles.ts
# Also stage any test articles you want to keep
git commit -m "feat: add orchestrator script for daily article generation"
```

---

## Task 12: GitHub Actions Daily Workflow

**Files:**
- Create: `.github/workflows/daily-articles.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/daily-articles.yml`:

```yaml
name: Daily Articles

on:
  schedule:
    - cron: '0 7 * * *'  # 07:00 UTC = 09:00 CEST
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate articles
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          TAGESBLICK_ARTICLES_PER_RUN: '4'
        run: npm run generate

      - name: Commit and push new articles
        run: |
          git config user.name "tagesblick-bot"
          git config user.email "bot@tagesblick.net"
          if [ -z "$(git status --porcelain content/articles public/generated)" ]; then
            echo "No new articles generated, nothing to commit"
            exit 0
          fi
          git add content/articles public/generated
          git commit -m "content: daily articles $(date -u +%Y-%m-%d)"
          git push
```

- [ ] **Step 2: Instructions for repo secrets**

Before the workflow can run, add these GitHub Actions secrets in the repo settings (Settings → Secrets and variables → Actions):

- `ANTHROPIC_API_KEY` — your Anthropic API key
- `GEMINI_API_KEY` — your Google Gemini API key

No code change required for this step — it's a one-time manual configuration. Document it for the user.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/daily-articles.yml
git commit -m "ci: add daily GitHub Actions workflow for article generation"
```

- [ ] **Step 4: Push and trigger a test run**

```bash
git push
```

Then, from the GitHub Actions UI, manually trigger the "Daily Articles" workflow via "Run workflow". Verify:
- The workflow completes successfully
- A new commit `content: daily articles YYYY-MM-DD` appears on `main`
- Vercel auto-deploys and the new articles are visible on `tagesblick.net`

---

## Task 13: Claude Code Skill — `tagesblick-article` (On-Demand)

**Files:**
- Create: `.claude/skills/tagesblick-article/SKILL.md`

- [ ] **Step 1: Create the skill**

Create `.claude/skills/tagesblick-article/SKILL.md`:

```markdown
---
name: tagesblick-article
description: Generate a single Tagesblick editorial article on demand and commit it. Use when the user wants to publish a specific article outside the daily schedule.
---

# tagesblick-article

Generate one editorial article for tagesblick.net from a user-supplied topic and commit it to the repo.

## When to use

- User says "write an article about X" or "/tagesblick-article <topic>"
- User wants to publish something immediately, outside the daily cron

## Inputs

The user provides a topic in the form `Category: Topic` (e.g. `Sport: Champions League Halbfinale`) or a free-form topic string. Infer the category from the content if not specified, choosing from: Wirtschaft, Panorama, Digital, Sport, Reise, Eilmeldung.

## Workflow

1. Confirm the interpreted `category` and `topic` with the user in one short sentence
2. Ensure `.env.local` in the project root contains `ANTHROPIC_API_KEY` and `GEMINI_API_KEY`. If missing, ask the user to add them before proceeding
3. Run a one-article generation:

```bash
cd /Users/andregomesfaria/Desktop/native-advertising-mvp
npx tsx -e "
import { config } from 'dotenv';
config({ path: '.env.local' });
import('./scripts/lib/claude').then(async claude => {
  const gemini = await import('./scripts/lib/gemini');
  const writer = await import('./scripts/lib/mdx-writer');
  const { toSlug } = await import('./scripts/lib/slug');
  const path = await import('node:path');

  const spec = { category: 'CATEGORY_HERE', topic: 'TOPIC_HERE', angle: 'ANGLE_HERE' };
  const date = new Date().toISOString().slice(0, 10);
  const article = await claude.writeArticle(spec);
  const slug = toSlug(article.title);
  const imageFilename = date + '-' + slug + '.jpg';

  await gemini.generateHeroImage({
    title: article.title,
    category: spec.category,
    outPath: path.join(process.cwd(), 'public/generated', imageFilename),
  });

  const mdxPath = writer.writeArticleFile(path.join(process.cwd(), 'content/articles'), {
    title: article.title,
    kicker: spec.category,
    dek: article.dek,
    date,
    slug,
    image: '/generated/' + imageFilename,
    body: article.body,
  });
  console.log('wrote ' + mdxPath);
});
"
```

Substitute `CATEGORY_HERE`, `TOPIC_HERE`, `ANGLE_HERE` with the user's inputs. The angle should be a concrete one-sentence journalistic angle you infer from the topic.

4. Show the user the generated MDX file path and the title
5. Offer to commit:

```bash
git add content/articles public/generated
git commit -m "content: article '<title>'"
```

6. If the user approves, run the commit. Do not push automatically — let the user push when ready.

## Notes

- Do NOT modify `scripts/generate-articles.ts`; use its lib modules directly via the inline script above
- If the Claude or Gemini API call fails, surface the error and stop — do not retry silently
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/tagesblick-article/SKILL.md
git commit -m "feat: add Claude Code skill for on-demand article generation"
```

---

## Task 14: Claude Code Skill — `tagesblick-daily` (Batch)

**Files:**
- Create: `.claude/skills/tagesblick-daily/SKILL.md`

- [ ] **Step 1: Create the skill**

Create `.claude/skills/tagesblick-daily/SKILL.md`:

```markdown
---
name: tagesblick-daily
description: Manually run the full daily article generation pipeline for Tagesblick. Use for testing, backfilling missed days, or running ahead of schedule.
---

# tagesblick-daily

Trigger the complete daily article generation pipeline from the local machine. This is the same pipeline that the GitHub Actions cron runs, but on-demand.

## When to use

- User says "run the daily articles" / "generate today's articles" / "/tagesblick-daily"
- Backfilling a missed day
- Testing the pipeline locally before trusting the cron

## Preconditions

1. `.env.local` in the project root contains:
   - `ANTHROPIC_API_KEY`
   - `GEMINI_API_KEY`

   If either is missing, ask the user to add them before proceeding.

2. Git working tree is clean (or user acknowledges they want to mix generated commits with uncommitted changes).

## Workflow

1. Confirm the intent in one short sentence (e.g. "Running daily generation — 4 articles for 2026-04-22")

2. Execute:

```bash
cd /Users/andregomesfaria/Desktop/native-advertising-mvp
npm run generate
```

3. Report the summary: number of articles generated, any failures, file paths written.

4. If at least one article was generated successfully, offer to commit:

```bash
git add content/articles public/generated
git commit -m "content: daily articles $(date -u +%Y-%m-%d)"
```

5. If the user approves, run the commit. Do not push automatically — let the user push when ready.

## Notes

- Default batch size is 4 (set via `TAGESBLICK_ARTICLES_PER_RUN` env var; can be overridden inline: `TAGESBLICK_ARTICLES_PER_RUN=2 npm run generate`)
- Failures on individual articles don't stop the whole batch — the script keeps going and reports at the end
- Do NOT push after committing — the user controls when deployments happen
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/tagesblick-daily/SKILL.md
git commit -m "feat: add Claude Code skill for manual daily pipeline"
```

---

## Task 15: README Update and Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current README**

Run: `cat README.md` and look at what exists.

- [ ] **Step 2: Append a "Daily Articles" section to `README.md`**

Open `README.md` and append at the end:

```markdown

## Daily Editorial Articles

Articles are AI-generated daily via GitHub Actions:
- Text: Claude (Sonnet for body, Haiku for topic selection)
- Images: Gemini Imagen
- Storage: `content/articles/*.mdx`, `public/generated/*.jpg`
- Rendering: dynamic route `/artikel/[slug]`
- Schedule: 07:00 UTC daily (see `.github/workflows/daily-articles.yml`)

### Local development

1. Copy `.env.example` to `.env.local` and fill in API keys
2. Run `npm run generate` to produce articles locally
3. Run `npm run dev` to preview

### Manual / on-demand generation

- Full batch: `npm run generate` or invoke the `tagesblick-daily` Claude Code skill
- Single article: invoke the `tagesblick-article` Claude Code skill with a topic

### Production secrets

Set in GitHub → Settings → Secrets and variables → Actions:
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
```

- [ ] **Step 3: Final verification — full build**

Run:
```bash
npm run test
npm run build
```

Expected: all tests pass; build succeeds with all seed articles pre-rendered (`/artikel/ezb-zinspolitik`, `/artikel/usb-c-eu-standard`, `/artikel/bundesliga-30-spieltag`).

- [ ] **Step 4: Final visual check in dev server**

Run: `npm run dev`

Verify:
- `http://localhost:3000` — home feed shows seed articles with easyJet sponsored card injected at position 3
- Click any real article → `/artikel/<slug>` renders correctly
- Click the easyJet card → `/advertorial` still works

Kill dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document daily editorial pipeline in README"
```

- [ ] **Step 6: Push everything**

```bash
git push
```

Vercel auto-deploys. Verify the seed articles appear on `tagesblick.net`.

---

## Self-Review Summary

Spec coverage:
- Section 1 (Content Architecture) — Tasks 2, 4, 5, 6, 7
- Section 2 (Generation Pipeline) — Tasks 3, 8, 9, 10, 11
- Section 3 (GitHub Actions Workflow) — Task 12
- Section 4 (Claude Code Skills) — Tasks 13, 14
- Section 5 (Data Flow) — end-to-end verified in Tasks 11 and 15

No placeholders, no TBDs. Function names (`pickTopics`, `writeArticle`, `generateHeroImage`, `writeArticleFile`, `toSlug`, `getAllArticles`, `getArticleBySlug`, `getAllSlugs`) are consistent across tasks. MDX frontmatter schema is consistent between the reader (Task 4) and writer (Task 10).

Category distribution (3–5 articles covering all 6 categories — with rotation on short days) is handled by Claude picking one topic per distinct category in `pickTopics`, with the daily budget defaulting to 4 (`TAGESBLICK_ARTICLES_PER_RUN=4`).
