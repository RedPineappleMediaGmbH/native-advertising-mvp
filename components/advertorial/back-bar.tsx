'use client';

import Link from 'next/link';
import { Brand } from '@/components/brands';

interface Props {
  brand: Brand;
  category: string;
  onBack?: () => void;
  href?: string;
  showNote?: boolean;
}

export default function BackBar({ brand, category, onBack, href = '/', showNote = false }: Props) {
  const label = <>← Zurück zu {brand.logoMark}</>;

  return (
    <div className="back-bar">
      <div className="back-bar-inner">
        {onBack ? (
          <a href="#" className="back" onClick={e => { e.preventDefault(); onBack(); }}>
            {label}
          </a>
        ) : (
          <Link href={href} className="back">{label}</Link>
        )}
        <span className="dot" />
        <span style={{ color: 'var(--muted)' }}>{category}</span>
        {showNote && (
          <span className="tab-note mobile-hide">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
            Geöffnet in neuem Tab · Anzeige
          </span>
        )}
      </div>
    </div>
  );
}
