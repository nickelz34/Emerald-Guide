/**
 * On-demand species info from PokéAPI. Fetched only when a Pokémon detail is
 * opened, then cached. Provides types, base stats, abilities, sprite, dex
 * flavor text, and the evolution line — i.e. "all the info" beyond raw
 * encounter data.
 */

export interface StatLine {
  label: string;
  value: number;
}

export interface SpeciesInfo {
  slug: string;
  dexNumber?: number;
  sprite?: string;
  types: string[];
  abilities: string[];
  hiddenAbility?: string;
  stats: StatLine[];
  total: number;
  heightM?: number;
  weightKg?: number;
  genus?: string;
  flavor?: string;
  evolution: string[];
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

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const API = "https://pokeapi.co/api/v2";

/**
 * Actual in-game Pokémon Emerald front sprite for a National-dex number,
 * served from the PokéAPI sprite set via the jsDelivr CDN. Valid for #1–386;
 * returns undefined for anything outside Gen 3 (e.g. the glitch slot).
 */
export function emeraldSpriteUrl(nationalNumber?: number): string | undefined {
  if (!nationalNumber || nationalNumber < 1 || nationalNumber > 386) return undefined;
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/versions/generation-iii/emerald/${nationalNumber}.png`;
}

/** Species whose default /pokemon slug differs from the species name. */
const POKEMON_SLUG_ALIASES: Record<string, string> = {
  deoxys: "deoxys-normal",
};

function cap(s: string): string {
  return s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

interface ChainLink {
  species: { name: string };
  evolves_to: ChainLink[];
}

function flattenChain(link: ChainLink, acc: string[] = []): string[] {
  acc.push(cap(link.species.name));
  if (link.evolves_to.length > 0) {
    // Follow the primary line (first branch) for a simple display.
    flattenChain(link.evolves_to[0], acc);
  }
  return acc;
}

const cache = new Map<string, Promise<SpeciesInfo>>();

export function loadSpeciesInfo(slug: string): Promise<SpeciesInfo> {
  const existing = cache.get(slug);
  if (existing) return existing;

  const promise = (async () => {
    const apiSlug = POKEMON_SLUG_ALIASES[slug] ?? slug;
    const pokemon = await fetch(`${API}/pokemon/${apiSlug}`).then((r) => {
      if (!r.ok) throw new Error(`PokéAPI ${r.status}`);
      return r.json();
    });

    const stats: StatLine[] = pokemon.stats.map((s: { base_stat: number; stat: { name: string } }) => ({
      label: STAT_LABELS[s.stat.name] ?? cap(s.stat.name),
      value: s.base_stat,
    }));

    const info: SpeciesInfo = {
      slug,
      sprite:
        pokemon.sprites?.other?.["official-artwork"]?.front_default ??
        pokemon.sprites?.front_default ??
        undefined,
      types: pokemon.types.map((t: { type: { name: string } }) => cap(t.type.name)),
      abilities: pokemon.abilities
        .filter((a: { is_hidden: boolean }) => !a.is_hidden)
        .map((a: { ability: { name: string } }) => cap(a.ability.name)),
      hiddenAbility: pokemon.abilities
        .filter((a: { is_hidden: boolean }) => a.is_hidden)
        .map((a: { ability: { name: string } }) => cap(a.ability.name))[0],
      stats,
      total: stats.reduce((sum, s) => sum + s.value, 0),
      heightM: pokemon.height ? pokemon.height / 10 : undefined,
      weightKg: pokemon.weight ? pokemon.weight / 10 : undefined,
      evolution: [],
    };

    // Species + evolution are best-effort; failures shouldn't block the core info.
    try {
      const species = await fetch(pokemon.species.url).then((r) => r.json());
      info.dexNumber = species.id;
      info.genus = species.genera?.find((g: { language: { name: string } }) => g.language.name === "en")?.genus;
      const flavorEntries = species.flavor_text_entries?.filter(
        (f: { language: { name: string } }) => f.language.name === "en",
      );
      const emerald = flavorEntries?.find((f: { version: { name: string } }) => f.version.name === "emerald");
      info.flavor = (emerald ?? flavorEntries?.[0])?.flavor_text?.replace(/[\n\f\r]+/g, " ");

      if (species.evolution_chain?.url) {
        const chain = await fetch(species.evolution_chain.url).then((r) => r.json());
        info.evolution = flattenChain(chain.chain);
      }
    } catch {
      // keep base info
    }

    return info;
  })().catch((err) => {
    cache.delete(slug);
    throw err;
  });

  cache.set(slug, promise);
  return promise;
}
