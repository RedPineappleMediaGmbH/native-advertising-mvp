'use client';

import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import PubTopbar from '@/components/home/pub-topbar';
import BreakingTicker from '@/components/home/breaking-ticker';
import HeroArticle from '@/components/home/hero-article';
import FeedCard from '@/components/home/feed-card';
import type { FeedItem } from '@/lib/types';
import type { Article } from '@/lib/articles';
import Sidebar from '@/components/home/sidebar';
import PubFooter from '@/components/home/pub-footer';
import { NATIVE_AD_HREF } from '@/lib/constants';

export default function HomeView({
  feed,
  hero,
  sidebarArticles,
}: {
  feed: FeedItem[];
  hero: Article;
  sidebarArticles: Article[];
}) {
  const router = useRouter();
  const { brand } = useBrand();
  useCtaToast();

  return (
    <>
      <PubTopbar brand={brand} />
      <main className="home">
        <BreakingTicker />
        <div>
          <HeroArticle article={hero} />
          <div className="feed">
            {feed.map((item, i) => (
              <FeedCard
                key={i}
                item={item}
                onOpenAdvertorial={() => router.push(NATIVE_AD_HREF)}
              />
            ))}
          </div>
        </div>
        <Sidebar articles={sidebarArticles} />
      </main>
      <PubFooter brand={brand} />
    </>
  );
}
