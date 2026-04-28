'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/components/brands';

const NAV_ITEMS = ['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Kultur', 'Digital', 'Reise', 'Wissen'];

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
        </div>
      )}
    </>
  );
}
