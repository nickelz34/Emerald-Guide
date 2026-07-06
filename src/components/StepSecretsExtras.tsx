import {
  getSecretsExtrasForStep,
  SECRETS_EXTRAS_SECTION_TITLE,
} from "../data/areaData";

interface StepSecretsExtrasProps {
  stepId: string;
  secrets?: string[];
}

/** Merged secrets, extras, and hidden-item notes for a walkthrough step. */
export function StepSecretsExtras({ stepId, secrets }: StepSecretsExtrasProps) {
  const items = getSecretsExtrasForStep(stepId, secrets);
  if (items.length === 0) return null;

  return (
    <div className="step-card__secrets">
      <strong>{SECRETS_EXTRAS_SECTION_TITLE}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}