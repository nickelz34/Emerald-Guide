import type { EncounterMethod } from "../types";

/**
 * Complete Emerald wild-encounter data, sourced at runtime from the authoritative
 * pret/pokeemerald decompilation (src/data/wild_encounters.json) and transformed
 * into a per-species "Pokédex" the UI can search. This guarantees every wild
 * Pokémon in the game is searchable, with accurate locations, methods, levels,
 * and encounter rates.
 */

const WILD_URL =
  "https://raw.githubusercontent.com/pret/pokeemerald/master/src/data/wild_encounters.json";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Very Rare";

export interface LocationRow {
  method: EncounterMethod;
  level: string;
  rate: string;
  rateValue: number;
}

export interface PokemonLocation {
  id: string;
  name: string;
  screenshot?: string;
  areaId?: string;
  rows: LocationRow[];
}

export interface WildPokemon {
  name: string;
  slug: string;
  methods: EncounterMethod[];
  minLevel: number;
  maxLevel: number;
  bestRate: number;
  rarity: Rarity;
  locationCount: number;
  locations: PokemonLocation[];
}

interface RawMon {
  min_level: number;
  max_level: number;
  species: string;
}
interface RawField {
  encounter_rate: number;
  mons: RawMon[];
}
interface RawEncounter {
  map: string;
  land_mons?: RawField;
  water_mons?: RawField;
  rock_smash_mons?: RawField;
  fishing_mons?: RawField;
}
interface RawFieldDef {
  type: string;
  encounter_rates: number[];
  groups?: Record<string, number[]>;
}
interface RawJson {
  wild_encounter_groups: {
    for_maps?: boolean;
    fields: RawFieldDef[];
    encounters: RawEncounter[];
  }[];
}

/** Maps that are event/Frontier-only and not legitimately catchable in normal play. */
const EXCLUDED = ["ALTERING_CAVE", "BATTLE_PYRAMID", "FARAWAY_ISLAND"];

const CAVE_KEYWORDS = [
  "CAVE",
  "TUNNEL",
  "CHAMBER",
  "CAVERN",
  "PILLAR",
  "HIDEOUT",
  "RUINS",
  "TOMB",
  "SLAB",
  "DEPTHS",
  "MIRAGE_TOWER",
  "METEOR_FALLS",
  "VICTORY_ROAD",
];

/** Known annotated screenshots keyed by a location-id prefix. */
const SCREENSHOTS: { prefix: string; shot: string; area: string }[] = [
  { prefix: "route-101", shot: "route-101.png", area: "route-101" },
  { prefix: "route-102", shot: "route-102.png", area: "route-102" },
  { prefix: "route-103", shot: "route-103.png", area: "route-103" },
  { prefix: "route-104", shot: "route-104.png", area: "route-104" },
  { prefix: "route-105", shot: "route-105.png", area: "route-105" },
  { prefix: "route-110", shot: "route110.png", area: "route-110" },
  { prefix: "route-111", shot: "route-111.png", area: "route-111" },
  { prefix: "route-113", shot: "route-113.png", area: "route-113" },
  { prefix: "route-116", shot: "route-116.png", area: "route-116" },
  { prefix: "route-119", shot: "route-119.png", area: "route-119" },
  { prefix: "route-120", shot: "route-120.png", area: "route-120" },
  { prefix: "petalburg-woods", shot: "petalburg-woods.png", area: "petalburg-woods" },
  { prefix: "rusturf-tunnel", shot: "rusturf-tunnel.png", area: "rusturf-tunnel" },
  { prefix: "granite-cave", shot: "granite-cave.png", area: "granite-cave" },
  { prefix: "mt-chimney", shot: "mt_chimney_e.png", area: "mt-chimney" },
  { prefix: "mossdeep-city", shot: "mossdeep_city_e.png", area: "mossdeep" },
  { prefix: "sootopolis-city", shot: "sootopolis_city_e.png", area: "sootopolis" },
  { prefix: "lilycove-city", shot: "lilycove.png", area: "lilycove" },
  { prefix: "pacifidlog-town", shot: "pacifidlog.png", area: "pacifidlog" },
  { prefix: "dewford-town", shot: "dewford_town_e.png", area: "dewford" },
  { prefix: "sky-pillar", shot: "sky-pillar.png", area: "sky-pillar" },
  { prefix: "victory-road", shot: "victory_road_e.png", area: "victory-road" },
  { prefix: "sealed-chamber", shot: "sealed-chamber.png", area: "sealed-chamber" },
  { prefix: "marine-cave", shot: "marine-cave.png", area: "marine-cave" },
];

function bareName(mapConst: string): string {
  return mapConst.replace(/^MAP_/, "");
}

function locationId(mapConst: string): string {
  return bareName(mapConst)
    .replace(/^ROUTE(\d+)/, "route-$1")
    .toLowerCase()
    .replace(/_/g, "-");
}

function prettyName(mapConst: string): string {
  const bare = bareName(mapConst);
  if (/^ROUTE\d+/.test(bare)) {
    const m = bare.match(/^ROUTE(\d+)(.*)$/)!;
    const rest = m[2]
      .split("_")
      .filter(Boolean)
      .map(titleToken)
      .join(" ");
    return `Route ${m[1]}${rest ? " " + rest : ""}`;
  }
  return bare.split("_").map(titleToken).join(" ");
}

function titleToken(tok: string): string {
  if (!tok) return tok;
  if (tok === "MT") return "Mt.";
  // Floor / room markers stay uppercase: 1F, B1F, 2R, etc.
  if (/^B?\d+[A-Z]?$/.test(tok) || /^\d+[A-Z]$/.test(tok)) return tok;
  return tok.charAt(0) + tok.slice(1).toLowerCase();
}

function isCave(mapConst: string): boolean {
  const bare = bareName(mapConst);
  return CAVE_KEYWORDS.some((k) => bare.includes(k));
}

function screenshotFor(id: string): { shot: string; area: string } | undefined {
  return SCREENSHOTS.find((s) => id === s.prefix || id.startsWith(s.prefix + "-"));
}

function speciesName(species: string): string {
  return species
    .replace(/^SPECIES_/, "")
    .split("_")
    .map((t) => t.charAt(0) + t.slice(1).toLowerCase())
    .join(" ");
}

function speciesSlug(species: string): string {
  return species.replace(/^SPECIES_/, "").toLowerCase().replace(/_/g, "-");
}

function rarityFor(rate: number): Rarity {
  if (rate >= 35) return "Common";
  if (rate >= 15) return "Uncommon";
  if (rate >= 5) return "Rare";
  return "Very Rare";
}

function levelStr(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

function rodFor(index: number, groups?: Record<string, number[]>): EncounterMethod {
  if (groups) {
    if (groups.old_rod?.includes(index)) return "old-rod";
    if (groups.good_rod?.includes(index)) return "good-rod";
    if (groups.super_rod?.includes(index)) return "super-rod";
  }
  return "super-rod";
}

interface Agg {
  min: number;
  max: number;
  rate: number;
}

function aggregateField(
  field: RawField | undefined,
  rates: number[],
  resolveMethod: (index: number) => EncounterMethod,
): Map<string, Map<EncounterMethod, Agg>> {
  const out = new Map<string, Map<EncounterMethod, Agg>>();
  if (!field) return out;
  field.mons.forEach((mon, i) => {
    const method = resolveMethod(i);
    const rate = rates[i] ?? 0;
    let byMethod = out.get(mon.species);
    if (!byMethod) {
      byMethod = new Map();
      out.set(mon.species, byMethod);
    }
    const prev = byMethod.get(method);
    if (prev) {
      prev.min = Math.min(prev.min, mon.min_level);
      prev.max = Math.max(prev.max, mon.max_level);
      prev.rate += rate;
    } else {
      byMethod.set(method, { min: mon.min_level, max: mon.max_level, rate });
    }
  });
  return out;
}

function transform(raw: RawJson): WildPokemon[] {
  const group = raw.wild_encounter_groups.find((g) => g.for_maps) ?? raw.wild_encounter_groups[0];
  const fieldRates: Record<string, number[]> = {};
  let fishingGroups: Record<string, number[]> | undefined;
  for (const f of group.fields) {
    fieldRates[f.type] = f.encounter_rates;
    if (f.type === "fishing_mons") fishingGroups = f.groups;
  }

  const bySpecies = new Map<string, WildPokemon>();

  for (const enc of group.encounters) {
    if (EXCLUDED.some((e) => enc.map.includes(e))) continue;

    const id = locationId(enc.map);
    const name = prettyName(enc.map);
    const shotInfo = screenshotFor(id);
    const landMethod: EncounterMethod = isCave(enc.map) ? "cave" : "grass";

    const perSpecies = new Map<string, Map<EncounterMethod, Agg>>();
    const merge = (src: Map<string, Map<EncounterMethod, Agg>>) => {
      for (const [sp, methods] of src) {
        let dst = perSpecies.get(sp);
        if (!dst) {
          dst = new Map();
          perSpecies.set(sp, dst);
        }
        for (const [m, agg] of methods) {
          const prev = dst.get(m);
          if (prev) {
            prev.min = Math.min(prev.min, agg.min);
            prev.max = Math.max(prev.max, agg.max);
            prev.rate += agg.rate;
          } else {
            dst.set(m, { ...agg });
          }
        }
      }
    };

    merge(aggregateField(enc.land_mons, fieldRates.land_mons ?? [], () => landMethod));
    merge(aggregateField(enc.water_mons, fieldRates.water_mons ?? [], () => "surf"));
    merge(aggregateField(enc.rock_smash_mons, fieldRates.rock_smash_mons ?? [], () => "rock-smash"));
    merge(
      aggregateField(enc.fishing_mons, fieldRates.fishing_mons ?? [], (i) => rodFor(i, fishingGroups)),
    );

    for (const [species, methods] of perSpecies) {
      const mon =
        bySpecies.get(species) ??
        ({
          name: speciesName(species),
          slug: speciesSlug(species),
          methods: [],
          minLevel: Infinity,
          maxLevel: 0,
          bestRate: 0,
          rarity: "Very Rare",
          locationCount: 0,
          locations: [],
        } as WildPokemon);
      bySpecies.set(species, mon);

      const rows: LocationRow[] = [...methods.entries()]
        .map(([method, agg]) => {
          if (!mon.methods.includes(method)) mon.methods.push(method);
          mon.minLevel = Math.min(mon.minLevel, agg.min);
          mon.maxLevel = Math.max(mon.maxLevel, agg.max);
          mon.bestRate = Math.max(mon.bestRate, agg.rate);
          return {
            method,
            level: levelStr(agg.min, agg.max),
            rate: `${Math.min(100, Math.round(agg.rate))}%`,
            rateValue: agg.rate,
          };
        })
        .sort((a, b) => b.rateValue - a.rateValue);

      mon.locations.push({
        id,
        name,
        screenshot: shotInfo?.shot,
        areaId: shotInfo?.area,
        rows,
      });
    }
  }

  const list = [...bySpecies.values()];
  for (const mon of list) {
    if (mon.minLevel === Infinity) mon.minLevel = 0;
    mon.locationCount = mon.locations.length;
    mon.rarity = rarityFor(mon.bestRate);
    mon.locations.sort((a, b) => {
      const ar = Math.max(...a.rows.map((r) => r.rateValue), 0);
      const br = Math.max(...b.rows.map((r) => r.rateValue), 0);
      return br - ar;
    });
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

let cache: Promise<WildPokemon[]> | null = null;

export function loadWildPokedex(): Promise<WildPokemon[]> {
  if (!cache) {
    cache = fetch(WILD_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load encounter data (${r.status})`);
        return r.json() as Promise<RawJson>;
      })
      .then(transform)
      .catch((err) => {
        cache = null; // allow retry
        throw err;
      });
  }
  return cache;
}
