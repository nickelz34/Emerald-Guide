import type { MapPoint } from "./mapPoints";
import {
  MARTS,
  MART_BY_ENTRANCE_ID,
  type MartData,
} from "./martsGenerated";

export type { MartData, MartItem, MartSection, MartKind } from "./martsGenerated";
export { MARTS, MART_BY_ENTRANCE_ID } from "./martsGenerated";

const byId = new Map(MARTS.map((m) => [m.id, m]));

/** Shop-like entrance / specialty pin names on the overworld map. */
const SHOP_NAMES = new Set([
  "Mart",
  "Herb Shop",
  "Department Store",
  "Bike Shop",
]);

export function isMartMapPoint(point: MapPoint): boolean {
  if (MART_BY_ENTRANCE_ID[point.id]) return true;
  if (point.category === "shop") return true;
  if (point.category !== "entrance" && !point.id.startsWith("mart-")) return false;
  return SHOP_NAMES.has(point.name);
}

export function getMartForMapPoint(point: MapPoint): MartData | undefined {
  const id = MART_BY_ENTRANCE_ID[point.id];
  if (id) return byId.get(id);
  // Fallback: match by location note + shop name
  const note = (point.note || "").toLowerCase();
  return MARTS.find((m) => {
    if (m.location.toLowerCase() !== note) return false;
    if (point.name === "Mart") return m.kind === "mart" && (m.name === "Pok\u00e9 Mart" || m.name === "Poke Mart");
    if (point.name === "Herb Shop") return m.id === "lavaridge-herb-shop";
    if (point.name === "Department Store") return m.id === "lilycove-dept-store";
    if (point.name === "Bike Shop") return m.id === "mauville-bike-shop";
    return false;
  });
}

export function formatMartPrice(price: number): string {
  if (price <= 0) return "Free";
  return `${price.toLocaleString("en-US")}\u00a5`;
}
