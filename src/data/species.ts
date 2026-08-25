/**
 * Species info for Gen 3 Pokémon — bundled locally (see speciesDataGenerated.ts).
 * Emerald battle sprites (#1–386) live under public/sprites/pokemon/.
 */

import { assetUrl } from "../lib/assetUrl";
import { SPECIES_BY_SLUG } from "./speciesDataGenerated";

export interface StatLine {
  label: string;
  value: number;
}

/** One directed evolution edge with Emerald-accurate method text. */
export interface EvolutionMethod {
  from: string;
  to: string;
  method: string;
}

export interface SpeciesInfo {
  slug: string;
  dexNumber?: number;
  sprite?: string;
  types: string[];
  abilities: string[];
  hiddenAbility?: string;
  baseExp?: number;
  stats: StatLine[];
  total: number;
  heightM?: number;
  weightKg?: number;
  genus?: string;
  flavor?: string;
  /** Display names in chain order (may omit alternate branches — prefer evolutionMethods). */
  evolution: string[];
  /** All Gen-3-reachable evolution edges from this species' family. */
  evolutionMethods?: EvolutionMethod[];
  /** Egg group display names (e.g. "Field", "Water 1"). */
  eggGroups?: string[];
  /**
   * PokéAPI gender_rate: -1 genderless, 0 always ♂, 8 always ♀,
   * otherwise eighths female (1–7).
   */
  genderRate?: number;
}

export const TYPE_COLORS: Record<string, string> = {
  Normal: "#9099a1",
  Fire: "#ff9d55",
  Water: "#4d90d5",
  Electric: "#f4d23c",
  Grass: "#63bb5b",
  Ice: "#73cec0",
  Fighting: "#ce4069",
  Poison: "#ab6ac8",
  Ground: "#d97746",
  Flying: "#8fa8dd",
  Psychic: "#fa7179",
  Bug: "#90c12c",
  Rock: "#c7b78b",
  Ghost: "#5269ad",
  Dragon: "#0a6dc4",
  Dark: "#5a5366",
  Steel: "#5a8ea1",
  Fairy: "#ec8fe6",
};

/** Species whose slug differs from the bundled key. */
const POKEMON_SLUG_ALIASES: Record<string, string> = {
  deoxys: "deoxys-normal",
};

/** Slug used to look up bundled species / dex data from a display name. */
export function speciesSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/['’]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/\s+/g, "-");
}

/**
 * National Pokédex number (#1–386) for a species display name.
 * Trainer party data historically stored pokeemerald SPECIES_* enum values,
 * which do not match National Dex numbers for Hoenn Pokémon.
 */
export function nationalDexNumberForSpecies(name: string): number | undefined {
  if (!name || name === "?") return undefined;
  const slug = speciesSlug(name);
  const info = SPECIES_BY_SLUG[slug] ?? SPECIES_BY_SLUG[POKEMON_SLUG_ALIASES[slug] ?? ""];
  const n = info?.dexNumber;
  return n && n >= 1 && n <= 386 ? n : undefined;
}

/** Emerald front sprite for a species name, falling back to a numeric id. */
export function emeraldSpriteUrlForSpecies(
  name: string,
  fallbackNational?: number,
): string | undefined {
  return emeraldSpriteUrl(nationalDexNumberForSpecies(name) ?? fallbackNational);
}

/** In-game Egg sprite (party / Day Care). */
export function eggSpriteUrl(): string {
  return assetUrl("sprites/pokemon/egg.png");
}

/**
 * In-game Pokémon Emerald front sprite for a National-dex number (#1–386).
 * Bundled locally — no CDN fetch. Returns undefined outside Gen 3 (e.g. glitch slot).
 */
export function emeraldSpriteUrl(nationalNumber?: number): string | undefined {
  if (!nationalNumber || nationalNumber < 1 || nationalNumber > 386) return undefined;
  return assetUrl(`sprites/pokemon/emerald/${nationalNumber}.png`);
}

const cache = new Map<string, Promise<SpeciesInfo>>();

export function loadSpeciesInfo(slug: string): Promise<SpeciesInfo> {
  const existing = cache.get(slug);
  if (existing) return existing;

  const promise = Promise.resolve().then(() => {
    if (!slug) throw new Error("No species slug");
    const key = POKEMON_SLUG_ALIASES[slug] ?? slug;
    const info = SPECIES_BY_SLUG[key];
    if (!info) throw new Error(`Unknown species: ${slug}`);
    return { ...info, slug };
  });

  cache.set(slug, promise);
  return promise;
}
