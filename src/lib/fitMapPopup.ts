/** Placement modifiers for map pin hover/selection bubbles. */
const HINT_MODS = ["below", "start", "end"] as const;

function clearMods(el: HTMLElement, prefix: string) {
  for (const mod of HINT_MODS) el.classList.remove(`${prefix}${mod}`);
}

/**
 * Keep a pin popup (hover hint or selection tip) inside a clipping viewport.
 * Default placement is above + centered; flips below and/or left/right as needed.
 */
export function fitMapPopup(
  popup: HTMLElement,
  viewport: Element | null | undefined,
  prefix: "hoenn-map__pin-hint--" | "hoenn-map__pin-tip--" = "hoenn-map__pin-hint--",
) {
  clearMods(popup, prefix);

  const pad = 6;
  const vr = (viewport ?? document.documentElement).getBoundingClientRect();

  let rect = popup.getBoundingClientRect();
  if (rect.height > 0 && rect.top < vr.top + pad) {
    popup.classList.add(`${prefix}below`);
    rect = popup.getBoundingClientRect();
  }

  if (rect.width > 0 && rect.left < vr.left + pad) {
    popup.classList.add(`${prefix}start`);
  } else if (rect.width > 0 && rect.right > vr.right - pad) {
    popup.classList.add(`${prefix}end`);
  }
}

/** Fit hint + tip children of a map pin against the map viewport. */
export function fitPinPopups(pin: HTMLElement, viewport?: Element | null) {
  const hint = pin.querySelector<HTMLElement>(".hoenn-map__pin-hint");
  if (hint) fitMapPopup(hint, viewport, "hoenn-map__pin-hint--");
  const tip = pin.querySelector<HTMLElement>(".hoenn-map__pin-tip");
  if (tip) fitMapPopup(tip, viewport, "hoenn-map__pin-tip--");
}
