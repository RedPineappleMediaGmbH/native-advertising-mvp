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
