import { config } from 'dotenv';
config({ path: '.env.local' });
import { writeArticle } from './lib/claude';
import { generateHeroImage } from './lib/gemini';
import { writeArticleFile } from './lib/mdx-writer';
import { toSlug } from './lib/slug';
import path from 'node:path';

interface OnDemandSpec {
  category: string;
  topic: string;
  angle: string;
}

async function generate(spec: OnDemandSpec) {
  const date = new Date().toISOString().slice(0, 10);
  const article = await writeArticle(spec as any);
  const slug = toSlug(article.title);
  const imageFilename = date + '-' + slug + '.jpg';

  await generateHeroImage({
    title: article.title,
    category: spec.category,
    outPath: path.join(process.cwd(), 'public/generated', imageFilename),
  });

  const mdxPath = writeArticleFile(path.join(process.cwd(), 'content/articles'), {
    title: article.title,
    kicker: spec.category,
    dek: article.dek,
    date,
    slug,
    image: '/generated/' + imageFilename,
    body: article.body,
  });
  return { mdxPath, title: article.title };
}

const SPECS: OnDemandSpec[] = JSON.parse(process.env.SPECS_JSON || '[]');
async function main() {
  for (const spec of SPECS) {
    console.log('=== Generating: ' + spec.topic);
    const result = await generate(spec);
    console.log('WROTE: ' + result.mdxPath);
    console.log('TITLE: ' + result.title);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
