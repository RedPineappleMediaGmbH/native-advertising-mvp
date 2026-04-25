# Sidebar Real Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage sidebar real — replace fake Meistgelesen titles with real article links, make the sponsored Greece card clickable, remove the fake weather widget.

**Architecture:** Pure UI change. Sidebar accepts an `articles: Article[]` prop and renders real `<Link>`s. Page component slices articles `[6..10]` (positions 7–11 by date) and threads them through HomeView. No new APIs, env vars, or services.

**Tech Stack:** Next.js 16 App Router, TypeScript, React Server Components

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/home/sidebar.tsx` | Modify | Accept `articles` prop, render real Meistgelesen `<Link>`s, wrap sponsored card in `<Link>`, remove Wetter block |
| `components/home/home-view.tsx` | Modify | Add `sidebarArticles` prop and forward to `<Sidebar>` |
| `app/page.tsx` | Modify | Slice `articles[6..10]` and pass to `<HomeView>` as `sidebarArticles` |
| `app/globals.css` | Modify | Add hover styles for sidebar Meistgelesen items and sponsored card image |

No tests — this is pure render logic with no business behavior worth unit testing per the design spec. Verification via TypeScript + browser visual check.

---

### Task 1: Rewrite Sidebar component

**Files:**
- Modify: `components/home/sidebar.tsx`

- [ ] **Step 1: Replace the entire file contents**

Full replacement of `components/home/sidebar.tsx`:

```tsx
import Link from 'next/link';
import type { Article } from '@/lib/articles';

const ADVERTORIAL_HREF = '/artikel/funf-europaische-stadte-die-sie-diesen-sommer-fur-unter-50-euro-erreichen-konnen';

interface Props {
  articles: Article[];
}

export default function Sidebar({ articles }: Props) {
  return (
    <aside>
      <div className="side-block">
        <h4 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>Meistgelesen</h4>
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/artikel/${article.slug}`}
            className="side-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="num" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{i + 1}</div>
            <div className="t">{article.title}</div>
          </Link>
        ))}
      </div>

      <Link
        href={ADVERTORIAL_HREF}
        className="side-block side-ad"
        style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div style={{ position: 'relative', height: 120 }}>
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
            alt="Santorini"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6600', letterSpacing: '0.1em', marginBottom: 3 }}>ANZEIGE · EASYJET</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>Griechenland ab 34€</div>
          </div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Athen, Santorini, Rhodos — Direktflüge ab Berlin, Hamburg und München.</div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>easyJet · Paid Content</div>
        </div>
      </Link>
    </aside>
  );
}
```

Key changes from the previous version:
- New `articles: Article[]` prop with import of `Article` type
- Meistgelesen list maps over `articles` instead of the hardcoded `MOST_READ` constant; each item is now a `<Link>` to `/artikel/{slug}`
- Sponsored card is wrapped in `<Link>` with `className="side-block side-ad"` (the `side-ad` class is used for the hover style in Task 4)
- The entire Wetter block has been deleted
- The hardcoded `MOST_READ` constant has been removed

- [ ] **Step 2: Verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit
```

Expected: One error in `components/home/home-view.tsx` (the Sidebar prop is now required but not yet supplied). This is fine — Task 2 fixes it.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add components/home/sidebar.tsx && git commit -m "feat: sidebar accepts articles, renders real Meistgelesen links and clickable advertorial card; remove Wetter block"
```

---

### Task 2: Wire HomeView to pass sidebarArticles

**Files:**
- Modify: `components/home/home-view.tsx`

- [ ] **Step 1: Add sidebarArticles prop**

In `components/home/home-view.tsx`, update the component signature and the `<Sidebar>` usage. The full file becomes:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import PubTopbar from '@/components/home/pub-topbar';
import BreakingTicker from '@/components/home/breaking-ticker';
import HeroArticle from '@/components/home/hero-article';
import FeedCard from '@/components/home/feed-card';
import type { FeedItem } from '@/lib/types';
import type { Article } from '@/lib/articles';
import Sidebar from '@/components/home/sidebar';
import PubFooter from '@/components/home/pub-footer';

export default function HomeView({
  feed,
  hero,
  sidebarArticles,
}: {
  feed: FeedItem[];
  hero: Article;
  sidebarArticles: Article[];
}) {
  const router = useRouter();
  const { brand } = useBrand();
  useCtaToast();

  return (
    <>
      <PubTopbar brand={brand} />
      <main className="home">
        <BreakingTicker />
        <div>
          <HeroArticle article={hero} />
          <div className="feed">
            {feed.map((item, i) => (
              <FeedCard
                key={i}
                item={item}
                onOpenAdvertorial={() => router.push('/artikel/funf-europaische-stadte-die-sie-diesen-sommer-fur-unter-50-euro-erreichen-konnen')}
              />
            ))}
          </div>
        </div>
        <Sidebar articles={sidebarArticles} />
      </main>
      <PubFooter brand={brand} />
    </>
  );
}
```

Changes vs. existing file:
- Added `sidebarArticles: Article[]` to the destructured props and the inline type
- Changed `<Sidebar />` to `<Sidebar articles={sidebarArticles} />`

- [ ] **Step 2: Verify TypeScript**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit
```

Expected: One error in `app/page.tsx` (HomeView now requires `sidebarArticles` but isn't getting it). This is fine — Task 3 fixes it.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add components/home/home-view.tsx && git commit -m "feat: HomeView accepts sidebarArticles and forwards to Sidebar"
```

---

### Task 3: Slice articles in HomePage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the slice and pass to HomeView**

In `app/page.tsx`, modify the `HomePage` function. Replace the existing `HomePage` function (lines 30–58) with:

```tsx
export default function HomePage() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const feedArticles = rest.slice(0, 5);
  const sidebarArticles = rest.slice(5, 10);

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

  return <HomeView feed={feedWithAd} hero={hero} sidebarArticles={sidebarArticles} />;
}
```

Only two changes from the existing function:
- Added `const sidebarArticles = rest.slice(5, 10);` after `feedArticles` declaration
- Added `sidebarArticles={sidebarArticles}` to the `<HomeView>` props

The `generateMetadata` function and `relativeTime` helper above it remain unchanged.

- [ ] **Step 2: Verify TypeScript and run tests**

```bash
cd ~/Desktop/native-advertising-mvp && bun x tsc --noEmit && bun run test
```

Expected: No TypeScript errors. All 21 existing tests pass.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/page.tsx && git commit -m "feat: pass sidebarArticles slice (positions 7-11) to HomeView"
```

---

### Task 4: Add sidebar hover styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append hover styles to globals.css**

Append the following CSS to the end of `app/globals.css`:

```css
.side-item { transition: background-color 0.15s; cursor: pointer; }
.side-item:hover { background-color: var(--line-2); }
.side-item:hover .t { color: var(--pub-accent); }

.side-ad { transition: opacity 0.2s; cursor: pointer; }
.side-ad:hover { opacity: 0.92; }
.side-ad:hover img { filter: brightness(1.05); transition: filter 0.2s; }
```

These selectors target the `<Link>` elements rendered in Task 1:
- `.side-item` was already styled (lines 151–154 of globals.css); we extend it with hover behavior. Existing styles (padding, border, font sizes) remain intact because we use `:hover` pseudo-class only.
- `.side-ad` is the new class added to the sponsored advertorial `<Link>` in Task 1.

- [ ] **Step 2: Verify build**

```bash
cd ~/Desktop/native-advertising-mvp && bun run build
```

Expected: Build succeeds with no errors. All 29 static pages generate.

- [ ] **Step 3: Visual verification in dev server**

```bash
cd ~/Desktop/native-advertising-mvp && bun run dev &
sleep 5
echo "Open http://localhost:3000 in browser. Verify:"
echo "1. Meistgelesen list shows 5 real article titles (not 'EZB-Entscheid' / 'Flughafen Frankfurt' / etc.)"
echo "2. Hovering a Meistgelesen item highlights the row and changes title color"
echo "3. Clicking a Meistgelesen item navigates to /artikel/{slug}"
echo "4. Hovering the Greece card brightens the image slightly"
echo "5. Clicking the Greece card navigates to the easyJet advertorial"
echo "6. The 'Wetter' section is GONE"
echo ""
echo "When done, kill dev server with: kill %1"
```

Manual verification only — no automated test to run.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/native-advertising-mvp && git add app/globals.css && git commit -m "feat: add hover styles for sidebar Meistgelesen items and sponsored card"
```

---

### Task 5: Final build verification

- [ ] **Step 1: Full test suite**

```bash
cd ~/Desktop/native-advertising-mvp && bun run test
```

Expected: All 21 tests pass.

- [ ] **Step 2: Production build**

```bash
cd ~/Desktop/native-advertising-mvp && bun run build
```

Expected: Build completes with no errors. Routes still include all expected pages (`/`, `/sitemap.xml`, `/robots.txt`, `/artikel/[slug]`, `/kategorie/[category]`).
