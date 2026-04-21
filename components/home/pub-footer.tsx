import { Brand } from '@/components/brands';

const RESSORTS = ['Politik', 'Wirtschaft', 'Panorama', 'Sport', 'Reise'];
const SERVICE = ['Newsletter', 'App', 'RSS', 'Podcasts', 'Archiv'];
const COMPANY = ['Über uns', 'Karriere', 'Presse', 'Werben', 'Kontakt'];

export default function PubFooter({ brand }: { brand: Brand }) {
  return (
    <footer className="pub-footer">
      <div className="inner">
        <div>
          <div className="logo" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{brand.logoMark}.</div>
          <div style={{ fontSize: 13, color: '#9ba4af', lineHeight: 1.6 }}>
            Unabhängiger Journalismus seit 2011.<br />
            Redaktion Hamburg · Berlin · München
          </div>
        </div>
        <div>
          <h6>Ressorts</h6>
          {RESSORTS.map(x => <a key={x} href="#">{x}</a>)}
        </div>
        <div>
          <h6>Service</h6>
          {SERVICE.map(x => <a key={x} href="#">{x}</a>)}
        </div>
        <div>
          <h6>Unternehmen</h6>
          {COMPANY.map(x => <a key={x} href="#">{x}</a>)}
        </div>
        <div className="legal">
          <span>© 2026 {brand.logoMark}. Alle Rechte vorbehalten.</span>
          <span>Impressum · Datenschutz · AGB · Cookie-Einstellungen</span>
        </div>
      </div>
    </footer>
  );
}
