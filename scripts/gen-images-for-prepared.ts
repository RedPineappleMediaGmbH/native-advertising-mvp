import { config } from 'dotenv';
config({ path: '.env.local' });
import { generateHeroImage } from './lib/gemini';
import path from 'node:path';
import fs from 'node:fs';

interface Spec { date: string; slug: string; title: string; category: string; }

const SPECS: Spec[] = [
  {
    date: '2026-04-29',
    slug: 'mietpreisbremse-laeuft-aus-warum-die-verlaengerung-bis-2029-schon-wieder-umstritten-ist',
    title: 'Mietpreisbremse läuft aus: Warum die Verlängerung bis 2029 schon wieder umstritten ist',
    category: 'Wirtschaft',
  },
  {
    date: '2026-04-29',
    slug: 'sommerferien-2026-tuerkei-und-albanien-holen-auf-mallorca-verliert',
    title: 'Sommerferien 2026: Türkei und Albanien holen auf, Mallorca verliert',
    category: 'Reise',
  },
  {
    date: '2026-04-29',
    slug: 'eu-ai-act-zeigt-zaehne-erste-bussgelder-gegen-anbieter-erwartet',
    title: 'EU AI Act zeigt Zähne: Erste Bußgelder gegen Anbieter erwartet',
    category: 'Digital',
  },
];

async function main() {
  for (const spec of SPECS) {
    const filename = `${spec.date}-${spec.slug}.jpg`;
    const outPath = path.join(process.cwd(), 'public/generated', filename);
    if (fs.existsSync(outPath)) {
      console.log(`SKIP existing: ${filename}`);
      continue;
    }
    console.log(`GEN: ${filename}`);
    try {
      await generateHeroImage({ title: spec.title, category: spec.category, outPath });
      console.log(`  OK -> ${outPath}`);
    } catch (e) {
      console.error(`  FAIL: ${(e as Error).message}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
