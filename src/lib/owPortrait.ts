/**
 * Overworld character portraits for tables, charts, and legends.
 * Always use south/forward frame 0 — never map facing or horizontal flip.
 * Map pins must keep using pinSpriteStyle() / entity spriteFrame as-is.
 */

/** Emerald OW sheet: frame 0 = facing the camera (south). */
export const OW_PORTRAIT_FRAME = 0;

export interface OwSpriteDims {
  spriteWidth?: number;
  spriteHeight?: number;
}

/** CSS vars for a forward-facing OW trainer/NPC crop (unscaled sheet units). */
export function owPortraitCssVars(
  dims: OwSpriteDims,
  scale = 1,
): Record<string, string | number> {
  return {
    ["--trainer-frame"]: OW_PORTRAIT_FRAME,
    ["--trainer-fw"]: (dims.spriteWidth ?? 16) * scale,
    ["--trainer-fh"]: (dims.spriteHeight ?? 32) * scale,
  };
}
