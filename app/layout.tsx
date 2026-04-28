import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { BrandProvider } from '@/components/brand-context';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  metadataBase: new URL('https://tagesblick.net'),
  title: 'Tagesblick — Nachrichten & Hintergründe',
  description: 'Nachrichten, Hintergründe und Reportagen aus Deutschland und der Welt.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    siteName: 'Tagesblick',
    locale: 'de_DE',
    type: 'website',
  },
  verification: {
    google: 'F_6fCHQn7NQQyX4n2jKFFW-0InujfD5-CxdK1Ra1bUI',
  },
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
          <SpeedInsights />
        </BrandProvider>
      </body>
    </html>
  );
}
