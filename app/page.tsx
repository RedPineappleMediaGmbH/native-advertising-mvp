import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { buildAktuellItems, buildAktuellStand } from '@/lib/aktuell';
import HomeView from '@/components/home/home-view';
import type { FeedItem } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const articles = getAllArticles();
  const hero = articles[0];
  return {
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      ...(hero && {
        images: [{ url: hero.image, width: 1200, height: 630, alt: hero.title }],
      }),
    },
  };
}

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'heute';
  if (diffDays === 1) return 'gestern';
  return `vor ${diffDays} Tagen`;
}

export default function HomePage() {
  const articles = getAllArticles();
  const [hero, ...rest] = articles;
  const feedArticles = rest.slice(0, 5);
  const sidebarArticles = rest.slice(5, 10);
  const aktuellItems = buildAktuellItems(articles);
  const aktuellStand = buildAktuellStand(articles);

  const feed: FeedItem[] = feedArticles.map(a => ({
    kicker: a.kicker,
    title: a.title,
    dek: a.dek,
    meta: relativeTime(a.date),
    img: a.image,
    href: `/artikel/${a.slug}`,
  }));

  const sponsored: FeedItem = {
    sponsored: true,
    partner: 'easyJet',
    kicker: 'Anzeige',
    title: 'Fünf europäische Städte, die Sie diesen Sommer für unter 50€ erreichen können',
    dek: 'Lissabon, Porto, Athen, Krakau, Valletta — wir zeigen, welche Destinationen 2026 das beste Preis-Erlebnis bieten.',
    meta: 'Präsentiert von easyJet',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  };

  const feedWithAd: FeedItem[] = feed.length >= 2
    ? [...feed.slice(0, 2), sponsored, ...feed.slice(2)]
    : [...feed, sponsored];

  return (
    <HomeView
      feed={feedWithAd}
      hero={hero}
      sidebarArticles={sidebarArticles}
      aktuellItems={aktuellItems}
      aktuellStand={aktuellStand}
    />
  );
}
