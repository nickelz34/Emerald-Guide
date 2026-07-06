interface StepDetailsProps {
  details: string[];
}

export function StepDetails({ details }: StepDetailsProps) {
  if (details.length === 0) return null;

  return (
    <div className="step-card__objectives">
      <strong>What to do</strong>
      <ol>
        {details.map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
