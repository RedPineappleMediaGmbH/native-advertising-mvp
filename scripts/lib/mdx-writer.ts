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
