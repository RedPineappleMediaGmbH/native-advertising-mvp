import type { Article } from './articles';

export interface AktuellItem {
  label: string;
  text: string;
  timestamp: string;
  href: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
});

const STAND_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function buildAktuellItems(articles: Article[], limit = 5): AktuellItem[] {
  return articles
    .filter(article => !article.sponsored)
    .slice(0, limit)
    .map(article => ({
      label: article.kicker,
      text: article.title,
      timestamp: DATE_FORMATTER.format(new Date(`${article.date}T12:00:00`)),
      href: `/artikel/${article.slug}`,
    }));
}

export function buildAktuellStand(articles: Article[]): string {
  const newest = articles.find(article => !article.sponsored);
  if (!newest) return 'Stand: Redaktion';

  return `Stand: ${STAND_FORMATTER.format(new Date(`${newest.date}T12:00:00`))}`;
}
