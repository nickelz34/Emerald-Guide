import { assetUrl } from "../lib/assetUrl";
import type { MapPoint } from "../data/mapPoints";
import { hasOwSprite } from "../data/areaMapCutsceneEntities";
import { getCollectibleSprite, isCollectibleSpriteCategory } from "../data/itemSpritesGenerated";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { getGymBadgeSprite } from "../data/gymBadgesGenerated";
import { getTownPinSprite } from "../data/townSprites";
import type { TrainerPoint } from "../data/mapTrainersGenerated";

export function isTrainerPoint(p: MapPoint): p is TrainerPoint {
  return p.category === "trainer" && "spriteSheet" in p && typeof p.spriteSheet === "string";
}

interface MapPinVisualProps {
  point: MapPoint;
}

/** Pin glyph: trainer/NPC overworld sprite, gym badge, collectible sprite, or colored dot fallback. */
export function MapPinVisual({ point }: MapPinVisualProps) {
  if (isTrainerPoint(point) || hasOwSprite(point)) {
    return (
      <span className="hoenn-map__trainer-frame" aria-hidden="true">
        <img
          src={assetUrl(point.spriteSheet!)}
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

  if (point.category === "town") {
    const town = getTownPinSprite();
    return (
      <span className="hoenn-map__town-frame" aria-hidden="true">
        <img
          src={assetUrl(town.spriteSheet)}
          alt=""
          className="hoenn-map__town-sprite"
          draggable={false}
        />
      </span>
    );
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

  if (point.pinCode) {
    return (
      <span className="hoenn-map__pin-code" aria-hidden="true">
        {point.pinCode}
      </span>
    );
  }

  return <span className="hoenn-map__pin-dot" />;
}

export function pinSpriteStyle(point: MapPoint): Record<string, string | number> {
  if (isTrainerPoint(point) || hasOwSprite(point)) {
    return {
      ["--trainer-frame"]: point.spriteFrame ?? 0,
      ["--trainer-fw"]: point.spriteWidth ?? 16,
      ["--trainer-fh"]: point.spriteHeight ?? 32,
      ...(point.spriteFlipX ? { ["--trainer-flip"]: -1 } : {}),
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
  if (point.category === "town") {
    const town = getTownPinSprite();
    return {
      ["--town-fw"]: town.spriteWidth,
      ["--town-fh"]: town.spriteHeight,
    };
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

const SELECTION_ICON_SCALE = 2;

/** True when the on-map selection callout should show an in-game bag icon. */
export function isItemSelectionPoint(point: MapPoint): boolean {
  return point.category === "item" || point.category === "hidden";
}

/** In-game bag icon for item / hidden selection callouts only. */
export function MapSelectionVisual({ point }: MapPinVisualProps) {
  if (!isItemSelectionPoint(point)) return null;

  const icon = getItemBagIcon(point.name);
  if (!icon) return null;

  const w = icon.spriteWidth * SELECTION_ICON_SCALE;
  const h = icon.spriteHeight * SELECTION_ICON_SCALE;

  return (
    <span
      className="hoenn-map__selection-icon hoenn-map__selection-icon--item"
      style={{ width: w, height: h }}
      aria-hidden="true"
    >
      <img
        src={assetUrl(icon.spriteSheet)}
        alt=""
        className="hoenn-map__selection-item-icon"
        width={w}
        height={h}
        draggable={false}
      />
    </span>
  );
}
