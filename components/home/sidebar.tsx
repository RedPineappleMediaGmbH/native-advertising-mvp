import Link from 'next/link';
import type { Article } from '@/lib/articles';
import { NATIVE_AD_HREF } from '@/lib/constants';

interface Props {
  articles: Article[];
}

export default function Sidebar({ articles }: Props) {
  return (
    <aside>
      <div className="side-block">
        <h4 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>Meistgelesen</h4>
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/artikel/${article.slug}`}
            className="side-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="num" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{i + 1}</div>
            <div className="t">{article.title}</div>
          </Link>
        ))}
      </div>

      <Link
        href={NATIVE_AD_HREF}
        className="side-block side-ad"
        style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div style={{ position: 'relative', height: 120 }}>
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
            alt="Santorini"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6600', letterSpacing: '0.1em', marginBottom: 3 }}>ANZEIGE · EASYJET</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>Griechenland ab 34€</div>
          </div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Athen, Santorini, Rhodos — Direktflüge ab Berlin, Hamburg und München.</div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>easyJet · Paid Content</div>
        </div>
      </Link>
    </aside>
  );
}
