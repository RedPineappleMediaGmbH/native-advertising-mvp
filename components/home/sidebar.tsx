const MOST_READ = [
  'EZB-Entscheid: Was die Zinspause für Sparer wirklich bedeutet',
  'Flughafen Frankfurt: Wie lange die Streiks dauern können',
  'Sommerdestinationen 2026: Diese Städte boomen jetzt',
  'Fünf Geheimtipps: Europas schönste Küstenorte abseits des Massentourismus',
  'Reiserecht: Was Ihnen bei Verspätungen wirklich zusteht',
];

export default function Sidebar() {
  return (
    <aside>
      <div className="side-block">
        <h4 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>Meistgelesen</h4>
        {MOST_READ.map((t, i) => (
          <div key={i} className="side-item">
            <div className="num" style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>{i + 1}</div>
            <div className="t">{t}</div>
          </div>
        ))}
      </div>

      <div className="side-block" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 120 }}>
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
            alt="Santorini"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6600', letterSpacing: '0.1em', marginBottom: 3 }}>ANZEIGE · EASYJET</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>Griechenland ab 34€</div>
          </div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Athen, Santorini, Rhodos — Direktflüge ab Berlin, Hamburg und München.</div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>easyJet · Paid Content</div>
        </div>
      </div>

      <div className="side-block">
        <h4 style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}>Wetter</h4>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 42, fontFamily: 'var(--font-source-serif), Georgia, serif', fontWeight: 700, color: 'var(--pub-accent)' }}>17°</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>
            <strong style={{ color: 'var(--ink)' }}>Berlin</strong><br />
            Wechselhaft, windig<br />
            <span style={{ fontSize: 11 }}>Aktualisiert 09:42</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
