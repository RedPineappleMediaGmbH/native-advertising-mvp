'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BRANDS, Brand, applyBrand } from './brands';

const LS_KEY = 'nativeAd.state.v1';

interface BrandState {
  brandId: string;
  variant: 'A' | 'B';
  stickyCta: 'on' | 'off';
}

const DEFAULTS: BrandState = {
  brandId: 'tagesblick',
  variant: 'A',
  stickyCta: 'on',
};

interface BrandContextValue {
  state: BrandState;
  brand: Brand;
  setTweak: (key: keyof BrandState, val: string) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrandState>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setMounted(true);
  }, []);

  const brand = BRANDS.find(b => b.id === state.brandId) || BRANDS[0];

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
    applyBrand(brand);
  }, [state, brand, mounted]);

  const setTweak = (key: keyof BrandState, val: string) => {
    setState(s => ({ ...s, [key]: val }));
  };

  return (
    <BrandContext.Provider value={{ state, brand, setTweak }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
