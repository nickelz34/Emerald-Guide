import type { MapPoint, PoiCategory } from "../data/mapPoints";

/** Non-battle overworld / interior characters (vs fightable trainers). */
export function isNpcLegendPoint(point: MapPoint): boolean {
  if (point.category === "npc") return true;
  if (point.category !== "trainer") return false;
  const trainerType = (point as MapPoint & { trainerType?: string }).trainerType;
  return trainerType === "TRAINER_TYPE_NONE";
}

/**
 * Legend category for filters: battle trainers stay "trainer";
 * TRAINER_TYPE_NONE (and explicit npc) become "npc".
 */
export function legendCategoryForPoint(point: MapPoint): PoiCategory {
  return isNpcLegendPoint(point) ? "npc" : point.category;
}

/** Copy with category adjusted for Hoenn Map / area-map legend filters. */
export function withLegendCategory<T extends MapPoint>(point: T): T {
  const next = legendCategoryForPoint(point);
  return next === point.category ? point : { ...point, category: next };
}
