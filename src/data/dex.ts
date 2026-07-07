/**
 * Full Pokédex listings for Pokémon Emerald — bundled locally (see dexGenerated.ts).
 *
 *  - Hoenn dex: the 202 species in the in-game Hoenn Pokédex (RSE order).
 *  - National dex: the remaining Gen-3 species (national #1–386 not in Hoenn),
 *    184 species, plus the well-known glitch slot "Decamark" → 185 entries.
 *  - All: every Gen-3 species (386) plus the glitch slot → 387 entries.
 */

import { ALL_DEX, HOENN_DEX, NATIONAL_DEX } from "./dexGenerated";

export type DexScope = "hoenn" | "national" | "all";

export interface DexEntry {
  name: string;
  slug: string;
  nationalNumber: number;
  hoennNumber?: number;
  isGlitch?: boolean;
}

export const DEX_META: Record<DexScope, { label: string; count: number; blurb: string }> = {
  hoenn: { label: "Hoenn", count: 202, blurb: "The 202 species in Emerald’s Hoenn Pokédex." },
  national: { label: "National", count: 185, blurb: "The 185 non-Hoenn entries, including 1 glitch Pokémon." },
  all: { label: "All", count: 387, blurb: "Every Gen-3 species plus the glitch slot — 387 total." },
};

export function loadHoennDex(): Promise<DexEntry[]> {
  return Promise.resolve(HOENN_DEX);
}

export function loadNationalDex(): Promise<DexEntry[]> {
  return Promise.resolve(NATIONAL_DEX);
}

export function loadAllDex(): Promise<DexEntry[]> {
  return Promise.resolve(ALL_DEX);
}

export function loadDex(scope: DexScope): Promise<DexEntry[]> {
  if (scope === "hoenn") return loadHoennDex();
  if (scope === "national") return loadNationalDex();
  return loadAllDex();
}

/** Resolve a display name (e.g. from encounter tables) to a dex entry. */
export function findDexEntryByName(entries: DexEntry[], name: string): DexEntry | undefined {
  const slug = name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/'/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/\s+/g, "-");
  const norm = name.toLowerCase().replace(/['.]/g, "");
  return entries.find(
    (e) =>
      e.slug === slug ||
      e.name.toLowerCase() === name.toLowerCase() ||
      e.name.toLowerCase().replace(/['.]/g, "") === norm,
  );
}
