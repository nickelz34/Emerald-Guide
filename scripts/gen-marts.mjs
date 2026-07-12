/**
 * Generate src/data/martsGenerated.ts from pokeemerald Poké Mart scripts + item prices.
 *
 * Usage: node scripts/gen-marts.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REPO = path.join(ROOT, ".calib/pokeemerald");
const OUT = path.join(ROOT, "src/data/martsGenerated.ts");

/** Entrance / shop pin id → mart id. */
const ENTRANCE_TO_MART = {
  en6: "oldale-mart",
  en40: "petalburg-mart",
  en45: "mauville-mart",
  en50: "slateport-mart",
  en132: "rustboro-mart",
  en167: "verdanturf-mart",
  en267: "fallarbor-mart",
  en273: "lavaridge-herb-shop",
  en275: "lavaridge-mart",
  en282: "fortree-mart",
  en356: "lilycove-dept-store",
  en384: "mossdeep-mart",
  en44: "mauville-bike-shop",
  en80: "pretty-petal-flower-shop",
  en152: "glass-workshop",
  en287: "fortree-decoration-shop",
  "mart-sootopolis": "sootopolis-mart",
  "shop-slateport-market": "slateport-market",
  "shop-battle-frontier-mart": "battle-frontier-mart",
  "shop-pokemon-league-mart": "pokemon-league-mart",
};

/**
 * Mart definitions. `maps` lists pokeemerald map folder names that contain pokemart lists.
 * For multi-map shops (dept store), lists are merged into sections.
 */
const MART_DEFS = [
  {
    id: "oldale-mart",
    name: "Poké Mart",
    location: "Oldale Town",
    kind: "mart",
    maps: ["OldaleTown_Mart"],
    notes: [
      "Poké Balls are sold out until you start your adventure (talk to Birch / leave for Route 103).",
    ],
  },
  {
    id: "petalburg-mart",
    name: "Poké Mart",
    location: "Petalburg City",
    kind: "mart",
    maps: ["PetalburgCity_Mart"],
    notes: [
      "Stock expands after you defeat Roxanne and return — Great Balls and Super Potions appear then.",
    ],
  },
  {
    id: "rustboro-mart",
    name: "Poké Mart",
    location: "Rustboro City",
    kind: "mart",
    maps: ["RustboroCity_Mart"],
  },
  {
    id: "slateport-mart",
    name: "Poké Mart",
    location: "Slateport City",
    kind: "mart",
    maps: ["SlateportCity_Mart"],
  },
  {
    id: "mauville-mart",
    name: "Poké Mart",
    location: "Mauville City",
    kind: "mart",
    maps: ["MauvilleCity_Mart"],
  },
  {
    id: "verdanturf-mart",
    name: "Poké Mart",
    location: "Verdanturf Town",
    kind: "mart",
    maps: ["VerdanturfTown_Mart"],
  },
  {
    id: "fallarbor-mart",
    name: "Poké Mart",
    location: "Fallarbor Town",
    kind: "mart",
    maps: ["FallarborTown_Mart"],
  },
  {
    id: "lavaridge-mart",
    name: "Poké Mart",
    location: "Lavaridge Town",
    kind: "mart",
    maps: ["LavaridgeTown_Mart"],
  },
  {
    id: "lavaridge-herb-shop",
    name: "Herb Shop",
    location: "Lavaridge Town",
    kind: "specialty",
    maps: ["LavaridgeTown_HerbShop"],
    notes: [
      "Herbal medicine is cheap and powerful but lowers friendship (Pokémon dislike the bitter taste).",
      "Talk to the old man once to receive Charcoal (boosts Fire-type moves when held).",
    ],
  },
  {
    id: "fortree-mart",
    name: "Poké Mart",
    location: "Fortree City",
    kind: "mart",
    maps: ["FortreeCity_Mart"],
  },
  {
    id: "lilycove-dept-store",
    name: "Department Store",
    location: "Lilycove City",
    kind: "department",
    maps: [
      "LilycoveCity_DepartmentStore_2F",
      "LilycoveCity_DepartmentStore_3F",
      "LilycoveCity_DepartmentStore_4F",
      "LilycoveCity_DepartmentStore_5F",
    ],
    notes: [
      "1F is the lobby (elevator / rooftop access). Shopping floors are 2F–5F.",
      "5F sells secret-base decorations (dolls, cushions, posters, mats).",
      "Rooftop has a drink stand and temporary Clear Bell / Tidal Bell events — not a standard mart list.",
    ],
  },
  {
    id: "mossdeep-mart",
    name: "Poké Mart",
    location: "Mossdeep City",
    kind: "mart",
    maps: ["MossdeepCity_Mart"],
  },
  {
    id: "sootopolis-mart",
    name: "Poké Mart",
    location: "Sootopolis City",
    kind: "mart",
    maps: ["SootopolisCity_Mart"],
  },
  {
    id: "mauville-bike-shop",
    name: "Bike Shop",
    location: "Mauville City",
    kind: "specialty",
    maps: [],
    notes: [
      "Rydel's Cycles — you choose either the Mach Bike (speed) or Acro Bike (tricks) for free.",
      "You can swap bikes later by returning the one you have.",
      "The Mach Bike is required for the jagged dirt slope on Route 112 / Jagged Pass shortcuts; the Acro Bike is needed for some rail tricks (e.g. Route 119).",
    ],
    manualSections: [
      {
        id: "bikes",
        label: "Bicycles",
        unlockNote: null,
        items: [
          { const: "ITEM_MACH_BIKE", name: "Mach Bike", price: 0, description: "A folding bicycle that doubles your speed or more." },
          { const: "ITEM_ACRO_BIKE", name: "Acro Bike", price: 0, description: "A folding bicycle capable of jumps and wheelies." },
        ],
      },
    ],
  },
  {
    id: "pretty-petal-flower-shop",
    name: "Pretty Petal Flower Shop",
    location: "Route 104",
    kind: "specialty",
    maps: ["Route104_PrettyPetalFlowerShop"],
    notes: [
      "One sister gives the Wailmer Pail (needed to water planted berries).",
      "Another sister gives one free random berry per day (Cheri, Chesto, Pecha, Rawst, Aspear, Leppa, Oran, or Persim).",
      "Plant decorations unlock for sale after you earn the Dynamo Badge (Mauville / Wattson).",
    ],
    manualSections: [
      {
        id: "flower-shop-gifts",
        label: "Free gifts",
        unlockNote: null,
        items: [
          {
            const: "ITEM_WAILMER_PAIL",
            name: "Wailmer Pail",
            price: 0,
            description: "A watering can for berries planted in soft soil.",
          },
          {
            const: "ITEM_CHERI_BERRY",
            name: "Daily berry",
            price: 0,
            description: "One free random berry each day (Cheri, Chesto, Pecha, Rawst, Aspear, Leppa, Oran, or Persim).",
          },
        ],
      },
    ],
  },
  {
    id: "fortree-decoration-shop",
    name: "Decoration Shop",
    location: "Fortree City",
    kind: "specialty",
    maps: ["FortreeCity_DecorationShop"],
    notes: [
      "Secret-base furniture shop — desks and chairs are sent to your PC when purchased.",
    ],
  },
  {
    id: "glass-workshop",
    name: "Glass Workshop",
    location: "Route 113",
    kind: "specialty",
    maps: [],
    notes: [
      "Talk to the glassblower once to receive the Soot Sack, then walk through ash on Route 113 to fill it.",
      "Prices below are ash amounts spent from the Soot Sack, not regular money.",
    ],
    manualSections: [
      {
        id: "glass-workshop-catalog",
        label: "Ash catalog",
        unlockNote: "Requires Soot Sack with enough ash",
        items: [
          { const: "ITEM_BLUE_FLUTE", name: "Blue Flute", price: 250, priceUnit: "ash", description: "A glass flute that awakens sleeping Pokémon." },
          { const: "ITEM_YELLOW_FLUTE", name: "Yellow Flute", price: 500, priceUnit: "ash", description: "A glass flute that snaps Pokémon out of confusion." },
          { const: "ITEM_RED_FLUTE", name: "Red Flute", price: 500, priceUnit: "ash", description: "A glass flute that snaps Pokémon out of infatuation." },
          { const: "ITEM_WHITE_FLUTE", name: "White Flute", price: 1000, priceUnit: "ash", description: "A glass flute that lures wild Pokémon." },
          { const: "ITEM_BLACK_FLUTE", name: "Black Flute", price: 1000, priceUnit: "ash", description: "A glass flute that keeps wild Pokémon away." },
          { const: "DECOR_PRETTY_CHAIR", name: "Pretty Chair", price: 6000, priceUnit: "ash", description: "A glass chair for a secret base." },
          { const: "DECOR_PRETTY_DESK", name: "Pretty Desk", price: 8000, priceUnit: "ash", description: "A huge glass desk for a secret base." },
        ],
      },
    ],
  },
  {
    id: "slateport-market",
    name: "Market",
    location: "Slateport City",
    kind: "specialty",
    maps: [],
    notes: [
      "Outdoor market vendors south of the Pokémon Center — not the indoor Poké Mart.",
      "The decorator who sells bricks, balloons, and note mats only opens after you learn Secret Power.",
    ],
    manualSections: [],
    scriptLists: [
      {
        map: "SlateportCity",
        lists: [
          { id: "SlateportCity_Pokemart_EnergyGuru", label: "Energy Guru" },
          { id: "SlateportCity_PokemartDecor_Dolls", label: "Doll stall" },
          { id: "SlateportCity_PokemartDecor", label: "Decorator", unlockNote: "After learning Secret Power" },
          { id: "SlateportCity_Pokemart_PowerTMs", label: "TM stall" },
        ],
      },
    ],
  },
  {
    id: "battle-frontier-mart",
    name: "Poké Mart",
    location: "Battle Frontier",
    kind: "mart",
    maps: ["BattleFrontier_Mart"],
    notes: ["Post-game mart inside the Battle Frontier."],
  },
  {
    id: "pokemon-league-mart",
    name: "Poké Mart",
    location: "Pokémon League",
    kind: "mart",
    maps: ["EverGrandeCity_PokemonLeague_1F"],
    notes: ["Clerk inside the Pokémon League lobby before the Elite Four."],
  },
];

const FLAG_NOTES = {
  FLAG_ADVENTURE_STARTED: "After your adventure starts (Pok? Balls unlock)",
  FLAG_PETALBURG_MART_EXPANDED_ITEMS: "After Norman's Gym opens (four badges - expanded stock)",
  FLAG_MET_DEVON_EMPLOYEE: "After helping the Devon employee on Route 116 (expanded stock)",
};

function titleCase(s) {
  return s
    .replace(/POKé/gi, "Poké")
    .split(/\s+/)
    .map((w) => {
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      if (/^(PP|HP|SP|S\.S\.|X)$/i.test(w)) return w.toUpperCase();
      if (w === "Poké") return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function loadItemIndex() {
  const itemsText = fs.readFileSync(path.join(REPO, "src/data/items.h"), "utf8");
  const descText = fs.readFileSync(path.join(REPO, "src/data/text/item_descriptions.h"), "utf8");
  const descByVar = new Map();
  for (const mt of descText.matchAll(/static const u8 (\w+)\[\] =\s*_\(([\s\S]*?)\);/g)) {
    const parts = [...mt[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    const text = parts
      .join(" ")
      .replace(/\\[nlp]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    descByVar.set(mt[1], text);
  }

  const byConst = new Map();
  for (const mt of itemsText.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
    const konst = mt[1];
    const body = mt[2];
    const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
    const priceM = body.match(/\.price\s*=\s*(\d+)/);
    const descM = body.match(/\.description\s*=\s*(\w+)/);
    if (!nameM) continue;
    byConst.set(`ITEM_${konst}`, {
      const: `ITEM_${konst}`,
      name: titleCase(nameM[1]),
      price: priceM ? Number(priceM[1]) : 0,
      description: descM ? descByVar.get(descM[1]) || "" : "",
    });
  }
  return byConst;
}

function loadDecorIndex() {
  const header = fs.readFileSync(path.join(REPO, "src/data/decoration/header.h"), "utf8");
  const descText = fs.readFileSync(path.join(REPO, "src/data/decoration/description.h"), "utf8");
  const descByVar = new Map();
  for (const mt of descText.matchAll(/const u8 (DecorDesc_\w+)\[\] =\s*_\(([\s\S]*?)\);/g)) {
    const parts = [...mt[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    const text = parts
      .join(" ")
      .replace(/\\[nlp]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    descByVar.set(mt[1], text);
  }

  const byConst = new Map();
  for (const mt of header.matchAll(/\[(DECOR_\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g)) {
    const konst = mt[1];
    const body = mt[2];
    const nameM = body.match(/\.name\s*=\s*_\("([^"]*)"\)/);
    const priceM = body.match(/\.price\s*=\s*(\d+)/);
    const descM = body.match(/\.description\s*=\s*(DecorDesc_\w+)/);
    if (!nameM) continue;
    byConst.set(konst, {
      const: konst,
      name: titleCase(nameM[1]),
      price: priceM ? Number(priceM[1]) : 0,
      description: descM ? descByVar.get(descM[1]) || "" : "",
    });
  }
  return byConst;
}

function resolveConst(itemConst, itemIndex, decorIndex) {
  if (itemConst.startsWith("DECOR_")) {
    const rec = decorIndex.get(itemConst);
    if (rec) return { ...rec };
    return {
      const: itemConst,
      name: titleCase(itemConst.replace(/^DECOR_/, "").replace(/_/g, " ")),
      price: 0,
      description: "",
    };
  }
  const rec = itemIndex.get(itemConst);
  if (rec) return { ...rec };
  return {
    const: itemConst,
    name: titleCase(itemConst.replace(/^ITEM_/, "").replace(/_/g, " ")),
    price: 0,
    description: "",
  };
}

function sectionLabelFromListName(listName, mapFolder) {
  // OldaleTown_Mart_Pokemart_Basic → Basic
  const m = listName.match(/Pokemart(?:_(\w+))?$/i);
  if (m?.[1]) {
    const raw = m[1].replace(/([a-z])([A-Z])/g, "$1 $2");
    if (/^basic$/i.test(raw)) return "Early stock";
    if (/^expanded$/i.test(raw)) return "Full stock";
    if (/^plants$/i.test(raw)) return "Plant decorations";
    return titleCase(raw.replace(/_/g, " "));
  }
  // LilycoveCity_DepartmentStore_2F_Pokemart1 → 2F · Clerk 1
  const floor = mapFolder.match(/_(\d+F)$/)?.[1];
  const clerk = listName.match(/Pokemart(\d+)$/i)?.[1];
  const themed = listName.match(/Pokemart(?:Decor)?_?(.+)$/i)?.[1];
  if (floor && themed && !clerk) {
    return `${floor} · ${titleCase(themed.replace(/_/g, " "))}`;
  }
  if (floor && clerk) {
    const clerkLabel =
      clerk === "1" ? "Balls & status heals" : clerk === "2" ? "Potions & Repels" : `Clerk ${clerk}`;
    return `${floor} · ${clerkLabel}`;
  }
  if (/PokemartDecor_Desks/i.test(listName)) return "Desks";
  if (/PokemartDecor_Chairs/i.test(listName)) return "Chairs";
  if (/PokemartDecor_Dolls/i.test(listName)) return "Dolls";
  if (/PokemartDecor$/i.test(listName)) return "Decorations";
  return "Stock";
}

function parseMartListBlock(listName, body, itemIndex, decorIndex, mapFolder, unlockByList) {
  const items = [];
  for (const im of body.matchAll(/\.2byte\s+((?:ITEM|DECOR)_\w+)/g)) {
    items.push(resolveConst(im[1], itemIndex, decorIndex));
  }
  if (!items.length) return null;
  return {
    id: listName,
    label: sectionLabelFromListName(listName, mapFolder),
    unlockNote: unlockByList.get(listName) || null,
    items,
  };
}

function parseMartScripts(mapFolder, itemIndex, decorIndex) {
  const scriptsPath = path.join(REPO, "data/maps", mapFolder, "scripts.inc");
  if (!fs.existsSync(scriptsPath)) return [];
  const text = fs.readFileSync(scriptsPath, "utf8");

  const unlockByList = new Map();
  for (const m of text.matchAll(/goto_if_set\s+(FLAG_\w+)\s*,\s*\w*Expanded\w*/gi)) {
    const flag = m[1];
    const expandedList = [...text.matchAll(/pokemart\s+(\w*Expanded\w*)/gi)].map((x) => x[1]);
    for (const list of expandedList) {
      unlockByList.set(list, FLAG_NOTES[flag] || flag.replace(/^FLAG_/, "").replace(/_/g, " "));
    }
  }
  for (const m of text.matchAll(/(\w*Expanded\w*)::\s*\n\s*pokemart\s+(\w+)/gi)) {
    const flagMatch = text.match(new RegExp(`goto_if_set\\s+(FLAG_\\w+)\\s*,\\s*${m[1]}`, "i"));
    if (flagMatch) {
      unlockByList.set(
        m[2],
        FLAG_NOTES[flagMatch[1]] || flagMatch[1].replace(/^FLAG_/, "").replace(/_/g, " "),
      );
    }
  }
  // Pretty Petal plants unlock after Dynamo Badge (script uses FLAG_TEMP_1 after badge check).
  if (/PrettyPetalFlowerShop/i.test(mapFolder)) {
    for (const m of text.matchAll(/pokemartdecoration2?\s+(\w+)/gi)) {
      unlockByList.set(m[1], "After earning the Dynamo Badge (Mauville)");
    }
  }

  const sections = [];
  for (const m of text.matchAll(
    /^(\w+):\s*\n((?:\s*\.2byte\s+(?:ITEM|DECOR)_\w+\s*\n)+)\s*pokemartlistend/gm,
  )) {
    const section = parseMartListBlock(m[1], m[2], itemIndex, decorIndex, mapFolder, unlockByList);
    if (section) sections.push(section);
  }
  return sections;
}

function parseNamedLists(mapFolder, listDefs, itemIndex, decorIndex) {
  const scriptsPath = path.join(REPO, "data/maps", mapFolder, "scripts.inc");
  if (!fs.existsSync(scriptsPath)) return [];
  const text = fs.readFileSync(scriptsPath, "utf8");
  const sections = [];
  for (const def of listDefs) {
    const re = new RegExp(
      `${def.id}:\\s*\\n((?:\\s*\\.2byte\\s+(?:ITEM|DECOR)_\\w+\\s*\\n)+)\\s*pokemartlistend`,
      "m",
    );
    const m = text.match(re);
    if (!m) continue;
    const items = [];
    for (const im of m[1].matchAll(/\.2byte\s+((?:ITEM|DECOR)_\w+)/g)) {
      items.push(resolveConst(im[1], itemIndex, decorIndex));
    }
    if (!items.length) continue;
    sections.push({
      id: def.id,
      label: def.label,
      unlockNote: def.unlockNote || null,
      items,
    });
  }
  return sections;
}

function main() {
  if (!fs.existsSync(REPO)) {
    console.error("Missing .calib/pokeemerald — clone pret/pokeemerald there first.");
    process.exit(1);
  }
  const itemIndex = loadItemIndex();
  const decorIndex = loadDecorIndex();
  const marts = [];

  for (const def of MART_DEFS) {
    const sections = [...(def.manualSections || [])];
    for (const mapFolder of def.maps) {
      sections.push(...parseMartScripts(mapFolder, itemIndex, decorIndex));
    }
    for (const script of def.scriptLists || []) {
      sections.push(...parseNamedLists(script.map, script.lists, itemIndex, decorIndex));
    }
    // Enrich manual items that only listed a const (optional) — leave as-is.
    // Deduplicate section ids
    const seen = new Set();
    const unique = [];
    for (const s of sections) {
      let id = s.id;
      let n = 2;
      while (seen.has(id)) id = `${s.id}_${n++}`;
      seen.add(id);
      unique.push({ ...s, id });
    }
    marts.push({
      id: def.id,
      name: def.name,
      location: def.location,
      kind: def.kind,
      notes: def.notes || [],
      sections: unique,
    });
  }

  const lines = [];
  lines.push("// AUTO-GENERATED by scripts/gen-marts.mjs — do not edit by hand.");
  lines.push("// Poké Mart / shop inventories from pokeemerald scripts.inc + item prices from items.h.");
  lines.push("");
  lines.push("export interface MartItem {");
  lines.push("  const: string;");
  lines.push("  name: string;");
  lines.push("  price: number;");
  lines.push("  description: string;");
  lines.push('  /** When set, price is paid in this currency instead of ¥ (e.g. glass workshop ash). */');
  lines.push('  priceUnit?: "ash";');
  lines.push("}");
  lines.push("");
  lines.push("export interface MartSection {");
  lines.push("  id: string;");
  lines.push("  label: string;");
  lines.push("  /** When set, this list replaces earlier stock after a story flag. */");
  lines.push("  unlockNote: string | null;");
  lines.push("  items: MartItem[];");
  lines.push("}");
  lines.push("");
  lines.push('export type MartKind = "mart" | "department" | "specialty";');
  lines.push("");
  lines.push("export interface MartData {");
  lines.push("  id: string;");
  lines.push("  name: string;");
  lines.push("  location: string;");
  lines.push("  kind: MartKind;");
  lines.push("  notes: string[];");
  lines.push("  sections: MartSection[];");
  lines.push("}");
  lines.push("");
  lines.push("export const MARTS: MartData[] = ");
  lines.push(JSON.stringify(marts, null, 2) + ";");
  lines.push("");
  lines.push("/** Map entrance / pin id → mart id. */");
  lines.push("export const MART_BY_ENTRANCE_ID: Record<string, string> = ");
  lines.push(JSON.stringify(ENTRANCE_TO_MART, null, 2) + ";");
  lines.push("");

  fs.writeFileSync(OUT, lines.join("\n"));
  console.log(
    `Wrote ${path.relative(ROOT, OUT)} (${marts.length} shops, ${marts.reduce((n, m) => n + m.sections.reduce((a, s) => a + s.items.length, 0), 0)} item rows)`,
  );
}

main();
