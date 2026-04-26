import { config } from 'dotenv';
config({ path: '.env.local' });
import { generateHeroImage } from './lib/gemini';
import { writeArticleFile } from './lib/mdx-writer';
import { toSlug } from './lib/slug';
import fs from 'node:fs';
import path from 'node:path';

interface Generated { title: string; dek: string; body: string; }

function extractJson(text: string): Generated {
  // Strip lines from known noise sources (SessionEnd hooks, warnings)
  const cleaned = text
    .split('\n')
    .filter(line => !line.match(/^(Warning:|SessionEnd hook|◇|◈|◉)/))
    .join('\n');
  // Find the JSON object by brace counting (handles nested braces in body strings)
  const start = cleaned.indexOf('{');
  if (start === -1) throw new Error('no { in input');
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.slice(start, i + 1));
      }
    }
  }
  throw new Error('no balanced JSON object found');
}

async function main() {
  const inputs: Array<{ category: string; jsonFile: string }> = JSON.parse(process.env.SPECS_JSON || '[]');
  const date = new Date().toISOString().slice(0, 10);

  for (const input of inputs) {
    const raw = fs.readFileSync(input.jsonFile, 'utf8');
    const article = extractJson(raw);
    const slug = toSlug(article.title);
    const imageFilename = date + '-' + slug + '.jpg';
    const mdxFilename = date + '-' + slug + '.mdx';
    const mdxFullPath = path.join(process.cwd(), 'content/articles', mdxFilename);

    if (fs.existsSync(mdxFullPath)) {
      console.log('=== SKIP (exists): ' + article.title);
      continue;
    }

    console.log('=== ' + article.title);
    console.log('  generating image...');
    await generateHeroImage({
      title: article.title,
      category: input.category,
      outPath: path.join(process.cwd(), 'public/generated', imageFilename),
    });
    const mdxPath = writeArticleFile(path.join(process.cwd(), 'content/articles'), {
      title: article.title,
      kicker: input.category,
      dek: article.dek,
      date,
      slug,
      image: '/generated/' + imageFilename,
      body: article.body,
    });
    console.log('  wrote ' + mdxPath);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
