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
   - `GEMINI_API_KEY`

   If missing, ask the user to add it before proceeding. Article text is generated via the Claude Code CLI (no Anthropic API key needed).

2. Git working tree is clean (or user acknowledges they want to mix generated commits with uncommitted changes).

## Workflow

1. Confirm the intent in one short sentence (e.g. "Running daily generation — 4 articles for 2026-04-22")

2. Execute:

```bash
cd /Users/andregomesfaria/Desktop/native-advertising-mvp
npm run generate
```

3. Report the summary: number of articles generated, any failures, file paths written.

4. Offer to commit and push:

```bash
git add content/articles public/generated
git commit -m "content: daily articles $(date -u +%Y-%m-%d)"
git push
```

5. If the user approves, run the commit and push.

## Notes

- `TAGESBLICK_ARTICLES_PER_RUN` can be set in `.env.local` to override the default of 4
- Do not skip failed articles — report them and let the user decide
- If all articles fail, the script exits with code 1; surface the error to the user
