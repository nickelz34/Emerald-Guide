/**
 * Full Pokédex listings for Pokémon Emerald, sourced from PokéAPI.
 *
 *  - Hoenn dex: the 202 species in the in-game Hoenn Pokédex (RSE order).
 *  - National dex: the remaining Gen-3 species (national #1–386 not in Hoenn),
 *    184 species, plus the well-known glitch slot "Decamark" → 185 entries.
 *  - All: every Gen-3 species (386) plus the glitch slot → 387 entries.
 */

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

const POKEAPI = "https://pokeapi.co/api/v2";
const MAX_GEN3 = 386;

const NAME_OVERRIDES: Record<string, string> = {
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "mr-mime": "Mr. Mime",
  "ho-oh": "Ho-Oh",
  farfetchd: "Farfetch'd",
};

const GLITCH: DexEntry = {
  name: "?????????? (Decamark)",
  slug: "",
  nationalNumber: 387,
  isGlitch: true,
};

function idFromUrl(url: string): number {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function displayName(slug: string): string {
  if (NAME_OVERRIDES[slug]) return NAME_OVERRIDES[slug];
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

interface RawPokedex {
  pokemon_entries: {
    entry_number: number;
    pokemon_species: { name: string; url: string };
  }[];
}

let hoennCache: Promise<DexEntry[]> | null = null;
let nationalCache: Promise<DexEntry[]> | null = null;
let allCache: Promise<DexEntry[]> | null = null;

export function loadHoennDex(): Promise<DexEntry[]> {
  if (!hoennCache) {
    hoennCache = fetch(`${POKEAPI}/pokedex/hoenn`)
      .then((r) => {
        if (!r.ok) throw new Error(`PokéAPI ${r.status}`);
        return r.json() as Promise<RawPokedex>;
      })
      .then((data) =>
        data.pokemon_entries
          .map((e) => ({
            name: displayName(e.pokemon_species.name),
            slug: e.pokemon_species.name,
            hoennNumber: e.entry_number,
            nationalNumber: idFromUrl(e.pokemon_species.url),
          }))
          .sort((a, b) => (a.hoennNumber ?? 0) - (b.hoennNumber ?? 0)),
      )
      .catch((err) => {
        hoennCache = null;
        throw err;
      });
  }
  return hoennCache;
}

export function loadNationalDex(): Promise<DexEntry[]> {
  if (!nationalCache) {
    nationalCache = Promise.all([
      loadHoennDex(),
      fetch(`${POKEAPI}/pokedex/national`).then((r) => {
        if (!r.ok) throw new Error(`PokéAPI ${r.status}`);
        return r.json() as Promise<RawPokedex>;
      }),
    ])
      .then(([hoenn, natl]) => {
        const hoennSlugs = new Set(hoenn.map((h) => h.slug));
        const entries = natl.pokemon_entries
          .filter((e) => e.entry_number <= MAX_GEN3 && !hoennSlugs.has(e.pokemon_species.name))
          .map((e) => ({
            name: displayName(e.pokemon_species.name),
            slug: e.pokemon_species.name,
            nationalNumber: e.entry_number,
          }))
          .sort((a, b) => a.nationalNumber - b.nationalNumber);
        return [...entries, GLITCH];
      })
      .catch((err) => {
        nationalCache = null;
        throw err;
      });
  }
  return nationalCache;
}

export function loadAllDex(): Promise<DexEntry[]> {
  if (!allCache) {
    allCache = Promise.all([loadHoennDex(), loadNationalDex()])
      .then(([hoenn, national]) => {
        const real = [...hoenn, ...national.filter((e) => !e.isGlitch)].sort(
          (a, b) => a.nationalNumber - b.nationalNumber,
        );
        return [...real, GLITCH];
      })
      .catch((err) => {
        allCache = null;
        throw err;
      });
  }
  return allCache;
}

export function loadDex(scope: DexScope): Promise<DexEntry[]> {
  if (scope === "hoenn") return loadHoennDex();
  if (scope === "national") return loadNationalDex();
  return loadAllDex();
}
