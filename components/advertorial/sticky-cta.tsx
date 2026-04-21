'use client';

export default function StickyCta({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <div
      className={`sticky-cta${visible ? ' visible' : ''}`}
      role="complementary"
      aria-label="easyJet Call-to-Action"
    >
      <div className="sticky-cta-inner">
        <div className="prod-mini">
          <img
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&q=80"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="txt">
          <div className="l1">Anzeige · easyJet</div>
          <div className="l2">Sommerflüge ab 29 Euro — Frühbucherpreis sichern</div>
        </div>
        <button className="btn-primary" data-cta="sticky" onClick={e => e.preventDefault()}>
          Jetzt buchen →
        </button>
        <button className="close" onClick={onClose} aria-label="Schließen">×</button>
      </div>
    </div>
  );
}
