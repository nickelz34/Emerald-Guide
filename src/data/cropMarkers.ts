import { MAP_ANNOTATIONS, type MapMarker, type MarkerType } from "./mapAnnotations";
import { MAP_POINTS, type MapPoint, type PoiCategory } from "./mapPoints";
import { GENERATED_POINTS } from "./mapPointsGenerated";
import { LANDMARK_PINS_GENERATED } from "./mapLandmarksGenerated";
import { SHOP_PINS_GENERATED } from "./shopPinsGenerated";
import { MAP_TRAINERS, type TrainerPoint } from "./mapTrainersGenerated";
import { AREA_MARKER_MAP_POS, AREA_NOTE_LABELS, HOENN_MAP_H, HOENN_MAP_W, type MapCrop } from "./mapCrops";

const ALL_MAP_POINTS: MapPoint[] = [
  ...MAP_POINTS,
  ...LANDMARK_PINS_GENERATED,
  ...GENERATED_POINTS,
  ...SHOP_PINS_GENERATED,
];

export type CropMapPoint = MapPoint | TrainerPoint;

/** Higher priority wins when pins overlap on walkthrough crops. */
const CATEGORY_PRIORITY: Record<PoiCategory, number> = {
  trainer: 100,
  gym: 90,
  item: 80,
  hidden: 75,
  berry: 70,
  shop: 65,
  entrance: 60,
  town: 55,
  landmark: 45,
  route: 40,
  npc: 35,
  wild: 30,
};

const POI_TO_MARKER: Record<PoiCategory, MarkerType> = {
  town: "building",
  route: "poi",
  gym: "building",
  landmark: "poi",
  item: "item",
  hidden: "item",
  berry: "item",
  entrance: "building",
  shop: "building",
  trainer: "trainer",
  npc: "npc",
  wild: "wild",
};

type PlacedPoint = CropMapPoint & { mapX: number; mapY: number };

function isTrainerPoint(p: MapPoint): p is TrainerPoint {
  return p.category === "trainer" && "spriteSheet" in p;
}

/** Convert a full-map percentage position to crop-local (0–100), or null if outside. */
function toCropLocal(mapX: number, mapY: number, crop: MapCrop): { x: number; y: number } | null {
  const margin = 0.15;
  if (
    mapX < crop.x - margin ||
    mapX > crop.x + crop.w + margin ||
    mapY < crop.y - margin ||
    mapY > crop.y + crop.h + margin
  ) {
    return null;
  }
  return {
    x: ((mapX - crop.x) / crop.w) * 100,
    y: ((mapY - crop.y) / crop.h) * 100,
  };
}

function toMapPos(localX: number, localY: number, crop: MapCrop): { x: number; y: number } {
  return {
    x: crop.x + (localX / 100) * crop.w,
    y: crop.y + (localY / 100) * crop.h,
  };
}

function markerToCropLocal(
  marker: MapMarker,
  areaId: string,
  displayCrop: MapCrop,
): { x: number; y: number; mapPos: { x: number; y: number } } | null {
  const tilePos = AREA_MARKER_MAP_POS[areaId]?.[marker.id];
  if (tilePos) {
    const local = toCropLocal(tilePos.x, tilePos.y, displayCrop);
    if (!local) return null;
    return { ...local, mapPos: tilePos };
  }
  const mapPos = toMapPos(marker.x, marker.y, displayCrop);
  return { x: marker.x, y: marker.y, mapPos };
}

function noteMatchesArea(note: string | undefined, labels: string[]): boolean {
  if (!note || labels.length === 0) return false;
  const n = note.toLowerCase();
  return labels.some((label) => n.includes(label.toLowerCase()));
}

/** Tile distance between two full-map percentage positions. */
function mapTileDistance(ax: number, ay: number, bx: number, by: number): number {
  const wTiles = HOENN_MAP_W / 16;
  const hTiles = HOENN_MAP_H / 16;
  const dx = (ax - bx) / (100 / wTiles);
  const dy = (ay - by) / (100 / hTiles);
  return Math.hypot(dx, dy);
}

function trainerSpriteNear(mapPos: { x: number; y: number }, labels: string[]): boolean {
  return MAP_TRAINERS.some((tr) => {
    if (!noteMatchesArea(tr.note, labels)) return false;
    return mapTileDistance(mapPos.x, mapPos.y, tr.x, tr.y) < 1.25;
  });
}

function generatedCollectibleNear(mapPos: { x: number; y: number }, labels: string[]): boolean {
  return ALL_MAP_POINTS.some((pt) => {
    if (!["item", "hidden", "berry"].includes(pt.category)) return false;
    if (!noteMatchesArea(pt.note, labels)) return false;
    return mapTileDistance(mapPos.x, mapPos.y, pt.x, pt.y) < 1.25;
  });
}

function generatedEntranceNear(
  mapPos: { x: number; y: number },
  labels: string[],
  maxTiles = 2,
): boolean {
  return ALL_MAP_POINTS.some(
    (pt) =>
      pt.category === "entrance" &&
      noteMatchesArea(pt.note, labels) &&
      mapTileDistance(mapPos.x, mapPos.y, pt.x, pt.y) < maxTiles,
  );
}

function generatedLandmarkNear(mapPos: { x: number; y: number }, maxTiles = 2): boolean {
  return ALL_MAP_POINTS.some((pt) => {
    if (!["landmark", "gym"].includes(pt.category)) return false;
    return mapTileDistance(mapPos.x, mapPos.y, pt.x, pt.y) < maxTiles;
  });
}

/** Route exits and town connections — blue route pins on walkthrough crops. */
function isRouteLinkMarker(marker: MapMarker): boolean {
  if (marker.type !== "poi") return false;
  const label = marker.label.toLowerCase();
  const id = marker.id.toLowerCase();
  if (label.startsWith("to route") || label.startsWith("exit to route")) return true;
  if (label.startsWith("to ") && (label.includes(" town") || label.includes(" city") || label.includes("route"))) {
    return true;
  }
  if (/-r\d+$/.test(id) || /^r\d+-[a-z]/.test(id)) {
    return !id.includes("grass") && !id.includes("cave") && !id.includes("rival") && !id.includes("birch");
  }
  if (/^(old|pet|rust|dew|sl|mau|lav|fall|lily|mos|pac|ft|eg)-r/.test(id)) return true;
  return false;
}

function categoryForMarker(marker: MapMarker): PoiCategory {
  switch (marker.type) {
    case "trainer":
      return "trainer";
    case "item":
      return "item";
    case "npc":
      return "npc";
    case "building":
      return "entrance";
    case "wild":
      return "wild";
    case "poi":
      return isRouteLinkMarker(marker) ? "route" : "landmark";
  }
}

function shouldSkipHandMarker(marker: MapMarker, mapPos: { x: number; y: number }, labels: string[]): boolean {
  if (marker.type === "trainer" && trainerSpriteNear(mapPos, labels)) return true;
  if (marker.type === "item" && generatedCollectibleNear(mapPos, labels)) return true;
  // Main-map entrances replace all hand building markers for outdoor areas.
  if (marker.type === "building" && labels.length > 0) return true;
  if ((marker.type === "building" || marker.type === "poi") && generatedEntranceNear(mapPos, labels)) {
    return true;
  }
  if (marker.type === "poi" && !isRouteLinkMarker(marker) && generatedLandmarkNear(mapPos)) {
    return true;
  }
  return false;
}

function priority(pt: CropMapPoint): number {
  return CATEGORY_PRIORITY[pt.category] ?? 0;
}

/** Drop overlapping pins — keep the highest-priority marker per cluster. */
function dedupeOverlapping(points: PlacedPoint[]): CropMapPoint[] {
  const sorted = [...points].sort((a, b) => priority(b) - priority(a));
  const kept: PlacedPoint[] = [];

  for (const candidate of sorted) {
    const clusterTiles =
      candidate.category === "entrance" ? 2.5 : 1.25;
    const overlaps = kept.some((existing) => {
      const dist = mapTileDistance(candidate.mapX, candidate.mapY, existing.mapX, existing.mapY);
      if (dist >= clusterTiles) return false;
      // Same entrance cluster — keep one gray pin.
      if (candidate.category === "entrance" && existing.category === "entrance") return true;
      // Lower-priority annotation on top of a main-map pin.
      if (priority(existing) >= priority(candidate)) return true;
      return dist < 1;
    });
    if (!overlaps) kept.push(candidate);
  }

  return kept.map(({ mapX: _mapX, mapY: _mapY, ...pt }) => pt);
}

function placeMapPoint(
  pt: CropMapPoint,
  mapX: number,
  mapY: number,
  crop: MapCrop,
  out: PlacedPoint[],
): void {
  const local = toCropLocal(mapX, mapY, crop);
  if (!local) return;
  out.push({ ...pt, x: local.x, y: local.y, mapX, mapY });
}

/**
 * Walkthrough crop markers — main Hoenn map POIs first, then unique walkthrough-only
 * annotations (route links, grass, story beats). Rendered with hoenn-map__pin styling.
 */
export function getCropMapPoints(crop: MapCrop, areaId?: string): CropMapPoint[] {
  const candidates: PlacedPoint[] = [];
  const labels = areaId ? (AREA_NOTE_LABELS[areaId] ?? []) : [];

  // 1. Same data as the main Hoenn map for this area.
  if (labels.length > 0) {
    for (const pt of ALL_MAP_POINTS) {
      const inArea =
        noteMatchesArea(pt.note, labels) ||
        (areaId && (pt.id === areaId || pt.id === `gym-${areaId}`));
      if (!inArea) continue;
      placeMapPoint({ ...pt, id: `mp-${pt.id}` }, pt.x, pt.y, crop, candidates);
    }

    for (const tr of MAP_TRAINERS) {
      if (!noteMatchesArea(tr.note, labels)) continue;
      placeMapPoint({ ...tr }, tr.x, tr.y, crop, candidates);
    }
  }

  // 2. Walkthrough-only annotations not covered by the main map.
  if (areaId && MAP_ANNOTATIONS[areaId]) {
    for (const marker of MAP_ANNOTATIONS[areaId].markers) {
      const placed = markerToCropLocal(marker, areaId, crop);
      if (!placed) continue;
      const { mapPos } = placed;
      if (shouldSkipHandMarker(marker, mapPos, labels)) continue;

      placeMapPoint(
        {
          id: marker.id,
          name: marker.label,
          category: categoryForMarker(marker),
          x: 0,
          y: 0,
          desc: marker.detail,
        },
        mapPos.x,
        mapPos.y,
        crop,
        candidates,
      );
    }
  }

  return dedupeOverlapping(candidates);
}

/** @deprecated Use getCropMapPoints — kept for any legacy callers. */
export function getCropMarkers(crop: MapCrop, areaId?: string): MapMarker[] {
  return getCropMapPoints(crop, areaId)
    .filter((p): p is MapPoint => !isTrainerPoint(p))
    .map((p) => ({
      id: p.id,
      type: POI_TO_MARKER[p.category] ?? "poi",
      label: p.name,
      detail: p.desc ?? p.note,
      x: p.x,
      y: p.y,
    }));
}

export { isTrainerPoint };
