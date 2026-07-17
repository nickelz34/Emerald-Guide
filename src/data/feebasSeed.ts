/**
 * Feebas fishing-spot RNG — mirrors pokeemerald wild_encounter.c
 * (FeebasSeedRng / FeebasRandom / CheckFeebas spot assignment).
 */

import { FEEBAS_FISHING_SPOTS, type FeebasFishingSpot } from "./feebasFishingSpots";

const NUM_FISHING_SPOTS = 447;
const NUM_FEEBAS_SPOTS = 6;

/** ISO_RANDOMIZE2 from pokeemerald's agb_flash / random helpers. */
function isoRandomize2(val: number): number {
  return (Math.imul(1103515245, val >>> 0) + 24691) >>> 0;
}

/**
 * Returns the six fishing-spot IDs (1–447) active for a Dewford trend `.rand` seed.
 * Duplicates are possible (same as the game), so unique tile count may be &lt; 6.
 */
export function feebasSpotIdsForSeed(seed: number): number[] {
  let rng = seed >>> 0;
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

/** Stable demo seed so the guide can show one concrete example set of six tiles. */
export const FEEBAS_DEMO_SEED = 0x4a7c;
