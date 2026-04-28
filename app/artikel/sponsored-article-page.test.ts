import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

test('does not wrap the sponsored article AI disclosure in a full-height article shell', () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      'app/artikel/funf-europaische-stadte-die-sie-diesen-sommer-fur-unter-50-euro-erreichen-konnen/page.tsx',
    ),
    'utf8',
  );

  expect(source).not.toContain('<div className="adv">\n        <div className="adv-wrap">\n          <AiDisclosure />');
});
