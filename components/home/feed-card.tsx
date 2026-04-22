'use client';

import Link from 'next/link';
import type { FeedItem } from '@/lib/types';

export default function FeedCard({ item, onOpenAdvertorial }: { item: FeedItem; onOpenAdvertorial: () => void }) {
  if (item.sponsored) {
    return (
      <article className="card sponsored" onClick={onOpenAdvertorial}>
        <div className="anzeige-row">
          <span className="lbl">Anzeige</span>
          <span className="by">Präsentiert von {item.partner}</span>
        </div>
        <div className="thumb" style={{ overflow: 'hidden' }}>
          <img
            src={item.img}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
        <div className="body">
          <h3 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{item.title}</h3>
          <p>{item.dek}</p>
          <div className="partner-row">
            <span className="partner-logo" style={{ background: '#ff6600' }}>eJ</span>
            <span>easyJet · Paid Post</span>
          </div>
        </div>
      </article>
    );
  }

  const inner = (
    <>
      <div className="thumb" style={{ overflow: 'hidden' }}>
        <img
          src={item.img}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {item.label && <span className="kicker">{item.label}</span>}
      </div>
      <div className="body">
        <h3 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{item.title}</h3>
        <p>{item.dek}</p>
        <div className="meta">
          <span style={{ color: 'var(--pub-accent)', fontWeight: 700 }}>{item.kicker}</span>
          <span>·</span>
          <span>{item.meta}</span>
        </div>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="card" style={{ color: 'inherit', textDecoration: 'none' }}>
        {inner}
      </Link>
    );
  }

  return <article className="card">{inner}</article>;
}
