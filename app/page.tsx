'use client';

import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import PubTopbar from '@/components/home/pub-topbar';
import BreakingTicker from '@/components/home/breaking-ticker';
import HeroArticle from '@/components/home/hero-article';
import FeedCard, { FEED } from '@/components/home/feed-card';
import Sidebar from '@/components/home/sidebar';
import PubFooter from '@/components/home/pub-footer';

export default function HomePage() {
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
            {FEED.map((item, i) => (
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
