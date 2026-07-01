import json
import urllib.request

MAPS = [
    "LittlerootTown", "OldaleTown", "Route101", "Route102", "Route103", "Route104", "Route105",
    "Route110", "Route111", "Route113", "Route116", "Route117", "Route118", "Route119", "Route120",
    "PetalburgCity", "PetalburgWoods", "RustboroCity", "RusturfTunnel", "DewfordTown",
    "SlateportCity", "MauvilleCity", "LavaridgeTown", "FallarborTown", "FortreeCity",
    "MossdeepCity", "SootopolisCity", "LilycoveCity", "PacifidlogTown", "MtChimney",
    "EverGrandeCity",
    "SkyPillar_Outside", "VictoryRoad_1F", "SealedChamber_OuterRoom", "SealedChamber_InnerRoom",
    "MarineCave_Entrance", "MarineCave_End",
    "GraniteCave_1F",
]

BASE = "https://raw.githubusercontent.com/pret/pokeemerald/master/data/maps"
LAYOUT_URL = "https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/layouts.json"


def fetch(url):
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read().decode())


def main():
    layouts_raw = fetch(LAYOUT_URL)
    layout_dims = {}
    for entry in layouts_raw["layouts"]:
        layout_dims[entry["id"]] = {
            "name": entry["name"],
            "width": entry["width"],
            "height": entry["height"],
        }

    results = []
    for map_name in MAPS:
        try:
            m = fetch(f"{BASE}/{map_name}/map.json")
        except Exception as e:
            results.append({"map": map_name, "error": str(e)})
            continue

        layout_id = m.get("layout")
        dims = layout_dims.get(layout_id, {})
        w_tiles = dims.get("width")
        h_tiles = dims.get("height")
        layout_name = dims.get("name", "unknown")

        all_coords = []

        warps = []
        for w in m.get("warp_events", []):
            warps.append(
                {
                    "x": w["x"],
                    "y": w["y"],
                    "dest_map": w.get("dest_map", ""),
                    "dest_warp_id": w.get("dest_warp_id"),
                }
            )
            all_coords.append((w["x"], w["y"]))

        signs = []
        for b in m.get("bg_events", []):
            if b.get("type") == "sign":
                signs.append(
                    {
                        "x": b["x"],
                        "y": b["y"],
                        "bg_id": b.get("bg_id", ""),
                    }
                )
                all_coords.append((b["x"], b["y"]))

        trainers = []
        for o in m.get("object_events", []):
            tt = o.get("trainer_type", "TRAINER_TYPE_NONE")
            if tt and tt != "TRAINER_TYPE_NONE":
                trainers.append(
                    {
                        "x": o["x"],
                        "y": o["y"],
                        "graphics_id": o.get("graphics_id", ""),
                        "trainer_type": tt,
                        "trainer_sight_or_berry_tree_id": o.get(
                            "trainer_sight_or_berry_tree_id", ""
                        ),
                    }
                )
                all_coords.append((o["x"], o["y"]))

        for o in m.get("object_events", []):
            all_coords.append((o["x"], o["y"]))
        for c in m.get("coord_events", []):
            all_coords.append((c["x"], c["y"]))

        inferred_w = max(c[0] for c in all_coords) + 1 if all_coords else None
        inferred_h = max(c[1] for c in all_coords) + 1 if all_coords else None

        results.append(
            {
                "map": map_name,
                "layout_id": layout_id,
                "layout_name": layout_name,
                "tiles_w": w_tiles,
                "tiles_h": h_tiles,
                "img_w": w_tiles * 16 if w_tiles else None,
                "img_h": h_tiles * 16 if h_tiles else None,
                "inferred_tiles_w": inferred_w,
                "inferred_tiles_h": inferred_h,
                "warps": warps,
                "signs": signs,
                "trainers": trainers,
                "warp_count": len(warps),
                "sign_count": len(signs),
                "trainer_count": len(trainers),
            }
        )

    out_path = "map_calibration_data.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Wrote {len(results)} maps to {out_path}")
    for r in results:
        if "error" in r:
            print(f"ERROR {r['map']}: {r['error']}")
        else:
            tw, th = r["tiles_w"], r["tiles_h"]
            iw, ih = r["img_w"], r["img_h"]
            print(
                f"{r['map']}: {tw}x{th} tiles ({iw}x{ih}px) | "
                f"warps={r['warp_count']} signs={r['sign_count']} trainers={r['trainer_count']}"
            )


if __name__ == "__main__":
    main()
