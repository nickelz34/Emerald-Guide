import { SPECIES_BY_SLUG } from "../data/speciesDataGenerated";
import { ITEM_BAG_ICONS } from "../data/itemIconsGenerated";
import {
  ITEM_SPRITE_PATHS,
  OTHER_SPRITE_PATHS,
  TRAINER_SPRITE_PATHS,
} from "./spriteCatalogPaths";

export type SpriteCatalogKind = "pokemon" | "trainer" | "item" | "other";

export interface SpriteCatalogEntry {
  id: string;
  kind: SpriteCatalogKind;
  /** Path relative to public/ */
  src: string;
  label: string;
  searchText: string;
}

function titleFromPath(src: string): string {
  const base = src.split("/").pop() ?? src;
  return base
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCatalog(): SpriteCatalogEntry[] {
  const entries: SpriteCatalogEntry[] = [];
  const seenSrc = new Set<string>();

  const byDex = new Map<number, string>();
  for (const [slug, info] of Object.entries(SPECIES_BY_SLUG)) {
    if (!info.dexNumber || info.dexNumber < 1 || info.dexNumber > 386) continue;
    if (!byDex.has(info.dexNumber)) byDex.set(info.dexNumber, slug);
  }
  for (let n = 1; n <= 386; n++) {
    const src = `sprites/pokemon/emerald/${n}.png`;
    const slug = byDex.get(n);
    const label = slug ? slugToName(slug) : `#${n}`;
    entries.push({
      id: `pokemon:${n}`,
      kind: "pokemon",
      src,
      label: `${label} (#${n})`,
      searchText: `${label} ${n} pokemon`.toLowerCase(),
    });
    seenSrc.add(src);
  }

  for (const src of TRAINER_SPRITE_PATHS) {
    if (seenSrc.has(src)) continue;
    const label = titleFromPath(src);
    entries.push({
      id: `trainer:${src}`,
      kind: "trainer",
      src,
      label,
      searchText: `${label} trainer ${src}`.toLowerCase(),
    });
    seenSrc.add(src);
  }

  for (const [name, icon] of Object.entries(ITEM_BAG_ICONS)) {
    if (seenSrc.has(icon.spriteSheet)) continue;
    entries.push({
      id: `item:${icon.spriteSheet}`,
      kind: "item",
      src: icon.spriteSheet,
      label: name,
      searchText: `${name} item ${icon.spriteSheet}`.toLowerCase(),
    });
    seenSrc.add(icon.spriteSheet);
  }

  for (const src of ITEM_SPRITE_PATHS) {
    if (seenSrc.has(src)) continue;
    const label = titleFromPath(src);
    entries.push({
      id: `item:${src}`,
      kind: "item",
      src,
      label,
      searchText: `${label} item ${src}`.toLowerCase(),
    });
    seenSrc.add(src);
  }

  for (const src of OTHER_SPRITE_PATHS) {
    if (seenSrc.has(src)) continue;
    const label = titleFromPath(src);
    entries.push({
      id: `other:${src}`,
      kind: "other",
      src,
      label,
      searchText: `${label} ${src}`.toLowerCase(),
    });
    seenSrc.add(src);
  }

  return entries;
}

let cached: SpriteCatalogEntry[] | null = null;

export function getSpriteCatalog(): SpriteCatalogEntry[] {
  if (!cached) cached = buildCatalog();
  return cached;
}

export function filterSpriteCatalog(
  query: string,
  kind: SpriteCatalogKind | "all" = "all",
): SpriteCatalogEntry[] {
  const catalog = getSpriteCatalog();
  const q = query.trim().toLowerCase();
  return catalog.filter((entry) => {
    if (kind !== "all" && entry.kind !== kind) return false;
    if (!q) return true;
    return entry.searchText.includes(q);
  });
}
