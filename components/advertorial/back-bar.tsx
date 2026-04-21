'use client';

import { Brand } from '@/components/brands';

export default function BackBar({ brand, onBack }: { brand: Brand; onBack: () => void }) {
  return (
    <div className="back-bar">
      <div className="back-bar-inner">
        <a href="#" className="back" onClick={e => { e.preventDefault(); onBack(); }}>
          ← Zurück zu {brand.logoMark}
        </a>
        <span className="dot" />
        <span style={{ color: 'var(--muted)' }}>Reise</span>
        <span className="tab-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6" />
            <path d="M10 14L21 3" />
          </svg>
          Geöffnet in neuem Tab · Anzeige
        </span>
      </div>
    </div>
  );
}
