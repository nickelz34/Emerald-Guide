/**
 * Parse pokeemerald trainer parties, species types, and battle metadata.
 */

export function parseEnumNames(text, prefix) {
  const map = new Map();
  for (const m of text.matchAll(new RegExp(`#define\\s+(${prefix}\\w+)\\s+(\\d+)`, "g"))) {
    map.set(m[1], Number(m[2]));
  }
  return map;
}

/**
 * Map SPECIES_WURMPLE → National Dex number (265) from pokedex.h.
 * pokeemerald's SPECIES_* enum is Hoenn-dex order with OLD_UNOWN gaps, so it
 * must not be used as the sprite / National Dex id.
 */
export function parseNationalDexBySpeciesKey(pokedexText) {
  const map = new Map();
  for (const m of pokedexText.matchAll(/#define\s+NATIONAL_DEX_(\w+)\s+(\d+)/g)) {
    if (m[1] === "COUNT") continue;
    map.set(`SPECIES_${m[1]}`, Number(m[2]));
  }
  return map;
}

/** Prefer National Dex; fall back to SPECIES_* enum (forms / unused slots). */
export function resolveSpeciesNationalNumber(speciesKey, nationalByKey, enumByKey) {
  if (nationalByKey.has(speciesKey)) return nationalByKey.get(speciesKey);
  const formBase = speciesKey.replace(
    /_(?:SUNNY|RAINY|SNOWY|ATTACK|DEFENSE|SPEED)$/,
    "",
  );
  if (formBase !== speciesKey && nationalByKey.has(formBase)) {
    return nationalByKey.get(formBase);
  }
  return enumByKey.get(speciesKey);
}

export function parseSpeciesNames(text) {
  const names = new Map();
  for (const m of text.matchAll(/\[SPECIES_(\w+)\]\s*=\s*_\("([^"]*)"\)/g)) {
    names.set(`SPECIES_${m[1]}`, m[2] === "??????????" ? "?" : titleCaseSpecies(m[2]));
  }
  return names;
}

export function parseMoveNames(text) {
  const names = new Map();
  for (const m of text.matchAll(/\[MOVE_(\w+)\]\s*=\s*_\("([^"]*)"\)/g)) {
    names.set(`MOVE_${m[1]}`, titleCaseSpecies(m[2]));
  }
  return names;
}

export function parseItemNames(text) {
  const names = new Map();
  for (const m of text.matchAll(/\[ITEM_(\w+)\]\s*=\s*\{[\s\S]*?\.name\s*=\s*_\("([^"]*)"\)/g)) {
    names.set(`ITEM_${m[1]}`, titleCaseSpecies(m[2]));
  }
  return names;
}

function titleCaseSpecies(s) {
  return s
    .replace(/POKéMON/gi, "Pokémon")
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

export function parseTypeNames(text) {
  const map = new Map();
  for (const m of text.matchAll(/#define\s+(TYPE_\w+)\s+(\d+)/g)) {
    map.set(m[1], m[1].replace(/^TYPE_/, "").charAt(0) + m[1].replace(/^TYPE_/, "").slice(1).toLowerCase());
  }
  return map;
}

/** species enum -> [type1, type2?] using national dex order blocks in species_info.h */
export function parseSpeciesTypes(speciesInfoText, typeNames) {
  const out = new Map();
  const blocks = speciesInfoText.split(/\[SPECIES_/);
  for (const block of blocks.slice(1)) {
    const speciesKey = `SPECIES_${block.match(/^(\w+)/)?.[1]}`;
    const typesMatch = block.match(/\.types\s*=\s*\{\s*(TYPE_\w+)\s*,\s*(TYPE_\w+|TYPE_MYSTERY)\s*\}/);
    if (!speciesKey || !typesMatch) continue;
    const t1 = typeNames.get(typesMatch[1]) ?? "Normal";
    const t2raw = typesMatch[2];
    const t2 = t2raw === "TYPE_MYSTERY" ? null : typeNames.get(t2raw);
    out.set(speciesKey, t2 && t2 !== t1 ? [t1, t2] : [t1]);
  }
  return out;
}

function parseMovesFromBlock(block, moveNames) {
  const movesMatch = block.match(/\.moves\s*=\s*\{([^}]*)\}/);
  if (!movesMatch) return undefined;
  const moves = [...movesMatch[1].matchAll(/MOVE_\w+/g)]
    .map((m) => moveNames.get(m[0]) ?? m[0].replace(/^MOVE_/, ""))
    .filter((v, i, a) => v && a.indexOf(v) === i);
  return moves.length ? moves : undefined;
}

function parseMonBlock(block, speciesNames, moveNames, itemNames, speciesTypes, speciesNums) {
  const speciesRaw = block.match(/\.species\s*=\s*(SPECIES_\w+)/)?.[1];
  if (!speciesRaw) return null;
  const lvl = Number(block.match(/\.lvl\s*=\s*(\d+)/)?.[1] ?? 0);
  const iv = Number(block.match(/\.iv\s*=\s*(\d+)/)?.[1] ?? 0);
  const heldRaw = block.match(/\.heldItem\s*=\s*(ITEM_\w+)/)?.[1];
  const moves = parseMovesFromBlock(block, moveNames);
  const species = speciesNames.get(speciesRaw) ?? speciesRaw.replace(/^SPECIES_/, "");
  const num = speciesNums.get(speciesRaw) ?? 0;
  const types = speciesTypes.get(speciesRaw) ?? ["Normal"];
  const mon = {
    species,
    speciesId: num ?? 0,
    level: lvl,
    types,
    iv: iv || undefined,
    heldItem: heldRaw ? itemNames.get(heldRaw) ?? heldRaw.replace(/^ITEM_/, "") : undefined,
    moves,
  };
  return mon;
}

function extractMonBlocks(body) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (body[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        blocks.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

export function parseTrainerParties(partiesText, speciesNames, moveNames, itemNames, speciesTypes, speciesNums) {
  const parties = new Map();
  const re = /static const struct TrainerMon\w+ (sParty_\w+)\[\] = \{([\s\S]*?)\n\};/g;
  for (const m of partiesText.matchAll(re)) {
    const id = m[1];
    const body = m[2];
    const mons = [];
    for (const block of extractMonBlocks(body)) {
      const mon = parseMonBlock(block, speciesNames, moveNames, itemNames, speciesTypes, speciesNums);
      if (mon) mons.push(mon);
    }
    if (mons.length) parties.set(id, mons);
  }
  return parties;
}

export function parseTrainerRecords(trainersText) {
  const records = new Map();
  const re = /\[TRAINER_(\w+)\]\s*=\s*\{([\s\S]*?)\n\s*\},/g;
  for (const m of trainersText.matchAll(re)) {
    const id = `TRAINER_${m[1]}`;
    const body = m[2];
    const partyMatch = body.match(
      /\.party\s*=\s*(NO_ITEM_DEFAULT_MOVES|NO_ITEM_CUSTOM_MOVES|ITEM_DEFAULT_MOVES|ITEM_CUSTOM_MOVES)\((sParty_\w+)\)/,
    );
    if (!partyMatch) continue;
    const itemsBlock = body.match(/\.items\s*=\s*\{([^}]*)\}/)?.[1] ?? "";
    const items = [...itemsBlock.matchAll(/ITEM_\w+/g)].map((x) => x[0]);
    const doubleBattle = /\.doubleBattle\s*=\s*TRUE/.test(body);
    records.set(id, {
      partyId: partyMatch[2],
      partyFlags: partyMatch[1],
      items,
      doubleBattle,
    });
  }
  return records;
}

export function buildTrainerBattleLookup(records, parties, itemNames) {
  const out = new Map();
  for (const [trainerId, rec] of records) {
    const party = parties.get(rec.partyId);
    if (!party) continue;
    out.set(trainerId, {
      doubleBattle: rec.doubleBattle,
      partyFlags: rec.partyFlags,
      items: rec.items
        .map((i) => itemNames.get(i) ?? i.replace(/^ITEM_/, ""))
        .filter((n) => n && !n.includes("?")),
      party,
    });
  }
  return out;
}
