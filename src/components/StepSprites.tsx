import { assetUrl } from "../lib/assetUrl";
import type { GuideSpriteItem } from "../types";

interface StepSpritesProps {
  sprites?: GuideSpriteItem[];
  /** When set, only render this sprite id (for page-layout per-item blocks). */
  onlySpriteId?: string;
}

export function StepSprites({ sprites, onlySpriteId }: StepSpritesProps) {
  const items = (sprites ?? []).filter((item) =>
    onlySpriteId ? item.id === onlySpriteId : true,
  );
  if (items.length === 0) return null;

  return (
    <div className="step-sprites" aria-label="Sprites">
      <ul className="step-sprites__list">
        {items.map((item) => (
          <li key={item.id} className="step-sprites__item">
            <span className={`step-sprites__frame step-sprites__frame--${item.kind}`}>
              <img src={assetUrl(item.src)} alt={item.label} draggable={false} />
            </span>
            <span className="step-sprites__label">{item.caption || item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
