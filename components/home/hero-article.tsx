export default function HeroArticle() {
  return (
    <article className="hero" style={{ gridColumn: '1 / -1' }}>
      <div className="hero-img">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85"
          alt="Paris"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span className="kicker">Politik</span>
      </div>
      <div className="hero-body">
        <div style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
          Leitartikel
        </div>
        <h1 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>
          Koalition ringt um Haushalt 2027 — diese drei Punkte entscheiden über den Kompromiss
        </h1>
        <p>
          Hinter verschlossenen Türen verhandeln die Fraktionen seit Tagen. Ein Rückzug aus den geplanten Investitionen würde den politischen Preis für die Ampel-Nachfolge deutlich erhöhen.
        </p>
        <div className="byline">Von Katharina Weinmann · vor 26 Minuten · 7 Min. Lesezeit</div>
      </div>
    </article>
  );
}
