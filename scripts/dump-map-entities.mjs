/**
 * Dump pokeemerald entities for walkthrough marker calibration.
 * Run: node scripts/dump-map-entities.mjs [MapName]
 */
import https from "https";

const maps = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "LittlerootTown", "OldaleTown", "Route101", "Route102", "Route103", "Route104",
      "PetalburgCity", "RustboroCity", "Route116", "Route118", "SlateportCity",
      "Route110", "LavaridgeTown", "Route119", "Route120", "Route111",
    ];

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, (r) => {
      const c = [];
      r.on("data", (d) => c.push(d));
      r.on("end", () => res(JSON.parse(Buffer.concat(c).toString())));
    }).on("error", rej);
  });
}

for (const name of maps) {
  const m = await get(`https://raw.githubusercontent.com/pret/pokeemerald/master/data/maps/${name}/map.json`);
  const layouts = await get("https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/layouts.json");
  const lay = layouts.layouts.find((l) => l.id === m.layout);
  console.log(`\n### ${name} (${lay?.width}x${lay?.height}) connections=${JSON.stringify(m.connections)}`);
  for (const w of m.warp_events ?? []) {
    console.log(`WARP (${w.x},${w.y}) -> ${w.dest_map}#${w.dest_warp_id}`);
  }
  for (const o of m.object_events ?? []) {
    const tt = o.trainer_type !== "TRAINER_TYPE_NONE" ? ` [${o.trainer_type}]` : "";
    console.log(`OBJ (${o.x},${o.y}) ${o.graphics_id}${tt} ${o.script?.slice?.(0, 40) ?? ""}`);
  }
  for (const b of m.bg_events ?? []) {
    console.log(`BG (${b.x},${b.y}) ${b.type} ${b.item ?? b.script?.slice?.(0, 40) ?? ""}`);
  }
}
