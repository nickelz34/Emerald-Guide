import type { PokemonEncounter } from "../types";
import { MAP_POINTS, type MapPoint, type PoiCategory } from "./mapPoints";
import { GENERATED_POINTS } from "./mapPointsGenerated";
import { LANDMARK_PINS_GENERATED } from "./mapLandmarksGenerated";
import { SHOP_PINS_GENERATED } from "./shopPinsGenerated";
import { MAP_TRAINERS, type TrainerPoint } from "./mapTrainersGenerated";
import { AREA_NOTE_LABELS } from "./mapCrops";
import { loadWildPokedex, type WildPokemon } from "./wildSource";
import { formatItemDescription, formatItemName } from "../lib/itemText";

export { formatItemDescription, formatItemName };

export interface AreaExtras {
  secrets?: string[];
  tips?: string[];
  screenshot?: string;
  encounters: PokemonEncounter[];
}

/** Encounter tables + area secrets keyed by area id. */
export const AREA_DATA: Record<string, AreaExtras> = {
  "route-101": {
    screenshot: "route-101.png",
    tips: [
      "Catch a Ralts on Route 102 instead — Route 101 has no rare spawns.",
      "Level to 8–10 before Petalburg Woods for an easier first rival rematch.",
    ],
    secrets: ["Hidden Potion in the grass patch southwest of Littleroot (not on Route 101, but grab it before leaving town)."],
    encounters: [
      { name: "Poochyena", level: "2–3", time: "any", method: "grass", rate: "45%" },
      { name: "Wurmple", level: "2–3", time: "any", method: "grass", rate: "45%" },
      { name: "Zigzagoon", level: "2–3", time: "any", method: "grass", rate: "10%" },
    ],
  },
  "route-102": {
    screenshot: "route-102.png",
    tips: ["Ralts is only 4% — use Repels on a high-level lead to hunt the grass safely."],
    secrets: ["Talk to the Devon researcher after the Rustboro gym quest for a Great Ball on this route."],
    encounters: [
      { name: "Poochyena", level: "3–4", time: "any", method: "grass", rate: "30%" },
      { name: "Wurmple", level: "3–4", time: "any", method: "grass", rate: "30%" },
      { name: "Lotad", level: "3–4", time: "any", method: "grass", rate: "20%" },
      { name: "Zigzagoon", level: "3–4", time: "any", method: "grass", rate: "16%" },
      { name: "Ralts", level: "4", time: "any", method: "grass", rate: "4%", notes: "Rare — great Psychic type" },
      { name: "Surskit", level: "3–4", time: "morning", method: "grass", rate: "15%", notes: "Morning only" },
      { name: "Surskit", level: "3–4", time: "day", method: "grass", rate: "15%", notes: "Day only" },
    ],
  },
  "route-103": {
    screenshot: "route-103.png",
    tips: ["Rival battle here — save first and grind on Route 102 if underleveled."],
    encounters: [
      { name: "Poochyena", level: "2–4", time: "any", method: "grass", rate: "30%" },
      { name: "Wingull", level: "2–4", time: "any", method: "grass", rate: "30%" },
      { name: "Zigzagoon", level: "2–4", time: "any", method: "grass", rate: "20%" },
      { name: "Wurmple", level: "2–4", time: "any", method: "grass", rate: "20%" },
      { name: "Wingull", level: "5–35", time: "any", method: "surf", rate: "60%" },
      { name: "Pelipper", level: "25–35", time: "any", method: "surf", rate: "35%" },
      { name: "Magikarp", level: "5–15", time: "any", method: "old-rod", rate: "70%" },
      { name: "Tentacool", level: "5–15", time: "any", method: "old-rod", rate: "30%" },
    ],
  },
  "petalburg-woods": {
    screenshot: "petalburg-woods.png",
    tips: [
      "Shroomish learns Spore at lv 15 — incredible for catching legendaries later.",
      "Team Aqua grunt drops Great Ball after battle — free item.",
    ],
    secrets: [
      "Paralyze Heal in the southwest corner (hidden item).",
      "Antidote and Potion on the east path — easy to miss in the trees.",
      "Devon Goods event triggers the Aqua grunt fight — required for story.",
    ],
    encounters: [
      { name: "Poochyena", level: "5–6", time: "any", method: "grass", rate: "30%" },
      { name: "Wurmple", level: "5–6", time: "any", method: "grass", rate: "30%" },
      { name: "Lotad", level: "5–6", time: "any", method: "grass", rate: "20%" },
      { name: "Zigzagoon", level: "5–6", time: "any", method: "grass", rate: "10%" },
      { name: "Shroomish", level: "5–6", time: "any", method: "grass", rate: "10%", notes: "Only early Shroomish location" },
    ],
  },
  "route-104": {
    screenshot: "route-104.png",
    tips: ["Flower shop sells berries — plant Oran and Pecha for free healing."],
    secrets: [
      "Pretty Petal shop on south side — buy berries and decorations.",
      "Old Lady near pond gives Chesto Berry if you talk to her.",
      "Surf required for south section later — Marill and Taillow there.",
    ],
    encounters: [
      { name: "Poochyena", level: "4–5", time: "any", method: "grass", rate: "30%" },
      { name: "Wurmple", level: "4–5", time: "any", method: "grass", rate: "30%" },
      { name: "Zigzagoon", level: "4–5", time: "any", method: "grass", rate: "20%" },
      { name: "Taillow", level: "4–5", time: "day", method: "grass", rate: "15%", notes: "Day only" },
      { name: "Wingull", level: "4–5", time: "any", method: "grass", rate: "5%" },
      { name: "Marill", level: "10–30", time: "any", method: "surf", rate: "60%", notes: "South section — need Surf" },
      { name: "Wingull", level: "10–30", time: "any", method: "surf", rate: "35%" },
    ],
  },
  "route-116": {
    screenshot: "route-116.png",
    tips: ["Abra teleports away turn 1 — use a Fast Ball or Mean Look/Shadow Tag."],
    secrets: [
      "HP Up hidden in the tunnel entrance area.",
      "Devon Goods stolen here — chase Team Magma to Rusturf Tunnel.",
    ],
    encounters: [
      { name: "Whismur", level: "6–7", time: "any", method: "grass", rate: "40%" },
      { name: "Nincada", level: "6–7", time: "any", method: "grass", rate: "30%" },
      { name: "Taillow", level: "6–7", time: "day", method: "grass", rate: "20%" },
      { name: "Zigzagoon", level: "6–7", time: "any", method: "grass", rate: "10%" },
      { name: "Abra", level: "7", time: "any", method: "grass", rate: "4%", notes: "Rare — teleports immediately" },
      { name: "Skitty", level: "6–7", time: "any", method: "grass", rate: "10%" },
    ],
  },
  "rusturf-tunnel": {
    screenshot: "rusturf-tunnel.png",
    secrets: ["Rescue Peeko the Wingull — Mr. Briney opens Route 104 ocean path afterward."],
    encounters: [
      { name: "Whismur", level: "6–8", time: "any", method: "cave", rate: "70%" },
      { name: "Zubat", level: "6–8", time: "any", method: "cave", rate: "30%" },
    ],
  },
  "route-110": {
    screenshot: "route110.png",
    tips: [
      "Trick House door is the small tree west of the Cycling Road entrance.",
      "Winstrate family gives useful held items after consecutive wins.",
    ],
    secrets: [
      "Trick House — 8 puzzles total, return after each badge milestone.",
      "Cycling Road requires Mach Bike to jump mud slopes.",
      "Secret Base spot in the tree/bushes along the route.",
    ],
    encounters: [
      { name: "Oddish", level: "12–14", time: "any", method: "grass", rate: "30%" },
      { name: "Gulpin", level: "12–14", time: "any", method: "grass", rate: "30%" },
      { name: "Wingull", level: "12–14", time: "any", method: "grass", rate: "20%" },
      { name: "Electrike", level: "12–14", time: "any", method: "grass", rate: "10%" },
      { name: "Duskull", level: "12–14", time: "night", method: "grass", rate: "10%", notes: "Night only" },
      { name: "Minun", level: "12–14", time: "any", method: "grass", rate: "5%", notes: "Rare — both Plusle and Minun appear in Emerald" },
    ],
  },
  "route-119": {
    screenshot: "route-119.png",
    tips: [
      "Need Acro Bike to cross log bridges — get it in Mauville.",
      "Castform is a gift, not a wild encounter — from Weather Institute director.",
      "Feebas only appears on six fishing tiles that move with the trendy phrase in Dewford — not on every water square.",
    ],
    secrets: [
      "Weather Institute: HM02 Fly on the top-floor bed after Aqua battle.",
      "Soft Soil patch for berries behind the institute.",
      "Rare Candy on the route (hidden) — check Bulbapedia for exact tile if hunting 100%.",
      "Feebas: six random water tiles among Route 119's fishable water yield Feebas on any rod; the set reshuffles when Dewford's trendy phrase changes. Fish every water tile systematically, or change the trend in Dewford and try a new set.",
      "Feebas evolves into Milotic at Beauty 170+ on level-up (Dry Pokéblocks) — see Pregame: Evolution and Contest Preparation.",
    ],
    encounters: [
      { name: "Oddish", level: "18–22", time: "any", method: "grass", rate: "30%" },
      { name: "Gulpin", level: "18–22", time: "any", method: "grass", rate: "30%" },
      { name: "Tropius", level: "18–22", time: "any", method: "grass", rate: "5%", notes: "Rare — grass on back" },
      { name: "Kecleon", level: "18–22", time: "any", method: "grass", rate: "5%", notes: "Invisible — use Devon Scope" },
      { name: "Castform", level: "—", time: "any", method: "grass", notes: "Gift from Weather Institute, not wild" },
      {
        name: "Feebas",
        level: "20–25",
        time: "any",
        method: "old-rod",
        rate: "special tiles",
        notes: "Only on 6 Dewford-trend water tiles — any rod; not on surf",
      },
    ],
  },
  "fiery-path": {
    secrets: ["TM06 Toxic in the north room — great for competitive-style playthroughs."],
    encounters: [
      { name: "Numel", level: "14–16", time: "any", method: "cave", rate: "50%" },
      { name: "Spoink", level: "14–16", time: "any", method: "cave", rate: "30%" },
      { name: "Zubat", level: "14–16", time: "any", method: "cave", rate: "20%" },
    ],
  },
  "mt-chimney": {
    screenshot: "mt_chimney_e.png",
    secrets: [
      "Meteorite on the path down — required for Magma Hideout later.",
      "Team Magma Hideout east of Lavaridge has the Master Ball.",
    ],
    encounters: [
      { name: "Numel", level: "14–16", time: "any", method: "grass", rate: "50%" },
      { name: "Spoink", level: "14–16", time: "any", method: "grass", rate: "30%" },
      { name: "Zubat", level: "14–16", time: "any", method: "cave", rate: "20%" },
    ],
  },
  "route-113": {
    screenshot: "route-113.png",
    tips: ["Always sandstorm weather — bring goggles or use Rock/Ground/Steel types."],
    secrets: ["Glass Workshop — talk to the owner for a free Soothe Bell."],
    encounters: [
      { name: "Sandshrew", level: "15–17", time: "any", method: "grass", rate: "40%" },
      { name: "Spinda", level: "15–17", time: "any", method: "grass", rate: "30%" },
      { name: "Skarmory", level: "15–17", time: "any", method: "grass", rate: "5%", notes: "Rare" },
    ],
  },
  "fallarbor": {
    screenshot: "fallarbor.png",
    secrets: [
      "Move Tutor for Metronome in the Move Maniac's house (needs Heart Scale).",
      "Professor Cozmo's meteorite plot starts here — Team Magma ambush.",
    ],
    encounters: [],
  },
  "mt-pyre": {
    secrets: [
      "Cleanse Tag on summit — reduces wild encounter rate when held.",
      "Old Couple guard the orbs — story theft happens after you visit.",
      "TM30 Shadow Ball inside the summit building.",
    ],
    encounters: [
      { name: "Shuppet", level: "18–22", time: "any", method: "grass", rate: "50%" },
      { name: "Vulpix", level: "18–22", time: "any", method: "grass", rate: "30%" },
      { name: "Wingull", level: "18–22", time: "any", method: "grass", rate: "20%" },
      { name: "Duskull", level: "18–22", time: "night", method: "grass", rate: "30%", notes: "Night only" },
    ],
  },
  "route-120": {
    screenshot: "route-120.png",
    tips: ["Kecleon invisible without Devon Scope — Steven gives the scope on Route 120 after the Kecleon ambush."],
    encounters: [
      { name: "Oddish", level: "20–24", time: "any", method: "grass", rate: "30%" },
      { name: "Gulpin", level: "20–24", time: "any", method: "grass", rate: "30%" },
      { name: "Abra", level: "20–24", time: "any", method: "grass", rate: "4%", notes: "Rare" },
      { name: "Kecleon", level: "20–24", time: "any", method: "grass", rate: "5%", notes: "Need Devon Scope" },
      { name: "Tropius", level: "20–24", time: "any", method: "grass", rate: "5%", notes: "Rare" },
    ],
  },
  "granite-cave": {
    screenshot: "granite-cave.png",
    tips: ["Flash optional but makes navigation much easier in the dark floors."],
    secrets: ["A Hiker on 1F gives HM05 Flash — Steven deeper in the cave gives TM47 Steel Wing."],
    encounters: [
      { name: "Zubat", level: "6–9", time: "any", method: "cave", rate: "50%" },
      { name: "Abra", level: "7–9", time: "any", method: "cave", rate: "4%", notes: "Rare" },
      { name: "Geodude", level: "6–9", time: "any", method: "cave", rate: "30%" },
      { name: "Makuhita", level: "6–9", time: "any", method: "cave", rate: "16%" },
      { name: "Aron", level: "7–9", time: "any", method: "rock-smash", rate: "100%", notes: "Rock Smash rocks" },
    ],
  },
  littleroot: {
    secrets: [
      "Your home town and Prof. Birch's lab.",
      "Choose Brendan or May's house at the start — same layout either way.",
      "Starter choice and first Pokédex from Prof. Birch after the Route 101 rescue.",
    ],
    encounters: [],
  },
  oldale: {
    secrets: [
      "First town north of home.",
      "Poké Mart opens after you deliver Devon goods to Rustboro.",
    ],
    encounters: [],
  },
  petalburg: {
    secrets: [
      "Your father Norman's gym city.",
      "Norman's gym stays closed until you have four badges.",
      "Wally catches his first Pokémon here with Norman's help.",
    ],
    encounters: [],
  },
  rustboro: {
    secrets: [
      "Devon Corporation — deliver Mr. Stone's letter from Route 104.",
      "First gym: Roxanne (Rock). HM01 Cut from Roxanne.",
      "Devon Goods unlock the Rusturf Tunnel and Slateport shipyard.",
    ],
    encounters: [],
  },
  verdanturf: {
    secrets: [
      "Clean-air resort west of Mauville.",
      "Contest Hall and Pokéblock case from the woman in the house.",
      "Rusturf Tunnel shortcut to Mauville through Route 117.",
    ],
    encounters: [],
  },
  lavaridge: {
    secrets: [
      "Hot-spring town — fourth gym with Flannery (Fire).",
      "Herb shop sells useful battle items.",
      "Jagged Pass south leads toward Mt. Chimney.",
    ],
    encounters: [],
  },
  fortree: {
    secrets: [
      "Treetop walkways — fifth gym with Winona (Flying).",
      "Steven gives the Devon Scope here to spot invisible Kecleon on Route 120.",
      "Bring Electric and Rock moves for the gym and nearby routes.",
    ],
    encounters: [],
  },
  dewford: {
    screenshot: "dewford_town_e.png",
    secrets: ["Granite Cave on the island — only path to Steven and Flash."],
    encounters: [
      { name: "Tentacool", level: "5–35", time: "any", method: "surf", rate: "60%" },
      { name: "Wingull", level: "10–30", time: "any", method: "surf", rate: "35%" },
      { name: "Magikarp", level: "5–15", time: "any", method: "old-rod", rate: "70%" },
      { name: "Tentacool", level: "5–15", time: "any", method: "old-rod", rate: "30%" },
      { name: "Magikarp", level: "10–30", time: "any", method: "good-rod", rate: "60%" },
      { name: "Wailmer", level: "10–30", time: "any", method: "good-rod", rate: "40%" },
    ],
  },
  "slateport": {
    screenshot: "slateport_city_e.png",
    secrets: [
      "Oceanic Museum — story event with Team Aqua.",
      "Name Rater in slateport — rename one Pokémon.",
      "Energy Guru sells Vitamins (Calcium, Protein, etc.).",
    ],
    encounters: [],
  },
  "mauville": {
    screenshot: "mauville_city_e.png",
    secrets: [
      "Game Corner next door — buy TMs with coins.",
      "Rydel's Bike Shop: choose Acro OR Mach Bike (both needed eventually — trade at Mt. Pyre).",
    ],
    encounters: [],
  },
  "mossdeep": {
    screenshot: "mossdeep_city_e.png",
    tips: ["Super Rod unlocks here after gym — Wailord and Relicanth for Regi puzzle."],
    secrets: ["Space Center event after gym — stock Ultra Balls before Tate & Liza."],
    encounters: [
      { name: "Tentacool", level: "5–35", time: "any", method: "surf", rate: "60%" },
      { name: "Wingull", level: "10–35", time: "any", method: "surf", rate: "35%" },
      { name: "Wailmer", level: "25–40", time: "any", method: "super-rod", rate: "40%" },
      { name: "Relicanth", level: "25–40", time: "any", method: "super-rod", rate: "5%", notes: "Rare — needed for Regi puzzle" },
    ],
  },
  "sootopolis": {
    screenshot: "sootopolis_city_e.png",
    secrets: [
      "Walls are closed until Rayquaza ends the crisis.",
      "Juan (Water gym in RS) replaced by Wallace in Emerald.",
    ],
    encounters: [
      { name: "Magikarp", level: "25–40", time: "any", method: "super-rod", rate: "90%" },
      { name: "Gyarados", level: "25–40", time: "any", method: "super-rod", rate: "10%" },
    ],
  },
  "sky-pillar": {
    screenshot: "sky-pillar.png",
    tips: ["Mach Bike required for cracked floors — one wrong step resets the room."],
    encounters: [
      { name: "Golbat", level: "30–40", time: "any", method: "cave", rate: "50%" },
      { name: "Sableye", level: "30–40", time: "any", method: "cave", rate: "30%" },
      { name: "Gastly", level: "30–40", time: "any", method: "cave", rate: "20%" },
    ],
  },
  "victory-road": {
    screenshot: "victory_road_e.png",
    tips: ["Bring Strength, Waterfall, and Flash. Full Restore before Sidney."],
    encounters: [
      { name: "Golbat", level: "40–44", time: "any", method: "cave", rate: "40%" },
      { name: "Vibrava", level: "40–44", time: "any", method: "cave", rate: "30%" },
      { name: "Sableye", level: "40–44", time: "any", method: "cave", rate: "20%" },
      { name: "Bagon", level: "40–44", time: "any", method: "cave", rate: "5%", notes: "Rare — Salamence line" },
    ],
  },
  "ever-grande": {
    screenshot: "ever-grande.png",
    encounters: [],
  },
  "lilycove": {
    screenshot: "lilycove.png",
    secrets: [
      "Department Store — TMs, evolution stones, and held items.",
      "Move Deleter and Move Relearner in the city.",
      "Team Aqua Hideout behind the city (story).",
    ],
    encounters: [
      { name: "Tentacool", level: "5–35", time: "any", method: "surf", rate: "60%" },
      { name: "Pelipper", level: "25–35", time: "any", method: "surf", rate: "35%" },
    ],
  },
  "pacifidlog": {
    screenshot: "pacifidlog.png",
    secrets: [
      "Old man hints Mirage Island daily — 1/65536 chance based on party PID.",
      "Sky Pillar access is east of town (need Mach Bike).",
    ],
    encounters: [
      { name: "Tentacool", level: "5–35", time: "any", method: "surf", rate: "60%" },
      { name: "Wingull", level: "10–35", time: "any", method: "surf", rate: "35%" },
    ],
  },
  "sealed-chamber": {
    screenshot: "sealed-chamber.png",
    secrets: [
      "Dive on Route 134 south patch — swim to the chamber.",
      "Dig at the back wall after reading Braille.",
      "Party order: Wailord slot 1, Relicanth slot 6 — then read Braille again.",
    ],
    encounters: [
      { name: "Chimecho", level: "30–35", time: "any", method: "cave", rate: "5%", notes: "Rare" },
      { name: "Zubat", level: "30–35", time: "any", method: "cave", rate: "50%" },
    ],
  },
  "battle-frontier": {
    screenshot: "battle_frontier_e.png",
    secrets: [
      "Scott calls on the PokéNav after the National Dex upgrade, then meets you aboard the S.S. Tidal and at the Battle Frontier entrance gate.",
      "First visit to Scott's house between the Dome and Tower awards 1–4 bonus BP total (based on how many of the 13 main-game sightings you found).",
    ],
    encounters: [],
  },
  "jagged-pass": {
    tips: ["Descend from Mt. Chimney toward Lavaridge — Numel, Machop, and Spoink on the ash path."],
    secrets: [
      "Pick up the Meteorite on Mt. Chimney before descending.",
      "Team Magma Hideout entrance is sealed until you have the Magma Emblem later.",
    ],
    encounters: [],
  },
  "meteor-falls": {
    secrets: [
      "Steven's guest room on 1F holds a Dusk Ball.",
      "Deeper floors need Surf and Waterfall — Bagon appears on B1F.",
    ],
    encounters: [],
  },
  "new-mauville": {
    secrets: [
      "Wattson's optional errand — TM24 Thunderbolt and a Thunder Stone inside.",
      "Also holds an Ultra Ball, Escape Ropes, and a Full Heal.",
    ],
    encounters: [],
  },
  "abandoned-ship": {
    secrets: [
      "Scanner on B1F for Captain Stern's quest in Slateport.",
      "TM13 Snatch and Harbor Mail in the upper cabins — Dive unlocks the flooded lower decks.",
    ],
    encounters: [],
  },
  "shoal-cave": {
    tips: ["Tide shifts every six hours — low tide for Shoal Shell/Salt; high tide opens the ice room."],
    secrets: ["Shoal Shell and Shoal Salt combine for HM07 Waterfall with the old man in Sootopolis."],
    encounters: [],
  },
  "safari-zone": {
    tips: [
      "Bait lowers flee but makes catches harder; Mud does the opposite.",
      "Blocks and Balls are consumed — plan catches before entering.",
    ],
    encounters: [],
  },
  "magma-hideout": {
    secrets: [
      "Master Ball on B1F after the Mt. Pyre earthquake — only one per save.",
      "Multi-floor maze east of Lavaridge — bring plenty of Repels.",
    ],
    encounters: [],
  },
  "seafloor-cavern": {
    secrets: [
      "Archie awakens Kyogre with the Blue Orb — save before the boss fight.",
      "Reach via Dive on Route 128 after the Mossdeep Space Center story.",
    ],
    encounters: [],
  },
};

/** Walkthrough steps with no wild encounter table (gyms, contests, interiors, story-only). */
export const ENCOUNTER_EXEMPT_STEPS = new Set([
  "contest-prep-1",
  "contest-prep-2",
  "contest-prep-3",
  "contests-lilycove-1",
  "contests-lilycove-2",
  "contests-lilycove-3",
  "contests-lilycove-4",
  "contests-lilycove-5",
  "contests-postgame-1",
  "contests-postgame-2",
  "postgame-events-1",
  "postgame-events-2",
  "postgame-events-3",
  "postgame-events-4",
  "postgame-events-5",
  "league-1",
  "league-2",
  "league-3",
  "pregame-evolution-1",
  "pregame-evolution-2",
  "pregame-evolution-3",
  "pregame-evolution-4",
  "pregame-evolution-5",
  "pregame-breeding-1",
  "pregame-breeding-2",
  "pregame-breeding-3",
  "petalburg-gym-1",
  "petalburg-gym-2",
  "petalburg-gym-3",
  "rustboro-2",
  "dewford-2",
  "mauville-2",
  "lavaridge-2",
  "fortree-2",
  "mossdeep-1",
  "sootopolis-gym-1",
  "sootopolis-gym-2",
  "lilycove-2",
  "route-120-3",
  "slateport-3",
  "battle-frontier-1",
]);

/** Maps walkthrough / guide step ids to encounter area ids. */
export const STEP_AREA_MAP: Record<string, string[]> = {
  "route-101-1": ["route-101"],
  "route-102-2": ["route-102"],
  "route-103-1": ["route-103"],
  "route-104-1": ["route-104"],
  "petalburg-woods-1": ["petalburg-woods"],
  "route-116-1": ["route-116"],
  "rusturf-tunnel-1": ["rusturf-tunnel"],
  "granite-cave-2": ["granite-cave"],
  "dewford-1": ["dewford"],
  "route-110-2": ["route-110"],
  "route-112-2": ["fiery-path"],
  "route-113-1": ["route-113"],
  "mt-chimney-1": ["mt-chimney"],
  "mt-chimney-2": ["jagged-pass"],
  "route-119-1": ["route-119"],
  "route-120-2": ["route-120"],
  "lilycove-1": ["lilycove"],
  "mt-pyre-1": ["mt-pyre"],
  "mossdeep-3": ["mossdeep"],
  "sootopolis-1": ["sootopolis"],
  "sky-pillar-1": ["sky-pillar"],
  "victory-road-2": ["victory-road"],
  "sealed-chamber-2": ["sealed-chamber"],
  "sealed-chamber-3": ["route-111"],
  "sealed-chamber-4": ["route-105"],
  "sealed-chamber-5": ["route-120"],
  "sky-pillar-3": ["sky-pillar"],
  "sootopolis-gym-3": ["marine-cave"],
  "postgame-1": ["littleroot"],
  "postgame-2": ["littleroot"],
  "postgame-3": ["littleroot"],
  "postgame-hoenn-1": ["mossdeep"],
  "postgame-hoenn-2": ["route-114"],
  "postgame-hoenn-3": ["route-111"],
  "postgame-hoenn-4": ["littleroot"],
  "postgame-hoenn-5": ["safari-zone"],
  "postgame-hoenn-7": ["route-114"],
  "battle-frontier-1": ["battle-frontier"],
  "battle-frontier-2": ["battle-frontier"],
  "battle-frontier-3": ["battle-frontier"],
  "battle-frontier-4": ["battle-frontier"],
  "trick-1": ["route-110"],
  "trick-2": ["route-110"],
  "trick-3": ["route-110"],
  "trick-4": ["route-110"],
  "trick-5": ["route-110"],
  "trick-6": ["route-110"],
  "trick-7": ["route-110"],
  "trick-8": ["route-110"],
  "battle-frontier": ["battle-frontier"],
  "mirage-island": ["pacifidlog"],
  "route-103-2": ["route-103"],
  "rustboro-3": ["rustboro"],
  "route-110-3": ["route-110"],
  "route-119-3": ["route-119"],
  "route-102-1": ["route-102"],
  "route-105-1": ["route-105"],
  "route-106-1": ["route-106"],
  "route-107-1": ["route-107"],
  "route-108-1": ["route-108"],
  "route-109-1": ["route-109"],
  "route-111-1": ["route-111"],
  "route-112-1": ["route-112"],
  "route-114-1": ["route-114"],
  "route-115-1": ["route-115"],
  "route-117-1": ["route-117"],
  "route-118-1": ["route-118"],
  "route-122-1": ["route-122"],
  "route-123-1": ["route-123"],
  "route-124-1": ["route-124"],
  "route-125-1": ["route-125"],
  "route-126-1": ["route-126"],
  "route-127-1": ["route-127"],
  "route-128-1": ["route-128"],
  "route-129-1": ["route-129"],
  "route-130-1": ["route-130"],
  "route-131-1": ["route-131"],
  "route-132-1": ["route-132"],
  "route-133-1": ["route-133"],
  "route-134-1": ["route-134"],
  "slateport-1": ["slateport"],
  "mauville-1": ["mauville"],
  "lavaridge-1": ["lavaridge"],
  "fallarbor-1": ["fallarbor"],
  "fortree-1": ["fortree"],
  "verdanturf-1": ["verdanturf"],
  "postgame-hoenn-6": ["route-110", "route-103"],
  "postgame-events-1": ["lilycove"],
  "postgame-events-2": ["lilycove"],
  "postgame-events-3": ["lilycove"],
  "postgame-events-4": ["lilycove"],
  "postgame-events-5": ["lilycove"],

  // Dungeons — explicit maps (inference fixed, but multi-area steps listed for clarity)
  "granite-cave-1": ["granite-cave"],
  "granite-cave-3": ["granite-cave"],
  "petalburg-woods-2": ["petalburg-woods"],
  "petalburg-woods-3": ["petalburg-woods"],
  "rusturf-tunnel-2": ["rusturf-tunnel"],
  "magma-hideout-1": ["magma-hideout"],
  "magma-hideout-2": ["magma-hideout"],
  "mt-pyre-2": ["mt-pyre"],
  "victory-road-1": ["victory-road"],
  "sky-pillar-2": ["sky-pillar"],
  "seafloor-cavern-1": ["underwater-route127", "underwater-route128", "seafloor-cavern"],
  "seafloor-cavern-2": ["seafloor-cavern"],
  "sealed-chamber-1": ["underwater-route124", "underwater-route126", "sealed-chamber"],
  "abandoned-ship-1": ["abandoned-ship"],
  "abandoned-ship-2": ["abandoned-ship"],
  "shoal-cave-1": ["shoal-cave"],
  "shoal-cave-2": ["shoal-cave"],
  "safari-zone-1": ["safari-zone"],
  "safari-zone-2": ["safari-zone"],
  "safari-zone-3": ["safari-zone"],

  // Interior / optional steps — explicit area (inference would show the wrong town or route)
  "mauville-3": ["new-mauville"],
  "route-114-2": ["meteor-falls"],
  "route-114-3": ["meteor-falls"],
};

const TOWN_AREA_PREFIXES = [
  "littleroot",
  "oldale",
  "petalburg",
  "rustboro",
  "dewford",
  "slateport",
  "mauville",
  "lavaridge",
  "fallarbor",
  "fortree",
  "lilycove",
  "mossdeep",
  "sootopolis",
  "pacifidlog",
  "ever-grande",
  "battle-frontier",
  "verdanturf",
] as const;

const DUNGEON_AREA_PREFIXES = [
  "granite-cave",
  "petalburg-woods",
  "rusturf-tunnel",
  "mt-chimney",
  "mt-pyre",
  "victory-road",
  "sky-pillar",
  "sealed-chamber",
  "safari-zone",
  "abandoned-ship",
  "shoal-cave",
  "magma-hideout",
  "seafloor-cavern",
  "new-mauville",
  "jagged-pass",
  "meteor-falls",
] as const;

/** Infer an encounter area slug from a walkthrough step id when not explicitly mapped. */
export function inferAreaIdFromStepId(stepId: string): string | undefined {
  const routeMatch = stepId.match(/^(route-\d+)-\d+$/);
  if (routeMatch) return routeMatch[1];

  // Gym interiors have no wild encounters — omit the panel rather than show town grass.
  if (/-gym-\d+$/.test(stepId)) return undefined;

  // Dungeon prefixes before town prefixes (petalburg-woods before petalburg).
  const sortedDungeons = [...DUNGEON_AREA_PREFIXES].sort((a, b) => b.length - a.length);
  for (const prefix of sortedDungeons) {
    if (stepId.startsWith(`${prefix}-`)) return prefix;
  }
  for (const prefix of TOWN_AREA_PREFIXES) {
    if (stepId.startsWith(`${prefix}-`)) return prefix;
  }
  return undefined;
}

/** Whether a pokeemerald wild location row belongs to a guide area slug. */
export function wildLocationMatchesArea(locId: string, locAreaId: string | undefined, areaId: string): boolean {
  if (locAreaId === areaId || locId === areaId) return true;
  return locId.startsWith(`${areaId}-`);
}

export function getAreasForStep(stepId: string): string[] {
  if (ENCOUNTER_EXEMPT_STEPS.has(stepId)) return [];
  const mapped = STEP_AREA_MAP[stepId];
  if (mapped?.length) return mapped;
  const inferred = inferAreaIdFromStepId(stepId);
  return inferred ? [inferred] : [];
}

export function getAreaData(areaId: string): AreaExtras | undefined {
  return AREA_DATA[areaId];
}

export function getAllAreaIds(): string[] {
  return Object.keys(AREA_DATA);
}

/** Unified walkthrough section title for secrets, area extras, and hidden items. */
export const SECRETS_EXTRAS_SECTION_TITLE = "Secrets, Extras, & Hidden Items";

function mergeUniqueLines(...lists: (string[] | undefined)[]): string[] {
  const combined: string[] = [];
  for (const list of lists) {
    if (list) combined.push(...list);
  }
  const seen = new Set<string>();
  return combined.filter((line) => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  });
}

/** Merge area secrets and area tips for one checklist (deduped, order preserved). */
export function getSecretsExtrasForArea(areaId: string): string[] {
  const data = getAreaData(areaId);
  return mergeUniqueLines(data?.secrets, data?.tips);
}

/** Merge step secrets with area secrets and tips for one checklist (deduped, order preserved). */
export function getSecretsExtrasForStep(stepId: string, stepSecrets?: string[]): string[] {
  const fromAreas: string[] = [];
  for (const areaId of getAreasForStep(stepId)) {
    fromAreas.push(...getSecretsExtrasForArea(areaId));
  }
  return mergeUniqueLines(stepSecrets, fromAreas);
}

const ALL_MAP_POINTS: MapPoint[] = [
  ...MAP_POINTS,
  ...LANDMARK_PINS_GENERATED,
  ...GENERATED_POINTS,
  ...SHOP_PINS_GENERATED,
];

export interface RoutePickup {
  id: string;
  name: string;
  category: PoiCategory;
  desc?: string;
}

/** MAP_ROUTE101-style id for a route area slug. */
export function areaIdToMapId(areaId: string): string {
  const m = areaId.match(/^route-(\d+)$/);
  if (m) return `MAP_ROUTE${m[1]}`;
  return `MAP_${areaId.replace(/-/g, "_").toUpperCase()}`;
}

/** Whether a map POI note belongs to the given outdoor area. */
export function noteMatchesArea(note: string | undefined, areaId: string): boolean {
  if (!note) return false;
  const n = note.toLowerCase();
  const labels = AREA_NOTE_LABELS[areaId] ?? [];
  if (labels.some((label) => n.includes(label.toLowerCase()))) return true;
  return n.includes(areaId.replace(/-/g, " "));
}

/** Visible items and berries on this route (from game-extracted map POIs). */
export function getRoutePickups(areaId: string): RoutePickup[] {
  return ALL_MAP_POINTS.filter(
    (p) =>
      noteMatchesArea(p.note, areaId) &&
      (p.category === "item" || p.category === "berry"),
  )
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      desc: p.desc ? formatItemDescription(p.desc) : p.note,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Hidden items on this route. */
export function getRouteHiddenItems(areaId: string): RoutePickup[] {
  return ALL_MAP_POINTS.filter(
    (p) => noteMatchesArea(p.note, areaId) && p.category === "hidden",
  )
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      desc: p.desc ? formatItemDescription(p.desc) : p.note,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Overworld trainers on this route (deduped by trainer id). */
export function getRouteTrainers(areaId: string): TrainerPoint[] {
  const mapId = areaIdToMapId(areaId);
  const seen = new Map<string, TrainerPoint>();
  for (const t of MAP_TRAINERS) {
    const onRoute = t.mapId === mapId || noteMatchesArea(t.note, areaId);
    if (!onRoute) continue;
    const key = t.trainerId ?? t.id;
    if (!seen.has(key)) seen.set(key, t);
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Build encounter rows from the live pokeemerald wild table for one map. */
export function encountersFromWildData(wildList: WildPokemon[], areaId: string): PokemonEncounter[] {
  const rows: PokemonEncounter[] = [];
  for (const mon of wildList) {
    for (const loc of mon.locations) {
      if (!wildLocationMatchesArea(loc.id, loc.areaId, areaId)) continue;
      for (const row of loc.rows) {
        rows.push({
          name: mon.name,
          level: row.level,
          time: "any",
          method: row.method,
          rate: row.rate,
        });
      }
    }
  }
  return rows.sort((a, b) => {
    const ar = parseFloat(a.rate?.replace("%", "") ?? "0");
    const br = parseFloat(b.rate?.replace("%", "") ?? "0");
    return br - ar || a.name.localeCompare(b.name) || a.method.localeCompare(b.method);
  });
}

/** pokeemerald wild data first; curated tables are fallback only. */
export async function loadRouteEncounters(areaId: string): Promise<PokemonEncounter[]> {
  const wild = await loadWildPokedex();
  const fromWild = encountersFromWildData(wild, areaId);
  if (fromWild.length > 0) return fromWild;
  return getAreaData(areaId)?.encounters ?? [];
}

/** Tips, secrets, and hidden-item notes for the route detail panel. */
export function getRouteSecretsExtras(areaId: string, hiddenItems: RoutePickup[]): string[] {
  const lines = [...getSecretsExtrasForArea(areaId)];
  const seen = new Set(lines);
  for (const item of hiddenItems) {
    const line = item.desc ? `${item.name} — ${item.desc}` : item.name;
    if (!seen.has(line)) {
      seen.add(line);
      lines.push(line);
    }
  }
  return lines;
}
