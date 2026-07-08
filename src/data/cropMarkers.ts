import { MAP_ANNOTATIONS, type MapMarker, type MarkerType } from "./mapAnnotations";
import { MAP_POINTS, type MapPoint, type PoiCategory } from "./mapPoints";
import { GENERATED_POINTS } from "./mapPointsGenerated";
import { MAP_TRAINERS, type TrainerPoint } from "./mapTrainersGenerated";
import { AREA_MARKER_MAP_POS, AREA_NOTE_LABELS, HOENN_MAP_H, HOENN_MAP_W, type MapCrop } from "./mapCrops";

const ALL_MAP_POINTS: MapPoint[] = [...MAP_POINTS, ...GENERATED_POINTS];

export type CropMapPoint = MapPoint | TrainerPoint;

const MARKER_TO_POI: Record<MarkerType, PoiCategory> = {
  trainer: "trainer",
  item: "item",
  npc: "landmark",
  building: "entrance",
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
  return {
    x: marker.x,
    y: marker.y,
    mapPos: {
      x: displayCrop.x + (marker.x / 100) * displayCrop.w,
      y: displayCrop.y + (marker.y / 100) * displayCrop.h,
    },
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
  if (areaId && MAP_ANNOTATIONS[areaId]) {
    for (const marker of MAP_ANNOTATIONS[areaId].markers) {
      const placed = markerToCropLocal(marker, areaId, crop);
      if (!placed) continue;
      const { mapPos, x, y } = placed;
      // Prefer auto-generated trainer sprites over hand-placed trainer dots.
      if (marker.type === "trainer" && trainerSpriteNear(mapPos, labels)) continue;
      // Prefer main-map building entrances over hand-placed duplicates.
      if (marker.type === "building" && labels.length > 0 && generatedEntranceNear(mapPos, labels)) {
        continue;
      }
      add(annotationToMapPoint(marker, { x, y }));
    }
  }

  // Game-extracted items, berries, entrances, etc. (true-scale on the big map).
  if (labels.length > 0) {
    for (const pt of ALL_MAP_POINTS) {
      if (!noteMatchesArea(pt.note, labels)) continue;
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
