/**
 * One-shot: clean {POKEBLOCK}/{POKEMON} placeholders in generated map/mart data.
 * Usage: node scripts/clean-generated-item-text.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { cleanItemDescription, cleanItemName } from "./item-text-lib.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const MAP_POINTS = path.join(ROOT, "src/data/mapPointsGenerated.ts");
const MARTS = path.join(ROOT, "src/data/martsGenerated.ts");

function patchField(text, re, cleanFn, onlyIfPoke = false) {
  let changed = 0;
  const out = text.replace(re, (full, prefix, value, suffix) => {
    if (onlyIfPoke && !/POKE|\{POKE/i.test(value)) return full;
    const cleaned = cleanFn(value);
    if (cleaned === value) return full;
    changed++;
    return prefix + cleaned + suffix;
  });
  return { text: out, changed };
}

let mapText = fs.readFileSync(MAP_POINTS, "utf8");
const nanabBefore = (mapText.match(/desc: "([^"]*(?:Nanab|NANAB)[^"]*)"/) || [])[1] || null;

const mapDesc = patchField(
  mapText,
  /(desc: ")(.*?)(")/g,
  cleanItemDescription,
);
mapText = mapDesc.text;

const mapName = patchField(
  mapText,
  /(name: ")(.*?)(")/g,
  cleanItemName,
  true,
);
mapText = mapName.text;
fs.writeFileSync(MAP_POINTS, mapText, "utf8");

let martText = fs.readFileSync(MARTS, "utf8");
const martDesc = patchField(
  martText,
  /("description": ")(.*?)(")/g,
  cleanItemDescription,
);
martText = martDesc.text;

const martName = patchField(
  martText,
  /("name": ")(.*?)(")/g,
  cleanItemName,
  true,
);
martText = martName.text;
fs.writeFileSync(MARTS, martText, "utf8");

const nanabAfter = (mapText.match(/desc: "([^"]*(?:Nanab|NANAB)[^"]*)"/) || [])[1] || null;

console.log("mapPointsGenerated.ts desc changed:", mapDesc.changed);
console.log("mapPointsGenerated.ts name changed:", mapName.changed);
console.log("martsGenerated.ts description changed:", martDesc.changed);
console.log("martsGenerated.ts name changed:", martName.changed);
if (nanabBefore) {
  console.log("Nanab before:", nanabBefore);
  console.log("Nanab after:", nanabAfter);
}

const remMap = (mapText.match(/\{POKEBLOCK\}|\{POKEMON\}/gi) || []).length;
const remMart = (martText.match(/\{POKEBLOCK\}|\{POKEMON\}/gi) || []).length;
console.log("Remaining {POKEBLOCK}/{POKEMON} in mapPoints:", remMap);
console.log("Remaining {POKEBLOCK}/{POKEMON} in marts:", remMart);
if (remMap || remMart) process.exitCode = 1;