type Props = {
  warnings?: string[];
};

export default function WarningsPanel({ warnings }: Props) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="warnings">
      <h4>Warnings</h4>
      <ul>
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}
