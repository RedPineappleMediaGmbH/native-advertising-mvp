import type { Metadata } from 'next';
import InfoPage from '@/components/home/info-page';

export const metadata: Metadata = {
  title: 'Über uns — Tagesblick',
  description: 'Wer hinter Tagesblick steht und wie das redaktionelle Projekt arbeitet.',
  alternates: { canonical: '/ueber-uns' },
};

export default function UeberUnsPage() {
  return (
    <InfoPage
      eyebrow="Unternehmen"
      title="Über Tagesblick"
      intro="Tagesblick ist ein junges digitales Nachrichtenangebot mit Fokus auf verständliche Einordnung, klare Sprache und sorgfältig kuratierte Themen."
      sections={[
        {
          title: 'Was wir machen',
          body: [
            'Wir veröffentlichen Nachrichten, Hintergründe und gesponserte Inhalte in einem redaktionellen Umfeld, das transparent zwischen Redaktion und Werbung unterscheidet.',
            'Der Schwerpunkt liegt auf kompakten Beiträgen aus Politik, Wirtschaft, Panorama, Sport, Reise, Kultur, Digitalem und Wissen.',
          ],
        },
        {
          title: 'Wie wir arbeiten',
          body: [
            'Tagesblick befindet sich im Aufbau. Deshalb halten wir diese Seite bewusst knapp und verzichten auf Angaben, die noch nicht belastbar sind.',
            'Werbliche Beiträge werden als Anzeige gekennzeichnet. Redaktionelle Inhalte und kommerzielle Inhalte sollen für Leserinnen und Leser klar unterscheidbar bleiben.',
            'Tagesblick nutzt KI-gestützte Werkzeuge zur Themenrecherche, Texterstellung, Bildgenerierung und redaktionellen Vorbereitung. Inhalte werden vor Veröffentlichung redaktionell geprüft.',
          ],
        },
      ]}
    />
  );
}
