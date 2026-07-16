import {
  getSecretsExtrasForStep,
  SECRETS_EXTRAS_SECTION_TITLE,
  type RoutePickup,
} from "../data/areaData";
import { GuideHtml } from "../lib/guideHtml";

interface StepSecretsExtrasProps {
  stepId: string;
  secrets?: string[];
}

/** Merged secrets, extras, and hidden-item notes for a walkthrough step. */
export function StepSecretsExtras({ stepId, secrets }: StepSecretsExtrasProps) {
  const items = getSecretsExtrasForStep(stepId, secrets);
  return <SecretsExtrasBlock items={items} />;
}

/** Shared bubble used in walkthrough steps and the Hoenn route guide modal. */
export function SecretsExtrasBlock({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="step-card__secrets">
      <strong>{SECRETS_EXTRAS_SECTION_TITLE}</strong>
      <ul>
        {items.map((item, index) => (
          <GuideHtml key={`${index}-${item.slice(0, 24)}`} value={item} as="li" />
        ))}
      </ul>
    </div>
  );
}

/** Visible items and berries on a route — same callout bubble pattern as walkthrough sections. */
export function ItemsBerriesBlock({ items }: { items: RoutePickup[] }) {
  if (items.length === 0) return null;

  return (
    <div className="step-card__items">
      <strong>Items &amp; Berries</strong>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span className="step-card__item-name">{item.name}</span>
            {item.desc && <span className="step-card__item-desc">{item.desc}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}