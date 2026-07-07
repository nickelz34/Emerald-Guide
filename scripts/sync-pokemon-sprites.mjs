/**
 * Download Gen 3 Emerald front sprites (#1–386) into public/sprites/pokemon/emerald/.
 * Same assets as PokeAPI/jsDelivr — served locally so lists and modals never depend on CDN uptime.
 *
 * Usage:
 *   node scripts/sync-pokemon-sprites.mjs
 *   node scripts/sync-pokemon-sprites.mjs --force   # re-download all
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/sprites/pokemon/emerald");
const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/versions/generation-iii/emerald";
const RAW_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald";
const FIRST = 1;
const LAST = 386;
const CONCURRENCY = 12;

const force = process.argv.includes("--force");

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} → HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function syncOne(n) {
  const file = path.join(OUT_DIR, `${n}.png`);
  if (!force && fs.existsSync(file)) return "skip";

  let buf;
  try {
    buf = await fetchBuffer(`${CDN_BASE}/${n}.png`);
  } catch {
    buf = await fetchBuffer(`${RAW_BASE}/${n}.png`);
  }
  fs.writeFileSync(file, buf);
  return "ok";
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let skip = 0;
  const failed = [];

  for (let start = FIRST; start <= LAST; start += CONCURRENCY) {
    const batch = [];
    for (let n = start; n < start + CONCURRENCY && n <= LAST; n++) {
      batch.push(
        syncOne(n).then((status) => {
          if (status === "ok") ok++;
          else skip++;
        }, (err) => {
          failed.push({ n, err: err.message });
        }),
      );
    }
    await Promise.all(batch);
    process.stdout.write(`\r  ${Math.min(start + CONCURRENCY - 1, LAST)} / ${LAST}`);
  }

  console.log();
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".png"));
  const bytes = files.reduce((sum, f) => sum + fs.statSync(path.join(OUT_DIR, f)).size, 0);
  console.log(`Done: ${ok} downloaded, ${skip} skipped, ${failed.length} failed, ${files.length} total (${(bytes / 1024).toFixed(0)} KB)`);

  if (failed.length) {
    console.error("Failures:", failed.slice(0, 10));
    process.exit(1);
  }
}

main();
