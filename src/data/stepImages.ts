import { assetUrl } from "../lib/assetUrl";
import { walkthrough } from "./walkthrough";
import { getAreaIdForEncounterStep } from "./encounters";
import { getAreaData } from "./areaData";
import { EVENT_MAP_CROP, type MapCrop } from "./mapCrops";
import { areaMapShots } from "./stepAreaMaps";

export interface StepScreenshot {
  src: string;
  caption: string;
  areaId?: string;
  /** Interactive interior/dungeon map from AREA_MAPS (items + trainers). */
  areaMapId?: string;
  /**
   * When false, this image should never have POI markers overlaid (used for the
   * per-event location renders, whose crop/scale differs from the annotated
   * chapter maps so chapter markers would be misaligned).
   */
  annotate?: boolean;
  /**
   * When set, this "image" is a window into the shared true-scale Hoenn map
   * (public/maps/hoenn-map.png) framed to a single town or route. Rendered by
   * HoennCrop rather than as a standalone image.
   */
  crop?: MapCrop;
}

const HOENN_MAP_SRC = assetUrl("maps/hoenn-map.png");

const img = (file: string, caption: string, areaId?: string): StepScreenshot => ({
  src: assetUrl(`screenshots/${file}`),
  caption,
  areaId,
});

/** Per-event location render — accurate standalone map, no marker overlay. */
const evImg = (file: string, caption: string): StepScreenshot => ({
  src: assetUrl(`screenshots/${file}`),
  caption,
  annotate: false,
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

/**
 * Per-event, pixel-perfect location renders. Each image is composited directly
 * from the pokeemerald tile/palette data for the exact map that event happens on
 * (interiors included), so it is an accurate top-down render of that location.
 * Generated via .calib/render-locations.mjs from .calib/event-map.json.
 */
const EVENT_IMAGE: Record<string, StepScreenshot> = {
  "littleroot-1": evImg("events/littleroot-1.png", "Your bedroom — set the clock, grab the PC Potion"),
  "littleroot-2": evImg("events/littleroot-2.png", "Your rival's room, next door"),
  "littleroot-3": evImg("events/littleroot-3.png", "Professor Birch's Lab"),
  "route-101-1": img("events/route-101-1.png", "Route 101 — Birch's rescue", "route-101"),
  "route-101-2": img("events/route-101-2.png", "Route 101 — choosing your starter", "route-101"),
  "route-101-3": evImg("events/route-101-3.png", "Back at the Lab for your Pokédex"),
  "oldale-1": img("events/oldale-1.png", "Oldale Town", "oldale"),
  "oldale-2": img("events/oldale-2.png", "Oldale Town — the crossroads", "oldale"),
  "route-103-1": img("events/route-103-1.png", "Route 103 — north shore", "route-103"),
  "route-103-2": img("events/route-103-2.png", "Route 103 — Rival Battle #1", "route-103"),
  "route-103-3": img("events/route-103-3.png", "Back through Oldale, heading west", "oldale"),
  "route-102-1": img("events/route-102-1.png", "Route 102 — trainers to Petalburg", "route-102"),
  "route-102-2": img("events/route-102-2.png", "Route 102 — rare Ralts grass", "route-102"),
  "route-102-3": img("events/route-102-3.png", "Petalburg City", "petalburg"),
  "petalburg-1": evImg("events/petalburg-1.png", "Petalburg Gym — meeting Norman"),
  "petalburg-2": img("events/petalburg-2.png", "Route 102 — Wally's catching tutorial", "route-102"),
  "petalburg-3": img("events/petalburg-3.png", "Petalburg City — stock up", "petalburg"),
  "route-104-1": evImg("events/route-104-1.png", "Mr. Briney's cottage"),
  "route-104-2": evImg("events/route-104-2.png", "Pretty Petal Flower Shop"),
  "route-104-3": img("events/route-104-3.png", "Route 104 — beach and flowers", "route-104"),
  "petalburg-woods-1": img("events/petalburg-woods-1.png", "Petalburg Woods", "petalburg-woods"),
  "petalburg-woods-2": img("events/petalburg-woods-2.png", "Petalburg Woods — Team Aqua ambush", "petalburg-woods"),
  "petalburg-woods-3": img("events/petalburg-woods-3.png", "Petalburg Woods — hidden items", "petalburg-woods"),
  "rustboro-1": evImg("events/rustboro-1.png", "The Cutter's House — HM01 Cut"),
  "rustboro-2": evImg("events/rustboro-2.png", "Rustboro Gym — Roxanne"),
  "rustboro-3": img("events/rustboro-3.png", "Rustboro City — the Devon theft", "rustboro"),
  "route-116-1": img("events/route-116-1.png", "Route 116 — chasing the thief", "route-116"),
  "route-116-2": img("events/route-116-2.png", "Route 116 — route items", "route-116"),
  "rusturf-tunnel-1": img("events/rusturf-tunnel-1.png", "Rusturf Tunnel — cornering the Grunt", "rusturf-tunnel"),
  "rusturf-tunnel-2": evImg("events/rusturf-tunnel-2.png", "Devon Corp — Mr. Stone's office"),
  "dewford-1": img("events/dewford-1.png", "Dewford Town", "dewford"),
  "dewford-2": evImg("events/dewford-2.png", "Dewford Gym — Brawly (dark maze)"),
  "dewford-3": img("events/dewford-3.png", "Dewford — heading to Granite Cave", "dewford"),
  "granite-cave-1": evImg("events/granite-cave-1.png", "Granite Cave — Steven's room"),
  "granite-cave-2": evImg("events/granite-cave-2.png", "Granite Cave 1F — HM05 Flash"),
  "granite-cave-3": evImg("events/granite-cave-3.png", "Route 109 beach — landing at Slateport"),
  "slateport-1": img("events/slateport-1.png", "Slateport City — the market", "slateport"),
  "slateport-2": evImg("events/slateport-2.png", "Oceanic Museum 2F — Archie"),
  "slateport-3": img("events/slateport-3.png", "Route 110 — north to Mauville", "route-110"),
  "route-110-1": evImg("events/route-110-1.png", "Trick House — puzzle #1"),
  "route-110-2": img("events/route-110-2.png", "Route 110 — beneath Cycling Road", "route-110"),
  "route-110-3": img("events/route-110-3.png", "Route 110 — Rival Battle #3", "route-110"),
  "mauville-1": evImg("events/mauville-1.png", "Rydel's Cycles"),
  "mauville-2": evImg("events/mauville-2.png", "Mauville Gym — Wattson (switch puzzle)"),
  "mauville-3": evImg("events/mauville-3.png", "New Mauville — the generator"),
  "route-117-1": evImg("events/route-117-1.png", "Route 117 — the Pokémon Day Care"),
  "route-117-2": evImg("events/route-117-2.png", "Verdanturf Town"),
  "route-111-1": evImg("events/route-111-1.png", "The Winstrate family's house"),
  "route-111-2": evImg("events/route-111-2.png", "Mirage Tower — the desert fossils"),
  "route-111-3": evImg("events/route-111-3.png", "Route 112 — around the desert"),
  "route-112-1": evImg("events/route-112-1.png", "Route 112 — Team Magma slopes"),
  "route-112-2": evImg("events/route-112-2.png", "Fiery Path"),
  "route-113-1": img("events/route-113-1.png", "Route 113 — volcanic ash", "route-113"),
  "route-113-2": evImg("events/route-113-2.png", "The Glass Workshop"),
  "fallarbor-1": evImg("events/fallarbor-1.png", "Professor Cozmo's house"),
  "fallarbor-2": evImg("events/fallarbor-2.png", "The Move Maniac's house"),
  "route-114-1": evImg("events/route-114-1.png", "Lanette's house — Route 114"),
  "route-114-2": evImg("events/route-114-2.png", "Meteor Falls"),
  "route-114-3": evImg("events/route-114-3.png", "Mt. Chimney cable car station"),
  "mt-chimney-1": img("events/mt-chimney-1.png", "Mt. Chimney summit — Maxie", "mt-chimney"),
  "mt-chimney-2": evImg("events/mt-chimney-2.png", "Jagged Pass"),
  "lavaridge-1": img("events/lavaridge-1.png", "Lavaridge Town — hot springs", "lavaridge"),
  "lavaridge-2": evImg("events/lavaridge-2.png", "Lavaridge Gym — Flannery"),
  "lavaridge-3": img("events/lavaridge-3.png", "Route 111 desert — back to Petalburg", "route-111"),
  "petalburg-gym-1": evImg("events/petalburg-gym-1.png", "Petalburg Gym — Norman"),
  "petalburg-gym-2": evImg("events/petalburg-gym-2.png", "Petalburg — receiving HM03 Surf"),
  "petalburg-gym-3": img("events/petalburg-gym-3.png", "Route 118 — Surf east", "route-118"),
  "route-118-1": img("events/route-118-1.png", "Route 118 — coastal crossing", "route-118"),
  "route-118-2": img("events/route-118-2.png", "Route 119 — into the jungle", "route-119"),
  "route-119-1": img("events/route-119-1.png", "Route 119 — rainy jungle", "route-119"),
  "route-119-2": evImg("events/route-119-2.png", "Weather Institute 2F — Shelly"),
  "route-119-3": img("events/route-119-3.png", "Route 119 — Rival Battle #4", "route-119"),
  "fortree-1": img("events/fortree-1.png", "Fortree City — the treetop town", "fortree"),
  "fortree-2": evImg("events/fortree-2.png", "Fortree Gym — Winona"),
  "route-120-1": img("events/route-120-1.png", "Route 120 — Steven & the Devon Scope", "route-120"),
  "route-120-2": evImg("events/route-120-2.png", "Ancient Tomb — Registeel"),
  "lilycove-1": evImg("events/lilycove-1.png", "Lilycove Department Store"),
  "lilycove-2": evImg("events/lilycove-2.png", "Team Aqua Hideout"),
  "lilycove-3": evImg("events/lilycove-3.png", "Route 122 — south toward Mt. Pyre"),
  "mt-pyre-1": evImg("events/mt-pyre-1.png", "Mt. Pyre — memorial floors"),
  "mt-pyre-2": evImg("events/mt-pyre-2.png", "Mt. Pyre summit — the orb theft"),
  "magma-hideout-1": evImg("events/magma-hideout-1.png", "Team Magma Hideout — cart rails"),
  "magma-hideout-2": evImg("events/magma-hideout-2.png", "Magma Hideout depths — Groudon wakes"),
  "mossdeep-1": evImg("events/mossdeep-1.png", "Mossdeep Gym — Tate & Liza"),
  "mossdeep-2": evImg("events/mossdeep-2.png", "Mossdeep Space Center"),
  "mossdeep-3": img("events/mossdeep-3.png", "Mossdeep City — Super Rod fishing", "mossdeep"),
  "seafloor-cavern-1": evImg("events/seafloor-cavern-1.png", "Seafloor Cavern entrance"),
  "seafloor-cavern-2": evImg("events/seafloor-cavern-2.png", "Seafloor Cavern depths — Kyogre wakes"),
  "sootopolis-1": img("events/sootopolis-1.png", "Sootopolis City — the weather crisis", "sootopolis"),
  "sootopolis-2": img("events/sootopolis-2.png", "Pacifidlog Town — toward the Sky Pillar", "pacifidlog"),
  "sky-pillar-1": evImg("events/sky-pillar-1.png", "Sky Pillar — cracked floors"),
  "sky-pillar-2": evImg("events/sky-pillar-2.png", "Sky Pillar summit — Rayquaza"),
  "sky-pillar-3": evImg("events/sky-pillar-2.png", "Sky Pillar summit — catch Rayquaza"),
  "sootopolis-gym-1": img("events/sootopolis-gym-1.png", "Sootopolis — HM07 Waterfall from Wallace", "sootopolis"),
  "sootopolis-gym-2": evImg("events/sootopolis-gym-2.png", "Sootopolis Gym — Wallace (ice floor)"),
  "sootopolis-gym-3": img("marine-cave.png", "Marine Cave — Kyogre"),
  "sealed-chamber-1": evImg("events/sealed-chamber-1.png", "Sealed Chamber — outer room"),
  "sealed-chamber-2": evImg("events/sealed-chamber-2.png", "Sealed Chamber — the Regi Braille"),
  "sealed-chamber-3": img("route-111.png", "Desert Ruins — Regirock", "route-111"),
  "sealed-chamber-4": img("route-105.png", "Island Cave — Regice", "route-105"),
  "sealed-chamber-5": img("route-120.png", "Ancient Tomb — Registeel", "route-120"),
  "victory-road-1": img("events/victory-road-1.png", "Ever Grande City", "ever-grande"),
  "victory-road-2": evImg("events/victory-road-2.png", "Victory Road"),
  "league-1": evImg("events/league-1.png", "Elite Four — Sidney's room"),
  "league-2": evImg("events/league-2.png", "Elite Four — Drake's room"),
  "league-3": evImg("events/league-3.png", "Champion Steven's room"),
  "league-4": img("littleroot_town_e.png", "Littleroot Town — post-game TV event", "littleroot"),
  "battle-frontier-1": evImg("events/battle-frontier-1.png", "Battle Frontier — west grounds"),
  "battle-frontier-2": evImg("events/battle-frontier-2.png", "Battle Frontier — east facilities"),
};

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
  // Outdoor towns/routes show a window into the shared true-scale Hoenn map.
  const cropEntry = EVENT_MAP_CROP[stepId];
  if (cropEntry) {
    return [
      {
        src: HOENN_MAP_SRC,
        caption: cropEntry.caption,
        areaId: cropEntry.areaId,
        crop: cropEntry.crop,
      },
    ];
  }

  // Interior dungeons and facilities — interactive area maps with item/trainer pins.
  const areaMaps = areaMapShots(stepId);
  if (areaMaps.length > 0) {
    return areaMaps.map(({ areaMapId, caption }) => ({
      src: "",
      caption,
      areaMapId,
    }));
  }

  // Interiors/caves/gyms without an area map keep their per-event pixel-perfect render.
  if (EVENT_IMAGE[stepId]) return [EVENT_IMAGE[stepId]];

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
