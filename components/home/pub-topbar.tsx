'use client';

import { Brand } from '@/components/brands';

const NAV_ITEMS = ['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Digital', 'Reise', 'Wissen'];
const SUBNAV = ['Schlagzeilen', 'Meistgelesen', 'Meinung', 'Live-Ticker', 'Videos', 'Podcasts'];
const TODAY = '21. April 2026';

export default function PubTopbar({ brand }: { brand: Brand }) {
  return (
    <>
      <div className="pub-topbar">
        <div className="pub-topbar-inner">
          <div className="pub-logo" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>
            {brand.logoMark}<span className="dot">.</span>
          </div>
          <div className="pub-date">Montag, {TODAY}</div>
          <nav className="pub-nav">
            {NAV_ITEMS.map((n, i) => (
              <a key={n} href="#" className={i === 6 ? 'active' : ''}>{n}</a>
            ))}
          </nav>
          <div className="pub-tools">
            <span className="pill">Abo</span>
            <span className="pill">Anmelden</span>
            <span>🔍</span>
          </div>
        </div>
      </div>
      <div className="subnav">
        <div className="subnav-inner">
          {SUBNAV.map((s, i) => (
            <span key={s} className={i === 0 ? 'current' : ''}>{s}</span>
          ))}
        </div>
      </div>
    </>
  );
}
