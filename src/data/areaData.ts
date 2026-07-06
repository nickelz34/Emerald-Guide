import type { PokemonEncounter } from "../types";

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
      { name: "Minun", level: "12–14", time: "any", method: "grass", rate: "5%", notes: "Rare — Ruby/Sapphire exclusive counterpart is Plusle" },
    ],
  },
  "route-119": {
    screenshot: "route-119.png",
    tips: [
      "Need Acro Bike to cross log bridges — get it in Mauville.",
      "Castform is a gift, not a wild encounter — from Weather Institute director.",
    ],
    secrets: [
      "Weather Institute: HM02 Fly on the top-floor bed after Aqua battle.",
      "Soft Soil patch for berries behind the institute.",
      "Rare Candy on the route (hidden) — check Bulbapedia for exact tile if hunting 100%.",
    ],
    encounters: [
      { name: "Oddish", level: "18–22", time: "any", method: "grass", rate: "30%" },
      { name: "Gulpin", level: "18–22", time: "any", method: "grass", rate: "30%" },
      { name: "Tropius", level: "18–22", time: "any", method: "grass", rate: "5%", notes: "Rare — grass on back" },
      { name: "Kecleon", level: "18–22", time: "any", method: "grass", rate: "5%", notes: "Invisible — use Devon Scope" },
      { name: "Castform", level: "—", time: "any", method: "grass", notes: "Gift from Weather Institute, not wild" },
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
    tips: ["Kecleon invisible without Devon Scope — get scope from Steven in Fortree."],
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
    secrets: ["Steven gives HM05 Flash here — required to see in dark areas."],
    encounters: [
      { name: "Zubat", level: "6–9", time: "any", method: "cave", rate: "50%" },
      { name: "Abra", level: "7–9", time: "any", method: "cave", rate: "4%", notes: "Rare" },
      { name: "Geodude", level: "6–9", time: "any", method: "cave", rate: "30%" },
      { name: "Makuhita", level: "6–9", time: "any", method: "cave", rate: "16%" },
      { name: "Aron", level: "7–9", time: "any", method: "rock-smash", rate: "100%", notes: "Rock Smash rocks" },
    ],
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
    secrets: ["Unlocked post-game — Scott meets you outside Petalburg after Hall of Fame."],
    encounters: [],
  },
};

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
  "mt-chimney-2": ["mt-chimney"],
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
  "league-4": ["littleroot"],
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
};

export function getAreasForStep(stepId: string): string[] {
  return STEP_AREA_MAP[stepId] ?? [];
}

export function getAreaData(areaId: string): AreaExtras | undefined {
  return AREA_DATA[areaId];
}

export function getAllAreaIds(): string[] {
  return Object.keys(AREA_DATA);
}

/** Unified walkthrough section title for secrets, area extras, and hidden items. */
export const SECRETS_EXTRAS_SECTION_TITLE = "Secrets, Extras, & Hidden Items";

/** Merge step-level secrets with area-data secrets for one checklist (deduped, order preserved). */
export function getSecretsExtrasForStep(stepId: string, stepSecrets?: string[]): string[] {
  const fromAreas: string[] = [];
  for (const areaId of getAreasForStep(stepId)) {
    const secrets = getAreaData(areaId)?.secrets;
    if (secrets) fromAreas.push(...secrets);
  }
  const combined = [...(stepSecrets ?? []), ...fromAreas];
  const seen = new Set<string>();
  return combined.filter((line) => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  });
}
