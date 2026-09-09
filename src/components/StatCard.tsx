interface StatCardProps {
  label: string;
  value: string;
  hint: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="muted">{label}</p>
      <strong>{value}</strong>
      <span>{hint}</span>
    </article>
  );
}