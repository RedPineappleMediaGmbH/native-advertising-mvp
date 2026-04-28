import Link from 'next/link';
import { Brand } from '@/components/brands';

const RESSORTS = [
  { label: 'Politik', href: '/kategorie/politik' },
  { label: 'Wirtschaft', href: '/kategorie/wirtschaft' },
  { label: 'Panorama', href: '/kategorie/panorama' },
  { label: 'Sport', href: '/kategorie/sport' },
  { label: 'Reise', href: '/kategorie/reise' },
];

const COMPANY = [
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Werben', href: '/werben' },
  { label: 'Kontakt', href: '/kontakt' },
];

export default function PubFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="pub-footer">
      <div className="inner">
        <div>
          <div className="logo" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{brand.logoMark}.</div>
          <div style={{ fontSize: 13, color: '#9ba4af', lineHeight: 1.6 }}>
            Unabhängiger Journalismus.<br />
            Redaktion Hamburg · Berlin · München
          </div>
        </div>
        <div>
          <h6>Ressorts</h6>
          {RESSORTS.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <h6>Unternehmen</h6>
          {COMPANY.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <div className="legal">
          <span>© 2026 {brand.logoMark}. Alle Rechte vorbehalten.</span>
          <span className="legal-links">
            <Link href="/impressum">Impressum</Link>
            <span aria-hidden="true"> · </span>
            <Link href="/datenschutz">Datenschutz</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
