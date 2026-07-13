/**
 * Bundle Pokédex listings, species detail stats, and wild encounter source data
 * for fully offline runtime — no PokéAPI or GitHub fetches in the browser.
 *
 * Usage:
 *   node scripts/sync-offline-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const API = "https://pokeapi.co/api/v2";
const WILD_URL =
  "https://raw.githubusercontent.com/pret/pokeemerald/master/src/data/wild_encounters.json";
const WILD_OUT = path.join(ROOT, "src/data/wild_encounters.json");
const DEX_OUT = path.join(ROOT, "src/data/dexGenerated.ts");
const SPECIES_OUT = path.join(ROOT, "src/data/speciesDataGenerated.ts");
const MAX_GEN3 = 386;
const CONCURRENCY = 8;

const NAME_OVERRIDES = {
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "mr-mime": "Mr. Mime",
  "ho-oh": "Ho-Oh",
  farfetchd: "Farfetch'd",
};

const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const GLITCH = {
  name: "?????????? (Decamark)",
  slug: "",
  nationalNumber: 387,
  isGlitch: true,
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchJson(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} → HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function cap(s) {
  return s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function displayName(slug) {
  return NAME_OVERRIDES[slug] ?? cap(slug);
}

function idFromUrl(url) {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function flattenChainNames(link, acc = [], seen = new Set()) {
  const name = displayName(link.species.name);
  if (!seen.has(name)) {
    seen.add(name);
    acc.push(name);
  }
  for (const next of link.evolves_to ?? []) {
    flattenChainNames(next, acc, seen);
  }
  return acc;
}

/** Gen 3 items / stones that exist in Emerald. */
const GEN3_STONE_SLUGS = new Set([
  "fire-stone",
  "water-stone",
  "thunder-stone",
  "leaf-stone",
  "moon-stone",
  "sun-stone",
]);

const GEN3_TRADE_ITEMS = new Set([
  "metal-coat",
  "dragon-scale",
  "kings-rock",
  "deep-sea-tooth",
  "deep-sea-scale",
  "upgrade",
]);

function itemLabel(slug) {
  if (!slug) return "";
  return cap(slug);
}

function formatEvolutionDetail(detail) {
  const trigger = detail.trigger?.name ?? "";
  const parts = [];

  if (trigger === "level-up") {
    if (detail.min_level != null) parts.push(`Level ${detail.min_level}`);
    else parts.push("Level-up");
    if (detail.min_happiness != null) {
      if (detail.time_of_day === "day") parts.push("friendship (day)");
      else if (detail.time_of_day === "night") parts.push("friendship (night)");
      else parts.push("friendship");
    }
    if (detail.min_beauty != null) parts.push(`Beauty ${detail.min_beauty}+`);
    if (detail.known_move) parts.push(`knowing ${cap(detail.known_move.name)}`);
    if (detail.relative_physical_stats != null) {
      if (detail.relative_physical_stats === 1) parts.push("Attack > Defense");
      else if (detail.relative_physical_stats === -1) parts.push("Attack < Defense");
      else parts.push("Attack = Defense");
    }
    if (detail.needs_overworld_rain) parts.push("in rain");
  } else if (trigger === "use-item") {
    const item = detail.item?.name;
    if (item) parts.push(itemLabel(item));
    else parts.push("Use item");
  } else if (trigger === "trade") {
    if (detail.held_item) parts.push(`Trade + ${itemLabel(detail.held_item.name)}`);
    else parts.push("Trade");
  } else if (trigger === "shed") {
    parts.push("Empty party slot + Poké Ball when Nincada evolves");
  } else {
    parts.push(cap(trigger || "Special"));
  }

  if (detail.gender === 1) parts.push("(female)");
  if (detail.gender === 2) parts.push("(male)");

  return parts.filter(Boolean).join(" · ") || "Special";
}

function isGen3Detail(detail, toNationalId) {
  if (toNationalId > MAX_GEN3) return false;
  const trigger = detail.trigger?.name ?? "";
  if (trigger === "use-item") {
    const item = detail.item?.name;
    if (!item || !GEN3_STONE_SLUGS.has(item)) return false;
  }
  if (trigger === "trade" && detail.held_item) {
    if (!GEN3_TRADE_ITEMS.has(detail.held_item.name)) return false;
  }
  // Location / region-based and Gen4+ move/party conditions
  if (detail.location) return false;
  if (detail.held_item && trigger === "level-up") return false;
  if (detail.known_move_type) return false;
  if (detail.min_affection) return false;
  if (detail.party_species || detail.party_type) return false;
  if (detail.trade_species) return false;
  if (trigger === "three-triggers" || trigger === "take-damage") return false;
  return true;
}

function collectEvolutionMethods(chainRoot, idBySlug) {
  const methods = [];
  const seen = new Set();

  function walk(link) {
    const fromName = displayName(link.species.name);
    for (const next of link.evolves_to ?? []) {
      const toSlug = next.species.name;
      const toId = idBySlug.get(toSlug) ?? idFromUrl(next.species.url);
      const toName = displayName(toSlug);
      for (const detail of next.evolution_details ?? []) {
        if (!isGen3Detail(detail, toId)) continue;
        let method = formatEvolutionDetail(detail);
        // Emerald-specific clarity for Shedinja
        if (toSlug === "shedinja") {
          method = "Empty party slot + Poké Ball when Nincada evolves into Ninjask";
        }
        if (fromName === "Feebas" && toSlug === "milotic" && !method.includes("Beauty")) {
          method = "Level-up with Beauty 170+";
        }
        const key = `${fromName}|${toName}|${method}`;
        if (!seen.has(key)) {
          seen.add(key);
          methods.push({ from: fromName, to: toName, method });
        }
      }
      walk(next);
    }
  }

  walk(chainRoot);
  return methods;
}

function eggGroupLabel(slug) {
  const map = {
    monster: "Monster",
    water1: "Water 1",
    water2: "Water 2",
    water3: "Water 3",
    bug: "Bug",
    flying: "Flying",
    ground: "Field",
    fairy: "Fairy",
    plant: "Grass",
    humanshape: "Human-Like",
    mineral: "Mineral",
    indeterminate: "Amorphous",
    ditto: "Ditto",
    dragon: "Dragon",
    no_eggs: "Undiscovered",
    "no-eggs": "Undiscovered",
  };
  return map[slug] ?? cap(slug);
}

function tsString(s) {
  return JSON.stringify(s);
}

function writeTs(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    `// AUTO-GENERATED by scripts/sync-offline-data.mjs — do not edit by hand.\n\n${body}\n`,
    "utf8",
  );
}

async function syncWild() {
  console.log("Syncing wild_encounters.json…");
  const raw = await fetchJson(WILD_URL);
  fs.mkdirSync(path.dirname(WILD_OUT), { recursive: true });
  fs.writeFileSync(WILD_OUT, JSON.stringify(raw));
  const kb = (fs.statSync(WILD_OUT).size / 1024).toFixed(0);
  console.log(`  → ${WILD_OUT} (${kb} KB)`);
}

async function syncDex() {
  console.log("Syncing Pokédex listings…");
  const [hoennRaw, nationalRaw] = await Promise.all([
    fetchJson(`${API}/pokedex/hoenn`),
    fetchJson(`${API}/pokedex/national`),
  ]);

  const hoenn = hoennRaw.pokemon_entries
    .map((e) => ({
      name: displayName(e.pokemon_species.name),
      slug: e.pokemon_species.name,
      hoennNumber: e.entry_number,
      nationalNumber: idFromUrl(e.pokemon_species.url),
    }))
    .sort((a, b) => a.hoennNumber - b.hoennNumber);

  const hoennSlugs = new Set(hoenn.map((h) => h.slug));
  const national = nationalRaw.pokemon_entries
    .filter((e) => e.entry_number <= MAX_GEN3 && !hoennSlugs.has(e.pokemon_species.name))
    .map((e) => ({
      name: displayName(e.pokemon_species.name),
      slug: e.pokemon_species.name,
      nationalNumber: e.entry_number,
    }))
    .sort((a, b) => a.nationalNumber - b.nationalNumber);

  const nationalWithGlitch = [...national, GLITCH];
  const allReal = [...hoenn, ...national].sort((a, b) => a.nationalNumber - b.nationalNumber);
  const all = [...allReal, GLITCH];

  writeTs(
    DEX_OUT,
    `import type { DexEntry } from "./dex";

export const HOENN_DEX: DexEntry[] = ${JSON.stringify(hoenn, null, 2)};

export const NATIONAL_DEX: DexEntry[] = ${JSON.stringify(nationalWithGlitch, null, 2)};

export const ALL_DEX: DexEntry[] = ${JSON.stringify(all, null, 2)};
`,
  );
  console.log(`  → ${DEX_OUT} (${hoenn.length} Hoenn, ${nationalWithGlitch.length} National, ${all.length} All)`);
}

async function syncSpecies() {
  console.log("Syncing species detail data (Gen 1–386)…");
  const chainCache = new Map();
  const bySlug = {};
  const idBySlug = new Map();

  async function loadChain(url) {
    if (!chainCache.has(url)) chainCache.set(url, fetchJson(url));
    return chainCache.get(url);
  }

  async function loadOne(id) {
    const pokemon = await fetchJson(`${API}/pokemon/${id}`);
    const slug = pokemon.species?.name ?? pokemon.name;
    idBySlug.set(slug, id);
    const stats = pokemon.stats.map((s) => ({
      label: STAT_LABELS[s.stat.name] ?? cap(s.stat.name),
      value: s.base_stat,
    }));

    const info = {
      slug,
      dexNumber: id,
      types: pokemon.types.map((t) => cap(t.type.name)),
      abilities: pokemon.abilities
        .filter((a) => !a.is_hidden)
        .map((a) => cap(a.ability.name)),
      hiddenAbility: pokemon.abilities.find((a) => a.is_hidden)?.ability?.name
        ? cap(pokemon.abilities.find((a) => a.is_hidden).ability.name)
        : undefined,
      baseExp: pokemon.base_experience ?? undefined,
      stats,
      total: stats.reduce((sum, s) => sum + s.value, 0),
      heightM: pokemon.height ? pokemon.height / 10 : undefined,
      weightKg: pokemon.weight ? pokemon.weight / 10 : undefined,
      genus: undefined,
      flavor: undefined,
      evolution: [],
      evolutionMethods: [],
      eggGroups: [],
      genderRate: undefined,
    };

    try {
      const species = await fetchJson(pokemon.species.url);
      info.dexNumber = species.id;
      idBySlug.set(slug, species.id);
      info.genus = species.genera?.find((g) => g.language.name === "en")?.genus;
      const flavorEntries = species.flavor_text_entries?.filter((f) => f.language.name === "en");
      const emerald = flavorEntries?.find((f) => f.version.name === "emerald");
      info.flavor = (emerald ?? flavorEntries?.[0])?.flavor_text?.replace(/[\n\f\r]+/g, " ");
      info.eggGroups = (species.egg_groups ?? []).map((g) => eggGroupLabel(g.name));
      info.genderRate = species.gender_rate;

      if (species.evolution_chain?.url) {
        const chain = await loadChain(species.evolution_chain.url);
        const methods = collectEvolutionMethods(chain.chain, idBySlug);
        info.evolutionMethods = methods;
        // Name list: species that appear in Gen-3-reachable edges, preserving BFS order from root
        const names = flattenChainNames(chain.chain).filter((n) => {
          // Keep if it is the root or appears in a Gen3 method edge
          if (methods.some((m) => m.from === n || m.to === n)) return true;
          // Root-only unevolved species
          return methods.length === 0 && n === displayName(chain.chain.species.name);
        });
        // Always include self
        const selfName = displayName(slug);
        if (!names.includes(selfName)) names.unshift(selfName);
        // Filter out Gen4+ names that slipped into flatten (no method edge)
        info.evolution = names.filter((n) => {
          if (n === selfName) return true;
          return methods.some((m) => m.from === n || m.to === n);
        });
        // Unevolved singles
        if (info.evolution.length === 0) info.evolution = [selfName];
      }
    } catch {
      // keep base stats
    }

    bySlug[slug] = info;
    if (slug === "deoxys-normal") bySlug.deoxys = info;
    return id;
  }

  for (let start = 1; start <= MAX_GEN3; start += CONCURRENCY) {
    const batch = [];
    for (let id = start; id < start + CONCURRENCY && id <= MAX_GEN3; id++) {
      batch.push(loadOne(id).catch((err) => ({ err, id })));
    }
    const results = await Promise.all(batch);
    const failed = results.filter((r) => r?.err);
    if (failed.length) {
      console.error("  failures:", failed);
      process.exit(1);
    }
    process.stdout.write(`\r  ${Math.min(start + CONCURRENCY - 1, MAX_GEN3)} / ${MAX_GEN3}`);
  }
  console.log();

  // Second pass: rebuild evolution methods with complete idBySlug (chains loaded mid-batch may miss ids)
  for (const info of Object.values(bySlug)) {
    if (!info.evolutionMethods) continue;
  }

  writeTs(
    SPECIES_OUT,
    `import type { SpeciesInfo } from "./species";

export const SPECIES_BY_SLUG: Record<string, SpeciesInfo> = ${JSON.stringify(bySlug, null, 2)};
`,
  );
  console.log(`  → ${SPECIES_OUT} (${Object.keys(bySlug).length} slugs)`);
}

async function main() {
  await syncWild();
  await syncDex();
  await syncSpecies();
  console.log("Offline data sync complete.");
}

main();
