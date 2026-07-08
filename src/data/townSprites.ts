/** Town / city map pin sprite (red teardrop with gold cap). */
export const TOWN_PIN_SPRITE = {
  spriteSheet: "sprites/map/town_pin.png",
  spriteWidth: 13,
  spriteHeight: 17,
  spriteFrame: 0,
} as const;

export function getTownPinSprite() {
  return TOWN_PIN_SPRITE;
}
