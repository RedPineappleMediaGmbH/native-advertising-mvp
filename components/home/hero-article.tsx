import Link from 'next/link';
import type { Article } from '@/lib/articles';

export default function HeroArticle({ article }: { article: Article }) {
  return (
    <Link href={`/artikel/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
      <article className="hero" style={{ gridColumn: '1 / -1', cursor: 'pointer' }}>
        <div className="hero-img">
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span className="kicker">{article.kicker}</span>
        </div>
        <div className="hero-body">
          <div style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
            Leitartikel
          </div>
          <h1 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>
            {article.title}
          </h1>
          <p>{article.dek}</p>
        </div>
      </article>
    </Link>
  );
}
