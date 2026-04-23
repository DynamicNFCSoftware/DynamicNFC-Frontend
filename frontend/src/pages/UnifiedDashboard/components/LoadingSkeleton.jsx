export function SkeletonKPIs() {
  return (
    <div className="ud-grid-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="ud-skeleton ud-skeleton-kpi" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="ud-skeleton ud-skeleton-card" />;
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="ud-card">
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="ud-skeleton ud-skeleton-row" />
        ))}
    </div>
  );
}
