import { AREA_MAPS, type AreaMap } from "./areaMaps";

/**
 * Story / face-off crops that belong in the walkthrough, not the Hoenn map
 * selector. Keep AREA_MAPS complete for steps; only filter the dropdown.
 */
const SELECTOR_EXCLUDED_IDS = new Set<string>([
  // Intro / early story crops
  "insideoftruck",
  "oldaletown-first-stop",
  "route101-birch-starter-choose",
  "route102-wally-catch",
  "dewfordtown-fishing",
  "petalburgwoods-aqua-battle",
  // Character beat crops (not standalone maps)
  "meteorfalls-archie",
  "mtchimney-archie",
  "route118-steven",
  "granitecave-steven-letter",
  "route128-aftermath",
  "fallarbor-pokemoncenter-lanette",
  "route104-briney-ferry",
  // Scott sightings
  "rustborocity-pokemonschool-scott",
  "slateportcity-scott-museum",
  "slateportcity-scott-battletent",
  "mauvillecity-scott",
  "verdanturf-battletent-scott",
  "fallarbor-battletent-scott",
  "route119-scott",
  "fortreecity-scott-call",
  "lilycove-motel-scott",
  "mossdeepcity-scott",
  "evergrandecity-pokemoncenter-scott",
  "petalburgcity-scott",
  // Rival face-offs
  "route103-rival-battle",
  "rustborocity-rival-battle",
  "route110-rival-battle",
  "route119-rival-battle",
  "lilycovecity-rival-battle",
  // Gym leader face-offs
  "rustborocity-gym-roxanne-battle",
  "dewfordtown-gym-brawly-battle",
  "mauvillecity-gym-wattson-battle",
  "lavaridgetown-gym-flannery-battle",
  "petalburgcity-gym-norman-battle",
  "fortreecity-gym-winona-battle",
  "mossdeepcity-gym-tate-liza-battle",
  "sootopoliscity-gym-juan-battle",
  // Elite Four / Champion face-offs (rooms themselves stay)
  "evergrandecity-sidneysroom-battle",
  "evergrandecity-phoebesroom-battle",
  "evergrandecity-glaciasroom-battle",
  "evergrandecity-drakesroom-battle",
  "evergrandecity-championsroom-battle",
  // Petalburg Gym per-room crops — keep the full gym map only
  "petalburgcity-gym-norman-intro",
  "petalburgcity-gym-norman",
  "petalburgcity-gym-jody",
  "petalburgcity-gym-berke",
  "petalburgcity-gym-parker",
  "petalburgcity-gym-alexia",
  "petalburgcity-gym-george",
  "petalburgcity-gym-randall",
  "petalburgcity-gym-mary",
  "petalburgcity-gym-entrance",
]);

/** True for area maps that should appear in the Hoenn map dropdown. */
export function isMapSelectorArea(area: AreaMap): boolean {
  if (SELECTOR_EXCLUDED_IDS.has(area.id)) return false;
  // Any remaining *-battle face-off crops
  if (area.id.endsWith("-battle")) return false;
  if (area.id.includes("scott")) return false;
  return true;
}

/** Selector label: hide internal crop labels like "Full (source)". */
export function mapSelectorLabel(area: AreaMap): string {
  const floor = area.floor?.trim() ?? "";
  if (!floor || /^full\b/i.test(floor)) return area.name;
  return floor;
}

/** Area maps shown in the Hoenn map switcher, grouped for <optgroup>. */
export const MAP_SELECTOR_GROUPS: { group: string; maps: AreaMap[] }[] = (() => {
  const byGroup = new Map<string, AreaMap[]>();
  for (const a of AREA_MAPS) {
    if (!isMapSelectorArea(a)) continue;
    if (!byGroup.has(a.group)) byGroup.set(a.group, []);
    byGroup.get(a.group)!.push(a);
  }
  return [...byGroup.entries()]
    .map(([group, maps]) => ({ group, maps }))
    .sort((a, b) => a.group.localeCompare(b.group));
})();
