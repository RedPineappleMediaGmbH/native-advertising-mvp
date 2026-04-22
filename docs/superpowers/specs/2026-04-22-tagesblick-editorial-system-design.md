# Tagesblick Editorial Publishing System — Design Spec

**Date:** 2026-04-22  
**Status:** Approved  
**Scope:** Daily AI-generated editorial content pipeline for tagesblick.net

---

## Overview

Populate tagesblick.net with 3–5 fully AI-generated German-language editorial articles per day, published automatically via GitHub Actions and Vercel. Website design is locked — only content infrastructure is added.

---

## 1. Content Architecture

### Article Storage

Articles are stored as MDX files:

```
content/articles/YYYY-MM-DD-slug.mdx
```

Frontmatter schema:

```yaml
---
title: "Artikel-Titel"
kicker: "Sport"           # one of: Wirtschaft, Panorama, Digital, Sport, Reise, Eilmeldung
dek: "Kurze Beschreibung des Artikels für die Feed-Karte."
date: "2026-04-22"
slug: "artikel-slug"
image: "/generated/2026-04-22-artikel-slug.jpg"
---
```

### Generated Images

Hero images are generated via Gemini Imagen 2 and committed to:

```
public/generated/YYYY-MM-DD-slug.jpg
```

### Routing

- **Home feed** (`app/page.tsx`) — reads the 6 most recent articles from `content/articles/` at build time, renders as feed cards. Replaces the current hardcoded `FEED` array.
- **Article page** (`app/artikel/[slug]/page.tsx`) — new dynamic route; renders full MDX article content with hero image, kicker, title, dek, and body text.

### Category Distribution

Each daily run covers all 6 categories: Wirtschaft, Panorama, Digital, Sport, Reise, Eilmeldung. On days with only 3–4 articles, categories are rotated to ensure even coverage over time.

---

## 2. Generation Pipeline

### Script: `scripts/generate-articles.ts`

Runs as a standalone Node.js script. Steps:

1. **Topic selection** — calls `claude-haiku-4-5` to generate 3–5 plausible German news topics (one per category), varied by date seed to avoid repetition.
2. **Article writing** — for each topic, calls `claude-sonnet-4-6` with an editorial prompt enforcing:
   - Language: German
   - Tone: neutral, concise, newspaper-style
   - Length: 400–600 words
   - Structure: intro paragraph, 2–3 subheadings, closing paragraph
   - No AI clichés, no filler phrases
3. **Image generation** — calls Gemini Imagen 2 with a prompt derived from the article title and category. Saves as JPEG to `public/generated/`.
4. **File writing** — writes MDX file per article to `content/articles/`.
5. **Git commit** — stages and commits all new files with message: `content: daily articles YYYY-MM-DD`.

### Environment Variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API for topic selection and article writing |
| `GEMINI_API_KEY` | Gemini Imagen 2 for hero image generation |

Both are stored as GitHub Actions repository secrets and injected at runtime.

---

## 3. GitHub Actions Workflow

File: `.github/workflows/daily-articles.yml`

- **Schedule:** `0 7 * * *` (7:00 UTC = 9:00 German time)
- **Steps:**
  1. Checkout repo (with write permissions via `GITHUB_TOKEN`)
  2. Setup Node.js
  3. Install dependencies (`npm ci`)
  4. Run `npx ts-node scripts/generate-articles.ts`
  5. Commit and push new files
  6. Vercel detects push → auto-deploys (no extra step)

The workflow can also be triggered manually via `workflow_dispatch` for testing.

---

## 4. Claude Code Skills

### `tagesblick-article`

On-demand single article generation. Invoked as:

```
/tagesblick-article Sport: Champions League Halbfinale
```

Generates one MDX article + hero image for the given topic and commits it. Useful for publishing outside the daily schedule or for advertorial-adjacent editorial pieces.

### `tagesblick-daily`

Manual trigger for the full daily pipeline. Invokes `scripts/generate-articles.ts` directly from the terminal. Useful for:
- Testing the pipeline locally before the first automated run
- Backfilling missed days
- Running ahead of schedule

Both skills live in the user's Claude Code skills directory and delegate to the shared `generate-articles.ts` script.

---

## 5. Data Flow

```
GitHub Actions cron (9am DE)
  └── generate-articles.ts
        ├── Claude Haiku → topic list (3–5 topics)
        ├── Claude Sonnet → article body (per topic)
        ├── Gemini Imagen 2 → hero image (per topic)
        ├── Write content/articles/YYYY-MM-DD-slug.mdx
        └── Write public/generated/YYYY-MM-DD-slug.jpg
              └── git commit + push
                    └── Vercel auto-deploy → tagesblick.net live
```

---

## 6. Out of Scope

- Advertorials (generated on-demand separately, existing flow)
- Comments, search, pagination (future)
- Real-time breaking news (rebuild lag of ~2 min is acceptable)
- Multi-brand support (locked to tagesblick)
