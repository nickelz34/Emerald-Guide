#!/usr/bin/env node
/**
 * Build dialogue + story-link lookups for Hoenn Map NPCs.
 *
 * Sources:
 *   - Outdoor MAP_NPCS scripts (mapNpcsGenerated.ts)
 *   - Interior AREA_MAP_ENTITIES with TRAINER_TYPE_NONE
 *   - pokeemerald map scripts.inc (local .calib or GitHub raw)
 *   - Walkthrough steps in guide_data.json + curated story NPC table
 *
 * Output: src/data/npcDetailsGenerated.ts
 *
 * Usage: node scripts/gen-npc-details.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const OUT_FILE = path.join(ROOT, "src/data/npcDetailsGenerated.ts");
const RAW = "https://raw.githubusercontent.com/pret/pokeemerald/master";
const { mapIdToDir } = await import("./map-origin-lib.mjs");

const GENERIC_NAMES = new Set(
  [
    "Boy",
    "Girl",
    "Man",
    "Woman",
    "Youngster",
    "Lass",
    "Fat Man",
    "Little Boy",
    "Little Girl",
    "Old Man",
    "Old Woman",
    "Camper",
    "Picnicker",
    "Fisherman",
    "Sailor",
    "Expert M",
    "Expert F",
    "Psychic M",
    "Psychic F",
    "Gentleman",
    "Beauty",
    "Rich Boy",
    "Lady",
    "Pokefan M",
    "Pokefan F",
    "Cook",
    "Artist",
    "Scientist 1",
    "Scientist 2",
    "Guitarist",
    "Ninja Boy",
    "Battle Girl",
    "Hex Maniac",
    "Pokemon Ranger M",
    "Pokemon Ranger F",
    "Magma Member M",
    "Magma Member F",
    "Aqua Member M",
    "Aqua Member F",
    "Npc",
    "Twin",
    "Tuber M",
    "Tuber F",
    "Swimmer M",
    "Swimmer F",
    "Maniac",
    "Hiker",
    "Black Belt",
    "Running Triathlete M",
    "Running Triathlete F",
    "Cycling Triathlete M",
    "Cycling Triathlete F",
    "Man 1",
    "Man 2",
    "Man 3",
    "Man 4",
    "Man 5",
    "Woman 1",
    "Woman 2",
    "Woman 3",
    "Woman 4",
    "Woman 5",
    "Boy 1",
    "Boy 2",
    "Boy 3",
    "Girl 1",
    "Girl 2",
    "Girl 3",
  ].map((s) => s.toLowerCase()),
);

/** High-signal story NPCs: script → walkthrough step ids (curated). */
const CURATED_SCRIPT_STEPS = {
  LittlerootTown_EventScript_Mom: ["littleroot-1", "littleroot-2", "postgame-1"],
  LittlerootTown_EventScript_Twin: ["littleroot-1", "route-101-1"],
  LittlerootTown_EventScript_FatMan: ["littleroot-1"],
  LittlerootTown_EventScript_Boy: ["littleroot-1"],
  ProfBirch_EventScript_RatePokedexOrRegister: ["route-101-1", "route-101-3", "littleroot-3"],
  OldaleTown_EventScript_MartEmployee: ["oldale-1"],
  OldaleTown_EventScript_FootprintsMan: ["oldale-1", "route-103-1"],
  OldaleTown_EventScript_Girl: ["oldale-1"],
  PetalburgCity_EventScript_Wally: ["petalburg-1", "petalburg-2", "petalburg-3"],
  PetalburgCity_EventScript_Boy: ["petalburg-1"],
  PetalburgCity_EventScript_Gentleman: ["petalburg-1"],
  PetalburgCity_EventScript_Woman: ["petalburg-1"],
  PetalburgCity_EventScript_Scott: ["petalburg-3"],
  RustboroCity_EventScript_DevonEmployee: ["rustboro-1", "rusturf-tunnel-1"],
  RustboroCity_EventScript_SchoolBoy: ["rustboro-1"],
  DewfordTown_EventScript_OldMan: ["dewford-1"],
  DewfordTown_EventScript_SoftboiledTutor: ["dewford-1"],
  SlateportCity_EventScript_CaptStern: ["slateport-1", "slateport-2"],
  SlateportCity_EventScript_Dock: ["slateport-1"],
  MauvilleCity_EventScript_Scott: ["mauville-1"],
  MauvilleCity_EventScript_WattSon: ["mauville-1"],
  FallarborTown_EventScript_Cozmo: ["fallarbor-1", "meteor-falls-1"],
  LavaridgeTown_EventScript_ExpertM: ["lavaridge-1"],
  FortreeCity_EventScript_Man: ["fortree-1"],
  LilycoveCity_EventScript_ContestHallMan: ["lilycove-1", "contests-lilycove-1"],
  MossdeepCity_EventScript_Scott: ["mossdeep-1"],
  SootopolisCity_EventScript_Kiri: ["sootopolis-1"],
  SootopolisCity_EventScript_Boy1: ["sootopolis-1"],
  EverGrandeCity_EventScript_SetVisitedEverGrande: [],
  Route104_EventScript_Briney: ["route-104-1", "dewford-1"],
  Route104_EventScript_FlowerShopOwner: ["route-104-2"],
  Route109_EventScript_MrBriney: ["route-109-1", "slateport-1"],
  Route111_EventScript_Victor: ["route-111-1"],
  Route119_EventScript_Scott: ["route-119-3"],
  Route120_EventScript_Steven: ["route-120-1", "route-120-2"],
  MtChimney_EventScript_Tabitha: ["mt-chimney-1"],
  MtChimney_EventScript_Maxie: ["mt-chimney-1"],
  LittlerootTown_ProfessorBirchsLab_EventScript_Birch: ["littleroot-3", "route-101-3"],
  LittlerootTown_ProfessorBirchsLab_EventScript_Aide: ["littleroot-3"],
  LittlerootTown_ProfessorBirchsLab_EventScript_Rival: ["littleroot-3", "route-103-2"],
};

const CURATED_NAME_STEPS = {
  Mom: ["littleroot-1", "littleroot-2", "postgame-1"],
  "Professor Birch": ["route-101-1", "route-101-2", "route-101-3", "littleroot-3"],
  Birch: ["route-101-1", "route-101-2", "route-101-3", "littleroot-3"],
  Scott: ["petalburg-3", "rustboro-1", "slateport-2", "mauville-1", "route-119-3", "mossdeep-1"],
  Wally: ["petalburg-1", "petalburg-2", "mauville-1", "victory-road-1"],
  Briney: ["route-104-1", "dewford-1", "route-109-1"],
  "Mr. Briney": ["route-104-1", "dewford-1", "route-109-1"],
  Steven: ["granite-cave-1", "route-120-1", "sootopolis-1", "postgame-1"],
  Norman: ["petalburg-1", "petalburg-gym-1"],
  "Capt Stern": ["slateport-1", "slateport-2"],
  "Captain Stern": ["slateport-1", "slateport-2"],
  Cozmo: ["fallarbor-1", "meteor-falls-1"],
  Maxie: ["mt-chimney-1", "magma-hideout-1"],
  Archie: ["slateport-2", "aqua-hideout-1", "seafloor-cavern-1"],
  Tabitha: ["mt-chimney-1", "magma-hideout-1"],
  Matt: ["aqua-hideout-1"],
  Shelly: ["weather-institute-1", "seafloor-cavern-1"],
  May: ["route-103-2", "rustboro-3", "route-110-3", "route-119-3", "lilycove-1"],
  Brendan: ["route-103-2", "rustboro-3", "route-110-3", "route-119-3", "lilycove-1"],
  Rival: ["route-103-2", "rustboro-3", "route-110-3", "route-119-3", "lilycove-1"],
  "Mart Employee": ["oldale-1"],
  Footprints: ["oldale-1"],
  Kiri: ["sootopolis-1"],
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchText(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", reject);
  });
}

async function fetchTextCached(relPath, cache) {
  const local = path.join(REPO, relPath);
  if (fs.existsSync(local)) return fs.readFileSync(local, "utf8");
  if (cache.has(relPath)) return cache.get(relPath);
  const text = await fetchText(`${RAW}/${relPath.replace(/\\/g, "/")}`);
  cache.set(relPath, text);
  return text;
}

function extractJsonArray(src, exportName) {
  const marker = `export const ${exportName}`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName}`);
  const eq = src.indexOf("= [", start);
  if (eq < 0) throw new Error(`Missing array for ${exportName}`);
  const bracket = eq + 2;
  let depth = 0;
  let i = bracket;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (!depth) {
        i++;
        break;
      }
    }
  }
  return JSON.parse(src.slice(bracket, i));
}

function extractAreaNoneEntities(src) {
  const out = [];
  // Match each object literal roughly; filter TYPE_NONE.
  const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?\}/g;
  let m;
  while ((m = re.exec(src))) {
    const block = m[0];
    if (!block.includes('trainerType: "TRAINER_TYPE_NONE"')) continue;
    const script = block.match(/script:\s*"([^"]+)"/)?.[1];
    const graphicsId = block.match(/graphicsId:\s*"([^"]+)"/)?.[1];
    out.push({
      id: m[1],
      name: m[2],
      script,
      graphicsId,
    });
  }
  return out;
}

function decodeEmeraldString(raw) {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\p/g, "\n\n")
    .replace(/\\l/g, "\n")
    .replace(/\{PLAYER\}/g, "PLAYER")
    .replace(/\{KUN\}/g, "")
    .replace(/\{STR_VAR_\d+\}/g, "…")
    .replace(/\{COLOR\s+\w+\}/g, "")
    .replace(/\{SHADOW\s+\w+\}/g, "")
    .replace(/\{RESET_COLOR\}/g, "")
    .replace(/\{PAUSE_UNTIL_PRESS\}/g, "")
    .replace(/\{PLAY_BGM[^}]*\}/g, "")
    .replace(/\{PLAY_SE[^}]*\}/g, "")
    .replace(/\$$/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseStringTable(scriptText) {
  const table = new Map();
  // Do not let \s* eat the leading tab on the next .string line.
  const re = /^([A-Za-z0-9_]+):\n((?:[ \t]*\.string\s+"[^"]*"\n)+)/gm;
  let m;
  while ((m = re.exec(scriptText))) {
    const parts = [...m[2].matchAll(/\.string\s+"([^"]*)"/g)].map((x) => x[1]);
    table.set(m[1], decodeEmeraldString(parts.join("")));
  }
  return table;
}

function splitLabels(scriptText) {
  /** @type {Map<string, string>} */
  const bodies = new Map();
  const lines = scriptText.split(/\r?\n/);
  let current = null;
  let buf = [];
  const flush = () => {
    if (current) bodies.set(current, buf.join("\n"));
    buf = [];
  };
  for (const line of lines) {
    const label = line.match(/^([A-Za-z0-9_]+)::\s*$/);
    if (label) {
      flush();
      current = label[1];
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return bodies;
}

function collectDialogueForScript(scriptName, bodies, strings, limit = 8) {
  if (!bodies.has(scriptName)) return [];
  const seen = new Set();
  const queue = [scriptName];
  const texts = [];
  const visited = new Set();

  while (queue.length && texts.length < limit) {
    const label = queue.shift();
    if (!label || visited.has(label)) continue;
    visited.add(label);
    const body = bodies.get(label);
    if (!body) continue;

    for (const mt of body.matchAll(/\bmsgbox\s+([A-Za-z0-9_]+)/g)) {
      const key = mt[1];
      if (seen.has(key)) continue;
      seen.add(key);
      const text = strings.get(key);
      if (text) texts.push(text);
      if (texts.length >= limit) break;
    }

    for (const mt of body.matchAll(
      /\b(?:goto|call|call_if_\w+|goto_if_\w+)\s+(?:[^,\n]+,\s*)?([A-Za-z0-9_]+)/g,
    )) {
      const next = mt[1];
      if (next.startsWith("Common_") || next === "EventScript_BagIsFull") continue;
      if (bodies.has(next) && !visited.has(next)) queue.push(next);
    }
    // switch/case branches (e.g. mart employee lead-you-to-the-mart cutscene)
    for (const mt of body.matchAll(/\bcase\s+[A-Za-z0-9_]+,\s*([A-Za-z0-9_]+)/g)) {
      const next = mt[1];
      if (bodies.has(next) && !visited.has(next)) queue.push(next);
    }
  }
  return texts;
}

function scriptToMapDir(script, mapId) {
  if (mapId) {
    try {
      return mapIdToDir(mapId);
    } catch {
      /* fall through */
    }
  }
  // LittlerootTown_EventScript_Mom → LittlerootTown
  // LittlerootTown_ProfessorBirchsLab_EventScript_Birch → LittlerootTown_ProfessorBirchsLab
  const m = script.match(/^(.+)_EventScript_/);
  if (!m) return null;
  return m[1];
}

function loadWalkthroughSteps() {
  const guide = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/guide_data.json"), "utf8"));
  const steps = [];
  const sections = guide.walkthrough || guide.sections || guide;
  const list = Array.isArray(sections) ? sections : sections.chapters || [];
  for (const section of list) {
    const sectionTitle = section.title || section.name || "";
    for (const step of section.steps || []) {
      steps.push({
        id: step.id,
        title: step.title || "",
        location: step.location || "",
        summary: step.summary || "",
        story: typeof step.story === "string" ? step.story : "",
        sectionTitle,
      });
    }
  }
  return steps;
}

function htmlToText(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findWalkthroughMatches(name, steps) {
  const q = name.trim().toLowerCase();
  if (!q || GENERIC_NAMES.has(q) || q.length < 3) return [];
  const hits = [];
  for (const step of steps) {
    const blob = `${step.title} ${step.location} ${step.summary} ${htmlToText(step.story)}`.toLowerCase();
    if (!blob.includes(q)) continue;
    const inTitle = step.title.toLowerCase().includes(q);
    hits.push({
      stepId: step.id,
      title: step.title,
      location: step.location || undefined,
      blurb: step.summary || htmlToText(step.story).slice(0, 140) || undefined,
      score: inTitle ? 2 : 1,
    });
  }
  hits.sort((a, b) => b.score - a.score);
  // Cap to keep the modal readable.
  return hits.slice(0, 6).map(({ stepId, title, location, blurb }) => ({
    stepId,
    title,
    location,
    blurb,
  }));
}

function stepMeta(steps, stepId) {
  const step = steps.find((s) => s.id === stepId);
  if (!step) return { stepId, title: stepId };
  return {
    stepId,
    title: step.title,
    location: step.location || undefined,
    blurb: step.summary || undefined,
  };
}

async function main() {
  const cache = new Map();
  const mapNpcs = extractJsonArray(
    fs.readFileSync(path.join(ROOT, "src/data/mapNpcsGenerated.ts"), "utf8"),
    "MAP_NPCS",
  );
  const areaNone = extractAreaNoneEntities(
    fs.readFileSync(path.join(ROOT, "src/data/areaMapEntitiesGenerated.ts"), "utf8"),
  );

  /** @type {Map<string, { name: string, mapId?: string, graphicsId?: string }>} */
  const byScript = new Map();
  for (const n of mapNpcs) {
    if (!n.script) continue;
    if (!byScript.has(n.script)) {
      byScript.set(n.script, {
        name: n.name,
        mapId: n.mapId,
        graphicsId: n.graphicsId,
      });
    }
  }
  for (const n of areaNone) {
    if (!n.script) continue;
    if (!byScript.has(n.script)) {
      byScript.set(n.script, { name: n.name, graphicsId: n.graphicsId });
    }
  }

  const walkthroughSteps = loadWalkthroughSteps();
  const stepById = new Map(walkthroughSteps.map((s) => [s.id, s]));

  /** script → map dir */
  const scriptsByDir = new Map();
  for (const [script, meta] of byScript) {
    const dir = scriptToMapDir(script, meta.mapId);
    if (!dir) continue;
    if (!scriptsByDir.has(dir)) scriptsByDir.set(dir, []);
    scriptsByDir.get(dir).push(script);
  }

  // Shared script files (Birch Pokédex rating, etc.)
  const SHARED_SCRIPT_FILES = [
    "data/scripts/prof_birch.inc",
    "data/scripts/repel.inc",
    "data/scripts/pkmn_center_nurse.inc",
  ];

  const details = {};
  let dialogueHits = 0;
  let storyHits = 0;

  for (const [dir, scripts] of scriptsByDir) {
    let text = "";
    try {
      text = await fetchTextCached(`data/maps/${dir}/scripts.inc`, cache);
    } catch {
      console.warn(`  skip map scripts ${dir}`);
      continue;
    }
    const bodies = splitLabels(text);
    const strings = parseStringTable(text);
    for (const script of scripts) {
      const lines = collectDialogueForScript(script, bodies, strings);
      if (lines.length) dialogueHits += 1;
      details[script] = {
        dialogue: lines,
        story: [],
      };
    }
  }

  // Shared scripts not under a map folder
  for (const rel of SHARED_SCRIPT_FILES) {
    let text = "";
    try {
      text = await fetchTextCached(rel, cache);
    } catch {
      continue;
    }
    const bodies = splitLabels(text);
    const strings = parseStringTable(text);
    for (const script of byScript.keys()) {
      if (!bodies.has(script)) continue;
      const lines = collectDialogueForScript(script, bodies, strings);
      if (!details[script]) details[script] = { dialogue: [], story: [] };
      if (lines.length && details[script].dialogue.length === 0) {
        details[script].dialogue = lines;
        dialogueHits += 1;
      }
    }
  }

  // Story links
  for (const [script, meta] of byScript) {
    if (!details[script]) details[script] = { dialogue: [], story: [] };
    const seen = new Set();
    const story = [];

    const pushLinks = (links) => {
      for (const link of links) {
        if (!link?.stepId || seen.has(link.stepId)) continue;
        if (!stepById.has(link.stepId) && !CURATED_SCRIPT_STEPS[script]) {
          // Allow curated even if id drift; skip unknown auto matches.
        }
        if (!stepById.has(link.stepId)) continue;
        seen.add(link.stepId);
        story.push(link);
      }
    };

    if (CURATED_SCRIPT_STEPS[script]) {
      pushLinks(CURATED_SCRIPT_STEPS[script].map((id) => stepMeta(walkthroughSteps, id)));
    }
    for (const [name, ids] of Object.entries(CURATED_NAME_STEPS)) {
      if (meta.name.toLowerCase() === name.toLowerCase() || meta.name.toLowerCase().includes(name.toLowerCase())) {
        pushLinks(ids.map((id) => stepMeta(walkthroughSteps, id)));
      }
    }
    pushLinks(findWalkthroughMatches(meta.name, walkthroughSteps));

    details[script].story = story.slice(0, 8);
    if (story.length) storyHits += 1;
  }

  const header = `/* AUTO-GENERATED by scripts/gen-npc-details.mjs — do not edit by hand.
 * Dialogue + walkthrough story links keyed by pokeemerald EventScript label.
 * Scripts: ${byScript.size}. With dialogue: ${dialogueHits}. With story links: ${storyHits}.
 */

export interface NpcStoryLink {
  stepId: string;
  title: string;
  location?: string;
  blurb?: string;
}

export interface NpcScriptDetails {
  dialogue: string[];
  story: NpcStoryLink[];
}

`;

  const body = `export const NPC_DETAILS_BY_SCRIPT: Record<string, NpcScriptDetails> = ${JSON.stringify(
    details,
    null,
    2,
  )};\n`;

  fs.writeFileSync(OUT_FILE, header + body, "utf8");
  console.log(
    `Wrote details for ${Object.keys(details).length} scripts → ${path.relative(ROOT, OUT_FILE)}`,
  );
  console.log(`  dialogue: ${dialogueHits}, story: ${storyHits}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
