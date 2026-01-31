type Props = {
  label: string;
  value?: number | null;
};

export default function ConfidenceBadge({ label, value }: Props) {
  const normalized = typeof value === 'number' ? Math.max(0, Math.min(1, value)) : null;
  const percentage = normalized !== null ? Math.round(normalized * 100) : null;
  const tone =
    normalized === null ? 'muted' : normalized >= 0.8 ? 'good' : normalized >= 0.6 ? 'warn' : 'risk';

  return (
    <span className={`confidence confidence--${tone}`}>
      {label}: {percentage !== null ? `${percentage}%` : 'N/A'}
    </span>
  );
}
