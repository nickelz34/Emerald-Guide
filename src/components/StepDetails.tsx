interface StepDetailsProps {
  details: string[];
}

export function StepDetails({ details }: StepDetailsProps) {
  if (details.length === 0) return null;

  return (
    <div className="step-details">
      <strong className="step-details__title">What to do</strong>
      <ul className="step-details__list">
        {details.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
