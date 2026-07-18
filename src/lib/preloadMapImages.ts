import { assetUrl } from "./assetUrl";
import { AREA_MAPS } from "../data/areaMaps";
import { hoennCropImagePath } from "../data/hoennCropImages";
import type { StepScreenshot } from "../data/stepImages";

const preloaded = new Set<string>();

function preloadUrl(path: string) {
  const url = assetUrl(path);
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

/** Warm cache for the Hoenn overworld atlas + filterable bake layers. */
export function preloadHoennOverworldMap() {
  preloadUrl("maps/hoenn-map.webp");
  preloadUrl("maps/hoenn-map.png");
  // Per-category layers (used whenever legend filters change — keep them warm).
  for (const cat of ["trainer", "item", "hidden", "berry"] as const) {
    preloadUrl(`maps/hoenn-map-baked-${cat}.webp`);
    preloadUrl(`maps/hoenn-map-baked-${cat}.png`);
  }
}

/** Warm the browser cache for walkthrough map images on the current step. */
export function preloadStepMapImages(images: StepScreenshot[]) {
  for (const shot of images) {
    let path: string | null = null;
    if (shot.areaMapId) {
      const area = AREA_MAPS.find((a) => a.id === shot.areaMapId);
      path = area?.image ?? null;
    } else if (shot.crop) {
      path = hoennCropImagePath(shot.areaId);
    }
    if (!path) continue;
    preloadUrl(path);
  }
}
