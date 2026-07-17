/**
 * Apply prose + data wiring for character-appearance cutscenes.
 * Run after preview-character-appearance-cutscenes.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const markers = JSON.parse(
  fs.readFileSync("/opt/cursor/artifacts/character-appearances/markers.json", "utf8"),
);

const SPRITE = {
  brendan: "sprites/trainers/brendan_walking.png",
  scott: "sprites/trainers/scott_walking.png",
  steven: "sprites/trainers/steven.png",
  archie: "sprites/trainers/archie.png",
  maxie: "sprites/trainers/maxie.png",
  lanette: "sprites/trainers/woman_2.png",
  briney: "sprites/trainers/expert_m.png",
};
const NAME = {
  brendan: "Brendan",
  scott: "Scott",
  steven: "Steven",
  archie: "Archie",
  maxie: "Maxie",
  lanette: "Lanette",
  briney: "Mr. Briney",
};
const DESC = {
  brendan: "You",
  scott: "Scott — seeker of talented Trainers",
  steven: "Steven — Devon heir and rock collector",
  archie: "Archie — Leader of Team Aqua",
  maxie: "Maxie — Leader of Team Magma",
  lanette: "Lanette — designer of the PC storage system",
  briney: "Mr. Briney — retired sailor and ferry captain",
};

const MAP_ID = {
  "rustborocity-pokemonschool-scott": "MAP_RUSTBORO_CITY_POKEMON_SCHOOL",
  "slateportcity-scott-museum": "MAP_SLATEPORT_CITY",
  "slateportcity-scott-battletent": "MAP_SLATEPORT_CITY",
  "mauvillecity-scott": "MAP_MAUVILLE_CITY",
  "verdanturf-battletent-scott": "MAP_VERDANTURF_TOWN_BATTLE_TENT_LOBBY",
  "fallarbor-battletent-scott": "MAP_FALLARBOR_TOWN_BATTLE_TENT_LOBBY",
  "route119-scott": "MAP_ROUTE119",
  "fortreecity-scott-call": "MAP_FORTREE_CITY",
  "lilycove-motel-scott": "MAP_LILYCOVE_CITY_COVE_LILY_MOTEL_2F",
  "mossdeepcity-scott": "MAP_MOSSDEEP_CITY",
  "evergrandecity-pokemoncenter-scott": "MAP_EVER_GRANDE_CITY_POKEMON_CENTER_1F",
  "meteorfalls-archie": "MAP_METEOR_FALLS_1F_1R",
  "mtchimney-archie": "MAP_MT_CHIMNEY",
  "route118-steven": "MAP_ROUTE118",
  "granitecave-steven-letter": "MAP_GRANITE_CAVE_STEVENS_ROOM",
  "route128-aftermath": "MAP_ROUTE128",
  "fallarbor-pokemoncenter-lanette": "MAP_FALLARBOR_TOWN_POKEMON_CENTER_1F",
  "route104-briney-ferry": "MAP_ROUTE104_MR_BRINEYS_HOUSE",
};

const GROUP = {
  "rustborocity-pokemonschool-scott": "Rustboro City",
  "slateportcity-scott-museum": "Slateport City",
  "slateportcity-scott-battletent": "Slateport City",
  "mauvillecity-scott": "Mauville City",
  "verdanturf-battletent-scott": "Verdanturf Town",
  "fallarbor-battletent-scott": "Fallarbor Town",
  "route119-scott": "Route 119",
  "fortreecity-scott-call": "Fortree City",
  "lilycove-motel-scott": "Lilycove City",
  "mossdeepcity-scott": "Mossdeep City",
  "evergrandecity-pokemoncenter-scott": "Ever Grande City",
  "meteorfalls-archie": "Meteor Falls",
  "mtchimney-archie": "Mt. Chimney",
  "route118-steven": "Route 118",
  "granitecave-steven-letter": "Granite Cave",
  "route128-aftermath": "Route 128",
  "fallarbor-pokemoncenter-lanette": "Fallarbor Town",
  "route104-briney-ferry": "Route 104",
};

// ---- areaMaps.ts ----
const areaMapsPath = path.join(ROOT, "src/data/areaMaps.ts");
let areaMaps = fs.readFileSync(areaMapsPath, "utf8");
const areaBlock = markers
  .map((m) => {
    const id = m.id;
    return `  {
    // Hand-added: ${m.floor}
    id: "${id}",
    mapId: "${MAP_ID[id]}",
    name: ${JSON.stringify(GROUP[id])},
    group: ${JSON.stringify(GROUP[id])},
    floor: ${JSON.stringify(m.floor)},
    image: "maps/areas/${id}.png",
    width: 240,
    height: 160,
    markers: [],
  },`;
  })
  .join("\n");

if (!areaMaps.includes("rustborocity-pokemonschool-scott")) {
  areaMaps = areaMaps.replace(
    "  {\n    // Hand-added: Scott stops the player on Petalburg’s west exit (toward Route 104).",
    `${areaBlock}\n  {\n    // Hand-added: Scott stops the player on Petalburg’s west exit (toward Route 104).`,
  );
  fs.writeFileSync(areaMapsPath, areaMaps);
  console.log("patched areaMaps.ts");
} else {
  console.log("areaMaps.ts already has new scenes");
}

// ---- cutscene entities ----
const entitiesPath = path.join(ROOT, "src/data/areaMapCutsceneEntities.ts");
let entities = fs.readFileSync(entitiesPath, "utf8");
const entityBlock = markers
  .map((m) => {
    const rows = m.markers
      .map((mk, i) => {
        const key = mk.spriteKey;
        return `    {
      id: "${m.id}-${key}-${i}",
      name: ${JSON.stringify(NAME[key])},
      category: "npc",
      x: ${mk.x},
      y: ${mk.y},
      desc: ${JSON.stringify(DESC[key])},
      spriteSheet: ${JSON.stringify(SPRITE[key])},
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: ${mk.spriteFrame},
${mk.spriteFlipX ? "      spriteFlipX: true,\n" : ""}      note: ${JSON.stringify(GROUP[m.id])},
      bakedInImage: true,
    }`;
      })
      .join(",\n");
    return `  "${m.id}": [\n${rows}\n  ],`;
  })
  .join("\n");

if (!entities.includes("rustborocity-pokemonschool-scott")) {
  entities = entities.replace(
    '  "petalburgcity-scott": [',
    `${entityBlock}\n  "petalburgcity-scott": [`,
  );
  fs.writeFileSync(entitiesPath, entities);
  console.log("patched areaMapCutsceneEntities.ts");
} else {
  console.log("entities already patched");
}

// ---- stepAreaMaps ----
const stepPath = path.join(ROOT, "src/data/stepAreaMaps.ts");
let stepSrc = fs.readFileSync(stepPath, "utf8");

const STEP_BINDS = {
  "rustboro-1": ['"rustborocity-pokemonschool-scott"'],
  "rustboro-3": ['"rustborocity-rival-battle"', '"rustborocity-pokemonschool-scott"'],
  "slateport-2": ['"slateportcity-scott-museum"'],
  "slateport-5": ['"slateportcity-scott-battletent"'],
  "mauville-1": ['"mauvillecity-scott"'],
  "route-117-2": ['"verdanturf-battletent-scott"'],
  "fallarbor-1": ['"fallarbor-battletent-scott"', '"fallarbor-pokemoncenter-lanette"'],
  "route-119-3": ['"route119-rival-battle"', '"route119-scott"'],
  "fortree-2": ['"fortreecity-gym-winona-battle"', '"fortreecity-gym"', '"fortreecity-scott-call"'],
  "lilycove-1": ['"lilycovecity-rival-battle"', '"lilycove-motel-scott"'],
  "mossdeep-2": ['"mossdeepcity-scott"'],
  "league-1": [
    '"evergrandecity-pokemoncenter-scott"',
    '"evergrandecity-sidneysroom-battle"',
    '"evergrandecity-sidneysroom"',
    '"evergrandecity-phoebesroom-battle"',
    '"evergrandecity-phoebesroom"',
  ],
  "route-114-2": ['"meteorfalls-archie"', '"meteorfalls-1f-1r"', '"meteorfalls-1f-2r"'],
  "mt-chimney-2": ['"mtchimney-archie"'],
  "route-118-1": ['"route118-steven"'],
  "granite-cave-1": [
    '"granitecave-steven-letter"',
    '"granitecave-1f"',
    '"granitecave-b1f"',
    '"granitecave-b2f"',
    '"granitecave-stevensroom"',
  ],
  "seafloor-cavern-2": ['"route128-aftermath"', '"seafloorcavern-room9"'],
  "dewford-1": ['"route104-briney-ferry"'],
};

function upsertStepMaps(src, stepId, ids) {
  const arr = `[${ids.join(", ")}]`;
  const re = new RegExp(`"${stepId}":\\s*\\[[\\s\\S]*?\\],`);
  if (re.test(src)) {
    return src.replace(re, `"${stepId}": ${arr},`);
  }
  // insert into STEP_AREA_MAPS object after opening
  return src.replace(
    "export const STEP_AREA_MAPS: Record<string, string[]> = {\n",
    `export const STEP_AREA_MAPS: Record<string, string[]> = {\n  "${stepId}": ${arr},\n`,
  );
}

for (const [stepId, ids] of Object.entries(STEP_BINDS)) {
  stepSrc = upsertStepMaps(stepSrc, stepId, ids);
}
fs.writeFileSync(stepPath, stepSrc);
console.log("patched stepAreaMaps.ts");

// Also bind single STEP_AREA_MAP for some outdoor steps that only use crop today
if (!stepSrc.includes('"route-118-1"')) {
  // handled in STEP_AREA_MAPS
}

// ---- scottSightings ----
const scottPath = path.join(ROOT, "src/data/scottSightings.ts");
let scott = fs.readFileSync(scottPath, "utf8");
scott = scott
  .replace(
    /walkthroughStepId: "slateport-2",\n    mandatory: false,/,
    'walkthroughStepId: "slateport-5",\n    mandatory: false,',
  )
  .replace(
    /timing: "After the museum encounter, before leaving town",\n    walkthroughStepId: "slateport-2"/,
    'timing: "At the Battle Tent after the museum encounter",\n    walkthroughStepId: "slateport-5"',
  );
fs.writeFileSync(scottPath, scott);
console.log("patched scottSightings.ts");

// ---- prose patches on guide_data.json + walkthrough.ts via structured step updates ----
const PROSE = {
  "rustboro-1": {
    title: "Get HM01 Cut & meet Scott at school",
    summary: "Pick up Cut from the Cutter, then talk to Scott inside the Trainer’s School before the Gym.",
    storyAppend: [
      "Before you challenge Roxanne, step into the Pokémon Trainer’s School in the northeast. Just inside the entrance, Scott — the sunglasses-wearing scout from Petalburg — introduces himself properly. He’s hunting outstanding Trainers and battle experts, and he suggests your first job is teaching a Pokémon Cut (someone in town already has the HM).",
    ],
    detailsAppend: [
      "Optional: talk to Scott inside the Trainer’s School before earning the Stone Badge (Scott sighting #2).",
    ],
    secretsAppend: [
      "Scott leaves the school once you receive the PokéNav from Mr. Stone — catch him before then if you want both school chats.",
    ],
    tagsAppend: ["scott"],
  },
  "rustboro-3": {
    storyAppend: [
      "If you revisit the Trainer’s School after the Stone Badge (and before Mr. Stone hands over the PokéNav), Scott is still inside. He notices your badge, praises the win, then admits a League Badge alone can’t show him how you battle — he wishes he could have watched the fight.",
    ],
    detailsAppend: [
      "Optional: talk to Scott again at the Trainer’s School after the Stone Badge (Scott sighting #3) before you get the PokéNav.",
    ],
    tagsAppend: ["scott"],
  },
  "slateport-2": {
    storyAppend: [
      "Outside the museum, Scott intercepts you. He saw Team Aqua flee, guesses you drove them off, and registers you for Match Call on the PokéNav so he can ring you later. Then he heads out to scout other towns — don’t leave Slateport without talking to him (Scott sighting #4, mandatory).",
    ],
    detailsAppend: [
      "After the museum, talk to Scott outside — he enables Scott Match Call (mandatory Scott sighting #4).",
    ],
    tagsAppend: ["scott"],
  },
  "slateport-5": {
    storyInsertFront: [
      "Before you leave Slateport for Mauville, check the Battle Tent entrance. Scott steps out of the doorway, greets you, and cheers you on for trying the tent challenge (Scott sighting #5, optional — missable if you defeat Wattson first).",
    ],
    detailsAppend: [
      "Optional: talk to Scott outside Slateport’s Battle Tent after the museum scene (Scott sighting #5).",
    ],
    tagsAppend: ["scott"],
  },
  "mauville-1": {
    storyAppend: [
      "Right after your battle with Wally, Scott appears. He watched the whole fight and praises that you didn’t hold back against a friend — that’s real battling, he says, and he’ll keep cheering for you (Scott sighting #6, mandatory).",
    ],
    detailsAppend: [
      "After Wally’s battle, talk to Scott in Mauville (mandatory Scott sighting #6).",
    ],
    tagsAppend: ["scott"],
  },
  "route-117-2": {
    storyAppend: [
      "Inside Verdanturf’s Battle Tent lobby, Scott is waiting. He expected to see you here — Battle Tents gather tough Trainers — and tells you to do your best (Scott sighting #7, optional; he appears after you earn Wattson’s Dynamo Badge).",
    ],
    detailsAppend: [
      "Optional: talk to Scott in Verdanturf’s Battle Tent lobby after the Dynamo Badge (Scott sighting #7).",
    ],
    tagsAppend: ["scott"],
  },
  "fallarbor-1": {
    storyAppend: [
      "At Fallarbor’s Pokémon Center, Lanette — designer of the PC storage system — introduces herself and invites you to visit her house on Route 114. Swing by the Battle Tent lobby too if Scott is there: he greets you and says he’s looking for someone who can take a real challenge (Scott sighting #8, optional).",
    ],
    detailsAppend: [
      "Talk to Lanette in Fallarbor’s Pokémon Center — she invites you to her Route 114 house.",
      "Optional: talk to Scott in Fallarbor’s Battle Tent lobby (Scott sighting #8).",
    ],
    tagsAppend: ["scott", "lanette"],
  },
  "route-119-3": {
    storyAppend: [
      "As your rival heads toward Fortree, Scott comes the other way. He cheers your win, mentions an angry biker kid he passed, asks if Fortree Gym is next, and says he expects you’ll do well there (Scott sighting #9, mandatory).",
    ],
    detailsAppend: [
      "After Rival Battle #4 and HM02 Fly, talk to Scott on the path (mandatory Scott sighting #9).",
    ],
    tagsAppend: ["scott"],
  },
  "fortree-2": {
    storyAppend: [
      "After you earn the Feather Badge, keep walking around town or the nearby routes. Scott rings your PokéNav to congratulate the Gym win — your strength may make you the Trainer he’s been searching for, and he’ll cheer from the sidelines (Scott sighting #10, mandatory phone call).",
    ],
    detailsAppend: [
      "After Winona, take ~10 steps outdoors to receive Scott’s PokéNav call (mandatory Scott sighting #10).",
    ],
    tagsAppend: ["scott"],
  },
  "lilycove-1": {
    storyAppend: [
      "Upstairs at the Cove Lily Motel, Scott is napping between Contest watching. He came for Contests but still prefers battles — though he admits Contests take strategy too (Scott sighting #11, optional; talk before Aqua steals the submarine from Slateport).",
    ],
    detailsAppend: [
      "Optional: talk to Scott on Cove Lily Motel 2F before the submarine theft (Scott sighting #11).",
    ],
    tagsAppend: ["scott"],
  },
  "mossdeep-2": {
    storyInsertFront: [
      "Outside the Space Center, Scott is milling about before the Magma raid. He came to size up Mossdeep’s Gym Leaders but senses something wrong — he mentions a warning letter and the Space Center, then decides it doesn’t concern him (Scott sighting #12, optional; talk before you clear the Magma attack).",
    ],
    detailsAppend: [
      "Optional: talk to Scott outside the Space Center before the Magma raid (Scott sighting #12).",
    ],
    tagsAppend: ["scott"],
  },
  "league-1": {
    storyInsertFront: [
      "Before you enter the Pokémon League, stop at Ever Grande’s Pokémon Center. Scott is waiting inside — he’s thrilled you’ve reached the League path and promises that if you become Champion, he’ll contact you. Go for greatness (Scott sighting #13, optional).",
    ],
    detailsAppend: [
      "Optional: talk to Scott in Ever Grande’s Pokémon Center before the Elite Four (Scott sighting #13).",
    ],
    tagsAppend: ["scott"],
  },
  "route-114-2": {
    replaceStoryContaining: {
      match: /Maxie/i,
      // full rewrite of story array
    },
    story: [
      "Meteor Falls is a roaring underground river cave, and Team Magma is already inside. Magma Grunts seize Professor Cozmo’s Meteorite and flee toward Mt. Chimney before you can stop them.",
      "Archie of Team Aqua arrives moments later. He recognizes you from the Slateport museum, explains that Magma fanatics want to expand the land while Aqua believes in expanding the sea, then races after Magma toward the volcano. Follow them — Mt. Chimney is next.",
    ],
    details: [
      "Enter Meteor Falls; Magma steals Cozmo’s Meteorite and flees toward Mt. Chimney.",
      "Archie appears, introduces Aqua’s rivalry with Magma, and chases them to the volcano.",
      "Continue to Mt. Chimney after the cutscene.",
    ],
    tagsAppend: ["archie"],
  },
  "mt-chimney-2": {
    storyAppend: [
      "When Maxie flees the crater, Archie finds you on the summit path. He thanks you for thwarting Magma’s volcano plan — he’s still unsure whose side you’re on, but Aqua will keep pursuing Magma, and you’ll meet again.",
    ],
    detailsAppend: [
      "After Maxie flees, Archie thanks you on Mt. Chimney before leaving.",
    ],
    tagsAppend: ["archie"],
  },
  "route-118-1": {
    replaceSummary: "Surf Route 118 and talk with Steven about how you raise Pokémon.",
    story: [
      "Route 118 stretches east from Mauville toward the Weather Institute’s jungles, with Surfing water, grassy banks, and trainers waiting on both shores.",
      "Near the eastern end, Steven — the same collector you met in Granite Cave — stops you for a real conversation. He remembers the Letter delivery, asks whether you raise a few favorites or many kinds of Pokémon, then admits it’s not his business and hopes you’ll meet again. This is no wordless glimpse — hear him out before you push north to Route 119.",
    ],
    details: [
      "Surf and battle across Route 118 toward Fortree.",
      "Talk to Steven on the eastern path — he recalls Granite Cave and asks how you raise Pokémon.",
    ],
  },
  "granite-cave-1": {
    storyAppend: [
      "Before Steven leaves, he registers you in the PokéNav for Match Call. You’ll be able to ring him later as the story advances — don’t skip the registration prompt after the Letter and TM47 Steel Wing.",
    ],
    detailsAppend: [
      "Steven registers you in the PokéNav (Match Call) after giving TM47 Steel Wing.",
    ],
  },
  "seafloor-cavern-2": {
    storyAppend: [
      "The story warps you to Route 128. Maxie confronts Archie over awakening Kyogre, then tells you that responsibility for this mess falls on both teams before they flee. Steven arrives by air, warns that the world will drown if nothing is done, and leaves for Sootopolis — follow him there next.",
    ],
    detailsAppend: [
      "On Route 128 after the cavern: Maxie and Archie argue, then Steven points you to Sootopolis.",
    ],
  },
  "dewford-1": {
    storyAppend: [
      "Mr. Briney’s ferry stays available between his Route 104 cottage, Dewford, and the Route 109 beach near Slateport until you defeat Norman for the Balance Badge — after that battle he leaves the docks, so finish any island errands before Petalburg Gym.",
    ],
    detailsAppend: [
      "Briney’s boat runs Route 104 ↔ Dewford ↔ Route 109 until you beat Norman; then he disappears from the docks.",
    ],
  },
  "petalburg-gym-1": {
    secretsAppend: [
      "Defeating Norman hides Mr. Briney and his boat from Route 104, Dewford, and Route 109 — use the ferry for any last Dewford/Slateport trips before this Gym if you still need it.",
    ],
  },
  "slateport-3": {
    storyAppend: [
      "Remember Mr. Briney can still sail you back to Dewford or his Route 104 cottage from the Route 109 beach until you earn Norman’s Balance Badge — after that Gym he leaves the ferry routes for good.",
    ],
  },
};

function applyProseToStep(step, patch) {
  if (patch.title) step.title = patch.title;
  if (patch.summary) step.summary = patch.summary;
  if (patch.replaceSummary) step.summary = patch.replaceSummary;
  if (patch.story) step.story = patch.story;
  if (patch.details) step.details = patch.details;
  if (patch.storyInsertFront) {
    step.story = [...patch.storyInsertFront, ...(step.story || [])];
  }
  if (patch.storyAppend) {
    step.story = [...(step.story || []), ...patch.storyAppend];
  }
  if (patch.detailsAppend) {
    step.details = [...(step.details || []), ...patch.detailsAppend];
  }
  if (patch.secretsAppend) {
    step.secrets = [...(step.secrets || []), ...patch.secretsAppend];
  }
  if (patch.tagsAppend) {
    const tags = new Set(step.tags || []);
    for (const t of patch.tagsAppend) tags.add(t);
    step.tags = [...tags];
  }
  return step;
}

// guide_data.json
const guidePath = path.join(ROOT, "src/data/guide_data.json");
const guide = JSON.parse(fs.readFileSync(guidePath, "utf8"));
let guideHits = 0;
for (const ch of guide.walkthrough) {
  for (const step of ch.steps) {
    if (PROSE[step.id]) {
      applyProseToStep(step, PROSE[step.id]);
      guideHits++;
    }
  }
}
fs.writeFileSync(guidePath, `${JSON.stringify(guide, null, 2)}\n`);
console.log("patched guide_data.json steps:", guideHits);

// walkthrough.ts — apply same prose by rewriting step objects with a lighter approach:
// sync from guide_data for the touched step ids into walkthrough.ts is hard (TS not JSON).
// Instead, run a regex-based patcher for each step block in walkthrough.ts.
const wtPath = path.join(ROOT, "src/data/walkthrough.ts");
let wt = fs.readFileSync(wtPath, "utf8");

function jsonStringArray(arr) {
  return arr.map((s) => JSON.stringify(s)).join(",\n          ");
}

for (const [stepId, patch] of Object.entries(PROSE)) {
  const step = guide.walkthrough.flatMap((c) => c.steps).find((s) => s.id === stepId);
  if (!step) continue;
  const re = new RegExp(
    `(\\{\\s*\\n\\s*id: "${stepId}",)[\\s\\S]*?(\\n\\s*tags: \\[[\\s\\S]*?\\],\\n\\s*\\},)`,
  );
  const m = wt.match(re);
  if (!m) {
    console.warn("walkthrough.ts: could not locate step", stepId);
    continue;
  }
  const tips = step.tips?.length
    ? `\n        tips: [\n          ${jsonStringArray(step.tips)},\n        ],`
    : "";
  const secrets = step.secrets?.length
    ? `\n        secrets: [\n          ${jsonStringArray(step.secrets)},\n        ],`
    : "";
  const block = `{
        id: "${step.id}",
        title: ${JSON.stringify(step.title)},
        location: ${JSON.stringify(step.location)},
        summary: ${JSON.stringify(step.summary)},
        story: [
          ${jsonStringArray(step.story || [])},
        ],
        details: [
          ${jsonStringArray(step.details || [])},
        ],${tips}${secrets}
        tags: ${JSON.stringify(step.tags || [])},
      },`;
  wt = wt.replace(re, block);
  console.log("walkthrough.ts patched", stepId);
}
fs.writeFileSync(wtPath, wt);

console.log("done content apply");
