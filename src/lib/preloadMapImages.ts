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

/** Warm cache for the full Hoenn overworld composite (WebP + PNG fallback). */
export function preloadHoennOverworldMap() {
  preloadUrl("maps/hoenn-map.webp");
  preloadUrl("maps/hoenn-map.png");
  // TEST bake: only the all-on composite — per-category layers load on demand.
  preloadUrl("maps/hoenn-map-baked.webp");
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
