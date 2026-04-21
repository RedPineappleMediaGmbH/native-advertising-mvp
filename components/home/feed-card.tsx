'use client';

export interface FeedItem {
  kicker: string;
  title: string;
  dek: string;
  meta: string;
  img: string;
  label?: string;
  sponsored?: boolean;
  partner?: string;
}

export const FEED: FeedItem[] = [
  {
    kicker: 'Wirtschaft',
    title: 'EZB hält an vorsichtiger Zinspolitik fest — Lagarde dämpft Erwartungen',
    dek: 'Die Notenbank belässt den Leitzins unverändert und verweist auf hartnäckige Kerninflation.',
    meta: 'vor 12 Min.',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    label: 'Analyse',
  },
  {
    kicker: 'Panorama',
    title: 'Warnstreik legt Frankfurter Flughafen zeitweise lahm',
    dek: 'Tausende Passagiere strandeten am Morgen — Gewerkschaft fordert höhere Löhne für Bodendienste.',
    meta: 'vor 34 Min.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    label: 'Eilmeldung',
  },
  {
    sponsored: true,
    partner: 'easyJet',
    kicker: 'Anzeige',
    title: 'Fünf europäische Städte, die Sie diesen Sommer für unter 50€ erreichen können',
    dek: 'Lissabon, Porto, Athen, Krakau, Valletta — wir zeigen, welche Destinationen 2026 das beste Preis-Erlebnis bieten.',
    meta: 'Präsentiert von easyJet',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
  {
    kicker: 'Digital',
    title: 'Neuer EU-Standard: USB-C wird Pflicht auch für Laptops ab 2027',
    dek: 'Brüssel erweitert die Vereinheitlichung — was Hersteller und Verbraucher jetzt wissen müssen.',
    meta: 'vor 1 Std.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },
  {
    kicker: 'Sport',
    title: 'Bundesliga: Favoritendämmerung am 30. Spieltag',
    dek: 'Drei Topspiele am Wochenende — wir zeigen die taktischen Entscheidungen, auf die es ankommt.',
    meta: 'vor 2 Std.',
    img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  },
  {
    kicker: 'Reise',
    title: 'Die schönsten Küstenorte Europas für den Sommer 2026',
    dek: 'Von der Algarve bis zur kroatischen Adria — unser Reiseredakteur hat die verborgenen Perlen.',
    meta: 'vor 3 Std.',
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  },
];

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
  return (
    <article className="card">
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
    </article>
  );
}
