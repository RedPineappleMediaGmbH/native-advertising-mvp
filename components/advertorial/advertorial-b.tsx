'use client';

import { Brand } from '@/components/brands';
import BackBar from './back-bar';
import AdvBanner from './adv-banner';
import BylineRow from './byline-row';
import Disclaimer from './disclaimer';

const ADV = {
  title: 'Fünf europäische Städte, die Sie diesen Sommer für unter 50 Euro erreichen können',
  lead: 'Lissabon, Porto, Athen, Krakau, Valletta: Wohin Sie diesen Sommer fliegen sollten — und warum Frühbucher 2026 besonders gut wegkommen.',
  readTime: '5 Min. Lesezeit',
};

const IMGS = {
  airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85',
  lisbon: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=1200&q=85',
  lisbonCap: 'Die Praça do Comércio in Lissabon gilt als einer der schönsten Stadtplätze Europas. (Foto: Unsplash)',
  athens: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=85',
  athensCap: 'Athen verbindet antikes Erbe mit einer lebendigen modernen Gastro- und Kulturszene. (Foto: Unsplash)',
  krakow: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Krakow_-_Cloth_Hall_from_Basilica_-_1.jpg/1280px-Krakow_-_Cloth_Hall_from_Basilica_-_1.jpg',
  krakowCap: 'Der Rynek Główny in Krakau — einer der größten mittelalterlichen Marktplätze Europas. (Foto: Wikimedia Commons)',
  porto: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85',
  portoCap: 'Porto am Douro: Die Ribeira-Uferpromenade gehört zum UNESCO-Welterbe. (Foto: Unsplash)',
  valletta: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=85',
  vallettaCap: 'Valletta, die kleinste Hauptstadt Europas, bietet Barockarchitektur und klares Mittelmeer. (Foto: Unsplash)',
};

const GALLERY = [
  { img: IMGS.lisbon, city: 'Lissabon', desc: 'Fado, Pastéis de Nata und Atlantikküste. Direktflüge ab 34€.' },
  { img: IMGS.athens, city: 'Athen', desc: 'Akropolis, lebendige Kreativszene, Mittelmeer in Reichweite. Ab 39€.' },
  { img: IMGS.krakow, city: 'Krakau', desc: 'Mittelalterliches Flair, jüdisches Viertel Kazimierz. Ab 29€.' },
];

function Img({ src, cap }: { src: string; cap: string }) {
  return (
    <figure style={{ margin: '28px 0 24px' }}>
      <img src={src} alt={cap} style={{ width: '100%', display: 'block', borderRadius: 3 }} />
      <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{cap}</figcaption>
    </figure>
  );
}

function TextLink({ children, cta }: { children: React.ReactNode; cta: string }) {
  return (
    <p style={{ margin: '18px 0' }}>
      <a
        href="#"
        data-cta={cta}
        onClick={e => e.preventDefault()}
        style={{ color: 'var(--pub-accent)', fontWeight: 600, fontSize: 15, textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    </p>
  );
}

const serif = { fontFamily: 'var(--font-source-serif), Georgia, serif' } as const;

export default function AdvertorialB({ brand, onBack }: { brand: Brand; onBack: () => void }) {
  return (
    <div className="adv variant-b">
      <BackBar brand={brand} onBack={onBack} />
      <AdvBanner />
      <div className="adv-wrap">
        <div className="masthead">
          <div>
            <div className="adv-meta" style={{ marginTop: 0 }}>
              <span className="kicker">Reise · Anzeige</span>
              <span>·</span>
              <span>{ADV.readTime}</span>
            </div>
            <h1 className="adv-title" style={serif}>{ADV.title}</h1>
            <p className="lead" style={serif}>{ADV.lead}</p>
            <BylineRow />
          </div>
          <div className="hero-media">
            <img src={IMGS.airport} alt="Flughafen" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>

        <div className="body-wrap">
          <p className="body" style={serif}>
            <strong>Wer in diesem Sommer fliegen will, ohne das Konto zu belasten, hat 2026 mehr Möglichkeiten denn je.</strong>{' '}
            Der europäische Kurzstreckenmarkt hat sich stabilisiert — und genau das bedeutet: Die Frühbucher-Preise sind zurück. Mit dem richtigen Buchungszeitpunkt lassen sich Direktflüge für unter 50 Euro pro Strecke finden.
          </p>
          <p className="body" style={serif}>
            „Wer bis Ende April bucht, zahlt im Schnitt 28 Prozent weniger als Last-Minute-Buchende im Juli", erklärt ein Sprecher von easyJet Deutschland. Wir haben fünf Destinationen herausgesucht, die 2026 besonders attraktive Kombinationen aus Preis, Erlebnis und Direktanbindung bieten.
          </p>
          <blockquote style={serif}>
            „Wer bis Ende April bucht, zahlt im Schnitt 28 Prozent weniger als Last-Minute-Buchende im Juli."
          </blockquote>
          <TextLink cta="intro">Alle Sommerflüge ab 29 Euro bei easyJet</TextLink>

          <h2 className="section" style={serif}>Lissabon — ab 34 Euro</h2>
          <Img src={IMGS.lisbon} cap={IMGS.lisbonCap} />
          <p className="body" style={serif}>Pastéis de Nata, Fado und Miradouros — Lissabon ist 2026 der meistgesuchte Städtetrip. Die Praça do Comércio am Tejo, die steilen Gassen des Alfama-Viertels und die Atlantiklage machen die Stadt zu einem Ziel, das kaum enttäuscht. Direktflüge ab 34 Euro.</p>

          <h2 className="section" style={serif}>Athen — ab 39 Euro</h2>
          <Img src={IMGS.athens} cap={IMGS.athensCap} />
          <p className="body" style={serif}>Die Akropolis bei Sonnenuntergang, Souvlaki in der Monastiraki-Gasse und das Meer in Reichweite. Athen hat sich zur lebendigen Kulturmetropole entwickelt — mit exzellenter Gastronomie und aufblühender Kreativszene. Ab 39 Euro direkt ab Deutschland.</p>

          <h2 className="section" style={serif}>Krakau — ab 29 Euro</h2>
          <Img src={IMGS.krakow} cap={IMGS.krakowCap} />
          <p className="body" style={serif}>Europas günstigstes Städteziel zwei Jahre in Folge: mittelalterlicher Hauptmarktplatz, jüdisches Viertel Kazimierz, exzellente Küche — bei einem Preisniveau deutlich unter westeuropäischem Standard. Direktflüge ab 29 Euro ab Berlin und Düsseldorf.</p>

          <h2 className="section" style={serif}>Porto — ab 38 Euro</h2>
          <Img src={IMGS.porto} cap={IMGS.portoCap} />
          <p className="body" style={serif}>Azulejo-Fassaden, Portwein direkt am Douro, mehrfach gewähltes bestes europäisches Reiseziel. Porto lässt sich ideal mit Lissabon kombinieren — drei Stunden Zugfahrt verbinden beide Städte. Direktflüge ab 38 Euro.</p>

          <h2 className="section" style={serif}>Valletta — ab 49 Euro</h2>
          <Img src={IMGS.valletta} cap={IMGS.vallettaCap} />
          <p className="body" style={serif}>Die kleinste Hauptstadt Europas: UNESCO-Welterbe, Barockarchitektur, kristallklares Mittelmeer. Malta ist ganzjährig mild — ideal auch für einen frühen Sommertrip im Mai. Direktflüge ab Frankfurt und Berlin ab 49 Euro.</p>

          <h2 className="section" style={serif}>So buchen Sie clever</h2>
          <p className="body" style={serif}>Dienstags und mittwochs sind die günstigsten Abflugtage. Flexible Rückreisedaten sparen bis zu 40 Euro. Gepäck immer im Voraus buchen — am Gate ist es teurer. Die easyJet-App bietet Preisalarme für alle fünf Routen.</p>
          <TextLink cta="final">Jetzt Sommerflüge ab 29 Euro bei easyJet suchen</TextLink>
          <Disclaimer />
        </div>
      </div>

      {/* Gallery band outside body-wrap for full width */}
      <div className="gallery-band">
        <div className="inner">
          <h3 style={serif}>Drei Highlights auf einen Blick</h3>
          <p className="sub">Die beliebtesten Destinationen für Frühbucher 2026</p>
          <div className="grid3">
            {GALLERY.map(({ img, city, desc }) => (
              <div key={city} className="tile">
                <div className="img">
                  <img src={img} alt={city} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div className="t">
                  <h5>{city}</h5>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
