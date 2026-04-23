import Link from 'next/link';
import PubTopbar from '@/components/home/pub-topbar';
import PubFooter from '@/components/home/pub-footer';
import { getArticlesByKicker } from '@/lib/articles';
import { BRANDS } from '@/components/brands';

const NAV_CATEGORIES = ['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Digital', 'Reise', 'Wissen'];

export function generateStaticParams() {
  return NAV_CATEGORIES.map(c => ({ category: c.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = NAV_CATEGORIES.find(c => c.toLowerCase() === category) ?? category;
  return {
    title: `${label} — Tagesblick`,
    description: `Alle ${label}-Artikel auf Tagesblick.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = NAV_CATEGORIES.find(c => c.toLowerCase() === category) ?? category;
  const articles = getArticlesByKicker(label);
  const brand = BRANDS.find(b => b.id === 'tagesblick')!;
  const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

  return (
    <>
      <PubTopbar brand={brand} />
      <div className="adv">
        <div className="adv-wrap">
          <h1 style={{ ...serif, fontSize: 32, marginBottom: 32, borderBottom: '2px solid var(--pub-accent)', paddingBottom: 12 }}>
            {label}
          </h1>
          {articles.length === 0 ? (
            <p style={{ color: 'var(--muted-2)', fontSize: 16 }}>
              Noch keine Artikel in dieser Kategorie.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {articles.map(a => (
                <Link
                  key={a.slug}
                  href={`/artikel/${a.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '20px 0', borderBottom: '1px solid var(--line)' }}
                >
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <img
                      src={a.image}
                      alt={a.title}
                      style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }}
                    />
                    <div>
                      <span className="kicker">{a.kicker}</span>
                      <h2 style={{ ...serif, fontSize: 18, margin: '4px 0 6px', lineHeight: 1.3 }}>{a.title}</h2>
                      <p style={{ fontSize: 14, color: 'var(--muted-2)', margin: 0 }}>{a.dek}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <Link href="/" style={{ color: 'var(--pub-accent)', fontWeight: 600 }}>← Zurück zur Startseite</Link>
          </div>
        </div>
      </div>
      <PubFooter brand={brand} />
    </>
  );
}
