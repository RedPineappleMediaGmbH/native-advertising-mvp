import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BackBar from '@/components/advertorial/back-bar';
import { getAllSlugs, getArticleBySlug } from '@/lib/articles';
import { BRANDS } from '@/components/brands';
import ArticleJsonLd from '@/components/seo/article-json-ld';
import PubFooter from '@/components/home/pub-footer';
import AiDisclosure from '@/components/home/ai-disclosure';

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
    alternates: { canonical: `/artikel/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      section: article.kicker,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return notFound();

  const brand = BRANDS.find(b => b.id === 'tagesblick')!;
  const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

  return (
    <>
      <ArticleJsonLd article={article} url={`https://tagesblick.net/artikel/${slug}`} />
      <div className="adv">
        <BackBar brand={brand} href="/" category={article.kicker} />
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
          <AiDisclosure />
          <div className="article-body" style={serif}>
            <MDXRemote source={article.body} />
          </div>
        </div>
      </div>
      <PubFooter brand={brand} />
    </>
  );
}
