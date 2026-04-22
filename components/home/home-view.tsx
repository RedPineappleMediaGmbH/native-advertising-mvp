'use client';

import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import PubTopbar from '@/components/home/pub-topbar';
import BreakingTicker from '@/components/home/breaking-ticker';
import HeroArticle from '@/components/home/hero-article';
import FeedCard from '@/components/home/feed-card';
import type { FeedItem } from '@/lib/types';
import Sidebar from '@/components/home/sidebar';
import PubFooter from '@/components/home/pub-footer';

export default function HomeView({ feed }: { feed: FeedItem[] }) {
  const router = useRouter();
  const { brand } = useBrand();
  useCtaToast();

  return (
    <>
      <PubTopbar brand={brand} />
      <main className="home">
        <BreakingTicker />
        <div>
          <HeroArticle />
          <div className="feed">
            {feed.map((item, i) => (
              <FeedCard
                key={i}
                item={item}
                onOpenAdvertorial={() => router.push('/advertorial')}
              />
            ))}
          </div>
        </div>
        <Sidebar />
      </main>
      <PubFooter brand={brand} />
    </>
  );
}
