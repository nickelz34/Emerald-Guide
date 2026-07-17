/**
 * Feebas fishing-spot RNG — mirrors pokeemerald wild_encounter.c
 * (FeebasSeedRng / FeebasRandom / CheckFeebas spot assignment).
 */

import {
  FEEBAS_FISHING_SECTIONS,
  FEEBAS_FISHING_SPOTS,
  type FeebasFishingSpot,
} from "./feebasFishingSpots";

const NUM_FISHING_SPOTS = 447;
const NUM_FEEBAS_SPOTS = 6;
const MAP_WIDTH_TILES = 40;

/** ISO_RANDOMIZE2 from pokeemerald include/random.h — used by FeebasRandom. */
function isoRandomize2(val: number): number {
  return (Math.imul(1103515245, val >>> 0) + 12345) >>> 0;
}

/**
 * Parse a Dewford trend `.rand` seed from hex (`4A7C`, `0x4A7C`) or decimal.
 * Game stores it as u16 — values are masked to 0–65535.
 */
export function parseFeebasSeed(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;

  let n: number | null = null;
  if (/^0x[0-9a-f]+$/i.test(raw)) {
    n = Number.parseInt(raw.slice(2), 16);
  } else if (/^[0-9a-f]+h$/i.test(raw)) {
    n = Number.parseInt(raw.slice(0, -1), 16);
  } else if (/^[0-9a-f]+$/i.test(raw) && /[a-f]/i.test(raw)) {
    n = Number.parseInt(raw, 16);
  } else if (/^\d+$/.test(raw)) {
    n = Number.parseInt(raw, 10);
  }

  if (n == null || !Number.isFinite(n) || n < 0) return null;
  return n & 0xffff;
}

export function formatFeebasSeed(seed: number): string {
  return `0x${(seed & 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
}

/**
 * Returns the six fishing-spot IDs (1–447) active for a Dewford trend `.rand` seed.
 * Duplicates are possible (same as the game), so unique tile count may be &lt; 6.
 */
export function feebasSpotIdsForSeed(seed: number): number[] {
  let rng = (seed & 0xffff) >>> 0;
  const next = (): number => {
    rng = isoRandomize2(rng);
    return (rng >>> 16) & 0xffff;
  };

  const spots: number[] = [];
  while (spots.length < NUM_FEEBAS_SPOTS) {
    let id = next() % NUM_FISHING_SPOTS;
    if (id === 0) id = NUM_FISHING_SPOTS;
    // Skip inaccessible spots 1–3 (same condition as CheckFeebas).
    if (id < 1 || id >= 4) spots.push(id);
  }
  return spots;
}

export function feebasSpotsForSeed(seed: number): FeebasFishingSpot[] {
  const ids = feebasSpotIdsForSeed(seed);
  return ids
    .map((id) => FEEBAS_FISHING_SPOTS.find((s) => s.id === id))
    .filter((s): s is FeebasFishingSpot => Boolean(s));
}

/** Local % coordinates (tile center) inside a Feebas section map image. */
export function feebasSpotLocalPercent(spot: FeebasFishingSpot): { x: number; y: number } {
  const sec = FEEBAS_FISHING_SECTIONS[spot.section];
  const tileH = sec.ymax - sec.ymin + 1;
  const localY = spot.y - sec.ymin;
  return {
    x: +(((spot.x + 0.5) / MAP_WIDTH_TILES) * 100).toFixed(4),
    y: +(((localY + 0.5) / tileH) * 100).toFixed(4),
  };
}

/** One metatile as a % of the section map — used for exact tile overlays. */
export function feebasSpotTileSizePercent(spot: FeebasFishingSpot): { w: number; h: number } {
  const sec = FEEBAS_FISHING_SECTIONS[spot.section];
  const tileH = sec.ymax - sec.ymin + 1;
  return {
    w: +((100 / MAP_WIDTH_TILES).toFixed(4)),
    h: +((100 / tileH).toFixed(4)),
  };
}

/** Stable demo seed so the guide can show one concrete example set of six tiles. */
export const FEEBAS_DEMO_SEED = 0x4a7c;
