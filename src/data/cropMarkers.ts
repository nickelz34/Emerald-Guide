import { MAP_ANNOTATIONS, type MapMarker, type MarkerType } from "./mapAnnotations";
import { MAP_POINTS, type MapPoint, type PoiCategory } from "./mapPoints";
import { GENERATED_POINTS } from "./mapPointsGenerated";
import { AREA_MAP_BOUNDS, AREA_MARKER_MAP_POS, AREA_NOTE_LABELS, type MapCrop } from "./mapCrops";

const ALL_MAP_POINTS: MapPoint[] = [...MAP_POINTS, ...GENERATED_POINTS];

const POI_TO_MARKER: Record<PoiCategory, MarkerType> = {
  town: "building",
  gym: "building",
  cave: "poi",
  landmark: "poi",
  item: "item",
  hidden: "item",
  berry: "item",
  entrance: "building",
  trainer: "trainer",
};

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

/**
 * POI markers for a Hoenn map crop — combines hand-placed area annotations with
 * game-extracted map points, all projected into crop-local coordinates.
 */
export function getCropMarkers(crop: MapCrop, areaId?: string): MapMarker[] {
  const seen = new Set<string>();
  const out: MapMarker[] = [];

  const add = (m: MapMarker) => {
    const key = `${m.type}:${Math.round(m.x)}:${Math.round(m.y)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(m);
  };

  // Hand-tuned walkthrough markers (trainers, grass, story POIs).
  if (areaId && MAP_ANNOTATIONS[areaId] && AREA_MAP_BOUNDS[areaId]) {
    const bounds = AREA_MAP_BOUNDS[areaId];
    for (const marker of MAP_ANNOTATIONS[areaId].markers) {
      const mapPos = markerToMapPos(marker, areaId, bounds);
      const local = toCropLocal(mapPos.x, mapPos.y, crop);
      if (!local) continue;
      add({ ...marker, x: local.x, y: local.y });
    }
  }

  const labels = areaId ? AREA_NOTE_LABELS[areaId] ?? [] : [];

  // Game-extracted items, berries, entrances, etc. (true-scale on the big map).
  if (labels.length > 0) {
    for (const pt of ALL_MAP_POINTS) {
      if (!noteMatchesArea(pt.note, labels)) continue;
      const local = toCropLocal(pt.x, pt.y, crop);
      if (!local) continue;
      add({
        id: `mp-${pt.id}`,
        type: POI_TO_MARKER[pt.category],
        label: pt.name,
        detail: pt.desc ?? pt.note,
        x: local.x,
        y: local.y,
      });
    }
  }

  return out;
}
