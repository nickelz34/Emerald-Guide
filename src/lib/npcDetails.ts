import type { MapPoint } from "../data/mapPoints";
import {
  NPC_DETAILS_BY_SCRIPT,
  type NpcScriptDetails,
  type NpcStoryLink,
} from "../data/npcDetailsGenerated";
import { isNpcLegendPoint } from "./mapLegendCategory";

export type NpcMapPoint = MapPoint & {
  graphicsId?: string;
  spriteSheet?: string;
  spriteWidth?: number;
  spriteHeight?: number;
  spriteFrame?: number;
  spriteFlipX?: boolean;
  script?: string;
  mapId?: string;
  trainerType?: string;
  trainerClass?: string;
  trainerName?: string;
};

export function isNpcMapPoint(point: MapPoint): point is NpcMapPoint {
  return isNpcLegendPoint(point);
}

export function getNpcScriptDetails(point: NpcMapPoint): NpcScriptDetails | null {
  const script = point.script;
  if (!script) return null;
  return NPC_DETAILS_BY_SCRIPT[script] ?? null;
}

export function getNpcStoryLinks(point: NpcMapPoint): NpcStoryLink[] {
  return getNpcScriptDetails(point)?.story ?? [];
}

export function getNpcDialogue(point: NpcMapPoint): string[] {
  return getNpcScriptDetails(point)?.dialogue ?? [];
}

/** True when this NPC has indexed walkthrough / story links. */
export function npcHasStory(point: MapPoint): boolean {
  if (!isNpcMapPoint(point)) return false;
  return getNpcStoryLinks(point).length > 0;
}
