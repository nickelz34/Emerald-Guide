/**
 * One-shot / maintenance exporter: serialize the assembled TypeScript walkthrough
 * into src/data/guide_data.json (the runtime CMS source of truth).
 *
 * Usage: npx tsx scripts/export-guide-data.mjs
 * (or: node --import tsx scripts/export-guide-data.mjs)
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { walkthrough } from "../src/data/walkthrough.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/data/guide_data.json");

writeFileSync(outPath, `${JSON.stringify({ walkthrough }, null, 2)}\n`);

const stepCount = walkthrough.reduce((n, ch) => n + ch.steps.length, 0);
console.log(`Wrote ${outPath} (${walkthrough.length} chapters, ${stepCount} steps)`);
