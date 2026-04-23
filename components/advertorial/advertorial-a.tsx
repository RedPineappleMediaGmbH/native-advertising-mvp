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

export default function AdvertorialA({ brand, onBack }: { brand: Brand; onBack: () => void }) {
  return (
    <div className="adv variant-a">
      <BackBar brand={brand} onBack={onBack} category="Reise" showNote />
      <AdvBanner />
      <div className="adv-wrap">
        <div className="adv-meta">
          <span className="kicker">Reise · Anzeige</span>
          <span>·</span>
          <span>{ADV.readTime}</span>
        </div>
        <h1 className="adv-title" style={serif}>{ADV.title}</h1>
        <p className="lead" style={serif}>{ADV.lead}</p>
        <BylineRow />

        <p className="body" style={serif}>
          <strong>Wer in diesem Sommer fliegen will, ohne das Konto zu belasten, hat 2026 mehr Möglichkeiten denn je.</strong>{' '}
          Der europäische Kurzstreckenmarkt hat sich nach den Nachholeffekten der Nachpandemie-Jahre stabilisiert — und genau das bedeutet: Die Frühbucher-Preise sind zurück. Mit dem richtigen Buchungszeitpunkt und flexiblen Reisedaten lassen sich Direktflüge ab deutschen Airports für unter 50 Euro pro Strecke finden.
        </p>
        <p className="body" style={serif}>
          „Die beste Zeit, einen Sommerflug zu buchen, ist jetzt gerade", erklärt ein Sprecher von easyJet Deutschland. „Wer bis Ende April bucht, zahlt im Schnitt 28 Prozent weniger als Last-Minute-Buchende im Juli." Wir haben fünf Destinationen herausgesucht, die 2026 besonders attraktive Kombinationen aus Preis, Erlebnis und Direktanbindung bieten.
        </p>
        <blockquote style={serif}>
          „Wer bis Ende April bucht, zahlt im Schnitt 28 Prozent weniger als Last-Minute-Buchende im Juli."
        </blockquote>

        <TextLink cta="intro">Alle Sommerflüge ab 29 Euro bei easyJet</TextLink>

        <h2 className="section" style={serif}>Lissabon, Portugal</h2>
        <Img src={IMGS.lisbon} cap={IMGS.lisbonCap} />
        <p className="body" style={serif}>
          Pastéis de Nata, Fado und Miradouros — die Hauptstadt Portugals ist 2026 der meistgesuchte Städtetrip unter Dreißigjährigen. Die historischen Straßenbahnen, die steilen Gassen des Alfama-Viertels und die Lage am Atlantik machen Lissabon zu einem Ziel, das kaum enttäuscht. Besonders die Praça do Comércio direkt am Tejo, einer der beeindruckendsten Stadtplätze Europas, ist für viele Reisende ein Highlight.
        </p>
        <p className="body" style={serif}>
          Ab Berlin, Hamburg und München bietet easyJet Direktflüge nach Lissabon an. Wer flexibel zwischen Dienstag und Donnerstag reist, findet regelmäßig Verbindungen <strong>ab 34 Euro pro Strecke</strong>.
        </p>

        <h2 className="section" style={serif}>Athen, Griechenland</h2>
        <Img src={IMGS.athens} cap={IMGS.athensCap} />
        <p className="body" style={serif}>
          Die Akropolis bei Sonnenuntergang, Souvlaki in der Monastiraki-Gasse und das Meer in Reichweite — Athen ist mehr als Geschichte. Die Stadt hat sich in den letzten Jahren zu einem lebendigen Kulturzentrum mit exzellenter Gastronomie und aufblühender Kreativszene entwickelt. Das Viertel Psirri gilt inzwischen als eines der interessantesten Ausgehviertel Südeuropas.
        </p>
        <p className="body" style={serif}>
          Direktflüge ab deutschen Airports kosten bei frühzeitiger Buchung <strong>ab 39 Euro</strong>. Wer Athen mit einer Insel kombinieren möchte, findet günstige Fährverbindungen direkt vom Hafen Piräus.
        </p>

        <h2 className="section" style={serif}>Krakau, Polen</h2>
        <Img src={IMGS.krakow} cap={IMGS.krakowCap} />
        <p className="body" style={serif}>
          Europas günstigstes Städteziel zwei Jahre in Folge: Krakaus mittelalterlicher Hauptmarktplatz Rynek Główny, das jüdische Viertel Kazimierz mit seinen Galerien und Bars und die exzellente polnische Küche machen die Stadt zur idealen Kurzreise. Das Preisniveau für Restaurants und Unterkünfte liegt deutlich unter westeuropäischem Standard — ein Vorteil, den viele Reisende bewusst einkalkulieren.
        </p>
        <p className="body" style={serif}>
          Krakau ist mit <strong>ab 29 Euro</strong> die günstigste Destination auf dieser Liste — und eine der faszinierendsten. Direktflüge ab Berlin und Düsseldorf sind regelmäßig unter der 35-Euro-Marke verfügbar.
        </p>

        <h2 className="section" style={serif}>Porto, Portugal</h2>
        <Img src={IMGS.porto} cap={IMGS.portoCap} />
        <p className="body" style={serif}>
          Azulejo-Fassaden, Portwein direkt am Douro und Francesinha-Sandwiches: Porto ist reifer als Lissabon — und für viele Reisende genauso beeindruckend. Die Livraria Lello, die Ribeira-Uferpromenade und die Weinkeller von Vila Nova de Gaia sind nur der Anfang. Porto wurde in den vergangenen Jahren mehrfach zum besten europäischen Reiseziel gewählt.
        </p>
        <p className="body" style={serif}>
          Direktflüge <strong>ab 38 Euro</strong> verbinden deutsche Airports mit Porto. Besonders attraktiv: Wer Lissabon und Porto kombinieren möchte, kann beide Städte innerhalb einer Woche per Zug verbinden — die Fahrt dauert rund drei Stunden.
        </p>

        <h2 className="section" style={serif}>Valletta, Malta</h2>
        <Img src={IMGS.valletta} cap={IMGS.vallettaCap} />
        <p className="body" style={serif}>
          Die kleinste Hauptstadt Europas bietet das größte Kulturangebot pro Quadratkilometer: UNESCO-Welterbe, Barockarchitektur und kristallklares Mittelmeer. Malta ist ganzjährig mild — und damit auch als früher Sommertrip schon im Mai ideal. Valletta war 2018 Europäische Kulturhauptstadt; die Kunstgalerien und Museen aus dieser Zeit sind geblieben.
        </p>
        <p className="body" style={serif}>
          easyJet fliegt Malta <strong>ab 49 Euro</strong> direkt ab Frankfurt und Berlin an. Wer die Insel erkunden möchte, kombiniert am besten Valletta mit einem Tagesausflug nach Gozo oder in die Blaue Lagune auf Comino.
        </p>

        <h2 className="section" style={serif}>So buchen Sie clever</h2>
        <p className="body" style={serif}>
          Drei einfache Regeln machen beim Preis den Unterschied: <strong>Reisen unter der Woche</strong> — dienstags und mittwochs sind die günstigsten Abflugtage. <strong>Flexible Rückreisedaten</strong> — ein Tag Verschiebung kann 20 bis 40 Euro sparen. Und das <strong>frühzeitige Buchen von Zusatzleistungen</strong>: aufgegebenes Gepäck ist im Voraus immer günstiger als am Gate.
        </p>
        <p className="body" style={serif}>
          easyJet bietet 2026 auf allen fünf vorgestellten Routen Direktflüge ab mindestens einem deutschen Drehkreuz an. Über die App lassen sich Preisalarme einrichten — sobald eine Route unter einen festgelegten Schwellenwert fällt, gibt es eine Benachrichtigung.
        </p>

        <TextLink cta="final">Jetzt Sommerflüge ab 29 Euro bei easyJet suchen</TextLink>

        <Disclaimer />
      </div>
    </div>
  );
}
