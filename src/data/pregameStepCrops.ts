import { AREA_MAP_CROP, type EventMapCrop } from "./mapCrops";

/**
 * Hoenn-map crop stacks for pregame field events that do not use area-map cutscenes.
 * Fishing rods are earned in three towns — show those windows in order.
 */
export const PREGAME_STEP_CROPS: Record<string, EventMapCrop[]> = {
  "pregame-field-3": [
    { ...AREA_MAP_CROP.dewford, caption: "Dewford Town — Old Rod fisherman" },
    { ...AREA_MAP_CROP["route-118"], caption: "Route 118 — Good Rod (needs Surf)" },
    { ...AREA_MAP_CROP.mossdeep, caption: "Mossdeep City — free Super Rod" },
  ],
};
