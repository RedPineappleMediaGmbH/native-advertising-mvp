import type { Metadata } from 'next';
import InfoPage from '@/components/home/info-page';

export const metadata: Metadata = {
  title: 'Kontakt — Tagesblick',
  description: 'Kontaktmöglichkeiten für Tagesblick.',
  alternates: { canonical: '/kontakt' },
};

export default function KontaktPage() {
  return (
    <InfoPage
      eyebrow="Unternehmen"
      title="Kontakt"
      intro="Für Hinweise, Fragen zu Inhalten oder Werbeanfragen erreichen Sie Tagesblick über die folgenden Kontaktwege."
      sections={[
        {
          title: 'Redaktion',
          body: [
            'Hinweise, Korrekturen und Themenvorschläge können an redaktion@tagesblick.net gesendet werden.',
            'Bitte nennen Sie bei Korrekturhinweisen den betroffenen Artikel und beschreiben Sie den Sachverhalt so konkret wie möglich.',
          ],
        },
        {
          title: 'Werbung und Kooperationen',
          body: [
            'Anfragen zu Anzeigen, gesponserten Beiträgen und Kooperationen können an werbung@tagesblick.net gesendet werden.',
            'Falls noch keine passende Zuständigkeit erkennbar ist, verwenden Sie kontakt@tagesblick.net.',
          ],
        },
      ]}
    />
  );
}
