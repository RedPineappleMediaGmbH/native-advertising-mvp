import type { Metadata } from 'next';
import InfoPage from '@/components/home/info-page';

export const metadata: Metadata = {
  title: 'Werben — Tagesblick',
  description: 'Informationen zu Werbe- und Native-Advertising-Anfragen bei Tagesblick.',
  alternates: { canonical: '/werben' },
};

export default function WerbenPage() {
  return (
    <InfoPage
      eyebrow="Unternehmen"
      title="Werben auf Tagesblick"
      intro="Tagesblick bietet ein redaktionelles Umfeld für klar gekennzeichnete Werbeformate und Native-Advertising-Kampagnen."
      sections={[
        {
          title: 'Formate',
          body: [
            'Möglich sind gesponserte Artikel und markierte Anzeigenflächen, die sich in Gestaltung und Kennzeichnung an journalistischen Qualitätsstandards orientieren.',
            'Wir machen keine Reichweitenversprechen, solange Tagesblick als neues Angebot noch wächst.',
          ],
        },
        {
          title: 'Anfragen',
          body: [
            'Für Werbe- und Kooperationsanfragen nutzen Sie bitte die Kontaktseite. Beschreiben Sie kurz Marke, Ziel, gewünschtes Format und Zeitraum.',
            'Alle kommerziellen Inhalte müssen als Werbung erkennbar sein und dürfen redaktionelle Unabhängigkeit nicht vortäuschen.',
          ],
        },
      ]}
    />
  );
}
