import type { Metadata } from 'next';
import InfoPage from '@/components/home/info-page';

export const metadata: Metadata = {
  title: 'Impressum — Tagesblick',
  description: 'Anbieterkennzeichnung und Kontaktangaben für Tagesblick.',
  alternates: { canonical: '/impressum' },
};

export default function ImpressumPage() {
  return (
    <InfoPage
      eyebrow="Rechtliches"
      title="Impressum"
      intro="Diese Seite enthält die Anbieterkennzeichnung für Tagesblick. Die endgültigen Betreiberangaben müssen vor Veröffentlichung durch die verantwortliche Person ergänzt und geprüft werden."
      sections={[
        {
          title: 'Anbieter',
          body: [
            'Tagesblick',
            'Betreiber, Rechtsform und ladungsfähige Anschrift: vor Veröffentlichung ergänzen.',
          ],
        },
        {
          title: 'Kontakt',
          body: [
            'E-Mail: kontakt@tagesblick.net',
            'Weitere Pflichtangaben nach § 5 DDG, soweit einschlägig, müssen vor Veröffentlichung ergänzt werden.',
          ],
        },
        {
          title: 'Redaktionell verantwortlich',
          body: [
            'Verantwortliche Person nach Presserecht bzw. Medienstaatsvertrag: vor Veröffentlichung ergänzen.',
          ],
        },
      ]}
    />
  );
}
