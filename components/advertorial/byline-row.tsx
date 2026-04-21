const ADV_META = {
  author: 'Anna Schreiber',
  authorRole: 'Reiseredakteurin · Paid Content',
  authorInitials: 'AS',
  published: '21. April 2026, 07:00',
};

export default function BylineRow() {
  return (
    <div className="byline-row">
      <div className="avatar" style={{ background: 'var(--pub-accent)' }}>{ADV_META.authorInitials}</div>
      <div>
        <div><strong>{ADV_META.author}</strong></div>
        <div style={{ fontSize: 12 }}>{ADV_META.authorRole} · {ADV_META.published}</div>
      </div>
      <div className="share"><i>↗</i><i>✉</i><i>♡</i></div>
    </div>
  );
}
