import { GuideHtml } from "../lib/guideHtml";

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
          <GuideHtml key={`${i}-${line.slice(0, 24)}`} value={line} as="li" />
        ))}
      </ol>
    </div>
  );
}
