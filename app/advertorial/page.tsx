'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/components/brand-context';
import { useCtaToast } from '@/hooks/use-cta-toast';
import AdvertorialA from '@/components/advertorial/advertorial-a';
import AdvertorialB from '@/components/advertorial/advertorial-b';
import StickyCta from '@/components/advertorial/sticky-cta';

export default function AdvertorialPage() {
  const router = useRouter();
  const { brand, state } = useBrand();
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyClosed, setStickyClosed] = useState(false);
  useCtaToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStickyVisible(false);
    setStickyClosed(false);
  }, []);

  useEffect(() => {
    if (state.stickyCta !== 'on') { setStickyVisible(false); return; }
    const onScroll = () => {
      if (stickyClosed) return;
      setStickyVisible((window.scrollY || window.pageYOffset) > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [state.stickyCta, stickyClosed]);

  const handleBack = () => router.push('/');

  return (
    <>
      {state.variant === 'A'
        ? <AdvertorialA brand={brand} onBack={handleBack} />
        : <AdvertorialB brand={brand} onBack={handleBack} />
      }
      <StickyCta
        visible={stickyVisible && state.stickyCta === 'on' && !stickyClosed}
        onClose={() => { setStickyClosed(true); setStickyVisible(false); }}
      />
    </>
  );
}
