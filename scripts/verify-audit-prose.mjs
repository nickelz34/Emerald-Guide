/**
 * Regression guard for v1.13.1 audit prose fixes.
 * Run: node scripts/verify-audit-prose.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const FILES = [
  "src/data/walkthrough.ts",
  "src/data/postgameWalkthrough.ts",
  "src/data/pregameFieldChapter.ts",
  "src/data/pregameBreedingChapter.ts",
  "src/data/pregameBattlesChapter.ts",
  "src/data/natures.ts",
  "src/data/tmHmCatalog.ts",
  "src/data/statusConditions.ts",
  "src/data/breedingHatchingChart.ts",
  "src/data/pokeBalls.ts",
  "src/data/keyItems.ts",
  "src/data/hmUnlock.ts",
  "src/data/areaData.ts",
  "src/data/mapAnnotations.ts",
];

/** Patterns that must NOT appear (stale / wrong prose). */
const FORBIDDEN = [
  { re: /learn the ropes together/i, why: "Early lab: rival does not co-learn ropes; Birch sends you to Route 103" },
  { re: /updates your Pokédex/i, why: "Route 103 return is first Pokédex, not an update" },
  { re: /five more Poké Balls/i, why: "Rival's five balls are the first usable balls" },
  { re: /Champion Steven/i, why: "Emerald League Champion is Wallace" },
  { re: /title: "Champion Steven/i, why: "League step must be Wallace" },
  { re: /Aqua Admin Archie/i, why: "Archie is Leader, not Admin" },
  { re: /Devon Parcel/i, why: "Deliver Devon Goods, not a separate Parcel" },
  { re: /Rainbow Badge/i, why: "Norman's badge is Balance Badge" },
  { re: /TM31 Brick Break from the Trick Master/i, why: "Trick House #1 reward is Rare Candy" },
  { re: /Team Aqua's Blue Orb theft/i, why: "Aqua steals Red Orb at Mt. Pyre" },
  { re: /Eelektross/i, why: "Eelektross is not in Emerald" },
  { re: /use a Fast Ball/i, why: "Fast Ball does not exist in Emerald" },
  { re: /Team Aqua \(Archie\) steals the Blue Orb/i, why: "Mt. Pyre: Aqua steals RED Orb" },
  { re: /title: "Team Aqua steals the Blue Orb"/i, why: "Mt. Pyre step title should reference Red Orb" },
  { re: /uses the Red Orb to awaken Groudon/i, why: "Magma Hideout: Groudon awakens with BLUE Orb" },
  { re: /Groudon awakens with the Red Orb/i, why: "Magma Hideout details: BLUE Orb" },
  { re: /uses the Blue Orb to awaken Kyogre/i, why: "Seafloor Cavern: Kyogre awakens with RED Orb" },
  { re: /HM02 Fly from the bed/i, why: "Fly comes from rival after battle #4" },
  { re: /pick up HM02 Fly from the bed/i, why: "Fly comes from rival" },
  { re: /Fly was already on the bed/i, why: "Fly comes from rival" },
  { re: /rival waiting outside does not give it/i, why: "Rival gives Fly" },
  { re: /Wallace meets you and sends you into the Cave of Origin/i, why: "Steven escorts first" },
  { re: /rematches unlock after becoming Champion/i, why: "Trainer rematches start post-Norman" },
  { re: /Frontier symbols.*puzzle 8|puzzle 8.*Frontier symbols/i, why: "Trick House 8 needs Champion flag" },
  { re: /sell you the Super Rod/i, why: "Super Rod is a free gift" },
  { re: /Steven gives HM05 Flash/i, why: "Hiker on 1F gives Flash" },
  { re: /Includes Map, Condition, and Match Call/i, why: "Match Call added later" },
  { re: /Ruby\/Sapphire exclusive counterpart is Plusle/i, why: "Both Plusle and Minun in Emerald" },
  { re: /get scope from Steven in Fortree/i, why: "Devon Scope on Route 120" },
  { re: /later gives you HM07 Waterfall outside Sootopolis Gym after the weather crisis/i, why: "HM07 not tied to contest wins in same sentence" },
  { re: /TM13 Snatch/i, why: "Abandoned Ship TM13 is Ice Beam; Snatch is TM49" },
];

/** Patterns that must appear (correct replacements). */
const REQUIRED = [
  { file: "src/data/walkthrough.ts", re: /steals the Red Orb/i, why: "Mt. Pyre Aqua takes Red Orb" },
  { file: "src/data/walkthrough.ts", re: /Champion Wallace/i, why: "Emerald League Champion is Wallace" },
  { file: "src/data/walkthrough.ts", re: /find May\/Brendan on Route 103/i, why: "Post-starter lab points to rival on 103" },
  { file: "src/data/walkthrough.ts", re: /Mom outside your house gives the Running Shoes/i, why: "Running Shoes after Route 103 lab" },
  { file: "src/data/walkthrough.ts", re: /id: "aqua-hideout"/i, why: "Aqua Hideout after Magma Hideout / Slateport sub" },
  { file: "src/data/walkthrough.ts", re: /Reward: Rare Candy/i, why: "Trick House #1 Rare Candy" },
  { file: "src/data/walkthrough.ts", re: /Blue Orb to awaken Groudon/i, why: "Magma Hideout Blue Orb" },
  { file: "src/data/walkthrough.ts", re: /Red Orb to awaken Kyogre/i, why: "Seafloor Cavern Red Orb" },
  { file: "src/data/walkthrough.ts", re: /they give you HM02 Fly/i, why: "Rival gives Fly" },
  { file: "src/data/walkthrough.ts", re: /Steven meets you/i, why: "Steven at Sootopolis" },
  { file: "src/data/keyItems.ts", re: /exp-share/i, why: "Exp. Share key item entry" },
  { file: "src/data/hmUnlock.ts", re: /route-119-3/i, why: "Fly HM tied to rival step" },
  { file: "src/data/postgameWalkthrough.ts", re: /become Champion/i, why: "Trick House 8 Champion gate" },
  { file: "src/data/walkthrough.ts", re: /Meditite/i, why: "Brawly party includes Meditite" },
  { file: "src/data/walkthrough.ts", re: /Claydol.*Xatu/i, why: "Tate & Liza full party" },
  { file: "src/data/areaData.ts", re: /both Plusle and Minun appear in Emerald/i, why: "Route 110 encounter note" },
  {
    file: "src/data/pregameFieldChapter.ts",
    re: /Super Rod is a free gift/i,
    why: "Pregame fishing: Super Rod is free",
  },
  {
    file: "src/data/pregameFieldChapter.ts",
    re: /National Pokédex/i,
    why: "Pregame trading: FRLG National Dex gate",
  },
  {
    file: "src/data/pregameFieldChapter.ts",
    re: /Network Machine/i,
    why: "Pregame trading: Celio Network Machine gate",
  },
  {
    file: "src/data/pregameFieldChapter.ts",
    re: /no Fast Ball or Dusk Ball/i,
    why: "Pregame catching: Gen III ball accuracy",
  },
  {
    file: "src/data/pokeBalls.ts",
    re: /while surfing, fishing, or underwater/i,
    why: "Dive Ball Gen III bonus conditions",
  },
  {
    file: "src/data/pregameBreedingChapter.ts",
    re: /every 256 steps burns one egg cycle/i,
    why: "Breeding: hatch step rule once Egg is received",
  },
  {
    file: "src/data/pregameBreedingChapter.ts",
    re: /PC never hatch|never hatch.*PC|Eggs in the PC never hatch/i,
    why: "Breeding: Eggs only hatch in the party",
  },
  {
    file: "src/data/breedingHatchingChart.ts",
    re: /PC never hatches them/i,
    why: "Hatching chart: no Bag/PC hatch implication",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /id: "pregame-battles"/i,
    why: "Battles pregame chapter registered",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /\+10 EV/i,
    why: "Vitamins: Gen III +10 EV per use",
  },
  {
    file: "src/data/natures.ts",
    re: /name: "Quirky"/,
    why: "Natures table includes all 25 (through Quirky)",
  },
  {
    file: "src/data/tmHmCatalog.ts",
    re: /id: "TM13"[\s\S]*?move: "Ice Beam"/,
    why: "TM13 is Ice Beam",
  },
  {
    file: "src/data/tmHmCatalog.ts",
    re: /id: "TM49"[\s\S]*?move: "Snatch"/,
    why: "TM49 is Snatch",
  },
  {
    file: "src/data/tmHmCatalog.ts",
    re: /id: "HM08"[\s\S]*?move: "Dive"/,
    why: "HM catalog includes Dive",
  },
  {
    file: "src/data/walkthrough.ts",
    re: /TM13 Ice Beam/i,
    why: "Abandoned Ship lists Ice Beam, not Snatch",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /lose exactly half the money/i,
    why: "RSE blackout loses half money",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /two independent Trainers who spot you at the same time/i,
    why: "Emerald dual-spotter doubles",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /voluntary switch is your action[\s\S]*before normal moves/i,
    why: "Gen III voluntary switch before moves",
  },
  {
    file: "src/data/pregameBattlesChapter.ts",
    re: /Speed is greater than or equal to the wild foe/i,
    why: "Gen III escape auto-success when Speed >= foe",
  },
];

const errors = [];

for (const rel of FILES) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const { re, why } of FORBIDDEN) {
    if (re.test(text)) errors.push(`${rel}: forbidden pattern (${why})`);
  }
}

for (const { file, re, why } of REQUIRED) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (!re.test(text)) errors.push(`${file}: missing required pattern (${why})`);
}

if (errors.length) {
  console.error("Audit prose verification FAILED:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`OK — audit prose checks passed (${FORBIDDEN.length} forbidden, ${REQUIRED.length} required).`);
