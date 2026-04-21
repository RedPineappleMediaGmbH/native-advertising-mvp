'use client';

import { useState } from 'react';
import { useBrand } from './brand-context';
import { BRANDS } from './brands';

export default function TweaksPanel() {
  const { state, setTweak } = useBrand();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', right: open ? 328 : 20, bottom: 20, zIndex: 101,
          width: 36, height: 36, borderRadius: '50%',
          background: '#0f172a', color: '#e2e8f0', border: 0,
          fontSize: 16, display: 'grid', placeItems: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          transition: 'right .2s ease',
          cursor: 'pointer',
        }}
        title="Tweaks"
        aria-label="Open tweaks panel"
      >
        ⚙
      </button>

      {open && (
        <div id="tweaks">
          <header>
            <b>Tweaks</b>
            <button onClick={() => setOpen(false)} aria-label="Close">×</button>
          </header>

          <div className="group">
            <label>Publisher brand</label>
            <div className="swatches">
              {BRANDS.map(b => (
                <div
                  key={b.id}
                  className={`sw${state.brandId === b.id ? ' active' : ''}`}
                  style={{ background: b.swatch }}
                  title={`${b.name} — ${b.tone}`}
                  onClick={() => setTweak('brandId', b.id)}
                />
              ))}
            </div>
          </div>

          <div className="group">
            <label>Advertorial layout</label>
            <div className="row">
              {(['A', 'B'] as const).map(v => (
                <button
                  key={v}
                  className={`chip${state.variant === v ? ' active' : ''}`}
                  onClick={() => setTweak('variant', v)}
                >
                  {v === 'A' ? 'A · Classic' : 'B · Magazine'}
                </button>
              ))}
            </div>
          </div>

          <div className="group">
            <label>Sticky CTA</label>
            <div className="row">
              {(['on', 'off'] as const).map(c => (
                <button
                  key={c}
                  className={`chip${state.stickyCta === c ? ' active' : ''}`}
                  onClick={() => setTweak('stickyCta', c)}
                >
                  {c === 'on' ? 'On' : 'Off'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
