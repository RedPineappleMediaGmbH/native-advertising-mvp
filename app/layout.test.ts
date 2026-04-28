import { expect, test } from 'vitest';
import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  Source_Serif_4: () => ({ variable: '--font-source-serif' }),
}));

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}));

import { metadata } from './layout';

test('uses Tagesblick favicon assets instead of a generic platform icon', () => {
  expect(metadata.icons).toEqual({
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  });
});
