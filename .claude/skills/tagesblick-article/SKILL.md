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
2. Ensure `.env.local` in the project root contains `GEMINI_API_KEY`. If missing, ask the user to add it before proceeding. Article text is generated via the Claude Code CLI (no API key needed)
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
