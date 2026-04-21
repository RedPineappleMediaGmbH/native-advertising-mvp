'use client';

import { useEffect } from 'react';

export function useCtaToast() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLElement>('[data-cta]');
      if (!btn) return;
      const label = btn.dataset.cta;
      const toast = document.createElement('div');
      toast.textContent = `Click-Out → easyJet.com (${label})`;
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#0f172a',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.02em',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity .2s, transform .2s',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      });
      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(-6px)';
      });
      setTimeout(() => { toast.style.opacity = '0'; }, 1600);
      setTimeout(() => toast.remove(), 2000);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
