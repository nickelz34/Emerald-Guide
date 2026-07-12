import type { MapPoint } from "./mapPoints";
import {
  MARTS,
  MART_BY_ENTRANCE_ID,
  type MartData,
} from "./martsGenerated";

export type { MartData, MartItem, MartSection, MartKind } from "./martsGenerated";
export { MARTS, MART_BY_ENTRANCE_ID } from "./martsGenerated";

const byId = new Map(MARTS.map((m) => [m.id, m]));

const SHOP_NAMES = new Set([
  "Mart",
  "Herb Shop",
  "Department Store",
  "Bike Shop",
  "Pretty Petal Flower Shop",
  "Glass Workshop",
  "Decoration Shop",
  "Market",
]);

export function isMartMapPoint(point: MapPoint): boolean {
  if (MART_BY_ENTRANCE_ID[point.id]) return true;
  if (point.category === "shop") return true;
  if (point.category !== "entrance" && !point.id.startsWith("mart-") && !point.id.startsWith("shop-")) {
    return false;
  }
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
    if (point.name === "Pretty Petal Flower Shop") return m.id === "pretty-petal-flower-shop";
    if (point.name === "Glass Workshop") return m.id === "glass-workshop";
    if (point.name === "Decoration Shop") return m.id === "fortree-decoration-shop";
    if (point.name === "Market") return m.id === "slateport-market";
    return false;
  });
}

export function formatMartPrice(price: number, priceUnit?: "ash"): string {
  if (price <= 0) return "Free";
  const amount = price.toLocaleString("en-US");
  if (priceUnit === "ash") return `${amount} ash`;
  return `${amount}\u00a5`;
}
