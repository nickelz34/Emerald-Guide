import type { AreaMap } from "./areaMaps";

/**
 * Clean walkthrough / lightbox caption for an area map.
 * Avoids control characters, fancy dashes, and redundant "Gym - Gym" labels.
 */
export function formatAreaMapCaption(area: Pick<AreaMap, "name" | "floor">): string {
  const name = (area.name || "").replace(/\s+/g, " ").trim();
  let floor = (area.floor || "").replace(/\s+/g, " ").trim();
  if (!name) return floor;
  if (!floor) return name;

  // "Dewford Town Gym" + "Gym" → "Dewford Town Gym"
  if (/^gym$/i.test(floor) && /\bgym\b/i.test(name)) return name;

  // "Lavaridge Town Gym" + "Gym 1F" → use "1F"
  if (/\bgym\b/i.test(name) && /^gym\s+/i.test(floor)) {
    floor = floor.replace(/^gym\s+/i, "").trim();
  }
  if (!floor) return name;

  // Name already ends with the floor token (e.g. "... Gym 1F")
  const floorEsc = floor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`(?:^|\\s)${floorEsc}$`, "i").test(name)) return name;

  return `${name} - ${floor}`;
}
