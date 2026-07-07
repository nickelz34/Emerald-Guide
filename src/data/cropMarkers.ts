import { MAP_ANNOTATIONS, type MapMarker, type MarkerType } from "./mapAnnotations";
import { MAP_POINTS, type MapPoint, type PoiCategory } from "./mapPoints";
import { GENERATED_POINTS } from "./mapPointsGenerated";
import { MAP_TRAINERS, type TrainerPoint } from "./mapTrainersGenerated";
import { AREA_MAP_BOUNDS, AREA_MARKER_MAP_POS, AREA_NOTE_LABELS, HOENN_MAP_H, HOENN_MAP_W, type MapCrop } from "./mapCrops";

const ALL_MAP_POINTS: MapPoint[] = [...MAP_POINTS, ...GENERATED_POINTS];

export type CropMapPoint = MapPoint | TrainerPoint;

const MARKER_TO_POI: Record<MarkerType, PoiCategory> = {
  trainer: "trainer",
  item: "item",
  npc: "landmark",
  building: "town",
  poi: "landmark",
  wild: "landmark",
};

const POI_TO_MARKER: Record<PoiCategory, MarkerType> = {
  town: "building",
  route: "poi",
  gym: "building",
  cave: "poi",
  landmark: "poi",
  item: "item",
  hidden: "item",
  berry: "item",
  entrance: "building",
  trainer: "trainer",
};

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

function markerToMapPos(marker: MapMarker, areaId: string, bounds: MapCrop): { x: number; y: number } {
  const tilePos = AREA_MARKER_MAP_POS[areaId]?.[marker.id];
  if (tilePos) return tilePos;
  return {
    x: bounds.x + (marker.x / 100) * bounds.w,
    y: bounds.y + (marker.y / 100) * bounds.h,
  };
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

function annotationToMapPoint(marker: MapMarker, local: { x: number; y: number }): MapPoint {
  return {
    id: marker.id,
    name: marker.label,
    category: MARKER_TO_POI[marker.type],
    x: local.x,
    y: local.y,
    desc: marker.detail,
  };
}

/**
 * Walkthrough crop markers — hand-placed annotations + game-extracted POIs for the
 * area, plus overworld trainer sprites when available. Rendered with hoenn-map__pin
 * styling (POI_CATEGORIES colors) in HoennCrop.
 */
export function getCropMapPoints(crop: MapCrop, areaId?: string): CropMapPoint[] {
  const seen = new Set<string>();
  const out: CropMapPoint[] = [];

  const add = (pt: CropMapPoint) => {
    if (seen.has(pt.id)) return;
    seen.add(pt.id);
    out.push(pt);
  };

  const labels = areaId ? (AREA_NOTE_LABELS[areaId] ?? []) : [];

  // Hand-tuned walkthrough markers (trainers, grass, story POIs, buildings).
  if (areaId && MAP_ANNOTATIONS[areaId] && AREA_MAP_BOUNDS[areaId]) {
    const bounds = AREA_MAP_BOUNDS[areaId];
    for (const marker of MAP_ANNOTATIONS[areaId].markers) {
      const mapPos = markerToMapPos(marker, areaId, bounds);
      // Prefer auto-generated trainer sprites over hand-placed trainer dots.
      if (marker.type === "trainer" && trainerSpriteNear(mapPos, labels)) continue;
      const local = toCropLocal(mapPos.x, mapPos.y, crop);
      if (!local) continue;
      add(annotationToMapPoint(marker, local));
    }
  }

  // Game-extracted items, berries, entrances, etc. (true-scale on the big map).
  // Skip auto-generated building entrances when hand-authored annotations already
  // cover the area — avoids duplicate pins (e.g. "House (NW)" + "House1").
  const hasBuildingAnnotations =
    areaId &&
    MAP_ANNOTATIONS[areaId]?.markers.some((m) => m.type === "building" || m.type === "poi");

  if (labels.length > 0) {
    for (const pt of ALL_MAP_POINTS) {
      if (!noteMatchesArea(pt.note, labels)) continue;
      if (hasBuildingAnnotations && pt.category === "entrance") continue;
      const local = toCropLocal(pt.x, pt.y, crop);
      if (!local) continue;
      add({
        id: `mp-${pt.id}`,
        name: pt.name,
        category: pt.category,
        x: local.x,
        y: local.y,
        desc: pt.desc ?? pt.note,
        note: pt.note,
      });
    }

    // Overworld trainer sprites from the main map data (same as Hoenn map modal).
    for (const tr of MAP_TRAINERS) {
      if (!noteMatchesArea(tr.note, labels)) continue;
      const local = toCropLocal(tr.x, tr.y, crop);
      if (!local) continue;
      add({ ...tr, x: local.x, y: local.y });
    }
  }

  return out;
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
