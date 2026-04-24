import { buildArticleJsonLd } from '@/lib/article-json-ld';
import type { Article } from '@/lib/articles';

interface Props {
  article: Article;
  url: string;
}

export default function ArticleJsonLd({ article, url }: Props) {
  const jsonLd = buildArticleJsonLd(article, url);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
