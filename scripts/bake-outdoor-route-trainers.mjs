/**
 * Bake outdoor route trainers into Hoenn walkthrough crop PNGs (Ch. 1–25).
 *
 * Mirrors the area-map bake pattern: paint OW sprites into
 * public/maps/crops/route-XXX-npcs.png, emit HOENN_CROP_CUTSCENE_ENTITIES
 * with bakedInImage for invisible hit targets + legend sprites.
 *
 * Usage: npx tsx scripts/bake-outdoor-route-trainers.mjs
 * (or: node --import tsx scripts/bake-outdoor-route-trainers.mjs)
 *
 * Re-run after scripts/gen-hoenn-crop-images.mjs (which overwrites base crops).
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { MAP_TRAINERS } from "../src/data/mapTrainersGenerated.ts";
import { AREA_MAP_CROP, AREA_NOTE_LABELS, HOENN_MAP_W, HOENN_MAP_H } from "../src/data/mapCrops.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const CROP_DIR = path.join(ROOT, "public/maps/crops");
const ARTIFACT = "/opt/cursor/artifacts/outdoor-route-trainers-baked";
const OUT_TS = path.join(ROOT, "src/data/hoennCropCutsceneEntities.ts");
const OUT_JSON = path.join(ROOT, "scripts/data/outdoor-route-bake-entities.json");

/** Outdoor routes with MAP_TRAINERS on Hoenn crops (Ch. 1–10 + Ch. 11–25). */
const ROUTE_AREA_IDS = [
  // Ch. 1–10 (story + pregame fishing preview)
  "route-102",
  "route-103",
  "route-118",
  // Ch. 11–25
  "route-104",
  "route-116",
  "route-110",
  "route-117",
  "route-111",
  "route-112",
];

function noteMatchesArea(note, labels) {
  if (!note || labels.length === 0) return false;
  const n = note.toLowerCase();
  return labels.some((label) => n.includes(label.toLowerCase()));
}

function toCropLocal(mapX, mapY, crop) {
  const margin = 0.15;
  if (
    mapX < crop.x - margin ||
    mapX > crop.x + crop.w + margin ||
    mapY < crop.y - margin ||
    mapY > crop.y + crop.h + margin
  ) {
    return null;
  }
  return {
    x: +(((mapX - crop.x) / crop.w) * 100).toFixed(2),
    y: +(((mapY - crop.y) / crop.h) * 100).toFixed(2),
  };
}

function loadRgbaPng(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  if (png.colorType === 6) return png;
  // Expand palette / RGB to RGBA
  const out = new PNG({ width: png.width, height: png.height, colorType: 6 });
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const i = (png.width * y + x) << 2;
      out.data[i] = png.data[i];
      out.data[i + 1] = png.data[i + 1];
      out.data[i + 2] = png.data[i + 2];
      out.data[i + 3] = png.data[i + 3] ?? 255;
    }
  }
  return out;
}

function blitSprite(dest, src, dx, dy, { frameX = 0, frameW = 16, frameH = 32, flipX = false } = {}) {
  for (let row = 0; row < frameH; row++) {
    for (let col = 0; col < frameW; col++) {
      const sx = frameX + col;
      const sy = row;
      if (sx >= src.width || sy >= src.height) continue;
      const si = (sy * src.width + sx) * 4;
      const r = src.data[si];
      const g = src.data[si + 1];
      const b = src.data[si + 2];
      const a = src.data[si + 3];
      if (a < 16) continue;
      if (r === 255 && g === 0 && b === 255) continue;
      const tx = flipX ? dx + (frameW - 1 - col) : dx + col;
      const ty = dy + row;
      if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
      const di = (ty * dest.width + tx) * 4;
      const alpha = a / 255;
      dest.data[di] = Math.round(r * alpha + dest.data[di] * (1 - alpha));
      dest.data[di + 1] = Math.round(g * alpha + dest.data[di + 1] * (1 - alpha));
      dest.data[di + 2] = Math.round(b * alpha + dest.data[di + 2] * (1 - alpha));
      dest.data[di + 3] = 255;
    }
  }
}

function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ ...png, colorType: 6, inputHasAlpha: true }));
}

const spriteCache = new Map();
function loadSprite(rel) {
  if (spriteCache.has(rel)) return spriteCache.get(rel);
  const file = path.join(ROOT, "public", rel);
  if (!fs.existsSync(file)) throw new Error(`Missing sprite ${rel}`);
  const png = loadRgbaPng(file);
  spriteCache.set(rel, png);
  return png;
}

fs.mkdirSync(ARTIFACT, { recursive: true });
const cutsceneByArea = {};

for (const areaId of ROUTE_AREA_IDS) {
  const entry = AREA_MAP_CROP[areaId];
  if (!entry?.crop) {
    console.error("Missing AREA_MAP_CROP for", areaId);
    process.exit(1);
  }
  const crop = entry.crop;
  const labels = AREA_NOTE_LABELS[areaId] ?? [];
  const trainers = MAP_TRAINERS.filter((tr) => noteMatchesArea(tr.note, labels));
  if (trainers.length === 0) {
    console.warn("No trainers for", areaId);
    continue;
  }

  const baseName = `${areaId}.png`;
  const npcName = `${areaId}-npcs.png`;
  const basePath = path.join(CROP_DIR, baseName);
  if (!fs.existsSync(basePath)) {
    console.error("Missing crop", basePath);
    process.exit(1);
  }

  // Prefer clean base — if *-npcs already replaced base, regenerate from full Hoenn crop math.
  // Use the non-npcs file if it looks like a prior bake (same size as npcs); always start from
  // the current baseName file which gen-hoenn-crop-images writes.
  const scene = loadRgbaPng(basePath);
  writePng(path.join(ARTIFACT, `${areaId}-clean.png`), scene);

  const expectedW = Math.round((crop.w / 100) * HOENN_MAP_W);
  const expectedH = Math.round((crop.h / 100) * HOENN_MAP_H);
  if (Math.abs(scene.width - expectedW) > 2 || Math.abs(scene.height - expectedH) > 2) {
    console.warn(
      `  ${areaId}: crop PNG ${scene.width}×${scene.height} vs expected ~${expectedW}×${expectedH}`,
    );
  }

  const baked = [];
  for (const tr of trainers) {
    const local = toCropLocal(tr.x, tr.y, crop);
    if (!local) {
      console.warn("  outside crop", areaId, tr.name, tr.x, tr.y);
      continue;
    }
    const fw = tr.spriteWidth ?? 16;
    const fh = tr.spriteHeight ?? 32;
    const frame = tr.spriteFrame ?? 0;
    const flipX = Boolean(tr.spriteFlipX);
    const sheet = loadSprite(tr.spriteSheet);
    const px = Math.round((local.x / 100) * scene.width - fw / 2);
    const py = Math.round((local.y / 100) * scene.height - fh);
    blitSprite(scene, sheet, px, py, {
      frameX: frame * fw,
      frameW: fw,
      frameH: fh,
      flipX,
    });

    baked.push({
      id: `crop-${tr.id}`,
      name: tr.name,
      category: "trainer",
      x: local.x,
      y: local.y,
      desc: tr.desc || tr.note || `${tr.name} on ${areaId}`,
      spriteSheet: tr.spriteSheet,
      spriteWidth: fw,
      spriteHeight: fh,
      spriteFrame: frame,
      ...(flipX ? { spriteFlipX: true } : {}),
      note: areaId,
      bakedInImage: true,
      trainerClass: tr.trainerClass,
      trainerName: tr.trainerName,
      trainerId: tr.trainerId,
      graphicsId: tr.graphicsId,
      script: tr.script,
      trainerType: tr.trainerType,
      ...(tr.sightRange != null ? { sightRange: tr.sightRange } : {}),
      ...(tr.rematchable ? { rematchable: true } : {}),
      mapId: tr.mapId,
      sourceTrainerId: tr.id,
    });
    console.log(`  ${areaId}: ${tr.name} @ crop% (${local.x},${local.y}) frame ${frame}`);
  }

  writePng(path.join(CROP_DIR, npcName), scene);
  writePng(path.join(ARTIFACT, npcName), scene);
  // Keep base crop clean for re-bake; image path switches to *-npcs in hoennCropImages.
  cutsceneByArea[areaId] = baked;
}

fs.writeFileSync(OUT_JSON, JSON.stringify(cutsceneByArea, null, 2));
console.log("Wrote", OUT_JSON);

function emitTs(entitiesByArea) {
  const lines = [];
  lines.push(`/**`);
  lines.push(` * Outdoor route trainers baked into Hoenn walkthrough crop PNGs.`);
  lines.push(` * Pins are invisible hit-targets; sprites show in the lightbox legend.`);
  lines.push(` *`);
  lines.push(` * AUTO-GENERATED by scripts/bake-outdoor-route-trainers.mjs — do not edit by hand.`);
  lines.push(` */`);
  lines.push(`import type { SpriteMapPoint } from "./areaMapCutsceneEntities";`);
  lines.push(``);
  lines.push(`export const HOENN_CROP_CUTSCENE_ENTITIES: Record<string, SpriteMapPoint[]> = {`);
  for (const [areaId, list] of Object.entries(entitiesByArea)) {
    lines.push(`  ${JSON.stringify(areaId)}: [`);
    for (const e of list) {
      lines.push(`    {`);
      lines.push(`      id: ${JSON.stringify(e.id)},`);
      lines.push(`      name: ${JSON.stringify(e.name)},`);
      lines.push(`      category: "trainer",`);
      lines.push(`      x: ${e.x},`);
      lines.push(`      y: ${e.y},`);
      lines.push(`      desc: ${JSON.stringify(e.desc)},`);
      lines.push(`      spriteSheet: ${JSON.stringify(e.spriteSheet)},`);
      lines.push(`      spriteWidth: ${e.spriteWidth},`);
      lines.push(`      spriteHeight: ${e.spriteHeight},`);
      lines.push(`      spriteFrame: ${e.spriteFrame},`);
      if (e.spriteFlipX) lines.push(`      spriteFlipX: true,`);
      lines.push(`      note: ${JSON.stringify(e.note)},`);
      lines.push(`      bakedInImage: true,`);
      if (e.trainerClass) lines.push(`      trainerClass: ${JSON.stringify(e.trainerClass)},`);
      if (e.trainerName) lines.push(`      trainerName: ${JSON.stringify(e.trainerName)},`);
      if (e.trainerId) lines.push(`      trainerId: ${JSON.stringify(e.trainerId)},`);
      if (e.graphicsId) lines.push(`      graphicsId: ${JSON.stringify(e.graphicsId)},`);
      if (e.script) lines.push(`      script: ${JSON.stringify(e.script)},`);
      if (e.trainerType) lines.push(`      trainerType: ${JSON.stringify(e.trainerType)},`);
      lines.push(`    },`);
    }
    lines.push(`  ],`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`/** Trainer ids (mapTrainersGenerated) already painted into a crop for this area. */`);
  lines.push(`export function isBakedOutdoorTrainer(areaId: string, trainerId: string): boolean {`);
  lines.push(`  const list = HOENN_CROP_CUTSCENE_ENTITIES[areaId];`);
  lines.push(`  if (!list) return false;`);
  lines.push(`  return list.some((e) => e.id === \`crop-\${trainerId}\` || (e as { sourceTrainerId?: string }).sourceTrainerId === trainerId);`);
  lines.push(`}`);
  lines.push(``);
  return lines.join("\n");
}

// Strip sourceTrainerId from TS emit helper — keep matching by crop-${id}
function emitTsClean(entitiesByArea) {
  const lines = [];
  lines.push(`/**`);
  lines.push(` * Outdoor route trainers baked into Hoenn walkthrough crop PNGs.`);
  lines.push(` * Pins are invisible hit-targets; sprites show in the lightbox legend.`);
  lines.push(` *`);
  lines.push(` * AUTO-GENERATED by scripts/bake-outdoor-route-trainers.mjs — do not edit by hand.`);
  lines.push(` */`);
  lines.push(`import type { SpriteMapPoint } from "./areaMapCutsceneEntities";`);
  lines.push(``);
  lines.push(`/** sourceTrainerId = MAP_TRAINERS[].id used to suppress overlay pins. */`);
  lines.push(`export type HoennCropBakedTrainer = SpriteMapPoint & { sourceTrainerId?: string };`);
  lines.push(``);
  lines.push(`export const HOENN_CROP_CUTSCENE_ENTITIES: Record<string, HoennCropBakedTrainer[]> = {`);
  for (const [areaId, list] of Object.entries(entitiesByArea)) {
    lines.push(`  ${JSON.stringify(areaId)}: [`);
    for (const e of list) {
      lines.push(`    {`);
      lines.push(`      id: ${JSON.stringify(e.id)},`);
      lines.push(`      name: ${JSON.stringify(e.name)},`);
      lines.push(`      category: "trainer",`);
      lines.push(`      x: ${e.x},`);
      lines.push(`      y: ${e.y},`);
      lines.push(`      desc: ${JSON.stringify(e.desc)},`);
      lines.push(`      spriteSheet: ${JSON.stringify(e.spriteSheet)},`);
      lines.push(`      spriteWidth: ${e.spriteWidth},`);
      lines.push(`      spriteHeight: ${e.spriteHeight},`);
      lines.push(`      spriteFrame: ${e.spriteFrame},`);
      if (e.spriteFlipX) lines.push(`      spriteFlipX: true,`);
      lines.push(`      note: ${JSON.stringify(e.note)},`);
      lines.push(`      bakedInImage: true,`);
      if (e.trainerClass) lines.push(`      trainerClass: ${JSON.stringify(e.trainerClass)},`);
      if (e.trainerName) lines.push(`      trainerName: ${JSON.stringify(e.trainerName)},`);
      if (e.trainerId) lines.push(`      trainerId: ${JSON.stringify(e.trainerId)},`);
      if (e.graphicsId) lines.push(`      graphicsId: ${JSON.stringify(e.graphicsId)},`);
      if (e.script) lines.push(`      script: ${JSON.stringify(e.script)},`);
      if (e.trainerType) lines.push(`      trainerType: ${JSON.stringify(e.trainerType)},`);
      if (e.sourceTrainerId) lines.push(`      sourceTrainerId: ${JSON.stringify(e.sourceTrainerId)},`);
      lines.push(`    },`);
    }
    lines.push(`  ],`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`/** True when this MAP_TRAINERS id is already painted into the area crop. */`);
  lines.push(`export function isBakedOutdoorTrainer(areaId: string | undefined, trainerId: string): boolean {`);
  lines.push(`  if (!areaId) return false;`);
  lines.push(`  const list = HOENN_CROP_CUTSCENE_ENTITIES[areaId];`);
  lines.push(`  if (!list) return false;`);
  lines.push(`  return list.some((e) => e.sourceTrainerId === trainerId || e.id === \`crop-\${trainerId}\`);`);
  lines.push(`}`);
  lines.push(``);
  return lines.join("\n");
}

fs.writeFileSync(OUT_TS, emitTsClean(cutsceneByArea));
console.log("Wrote", OUT_TS);
console.log(
  "Total:",
  Object.values(cutsceneByArea).reduce((n, a) => n + a.length, 0),
  "trainers across",
  Object.keys(cutsceneByArea).length,
  "routes",
);
