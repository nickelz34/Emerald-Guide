import { assetUrl } from "../lib/assetUrl";
import type { MapPoint } from "../data/mapPoints";
import { getCollectibleSprite, isCollectibleSpriteCategory } from "../data/itemSpritesGenerated";
import { getGymBadgeSprite } from "../data/gymBadgesGenerated";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

export function isTrainerPoint(p: MapPoint): p is TrainerPoint {
  return p.category === "trainer" && "spriteSheet" in p;
}

interface MapPinVisualProps {
  point: MapPoint;
}

/** Pin glyph: trainer overworld sprite, gym badge, collectible sprite, or colored dot fallback. */
export function MapPinVisual({ point }: MapPinVisualProps) {
  if (isTrainerPoint(point)) {
    return (
      <span className="hoenn-map__trainer-frame" aria-hidden="true">
        <img
          src={assetUrl(point.spriteSheet)}
          alt=""
          className="hoenn-map__trainer-sprite"
          draggable={false}
        />
      </span>
    );
  }

  if (point.category === "gym") {
    const badge = getGymBadgeSprite(point.id);
    if (badge) {
      return (
        <span className="hoenn-map__badge-frame" aria-hidden="true">
          <img
            src={assetUrl(badge.spriteSheet)}
            alt=""
            className="hoenn-map__badge-sprite"
            draggable={false}
          />
        </span>
      );
    }
  }

  if (isCollectibleSpriteCategory(point.category)) {
    const sprite = getCollectibleSprite(point.category);
    if (sprite) {
      return (
        <span className="hoenn-map__item-frame" aria-hidden="true">
          <img
            src={assetUrl(sprite.spriteSheet)}
            alt=""
            className="hoenn-map__item-sprite"
            draggable={false}
          />
        </span>
      );
    }
  }

  return <span className="hoenn-map__pin-dot" />;
}

export function pinSpriteStyle(point: MapPoint): Record<string, string | number> {
  if (isTrainerPoint(point)) {
    return {
      ["--trainer-frame"]: point.spriteFrame,
      ["--trainer-fw"]: point.spriteWidth,
      ["--trainer-fh"]: point.spriteHeight,
    };
  }
  if (point.category === "gym") {
    const badge = getGymBadgeSprite(point.id);
    if (badge) {
      return {
        ["--badge-frame"]: badge.spriteFrame,
        ["--badge-fw"]: badge.spriteWidth,
        ["--badge-fh"]: badge.spriteHeight,
      };
    }
  }
  if (isCollectibleSpriteCategory(point.category)) {
    const sprite = getCollectibleSprite(point.category);
    if (sprite) {
      return {
        ["--item-fw"]: sprite.spriteWidth,
        ["--item-fh"]: sprite.spriteHeight,
      };
    }
  }
  return {};
}
