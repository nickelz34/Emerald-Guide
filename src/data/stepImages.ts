import { assetUrl } from "../lib/assetUrl";
import { walkthrough } from "./walkthrough";
import { getAreaIdForEncounterStep } from "./encounters";
import { getAreaData } from "./areaData";

export interface StepScreenshot {
  src: string;
  caption: string;
  areaId?: string;
}

const img = (file: string, caption: string, areaId?: string): StepScreenshot => ({
  src: assetUrl(`screenshots/${file}`),
  caption,
  areaId,
});

/**
 * Screenshot + optional areaId for each walkthrough chapter. Every event in a
 * chapter falls back to its chapter image so maps show consistently.
 */
const CHAPTER_IMAGE: Record<string, StepScreenshot> = {
  littleroot: img("littleroot_town_e.png", "Littleroot Town", "littleroot"),
  "route-101": img("route-101.png", "Route 101", "route-101"),
  oldale: img("oldale.png", "Oldale Town", "oldale"),
  "route-103": img("route-103.png", "Route 103", "route-103"),
  "route-102": img("route-102.png", "Route 102", "route-102"),
  petalburg: img("petalburg_city_e.png", "Petalburg City", "petalburg"),
  "route-104": img("route-104.png", "Route 104", "route-104"),
  "petalburg-woods": img("petalburg-woods.png", "Petalburg Woods", "petalburg-woods"),
  rustboro: img("rustboro_city_e.png", "Rustboro City", "rustboro"),
  "route-116": img("route-116.png", "Route 116", "route-116"),
  "rusturf-tunnel": img("rusturf-tunnel.png", "Rusturf Tunnel", "rusturf-tunnel"),
  dewford: img("dewford_town_e.png", "Dewford Town", "dewford"),
  "granite-cave": img("granite-cave.png", "Granite Cave", "granite-cave"),
  slateport: img("slateport_city_e.png", "Slateport City", "slateport"),
  "route-110": img("route110.png", "Route 110", "route-110"),
  mauville: img("mauville_city_e.png", "Mauville City", "mauville"),
  "route-117": img("route-117.png", "Route 117", "route-117"),
  "route-111": img("route-111.png", "Route 111", "route-111"),
  "route-112": img("mt_chimney_e.png", "Route 112 / Fiery Path", "mt-chimney"),
  "route-113": img("route-113.png", "Route 113", "route-113"),
  fallarbor: img("fallarbor.png", "Fallarbor Town", "fallarbor"),
  "route-114": img("fallarbor.png", "Route 114 / Meteor Falls", "fallarbor"),
  "mt-chimney": img("mt_chimney_e.png", "Mt. Chimney", "mt-chimney"),
  lavaridge: img("lavaridge_town_e.png", "Lavaridge Town", "lavaridge"),
  "petalburg-gym": img("petalburg_city_e.png", "Petalburg Gym", "petalburg"),
  "route-118": img("route-118.png", "Route 118", "route-118"),
  "route-119": img("route-119.png", "Route 119 — Weather Institute", "route-119"),
  fortree: img("fortree_city_e.png", "Fortree City", "fortree"),
  "route-120": img("route-120.png", "Route 120", "route-120"),
  lilycove: img("lilycove.png", "Lilycove City", "lilycove"),
  "mt-pyre": img("emeraldtitle.png", "Mt. Pyre"),
  "magma-hideout": img("mt_chimney_e.png", "Team Magma Hideout", "mt-chimney"),
  mossdeep: img("mossdeep_city_e.png", "Mossdeep City", "mossdeep"),
  "seafloor-cavern": img("marine-cave.png", "Seafloor Cavern"),
  sootopolis: img("sootopolis_city_e.png", "Sootopolis City", "sootopolis"),
  "sky-pillar": img("sky-pillar.png", "Sky Pillar", "sky-pillar"),
  "sootopolis-gym": img("sootopolis_city_e.png", "Sootopolis Gym", "sootopolis"),
  "sealed-chamber": img("sealed-chamber.png", "Sealed Chamber", "sealed-chamber"),
  "victory-road": img("victory_road_e.png", "Victory Road", "victory-road"),
  league: img("elite-four.png", "Pokémon League"),
  "battle-frontier": img("battle_frontier_e.png", "Battle Frontier"),
};

const STEP_TO_CHAPTER: Record<string, string> = {};
for (const section of walkthrough) {
  for (const step of section.steps) {
    STEP_TO_CHAPTER[step.id] = section.id;
  }
}

/** Primary + optional extra screenshots per guide step (non-walkthrough categories). */
export const STEP_IMAGES: Record<string, StepScreenshot[]> = {
  "trick-1": [img("trick-house.png", "Trick House", "trick-house"), img("route110.png", "Route 110", "route-110")],
  "trick-2": [img("trick-house.png", "Trick House puzzle 2")],
  "trick-3": [img("trick-house.png", "Trick House puzzle 3")],
  "trick-4": [img("trick-house.png", "Trick House puzzle 4")],
  "trick-5": [img("trick-house.png", "Trick House puzzle 5")],
  "trick-6": [img("trick-house.png", "Trick House puzzle 6")],
  "trick-7": [img("trick-house.png", "Trick House puzzle 7")],
  "trick-8": [img("trick-house.png", "Trick House — final puzzle")],
  "master-ball": [img("mt_chimney_e.png", "Team Magma Hideout area")],
  "exp-share": [img("route-103.png", "Route 103 — Mr. Briney"), img("rustboro_city_e.png", "Devon Corp")],
  "lucky-egg": [img("fortree_city_e.png", "Fortree — Chansey")],
  "berry-master": [img("route-120.png", "Route 123 area")],
  "secret-base": [img("route-104.png", "Secret Base trees")],
  "battle-frontier": [img("battle_frontier_e.png", "Battle Frontier")],
  "mirage-island": [img("pacifidlog.png", "Pacifidlog — Mirage Island hint")],
  "regi-puzzle": [img("sealed-chamber.png", "Sealed Chamber")],

  "rayquaza-catch": [img("sky-pillar.png", "Sky Pillar — Rayquaza")],
  kyogre: [img("marine-cave.png", "Marine Cave — Kyogre")],
  groudon: [img("mt_chimney_e.png", "Terra Cave area")],
  regirock: [img("route-111.png", "Desert Ruins — Route 111", "route-111")],
  regice: [img("route-105.png", "Island Cave — Route 105", "route-105")],
  registeel: [img("route-120.png", "Ancient Tomb — Route 120", "route-120")],
  "latios-latias": [img("lilycove.png", "Lilycove — TV event")],
  "deoxys-note": [img("emeraldtitle.png", "Event legendary note")],
  "jirachi-note": [img("emeraldtitle.png", "Event legendary note")],

  "hm-list": [img("route110.png", "HMs across Hoenn", "route-110")],
  "gym-counters": [img("mauville_city_e.png", "Gym matchups")],
  "mudkip-line": [img("littleroot_town_e.png", "Mudkip starter")],
  "torchic-line": [img("littleroot_town_e.png", "Torchic starter")],
  "treecko-line": [img("littleroot_town_e.png", "Treecko starter")],
  "save-spots": [img("littleroot_town_e.png", "Save often")],
  pickup: [img("route110.png", "Pickup ability", "route-110")],
  "dex-nav": [img("rustboro_city_e.png", "Pokédex & Match Call")],

  "enc-route-101": [img("route-101.png", "Route 101", "route-101")],
  "enc-route-102": [img("route-102.png", "Route 102", "route-102")],
  "enc-route-103": [img("route-103.png", "Route 103", "route-103")],
  "enc-petalburg-woods": [img("petalburg-woods.png", "Petalburg Woods", "petalburg-woods")],
  "enc-route-104": [img("route-104.png", "Route 104", "route-104")],
  "enc-route-116": [img("route-116.png", "Route 116", "route-116")],
  "enc-rusturf-tunnel": [img("rusturf-tunnel.png", "Rusturf Tunnel", "rusturf-tunnel")],
  "enc-granite-cave": [img("granite-cave.png", "Granite Cave", "granite-cave")],
  "enc-dewford": [img("dewford_town_e.png", "Dewford", "dewford")],
  "enc-route-110": [img("route110.png", "Route 110", "route-110")],
  "enc-fiery-path": [],
  "enc-mt-chimney": [img("mt_chimney_e.png", "Mt. Chimney", "mt-chimney")],
  "enc-route-113": [img("route-113.png", "Route 113", "route-113")],
  "enc-fallarbor": [img("fallarbor.png", "Fallarbor Town", "fallarbor")],
  "enc-route-119": [img("route-119.png", "Route 119", "route-119")],
  "enc-route-120": [img("route-120.png", "Route 120", "route-120")],
  "enc-mt-pyre": [],
  "enc-mossdeep": [img("mossdeep_city_e.png", "Mossdeep", "mossdeep")],
  "enc-sootopolis": [img("sootopolis_city_e.png", "Sootopolis", "sootopolis")],
  "enc-sky-pillar": [img("sky-pillar.png", "Sky Pillar", "sky-pillar")],
  "enc-victory-road": [img("victory_road_e.png", "Victory Road", "victory-road")],
  "enc-lilycove": [img("lilycove.png", "Lilycove City", "lilycove")],
  "enc-pacifidlog": [img("pacifidlog.png", "Pacifidlog Town", "pacifidlog")],
  "enc-sealed-chamber": [img("sealed-chamber.png", "Sealed Chamber", "sealed-chamber")],
};

export function getStepImages(stepId: string): StepScreenshot[] {
  if (STEP_IMAGES[stepId]) return STEP_IMAGES[stepId];

  const chapter = STEP_TO_CHAPTER[stepId];
  if (chapter && CHAPTER_IMAGE[chapter]) return [CHAPTER_IMAGE[chapter]];

  const areaId = getAreaIdForEncounterStep(stepId);
  if (areaId) {
    const shot = getAreaData(areaId)?.screenshot;
    if (shot) return [img(shot, areaId.replace(/-/g, " "), areaId)];
  }

  return [img("emeraldtitle.png", "Pokémon Emerald", "littleroot")];
}
