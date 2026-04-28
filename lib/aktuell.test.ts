import { describe, expect, it } from 'vitest';
import { buildAktuellItems, buildAktuellStand } from './aktuell';
import type { Article } from './articles';

const articles: Article[] = [
  {
    title: 'Sozialreformen unter Druck',
    kicker: 'Politik',
    dek: 'Warum Merz und SPD jetzt liefern müssen.',
    date: '2026-04-28',
    slug: 'sozialreformen-unter-druck',
    image: '/generated/politik.jpg',
    body: 'Text',
  },
  {
    title: 'Lichter Filmfest startet in Frankfurt',
    kicker: 'Kultur',
    dek: 'Wenn Kino die Kunst befragt.',
    date: '2026-04-28',
    slug: 'lichter-filmfest-startet',
    image: '/generated/kultur.jpg',
    body: 'Text',
  },
  {
    title: 'Alter Reiseartikel',
    kicker: 'Reise',
    dek: 'Nicht mehr ganz frisch.',
    date: '2026-04-21',
    slug: 'alter-reiseartikel',
    image: '/generated/reise.jpg',
    body: 'Text',
  },
];

describe('buildAktuellItems', () => {
  it('turns the newest editorial articles into linked update items', () => {
    expect(buildAktuellItems(articles, 2)).toEqual([
      {
        label: 'Politik',
        text: 'Sozialreformen unter Druck',
        timestamp: '28.04.',
        href: '/artikel/sozialreformen-unter-druck',
      },
      {
        label: 'Kultur',
        text: 'Lichter Filmfest startet in Frankfurt',
        timestamp: '28.04.',
        href: '/artikel/lichter-filmfest-startet',
      },
    ]);
  });

  it('omits sponsored articles from the update strip', () => {
    const items = buildAktuellItems([
      { ...articles[0], sponsored: true, advertiser: 'Demo GmbH' },
      articles[1],
    ]);

    expect(items).toHaveLength(1);
    expect(items[0].label).toBe('Kultur');
  });
});

describe('buildAktuellStand', () => {
  it('uses the newest article date as the editorial stand', () => {
    expect(buildAktuellStand(articles)).toBe('Stand: 28.04.2026');
  });
});
