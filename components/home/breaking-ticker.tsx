'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { AktuellItem } from '@/lib/aktuell';

export default function BreakingTicker({ items, stand }: { items: AktuellItem[]; stand: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? null;

  useEffect(() => {
    if (items.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % items.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!activeItem) return null;

  return (
    <section className="breaking" aria-label="Aktuelle Meldungen">
      <div className="breaking-head">
        <span className="tag">AKTUELL</span>
        <span className="stand">{stand}</span>
      </div>
      <Link className="ticker" href={activeItem.href} key={`${activeItem.href}-${activeIndex}`}>
        <span className="ticker-time">{activeItem.timestamp}</span>
        <span className="ticker-label">{activeItem.label}</span>
        <span className="ticker-text">{activeItem.text}</span>
      </Link>
      <div className="ticker-dots" aria-hidden="true">
        {items.map((item, index) => (
          <span key={item.href} className={index === activeIndex ? 'active' : undefined} />
        ))}
      </div>
    </section>
  );
}
