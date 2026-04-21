export interface Brand {
  id: string;
  name: string;
  logoMark: string;
  accent: string;
  accentDark: string;
  swatch: string;
  tone: string;
}

export const BRANDS: Brand[] = [
  {
    id: 'tagesblick',
    name: 'Tagesblick',
    logoMark: 'Tagesblick',
    accent: '#0b57d0',
    accentDark: '#0842a0',
    swatch: '#0b57d0',
    tone: 'Generic blue — t-online-ish',
  },
  {
    id: 'postland',
    name: 'Postland',
    logoMark: 'Postland',
    accent: '#b91c1c',
    accentDark: '#7f1515',
    swatch: '#b91c1c',
    tone: 'Editorial red',
  },
  {
    id: 'nordblatt',
    name: 'Nordblatt',
    logoMark: 'Nordblatt',
    accent: '#0f766e',
    accentDark: '#0b5851',
    swatch: '#0f766e',
    tone: 'Coastal teal',
  },
  {
    id: 'kurier24',
    name: 'Kurier24',
    logoMark: 'Kurier24',
    accent: '#c2410c',
    accentDark: '#8a2d08',
    swatch: '#c2410c',
    tone: 'Tabloid orange',
  },
];

export function applyBrand(brand: Brand) {
  const r = document.documentElement;
  r.style.setProperty('--pub-accent', brand.accent);
  r.style.setProperty('--pub-accent-dark', brand.accentDark);
  r.style.setProperty('--pub-name', `"${brand.name}"`);
}
