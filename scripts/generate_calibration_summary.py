import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "map_calibration_data.json").read_text(encoding="utf-8"))


def pct(x, y, iw, ih):
    return round(((x * 16 + 8) / iw) * 100, 2), round(((y * 16 + 8) / ih) * 100, 2)


lines = []
lines.append("# Pokemon Emerald Map Calibration Data")
lines.append("")
lines.append("Source: pret/pokeemerald master branch map.json + layouts.json")
lines.append("Formula: `pctX = ((x*16+8)/imgWidth)*100`, `pctY = ((y*16+8)/imgHeight)*100`")
lines.append("")
lines.append("## Notes on special maps")
lines.append("- **GraniteCave**: No exterior map exists; only interior floors (1F shown).")
lines.append("- **SealedChamber**: No folder named SealedChamber; use SealedChamber_OuterRoom / InnerRoom.")
lines.append("- **SkyPillar**: Exterior is SkyPillar_Outside.")
lines.append("- **VictoryRoad**: Entrance area mapped as VictoryRoad_1F.")
lines.append("- **MarineCave**: MarineCave_Entrance + MarineCave_End exist (no Center/Corner).")
lines.append("")
lines.append("## Dimension quick reference")
lines.append("| Map | Tiles (W x H) | Image (W x H px) | Layout |")
lines.append("|-----|---------------|------------------|--------|")
for r in data:
    if "error" in r:
        continue
    lines.append(
        f"| {r['map']} | {r['tiles_w']} x {r['tiles_h']} | {r['img_w']} x {r['img_h']} | {r['layout_name']} |"
    )

for r in data:
    if "error" in r:
        lines.append(f"\n## {r['map']} - ERROR: {r['error']}")
        continue
    iw, ih = r["img_w"], r["img_h"]
    lines.append(f"\n## {r['map']}")
    lines.append(f"- **Layout**: {r['layout_name']} ({r['layout_id']})")
    lines.append(f"- **Dimensions**: {r['tiles_w']} x {r['tiles_h']} tiles = {iw} x {ih} px")
    if r["inferred_tiles_w"] != r["tiles_w"] or r["inferred_tiles_h"] != r["tiles_h"]:
        lines.append(
            f"- **Inferred from coords** (fallback): {r['inferred_tiles_w']} x {r['inferred_tiles_h']} tiles"
        )

    lines.append(f"\n### Warps ({r['warp_count']})")
    if r["warps"]:
        lines.append("| x | y | pctX | pctY | dest_map | dest_warp_id |")
        lines.append("|---|---|------|------|----------|--------------|")
        for w in r["warps"]:
            px, py = pct(w["x"], w["y"], iw, ih)
            lines.append(
                f"| {w['x']} | {w['y']} | {px} | {py} | {w['dest_map']} | {w['dest_warp_id']} |"
            )
    else:
        lines.append("_none_")

    lines.append(f"\n### Signs ({r['sign_count']})")
    if r["signs"]:
        lines.append("| x | y | pctX | pctY | bg_id |")
        lines.append("|---|---|------|------|-------|")
        for s in r["signs"]:
            px, py = pct(s["x"], s["y"], iw, ih)
            lines.append(f"| {s['x']} | {s['y']} | {px} | {py} | {s['bg_id']} |")
    else:
        lines.append("_none_")

    lines.append(f"\n### Trainers ({r['trainer_count']})")
    if r["trainers"]:
        lines.append("| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |")
        lines.append("|---|---|------|------|-------------|--------------|----------|")
        for t in r["trainers"]:
            px, py = pct(t["x"], t["y"], iw, ih)
            lines.append(
                f"| {t['x']} | {t['y']} | {px} | {py} | {t['graphics_id']} | {t['trainer_type']} | {t['trainer_sight_or_berry_tree_id']} |"
            )
    else:
        lines.append("_none_")

out = ROOT / "map_calibration_summary.md"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {out} ({len(lines)} lines)")
