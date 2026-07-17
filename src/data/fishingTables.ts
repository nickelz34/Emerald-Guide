/**
 * Emerald fishing reference — rod obtain info + encounter tables built from
 * pret/pokeemerald wild_encounters.json (bundled). Maps that share an identical
 * rod table are clustered so the guide stays accurate without repeating rows.
 */

import rawWildEncounters from "./wild_encounters.json";
import type { EncounterMethod } from "../types";

export interface FishingRodRow {
  id: "old-rod" | "good-rod" | "super-rod";
  name: string;
  /** Key in itemIconsGenerated / bag icon name. */
  iconName: string;
  /** Short progression label, e.g. "1st rod". */
  tier: string;
  /** Town / route where the rod is given. */
  location: string;
  /** Who gives it and where to stand. */
  npc: string;
  prerequisite?: string;
  typicalLevels: string;
  /** How many successful “Oh! A bite!” prompts this rod needs. */
  reelPrompts: string;
  /** Representative species / themes this rod unlocks. */
  catches: string[];
  /** One practical tip for when to use this rod. */
  tip: string;
}

export interface FishingEncounterMon {
  name: string;
  rate: string;
  rateValue: number;
  level: string;
}

export interface FishingLocationCluster {
  id: string;
  /** Compact label for the cluster (routes compressed when possible). */
  location: string;
  /** Every map in this cluster (pretty names). */
  maps: string[];
  encounters: FishingEncounterMon[];
  note?: string;
}

/** One fishable map entry for the location finder (points at a shared rod table). */
export interface FishingMapEntry {
  /** Stable id: method + map name. */
  id: string;
  /** Pretty map name (e.g. "Lilycove City"). */
  mapName: string;
  /** Shared-table cluster this map belongs to. */
  clusterId: string;
  encounters: FishingEncounterMon[];
  /** Other maps that share this exact rod table (excludes mapName). */
  sameTableAs: string[];
  note?: string;
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

const EXCLUDED = ["ALTERING_CAVE", "BATTLE_PYRAMID", "FARAWAY_ISLAND"];

const ROD_KEYS: Record<"old-rod" | "good-rod" | "super-rod", string> = {
  "old-rod": "old_rod",
  "good-rod": "good_rod",
  "super-rod": "super_rod",
};

/** Where each rod is earned and what it generally unlocks. */
export const FISHING_ROD_TABLE: FishingRodRow[] = [
  {
    id: "old-rod",
    name: "Old Rod",
    iconName: "Old Rod",
    tier: "1st rod",
    location: "Dewford Town",
    npc: "Fisherman on the south shore by the Gym — free gift, never sold.",
    typicalLevels: "Lv. 5–10",
    reelPrompts: "1 successful “Oh! A bite!” prompt",
    catches: ["Magikarp (most maps)", "Tentacool or Goldeen (map table)", "Fastest rod for Feebas tile sweeps"],
    tip: "Register it in Key Items. One prompt per cast makes Route 119 Feebas hunting much quicker.",
  },
  {
    id: "good-rod",
    name: "Good Rod",
    iconName: "Good Rod",
    tier: "2nd rod",
    location: "Route 118",
    npc: "Fisherman on the east shore — free gift after you can cross the river.",
    prerequisite: "Balance Badge + Surf to reach the east bank",
    typicalLevels: "Lv. 10–30",
    reelPrompts: "1–3 successful prompts in a row",
    catches: ["Magikarp still common", "Tentacool, Goldeen, Carvanha", "Barboach, Wailmer on many maps"],
    tip: "First rod that adds mid-game water species beyond Magikarp on most routes.",
  },
  {
    id: "super-rod",
    name: "Super Rod",
    iconName: "Super Rod",
    tier: "3rd rod",
    location: "Mossdeep City",
    npc: "Fisherman’s house east of the Gym — free gift (nobody sells Super Rods).",
    typicalLevels: "Lv. 20–45",
    reelPrompts: "1–6 successful prompts in a row",
    catches: ["Map-specific rares (Corphish, Sharpedo…)", "Whiscash, Gyarados, Staryu, Luvdisc", "Best tables for story & Pokédex fish"],
    tip: "Use Fishing encounters by location below for exact rates by map.",
  },
];

export const FISHING_SPECIAL_NOTES = [
  {
    id: "feebas",
    title: "Feebas (Route 119)",
    body: "Exactly six numbered fishing spots are active at a time (Dewford trendy-phrase seed). The hunt guide and tile calculator are in the walkthrough at Ch. 33 event 4 of 4 (Hunt Feebas on the river). Fish any rod on those tiles (Old Rod is fastest); ~50% on a correct tile. Surf never catches Feebas. Not part of the standard Route 119 rod table.",
  },
  {
    id: "relicanth",
    title: "Relicanth (Regi puzzle)",
    body: "Relicanth is not a Super Rod catch in Emerald — it appears while diving on Underwater Routes 124 and 126 (water encounters). Pair with a Wailord for the Sealed Chamber.",
  },
];

function bareName(mapConst: string): string {
  return mapConst.replace(/^MAP_/, "");
}

function titleToken(tok: string): string {
  if (!tok) return tok;
  if (tok === "MT") return "Mt.";
  if (/^B?\d+[A-Z]?$/.test(tok) || /^\d+[A-Z]$/.test(tok)) return tok;
  return tok.charAt(0) + tok.slice(1).toLowerCase();
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
    return `Route ${m[1]}${rest ? ` ${rest}` : ""}`;
  }
  return bare.split("_").map(titleToken).join(" ");
}

function speciesName(species: string): string {
  return species
    .replace(/^SPECIES_/, "")
    .split("_")
    .map((t) => t.charAt(0) + t.slice(1).toLowerCase())
    .join(" ");
}

function levelStr(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

/** Compress consecutive Route N names: Route 105 · Route 106 → Routes 105–106. */
function formatLocationLabel(maps: string[]): string {
  if (maps.length === 1) return maps[0];

  const routeNums: number[] = [];
  const others: string[] = [];
  for (const name of maps) {
    const m = name.match(/^Route (\d+)$/);
    if (m) routeNums.push(Number(m[1]));
    else others.push(name);
  }
  routeNums.sort((a, b) => a - b);

  const routeParts: string[] = [];
  let i = 0;
  while (i < routeNums.length) {
    let j = i;
    while (j + 1 < routeNums.length && routeNums[j + 1] === routeNums[j] + 1) j++;
    if (j > i + 1) routeParts.push(`Routes ${routeNums[i]}–${routeNums[j]}`);
    else if (j === i + 1) routeParts.push(`Routes ${routeNums[i]} & ${routeNums[j]}`);
    else routeParts.push(`Route ${routeNums[i]}`);
    i = j + 1;
  }

  // Shorten long dungeon room lists when every map shares a prefix.
  const compressedOthers = compressPrefixedMaps(others);
  return [...routeParts, ...compressedOthers].join(" · ");
}

function compressPrefixedMaps(names: string[]): string[] {
  if (names.length <= 1) return names;

  const byPrefix = new Map<string, string[]>();
  for (const name of names) {
    // "Meteor Falls B1F 1R" → prefix "Meteor Falls", suffix "B1F 1R"
    const parts = name.split(" ");
    if (parts.length >= 3 && /^(B?\d+[A-Z]?|\d+[A-Z])$/.test(parts[parts.length - 2] ?? "")) {
      // keep full for complex names; group by first two tokens when possible
    }
    const prefixMatch = name.match(
      /^(Meteor Falls|Victory Road|Seafloor Cavern|Shoal Cave|Abandoned Ship|Safari Zone)\b(.*)$/,
    );
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      const rest = prefixMatch[2].trim();
      const list = byPrefix.get(prefix) ?? [];
      list.push(rest || prefix);
      byPrefix.set(prefix, list);
    } else {
      const list = byPrefix.get(name) ?? [];
      list.push("");
      byPrefix.set(name, list);
    }
  }

  const out: string[] = [];
  for (const [prefix, rests] of byPrefix) {
    const uniqueRests = [...new Set(rests.filter(Boolean))];
    if (uniqueRests.length === 0) {
      out.push(prefix);
    } else if (uniqueRests.length === 1 && rests.length === 1) {
      out.push(`${prefix} ${uniqueRests[0]}`.trim());
    } else if (uniqueRests.every((r) => r.length > 0)) {
      out.push(`${prefix} (${uniqueRests.join(", ")})`);
    } else {
      out.push(prefix);
    }
  }
  return out;
}

function clusterNote(maps: string[], method: EncounterMethod): string | undefined {
  if (method !== "super-rod") return undefined;
  if (maps.includes("Route 119")) {
    return "Standard Super Rod table only — Feebas is a separate 6-tile special (see note below).";
  }
  if (maps.includes("Route 114") && maps.includes("Route 111")) {
    return "Whiscash is not here — Meteor Falls lower floors / Victory Road B2F have Barboach 80% + Whiscash 20%.";
  }
  return undefined;
}

function aggregateRodSlots(
  mons: RawMon[],
  slotIndexes: number[],
  rates: number[],
): FishingEncounterMon[] {
  const byName = new Map<string, { min: number; max: number; rate: number }>();
  for (const i of slotIndexes) {
    const mon = mons[i];
    if (!mon) continue;
    const name = speciesName(mon.species);
    const rate = rates[i] ?? 0;
    const prev = byName.get(name);
    if (prev) {
      prev.min = Math.min(prev.min, mon.min_level);
      prev.max = Math.max(prev.max, mon.max_level);
      prev.rate += rate;
    } else {
      byName.set(name, { min: mon.min_level, max: mon.max_level, rate });
    }
  }
  return [...byName.entries()]
    .map(([name, agg]) => ({
      name,
      rateValue: agg.rate,
      rate: `${Math.min(100, Math.round(agg.rate))}%`,
      level: levelStr(agg.min, agg.max),
    }))
    .sort((a, b) => b.rateValue - a.rateValue || a.name.localeCompare(b.name));
}

function signature(encounters: FishingEncounterMon[]): string {
  return encounters.map((e) => `${e.name}|${e.rateValue}|${e.level}`).join(";");
}

function sortMaps(maps: string[]): string[] {
  return [...maps].sort((a, b) => {
    const ar = a.match(/^Route (\d+)/);
    const br = b.match(/^Route (\d+)/);
    if (ar && br) return Number(ar[1]) - Number(br[1]) || a.localeCompare(b);
    if (ar) return -1;
    if (br) return 1;
    return a.localeCompare(b);
  });
}

function buildClustersForRod(method: EncounterMethod): FishingLocationCluster[] {
  const raw = rawWildEncounters as RawJson;
  const group = raw.wild_encounter_groups.find((g) => g.for_maps) ?? raw.wild_encounter_groups[0];
  const fishingField = group.fields.find((f) => f.type === "fishing_mons");
  if (!fishingField?.groups) return [];

  const rates = fishingField.encounter_rates;
  const slotKey = ROD_KEYS[method as "old-rod" | "good-rod" | "super-rod"];
  const slotIndexes = fishingField.groups[slotKey] ?? [];
  if (slotIndexes.length === 0) return [];

  type Bucket = { encounters: FishingEncounterMon[]; maps: string[]; mapConsts: string[] };
  const buckets = new Map<string, Bucket>();

  for (const enc of group.encounters) {
    if (!enc.fishing_mons) continue;
    if (EXCLUDED.some((e) => enc.map.includes(e))) continue;
    const encounters = aggregateRodSlots(enc.fishing_mons.mons, slotIndexes, rates);
    if (encounters.length === 0) continue;
    const key = signature(encounters);
    const bucket = buckets.get(key) ?? { encounters, maps: [], mapConsts: [] };
    bucket.maps.push(prettyName(enc.map));
    bucket.mapConsts.push(enc.map);
    buckets.set(key, bucket);
  }

  const clusters: FishingLocationCluster[] = [...buckets.values()].map((bucket, idx) => {
    const maps = sortMaps(bucket.maps);
    return {
      id: `${method}-${idx}-${signature(bucket.encounters).slice(0, 40)}`,
      location: formatLocationLabel(maps),
      maps,
      encounters: bucket.encounters,
      note: clusterNote(maps, method),
    };
  });

  // Story-ish order: earliest route number in cluster, then town/dungeon names.
  clusters.sort((a, b) => {
    const routeOf = (maps: string[]) => {
      const nums = maps
        .map((m) => m.match(/^Route (\d+)/)?.[1])
        .filter(Boolean)
        .map(Number);
      return nums.length ? Math.min(...nums) : 999;
    };
    const ra = routeOf(a.maps);
    const rb = routeOf(b.maps);
    if (ra !== rb) return ra - rb;
    return a.location.localeCompare(b.location);
  });

  // Stable readable ids after sort
  return clusters.map((c, i) => ({ ...c, id: `${method}-${i}` }));
}

const CLUSTER_CACHE: Partial<Record<EncounterMethod, FishingLocationCluster[]>> = {};

/** All fishing maps clustered by identical Old / Good / Super Rod tables. */
export function getFishingClusters(method: EncounterMethod): FishingLocationCluster[] {
  if (method !== "old-rod" && method !== "good-rod" && method !== "super-rod") return [];
  if (!CLUSTER_CACHE[method]) {
    CLUSTER_CACHE[method] = buildClustersForRod(method);
  }
  return CLUSTER_CACHE[method]!;
}

const MAP_ENTRY_CACHE: Partial<Record<EncounterMethod, FishingMapEntry[]>> = {};

/**
 * Flat per-map fishing location list for the finder UI.
 * Prefer this over cluster labels — shared-table groups compress into huge names.
 */
export function getFishingMapEntries(method: EncounterMethod): FishingMapEntry[] {
  if (method !== "old-rod" && method !== "good-rod" && method !== "super-rod") return [];
  if (!MAP_ENTRY_CACHE[method]) {
    const entries: FishingMapEntry[] = [];
    for (const cluster of getFishingClusters(method)) {
      for (const mapName of cluster.maps) {
        entries.push({
          id: `${method}:${mapName}`,
          mapName,
          clusterId: cluster.id,
          encounters: cluster.encounters,
          sameTableAs: cluster.maps.filter((m) => m !== mapName),
          note: cluster.note,
        });
      }
    }
    entries.sort((a, b) => {
      const ar = a.mapName.match(/^Route (\d+)/);
      const br = b.mapName.match(/^Route (\d+)/);
      if (ar && br) return Number(ar[1]) - Number(br[1]) || a.mapName.localeCompare(b.mapName);
      if (ar) return -1;
      if (br) return 1;
      return a.mapName.localeCompare(b.mapName);
    });
    MAP_ENTRY_CACHE[method] = entries;
  }
  return MAP_ENTRY_CACHE[method]!;
}

/** @deprecated Prefer getFishingClusters("super-rod") — kept for any external callers. */
export const SUPER_ROD_LOCATION_TABLE: FishingLocationCluster[] = getFishingClusters("super-rod");
