import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { BrandProvider } from '@/components/brand-context';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-source-serif',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Tagesblick — Nachrichten & Hintergründe',
  description: 'Native advertising MVP — fictional German news publisher',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <BrandProvider>
          {children}
          <Analytics />
        </BrandProvider>
      </body>
    </html>
  );
}
