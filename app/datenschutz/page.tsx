import type { Metadata } from 'next';
import InfoPage from '@/components/home/info-page';

export const metadata: Metadata = {
  title: 'Datenschutz — Tagesblick',
  description: 'Informationen zum Datenschutz bei Tagesblick.',
  alternates: { canonical: '/datenschutz' },
};

export default function DatenschutzPage() {
  return (
    <InfoPage
      eyebrow="Rechtliches"
      title="Datenschutz"
      intro="Diese Datenschutzhinweise beschreiben die grundlegende Verarbeitung personenbezogener Daten auf Tagesblick. Sie sollten vor Veröffentlichung mit den tatsächlich eingesetzten Diensten abgeglichen werden."
      sections={[
        {
          title: 'Verantwortliche Stelle',
          body: [
            'Verantwortliche Stelle: vor Veröffentlichung mit Betreiber, Anschrift und Kontaktangaben ergänzen.',
            'Kontakt für Datenschutzfragen: datenschutz@tagesblick.net oder kontakt@tagesblick.net.',
          ],
        },
        {
          title: 'Serverzugriffe und Betrieb',
          body: [
            'Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, etwa IP-Adresse, Zeitpunkt des Abrufs, Browserinformationen und angeforderte Seiten.',
            'Diese Verarbeitung dient der sicheren Bereitstellung, Fehleranalyse und Stabilität des Angebots.',
          ],
        },
        {
          title: 'Analyse und Performance',
          body: [
            'Tagesblick nutzt Vercel Analytics und Vercel Speed Insights zur Messung von Seitenaufrufen, Performance und technischen Kennzahlen.',
            'Vor Veröffentlichung sollte geprüft werden, ob zusätzliche Cookie- oder Einwilligungshinweise erforderlich sind.',
          ],
        },
        {
          title: 'Kontaktaufnahme',
          body: [
            'Wenn Sie Tagesblick per E-Mail kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage.',
            'Die Daten werden nicht länger aufbewahrt, als es für die Bearbeitung und gesetzliche Aufbewahrungspflichten erforderlich ist.',
          ],
        },
      ]}
    />
  );
}
