# Sidebar Real Content — Design

**Date:** 2026-04-26
**Goal:** Make the homepage sidebar feel like a real newspaper instead of a static mockup.
**Driver:** Sidebar currently has fake hardcoded headlines, an unclickable advertorial card, and a fake weather widget. Native advertisers evaluating the site immediately see it's a template.

---

## Context

The sidebar at `components/home/sidebar.tsx` has three sections:

1. **Meistgelesen** — 5 hardcoded fake headlines, rendered as plain `<div>` text (not clickable)
2. **Greece advertorial card** — hardcoded easyJet ad, no click target
3. **Wetter** — hardcoded "Berlin 17° Wechselhaft, windig · Aktualisiert 09:42" (never updates)

None of these reflect real content or behavior. The third one is actively misleading because the timestamp is stale.

---

## Approach

Pure UI cleanup. No new APIs, no env vars, no third-party services.

| Section | Change |
|---|---|
| Meistgelesen | Replace hardcoded titles with 5 real articles (positions 7–11 by date), each wrapped in a `<Link>` |
| Sponsored Greece card | Wrap the existing card in `<Link>` to the advertorial URL, add subtle hover state |
| Wetter | Remove entirely |

The Meistgelesen articles deliberately skip positions 1–6 (hero + main feed) so the sidebar shows different content from the main column — like a real "deep cut" most-read list.

---

## Section 1 — Sidebar component

**File:** `components/home/sidebar.tsx`

**Signature change:** accepts an `articles` prop:

```ts
import type { Article } from '@/lib/articles';
import Link from 'next/link';

interface Props {
  articles: Article[];
}

export default function Sidebar({ articles }: Props) {
  // ...
}
```

**Meistgelesen rendering:**

```tsx
<div className="side-block">
  <h4 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>Meistgelesen</h4>
  {articles.map((article, i) => (
    <Link
      key={article.slug}
      href={`/artikel/${article.slug}`}
      className="side-item"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: 12, alignItems: 'flex-start' }}
    >
      <div className="num" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{i + 1}</div>
      <div className="t">{article.title}</div>
    </Link>
  ))}
</div>
```

The block degrades gracefully if `articles.length === 0` (renders nothing); if `articles.length < 5`, it just renders the available items.

**Sponsored card:** the existing markup wrapped in `<Link>`:

```tsx
<Link
  href="/artikel/funf-europaische-stadte-die-sie-diesen-sommer-fur-unter-50-euro-erreichen-konnen"
  className="side-block"
  style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}
>
  {/* existing image + overlay + text — unchanged */}
</Link>
```

**Wetter block:** deleted entirely (lines 41–51 of the current file).

**Hover styles:** added to `app/globals.css` (existing `.side-block` / `.side-item` definitions live there at lines 143–154):

```css
.side-item:hover .t { color: var(--pub-accent); }
.side-block a:hover img { filter: brightness(1.05); transition: filter 0.2s; }
```

---

## Section 2 — HomeView wiring

**File:** `components/home/home-view.tsx`

The component currently receives `feed: FeedItem[]` and `hero: Article`. It needs the full `articles: Article[]` array too, so it can pass a slice to `<Sidebar>`.

**Signature change:**

```ts
export default function HomeView({
  feed,
  hero,
  sidebarArticles,
}: {
  feed: FeedItem[];
  hero: Article;
  sidebarArticles: Article[];
}) {
  // ...
  <Sidebar articles={sidebarArticles} />
  // ...
}
```

We pass a pre-sliced array (`sidebarArticles`) rather than the full `articles` array to keep the slicing logic in one place (`app/page.tsx`) and avoid passing more data than the sidebar needs.

---

## Section 3 — Page-level data wiring

**File:** `app/page.tsx`

The page already calls `getAllArticles()`. Add a slice for the sidebar:

```ts
export default function HomePage() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const feedArticles = rest.slice(0, 5);
  const sidebarArticles = rest.slice(5, 10); // positions 7–11 overall

  // ... feed building unchanged

  return <HomeView feed={feedWithAd} hero={hero} sidebarArticles={sidebarArticles} />;
}
```

If there are fewer than 11 articles total, `sidebarArticles` will simply be shorter — the sidebar handles that.

---

## Files Changed

| File | Change |
|---|---|
| `components/home/sidebar.tsx` | Accept `articles` prop, render real `<Link>`s for Meistgelesen, wrap sponsored card in `<Link>`, remove Wetter block |
| `components/home/home-view.tsx` | Add `sidebarArticles` prop, forward to `<Sidebar>` |
| `app/page.tsx` | Slice `articles[6..10]` and pass as `sidebarArticles` to `<HomeView>` |
| `app/globals.css` | Add hover styles for sidebar links |

---

## Out of Scope

- Newsletter signup widget (deferred — not needed for this iteration)
- Weather replacement widget (deferred — sidebar is fine with two sections)
- Real "most read" analytics (would require tracking infra; a positional slice is good enough)
- Changing the sponsored Greece card content (still curated, still hardcoded — same easyJet ad)
- Tests (changes are pure render logic with no business behavior worth unit testing; visual verification in browser is sufficient)
