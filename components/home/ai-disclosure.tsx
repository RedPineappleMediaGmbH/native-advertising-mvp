type AiDisclosureProps = {
  className?: string;
};

export default function AiDisclosure({ className }: AiDisclosureProps) {
  return (
    <aside className={['ai-disclosure', className].filter(Boolean).join(' ')}>
      <strong>Transparenzhinweis:</strong>{' '}
      Dieser Artikel wurde mit Unterstützung künstlicher Intelligenz erstellt und redaktionell geprüft.
    </aside>
  );
}
