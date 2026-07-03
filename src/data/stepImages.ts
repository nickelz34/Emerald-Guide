import { assetUrl } from "../lib/assetUrl";
import { walkthrough } from "./walkthrough";
import { getAreaIdForEncounterStep } from "./encounters";
import { getAreaData } from "./areaData";

export interface StepScreenshot {
  src: string;
  caption: string;
  areaId?: string;
  /**
   * When false, this image should never have POI markers overlaid (used for the
   * per-event location renders, whose crop/scale differs from the annotated
   * chapter maps so chapter markers would be misaligned).
   */
  annotate?: boolean;
}

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
  "route-101-1": evImg("events/route-101-1.png", "Route 101 — Birch's rescue"),
  "route-101-2": evImg("events/route-101-2.png", "Route 101 — choosing your starter"),
  "route-101-3": evImg("events/route-101-3.png", "Back at the Lab for your Pokédex"),
  "oldale-1": evImg("events/oldale-1.png", "Oldale Town"),
  "oldale-2": evImg("events/oldale-2.png", "Oldale Town — the crossroads"),
  "route-103-1": evImg("events/route-103-1.png", "Route 103 — north shore"),
  "route-103-2": evImg("events/route-103-2.png", "Route 103 — Rival Battle #1"),
  "route-103-3": evImg("events/route-103-3.png", "Back through Oldale, heading west"),
  "route-102-1": evImg("events/route-102-1.png", "Route 102 — trainers to Petalburg"),
  "route-102-2": evImg("events/route-102-2.png", "Route 102 — rare Ralts grass"),
  "route-102-3": evImg("events/route-102-3.png", "Petalburg City"),
  "petalburg-1": evImg("events/petalburg-1.png", "Petalburg Gym — meeting Norman"),
  "petalburg-2": evImg("events/petalburg-2.png", "Route 102 — Wally's catching tutorial"),
  "petalburg-3": evImg("events/petalburg-3.png", "Petalburg City — stock up"),
  "route-104-1": evImg("events/route-104-1.png", "Mr. Briney's cottage"),
  "route-104-2": evImg("events/route-104-2.png", "Pretty Petal Flower Shop"),
  "route-104-3": evImg("events/route-104-3.png", "Route 104 — beach and flowers"),
  "petalburg-woods-1": evImg("events/petalburg-woods-1.png", "Petalburg Woods"),
  "petalburg-woods-2": evImg("events/petalburg-woods-2.png", "Petalburg Woods — Team Aqua ambush"),
  "petalburg-woods-3": evImg("events/petalburg-woods-3.png", "Petalburg Woods — hidden items"),
  "rustboro-1": evImg("events/rustboro-1.png", "The Cutter's House — HM01 Cut"),
  "rustboro-2": evImg("events/rustboro-2.png", "Rustboro Gym — Roxanne"),
  "rustboro-3": evImg("events/rustboro-3.png", "Rustboro City — the Devon theft"),
  "route-116-1": evImg("events/route-116-1.png", "Route 116 — chasing the thief"),
  "route-116-2": evImg("events/route-116-2.png", "Route 116 — route items"),
  "rusturf-tunnel-1": evImg("events/rusturf-tunnel-1.png", "Rusturf Tunnel — cornering the Grunt"),
  "rusturf-tunnel-2": evImg("events/rusturf-tunnel-2.png", "Devon Corp — Mr. Stone's office"),
  "dewford-1": evImg("events/dewford-1.png", "Dewford Town"),
  "dewford-2": evImg("events/dewford-2.png", "Dewford Gym — Brawly (dark maze)"),
  "dewford-3": evImg("events/dewford-3.png", "Dewford — heading to Granite Cave"),
  "granite-cave-1": evImg("events/granite-cave-1.png", "Granite Cave — Steven's room"),
  "granite-cave-2": evImg("events/granite-cave-2.png", "Granite Cave 1F — HM05 Flash"),
  "granite-cave-3": evImg("events/granite-cave-3.png", "Route 109 beach — landing at Slateport"),
  "slateport-1": evImg("events/slateport-1.png", "Slateport City — the market"),
  "slateport-2": evImg("events/slateport-2.png", "Oceanic Museum 2F — Archie"),
  "slateport-3": evImg("events/slateport-3.png", "Route 110 — north to Mauville"),
  "route-110-1": evImg("events/route-110-1.png", "Trick House — puzzle #1"),
  "route-110-2": evImg("events/route-110-2.png", "Route 110 — beneath Cycling Road"),
  "route-110-3": evImg("events/route-110-3.png", "Route 110 — Rival Battle #3"),
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
  "route-113-1": evImg("events/route-113-1.png", "Route 113 — volcanic ash"),
  "route-113-2": evImg("events/route-113-2.png", "The Glass Workshop"),
  "fallarbor-1": evImg("events/fallarbor-1.png", "Professor Cozmo's house"),
  "fallarbor-2": evImg("events/fallarbor-2.png", "The Move Maniac's house"),
  "route-114-1": evImg("events/route-114-1.png", "Lanette's house — Route 114"),
  "route-114-2": evImg("events/route-114-2.png", "Meteor Falls"),
  "route-114-3": evImg("events/route-114-3.png", "Mt. Chimney cable car station"),
  "mt-chimney-1": evImg("events/mt-chimney-1.png", "Mt. Chimney summit — Maxie"),
  "mt-chimney-2": evImg("events/mt-chimney-2.png", "Jagged Pass"),
  "lavaridge-1": evImg("events/lavaridge-1.png", "Lavaridge Town — hot springs"),
  "lavaridge-2": evImg("events/lavaridge-2.png", "Lavaridge Gym — Flannery"),
  "lavaridge-3": evImg("events/lavaridge-3.png", "Route 111 desert — back to Petalburg"),
  "petalburg-gym-1": evImg("events/petalburg-gym-1.png", "Petalburg Gym — Norman"),
  "petalburg-gym-2": evImg("events/petalburg-gym-2.png", "Petalburg — receiving HM03 Surf"),
  "petalburg-gym-3": evImg("events/petalburg-gym-3.png", "Route 118 — Surf east"),
  "route-118-1": evImg("events/route-118-1.png", "Route 118 — coastal crossing"),
  "route-118-2": evImg("events/route-118-2.png", "Route 119 — into the jungle"),
  "route-119-1": evImg("events/route-119-1.png", "Route 119 — rainy jungle"),
  "route-119-2": evImg("events/route-119-2.png", "Weather Institute 2F — Shelly"),
  "route-119-3": evImg("events/route-119-3.png", "Route 119 — Rival Battle #4"),
  "fortree-1": evImg("events/fortree-1.png", "Fortree City — the treetop town"),
  "fortree-2": evImg("events/fortree-2.png", "Fortree Gym — Winona"),
  "route-120-1": evImg("events/route-120-1.png", "Route 120 — Steven & the Devon Scope"),
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
  "mossdeep-3": evImg("events/mossdeep-3.png", "Mossdeep City — Super Rod fishing"),
  "seafloor-cavern-1": evImg("events/seafloor-cavern-1.png", "Seafloor Cavern entrance"),
  "seafloor-cavern-2": evImg("events/seafloor-cavern-2.png", "Seafloor Cavern depths — Kyogre wakes"),
  "sootopolis-1": evImg("events/sootopolis-1.png", "Sootopolis City — the weather crisis"),
  "sootopolis-2": evImg("events/sootopolis-2.png", "Pacifidlog Town — toward the Sky Pillar"),
  "sky-pillar-1": evImg("events/sky-pillar-1.png", "Sky Pillar — cracked floors"),
  "sky-pillar-2": evImg("events/sky-pillar-2.png", "Sky Pillar summit — Rayquaza"),
  "sootopolis-gym-1": evImg("events/sootopolis-gym-1.png", "Sootopolis — HM07 Waterfall from Wallace"),
  "sootopolis-gym-2": evImg("events/sootopolis-gym-2.png", "Sootopolis Gym — Wallace (ice floor)"),
  "sealed-chamber-1": evImg("events/sealed-chamber-1.png", "Sealed Chamber — outer room"),
  "sealed-chamber-2": evImg("events/sealed-chamber-2.png", "Sealed Chamber — the Regi Braille"),
  "victory-road-1": evImg("events/victory-road-1.png", "Ever Grande City"),
  "victory-road-2": evImg("events/victory-road-2.png", "Victory Road"),
  "league-1": evImg("events/league-1.png", "Elite Four — Sidney's room"),
  "league-2": evImg("events/league-2.png", "Elite Four — Drake's room"),
  "league-3": evImg("events/league-3.png", "Champion Steven's room"),
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
  // Per-event location render takes priority for walkthrough steps.
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
