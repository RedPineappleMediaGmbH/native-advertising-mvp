'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/components/brands';

const NAV_ITEMS = ['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Digital', 'Reise', 'Wissen'];
const SUBNAV = ['Schlagzeilen', 'Meistgelesen', 'Meinung', 'Live-Ticker', 'Videos', 'Podcasts'];

function todayDE(): string {
  return new Date().toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function PubTopbar({ brand }: { brand: Brand }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeCategory = pathname.startsWith('/kategorie/')
    ? pathname.split('/')[2]
    : null;

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className="pub-topbar">
        <div className="pub-topbar-inner">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <span /><span /><span />
          </button>

          <Link href="/" className="pub-logo" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif', textDecoration: 'none', color: 'inherit' }}>
            {brand.logoMark}<span className="dot">.</span>
          </Link>
          <div className="pub-date mobile-hide" suppressHydrationWarning>{todayDE()}</div>
          <nav className="pub-nav mobile-hide">
            {NAV_ITEMS.map(n => (
              <Link key={n} href={`/kategorie/${n.toLowerCase()}`} className={activeCategory === n.toLowerCase() ? 'active' : ''}>{n}</Link>
            ))}
          </nav>
          <div className="pub-tools">
            <span className="pill mobile-hide">Abo</span>
            <span className="pill mobile-hide">Anmelden</span>
            <span className="mobile-hide">🔍</span>
          </div>
        </div>
      </div>

      {/* Subnav — desktop only */}
      <div className="subnav mobile-hide">
        <div className="subnav-inner">
          {SUBNAV.map((s, i) => (
            <span key={s} className={i === 0 ? 'current' : ''}>{s}</span>
          ))}
        </div>
      </div>

      {/* Mobile full-screen nav drawer */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="mobile-menu-header">
            <Link href="/" className="mobile-menu-logo" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif', textDecoration: 'none', color: 'inherit' }} onClick={() => setMenuOpen(false)}>
              {brand.logoMark}<span className="dot">.</span>
            </Link>
            <button
              className="mobile-menu-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Menü schließen"
            >
              ✕
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {NAV_ITEMS.map(n => (
              <Link key={n} href={`/kategorie/${n.toLowerCase()}`} className={activeCategory === n.toLowerCase() ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                {n}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-sub">
            {SUBNAV.map((s, i) => (
              <a key={s} href="#" className={i === 0 ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                {s}
              </a>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Abo abschließen</button>
            <button style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 6, padding: '12px 20px', fontWeight: 600, fontSize: 14, background: '#fff' }}>Anmelden</button>
          </div>
        </div>
      )}
    </>
  );
}
