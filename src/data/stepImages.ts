import { getAreaIdForEncounterStep } from "./encounters";
import { getAreaData } from "./areaData";

export interface StepScreenshot {
  src: string;
  caption: string;
  areaId?: string;
}

const img = (file: string, caption: string, areaId?: string): StepScreenshot => ({
  src: `/screenshots/${file}`,
  caption,
  areaId,
});

/** Primary + optional extra screenshots per guide step. */
export const STEP_IMAGES: Record<string, StepScreenshot[]> = {
  start: [img("littleroot_town_e.png", "Littleroot Town", "littleroot"), img("route-101.png", "Route 101", "route-101"), img("oldale.png", "Oldale Town", "oldale")],
  petalburg: [img("petalburg_city_e.png", "Petalburg City", "petalburg"), img("petalburg-woods.png", "Petalburg Woods", "petalburg-woods")],
  "stone-badge": [img("rustboro_city_e.png", "Rustboro City", "rustboro"), img("route-116.png", "Route 116", "route-116")],
  "knuckle-badge": [img("dewford_town_e.png", "Dewford Town", "dewford"), img("granite-cave.png", "Granite Cave", "granite-cave")],
  "slateport-museum": [img("slateport_city_e.png", "Slateport City", "slateport")],
  "dynamo-badge": [img("mauville_city_e.png", "Mauville City", "mauville"), img("route110.png", "Route 110", "route-110")],
  chimney: [img("mt_chimney_e.png", "Mt. Chimney", "mt-chimney")],
  "heat-badge": [img("lavaridge_town_e.png", "Lavaridge Town", "lavaridge"), img("fallarbor.png", "Fallarbor Town", "fallarbor")],
  norman: [img("petalburg_city_e.png", "Petalburg Gym", "petalburg")],
  "feather-badge": [img("fortree_city_e.png", "Fortree City", "fortree"), img("route-120.png", "Route 120", "route-120")],
  "weather-institute": [img("route-119.png", "Route 119 — Weather Institute", "route-119")],
  "mt-pyre": [],
  "mind-badge": [img("mossdeep_city_e.png", "Mossdeep City", "mossdeep")],
  "seafloor-cavern": [img("marine-cave.png", "Marine Cave", "marine-cave")],
  "sootopolis-rayquaza": [
    img("sootopolis_city_e.png", "Sootopolis City", "sootopolis"),
    img("sky-pillar.png", "Sky Pillar", "sky-pillar"),
    img("pacifidlog.png", "Pacifidlog Town", "pacifidlog"),
  ],
  "rain-badge": [img("sootopolis_city_e.png", "Sootopolis Gym", "sootopolis")],
  "victory-road": [
    img("victory_road_e.png", "Victory Road", "victory-road"),
    img("ever-grande.png", "Ever Grande City", "ever-grande"),
  ],

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

  const areaId = getAreaIdForEncounterStep(stepId);
  if (areaId) {
    const shot = getAreaData(areaId)?.screenshot;
    if (shot) return [img(shot, areaId.replace(/-/g, " "), areaId)];
  }

  return [img("emeraldtitle.png", "Pokémon Emerald", "littleroot")];
}
