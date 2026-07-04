/**
 * Render the true-scale Hoenn composite and copy to public/maps/hoenn-map.png.
 * Run after manifest fixes: node scripts/publish-hoenn-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = path.join(ROOT, ".calib/hoenn-truescale.png");
const dst = path.join(ROOT, "public/maps/hoenn-map.png");

const r = spawnSync(process.execPath, [path.join(ROOT, ".calib/render.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (r.status !== 0) process.exit(r.status ?? 1);

fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.copyFileSync(src, dst);
console.log(`Published ${dst}`);
