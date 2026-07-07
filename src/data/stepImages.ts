import { assetUrl } from "../lib/assetUrl";
import { walkthrough } from "./walkthrough";
import {
  EVENT_MAP_CROP,
  AREA_MAP_CROP,
  CHAPTER_MAP_CROP,
  type MapCrop,
} from "./mapCrops";
import { getAreasForStep } from "./areaData";
import { getAreaIdForEncounterStep } from "./encounters";
import { areaMapShots, INTERIOR_AREA_MAP } from "./stepAreaMaps";

export interface StepScreenshot {
  src: string;
  caption: string;
  areaId?: string;
  /** Interactive interior/dungeon map from AREA_MAPS (items + trainers). */
  areaMapId?: string;
  /**
   * Window into the shared true-scale Hoenn map (public/maps/hoenn-map.png).
   * Rendered by HoennCrop with the same markers as the main map modal.
   */
  crop?: MapCrop;
}

const HOENN_MAP_SRC = assetUrl("maps/hoenn-map.png");

const STEP_TO_CHAPTER: Record<string, string> = {};
for (const section of walkthrough) {
  for (const step of section.steps) {
    STEP_TO_CHAPTER[step.id] = section.id;
  }
}

function resolveOutdoorCrop(
  stepId: string,
  chapterId?: string,
): { crop: MapCrop; caption: string; areaId?: string } | null {
  const event = EVENT_MAP_CROP[stepId];
  if (event) {
    return { crop: event.crop, caption: event.caption, areaId: event.areaId };
  }

  for (const areaId of getAreasForStep(stepId)) {
    const area = AREA_MAP_CROP[areaId];
    if (area) {
      return { crop: area.crop, caption: area.caption, areaId: area.areaId ?? areaId };
    }
  }

  const encArea = getAreaIdForEncounterStep(stepId);
  if (encArea) {
    const area = AREA_MAP_CROP[encArea];
    if (area) {
      return { crop: area.crop, caption: area.caption, areaId: area.areaId ?? encArea };
    }
  }

  if (chapterId) {
    const chapter = CHAPTER_MAP_CROP[chapterId];
    if (chapter) {
      return { crop: chapter.crop, caption: chapter.caption, areaId: chapter.areaId };
    }
  }

  return null;
}

/** Map image for an encounter/area id — interior area map or Hoenn composite crop. */
export function getAreaDisplayMap(areaId: string, caption?: string): StepScreenshot | null {
  const interiorId = INTERIOR_AREA_MAP[areaId];
  if (interiorId) {
    return {
      src: "",
      caption: caption ?? areaId.replace(/-/g, " "),
      areaMapId: interiorId,
    };
  }

  const outdoor = AREA_MAP_CROP[areaId];
  if (outdoor) {
    return {
      src: HOENN_MAP_SRC,
      caption: caption ?? outdoor.caption,
      areaId: outdoor.areaId ?? areaId,
      crop: outdoor.crop,
    };
  }

  return null;
}

/** Primary map view for a walkthrough or guide step. */
export function getStepImages(stepId: string): StepScreenshot[] {
  const areaMaps = areaMapShots(stepId);
  if (areaMaps.length > 0) {
    return areaMaps.map(({ areaMapId, caption }) => ({
      src: "",
      caption,
      areaMapId,
    }));
  }

  const chapter = STEP_TO_CHAPTER[stepId];
  const outdoor = resolveOutdoorCrop(stepId, chapter);
  if (outdoor) {
    return [
      {
        src: HOENN_MAP_SRC,
        caption: outdoor.caption,
        areaId: outdoor.areaId,
        crop: outdoor.crop,
      },
    ];
  }

  return [
    {
      src: HOENN_MAP_SRC,
      caption: "Hoenn Region",
      crop: { x: 0, y: 0, w: 100, h: 100 },
    },
  ];
}
