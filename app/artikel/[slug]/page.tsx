import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PubTopbar from '@/components/home/pub-topbar';
import PubFooter from '@/components/home/pub-footer';
import { getAllSlugs, getArticleBySlug } from '@/lib/articles';
import { BRANDS } from '@/components/brands';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Tagesblick`,
    description: article.dek,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const brand = BRANDS.find(b => b.id === 'tagesblick')!;
  const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

  return (
    <>
      <PubTopbar brand={brand} />
      <div className="adv">
        <div className="adv-wrap">
          <div className="adv-meta">
            <span className="kicker">{article.kicker}</span>
            <span>·</span>
            <span>{new Date(article.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="adv-title" style={serif}>{article.title}</h1>
          <p className="lead" style={serif}>{article.dek}</p>
          <figure style={{ margin: '28px 0 24px' }}>
            <img src={article.image} alt={article.title} style={{ width: '100%', display: 'block', borderRadius: 3 }} />
          </figure>
          <div className="article-body" style={serif}>
            <MDXRemote source={article.body} />
          </div>
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <Link href="/" style={{ color: 'var(--pub-accent)', fontWeight: 600 }}>← Zurück zur Startseite</Link>
          </div>
        </div>
      </div>
      <PubFooter brand={brand} />
    </>
  );
}
