/**
 * Links walkthrough / guide step ids to interactive area map ids (AREA_MAPS).
 * Outdoor steps that use HoennCrop (EVENT_MAP_CROP) keep the overworld window;
 * interior and dungeon steps use the matching standalone area map here.
 */
import { walkthrough } from "./walkthrough";
import { AREA_MAPS, type AreaMap } from "./areaMaps";

const STEP_TO_CHAPTER: Record<string, string> = {};
for (const section of walkthrough) {
  for (const step of section.steps) STEP_TO_CHAPTER[step.id] = section.id;
}

const areaMapById = new Map(AREA_MAPS.map((a) => [a.id, a]));

function resolveIds(ids: string[]): AreaMap[] {
  const out: AreaMap[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    const area = areaMapById.get(id);
    if (area) {
      seen.add(id);
      out.push(area);
    }
  }
  return out;
}

/** One area map per step (most common). */
export const STEP_AREA_MAP: Record<string, string> = {
  // Littleroot interiors
  "littleroot-1": "littleroottown-brendanshouse-2f",
  "littleroot-2": "littleroottown-mayshouse-2f",
  "littleroot-3": "littleroottown-professorbirchslab",

  // Petalburg Woods
  "petalburg-woods-1": "petalburgwoods",
  "petalburg-woods-2": "petalburgwoods",
  "petalburg-woods-3": "petalburgwoods",

  // Rusturf Tunnel (Devon Corp step has no area map)
  "rusturf-tunnel-1": "rusturftunnel",

  // Granite Cave
  "granite-cave-1": "granitecave-b1f",
  "granite-cave-2": "granitecave-1f",

  // Trick House
  "route-110-1": "route110-trickhousepuzzle1",
  "trick-1": "route110-trickhousepuzzle1",
  "trick-2": "route110-trickhousepuzzle2",
  "trick-3": "route110-trickhousepuzzle3",
  "trick-4": "route110-trickhousepuzzle4",
  "trick-5": "route110-trickhousepuzzle6",
  "trick-6": "route110-trickhousepuzzle6",
  "trick-7": "route110-trickhousepuzzle7",

  // Mauville / New Mauville
  "mauville-2": "mauvillecity-gym",
  "mauville-3": "newmauville-inside",

  // Gym battles — single-floor interiors
  "rustboro-2": "rustborocity-gym",
  "dewford-2": "dewfordtown-gym",
  "petalburg-gym-1": "petalburgcity-gym",
  "fortree-2": "fortreecity-gym",
  "mossdeep-1": "mossdeepcity-gym",

  // Fiery Path & Scorched Slab
  "route-112-2": "fierypath",
  "route-120-3": "scorchedslab",

  // Meteor Falls
  "route-114-2": "meteorfalls-1f-1r",
  "route-114-3": "meteorfalls-b1f-2r",

  // Jagged Pass & Magma Hideout
  "mt-chimney-2": "jaggedpass",
  "magma-hideout-2": "magmahideout-4f",

  // Team Aqua Hideout (multi-floor in STEP_AREA_MAPS)

  // Mt. Pyre
  "mt-pyre-2": "mtpyre-summit",

  // Dive / Seafloor Cavern (multi-floor dive in STEP_AREA_MAPS)
  "seafloor-cavern-2": "seafloorcavern-room9",

  // Mossdeep   Steven's house items
  "mossdeep-3": "mossdeepcity-stevenshouse",

  // SS Tidal
  "slateport-3": "sstidallowerdeck",

  // Sealed Chamber (underwater approach)
  "sealed-chamber-2": "underwater-route126",

  // Optional / post-game guide steps
  "master-ball": "magmahideout-4f",

  // Encounter guide steps
  "enc-petalburg-woods": "petalburgwoods",
  "enc-rusturf-tunnel": "rusturftunnel",
  "enc-granite-cave": "granitecave-1f",
  "enc-fiery-path": "fierypath",
  "enc-mt-pyre": "mtpyre-exterior",
  "enc-victory-road": "victoryroad-1f",
  "enc-sealed-chamber": "underwater-route126",
  // Post-game opening
  "postgame-1": "littleroottown-brendanshouse-2f",
  "postgame-2": "littleroottown-brendanshouse-2f",
  "postgame-3": "littleroottown-professorbirchslab",

  // Post-game Hoenn
  "postgame-hoenn-1": "mossdeepcity-stevenshouse",
  "postgame-hoenn-4": "littleroottown-professorbirchslab",
  "postgame-hoenn-7": "meteorfalls-1f-1r",

  // Battle Frontier gate
  "battle-frontier-2": "battlefrontier-battlepyramidlobby",
};

/** Multiple area maps for steps that span floors or zones. */
export const STEP_AREA_MAPS: Record<string, string[]> = {
  "mt-pyre-1": [
    "mtpyre-exterior",
    "mtpyre-2f",
    "mtpyre-3f",
    "mtpyre-4f",
    "mtpyre-5f",
    "mtpyre-6f",
  ],
  "magma-hideout-1": [
    "magmahideout-1f",
    "magmahideout-2f-2r",
    "magmahideout-3f-1r",
    "magmahideout-3f-2r",
    "magmahideout-3f-3r",
  ],
  "lilycove-2": ["aquahideout-b1f", "aquahideout-b2f"],
  "granite-cave-2": ["granitecave-1f", "granitecave-b2f"],
  "victory-road-2": ["victoryroad-1f", "victoryroad-b1f", "victoryroad-b2f"],
  "sealed-chamber-1": ["underwater-route124", "underwater-route126"],
  "safari-zone-1": ["safarizone-northwest"],
  "safari-zone-2": ["safarizone-north"],
  "safari-zone-3": ["safarizone-northeast", "safarizone-southeast", "safarizone-southwest"],
  "abandoned-ship-1": [
    "abandonedship-rooms-1f",
    "abandonedship-rooms2-1f",
    "abandonedship-captainsoffice",
  ],
  "abandoned-ship-2": [
    "abandonedship-rooms-b1f",
    "abandonedship-rooms2-b1f",
    "abandonedship-hiddenfloorrooms",
    "abandonedship-room-b1f",
  ],
  "shoal-cave-1": [
    "shoalcave-lowtideentranceroom",
    "shoalcave-lowtidestairsroom",
    "shoalcave-lowtideinnerroom",
  ],
  "shoal-cave-2": ["shoalcave-lowtideiceroom"],
  "trick-8": ["route110-trickhousepuzzle8", "route110-trickhouseend"],
  "battle-frontier-1": ["sstidallowerdeck"],
  // Multi-floor gym interiors
  "lavaridge-2": ["lavaridgetown-gym-1f", "lavaridgetown-gym-b1f"],
  "sootopolis-gym-2": ["sootopoliscity-gym-1f", "sootopoliscity-gym-b1f"],
  "postgame-hoenn-5": [
    "safarizone-northeast",
    "safarizone-northwest",
    "safarizone-north",
    "safarizone-southeast",
    "safarizone-southwest",
  ],
  "seafloor-cavern-1": ["underwater-route127", "underwater-route128"],
};

/** Chapter fallback when a step has no explicit mapping but the whole chapter is one dungeon. */
export const CHAPTER_AREA_MAP: Record<string, string> = {
  "petalburg-woods": "petalburgwoods",
  "rusturf-tunnel": "rusturftunnel",
  "granite-cave": "granitecave-1f",
  "magma-hideout": "magmahideout-1f",
  "mt-pyre": "mtpyre-exterior",
  "seafloor-cavern": "seafloorcavern-room9",
  "victory-road": "victoryroad-1f",
  "abandoned-ship": "abandonedship-rooms-1f",
  "shoal-cave": "shoalcave-lowtideentranceroom",
  "sealed-chamber": "underwater-route126",
  "safari-zone": "safarizone-north",
  "battle-frontier": "battlefrontier-battlepyramidlobby",
};

/** Encounter / area ids that use interior area maps instead of the Hoenn composite crop. */
export const INTERIOR_AREA_MAP: Record<string, string> = {
  ...CHAPTER_AREA_MAP,
  "new-mauville": "newmauville-inside",
  "scorched-slab": "scorchedslab",
  "meteor-falls": "meteorfalls-1f-1r",
  "jagged-pass": "jaggedpass",
  "aquahideout": "aquahideout-b1f",
  "trick-house": "route110-trickhousepuzzle1",
};

function areaCaption(area: AreaMap): string {
  return area.floor ? `${area.name}   ${area.floor}` : area.name;
}

/** All area maps to show for a walkthrough step (empty if none). */
export function getAreaMapsForStep(stepId: string): AreaMap[] {
  const multi = STEP_AREA_MAPS[stepId];
  if (multi) return resolveIds(multi);

  const direct = STEP_AREA_MAP[stepId];
  if (direct) {
    const area = areaMapById.get(direct);
    return area ? [area] : [];
  }

  const chapter = STEP_TO_CHAPTER[stepId];
  if (chapter) {
    const fromChapter = CHAPTER_AREA_MAP[chapter];
    if (fromChapter) {
      const area = areaMapById.get(fromChapter);
      if (area) return [area];
    }
  }

  return [];
}

export function getAreaMapForStep(stepId: string): string | undefined {
  return getAreaMapsForStep(stepId)[0]?.id;
}

export function getAreaMapEntry(stepId: string): AreaMap | null {
  return getAreaMapsForStep(stepId)[0] ?? null;
}

export function areaMapShots(stepId: string): { areaMapId: string; caption: string }[] {
  return getAreaMapsForStep(stepId).map((area) => ({
    areaMapId: area.id,
    caption: areaCaption(area),
  }));
}
