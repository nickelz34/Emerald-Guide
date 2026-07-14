/**
 * Hand-placed overworld-sprite markers for story cutscene area maps.
 * Base map images are tiles-only; these sprites are the interactive pins.
 */
import type { MapPoint } from "./mapPoints";

/** MapPoint with an overworld / object-event sprite sheet. */
export interface SpriteMapPoint extends MapPoint {
  spriteSheet: string;
  spriteWidth: number;
  spriteHeight: number;
  spriteFrame: number;
  /** Horizontal flip (Emerald east-facing frames reuse west + hFlip). */
  spriteFlipX?: boolean;
}

export function hasOwSprite(p: MapPoint): p is SpriteMapPoint {
  return typeof (p as SpriteMapPoint).spriteSheet === "string";
}

/**
 * Cutscene entities keyed by AREA_MAPS id.
 * Positions use the same percent convention as sync-area-map-entities
 * (tile center X, feet one tile below object Y).
 */
export const AREA_MAP_CUTSCENE_ENTITIES: Record<string, SpriteMapPoint[]> = {
  route101: [
    {
      id: "r101-birchs-bag",
      name: "Birch's Bag",
      category: "item",
      x: 37.5,
      y: 75,
      desc: "Open the bag to choose Treecko, Torchic, or Mudkip and rescue Professor Birch.",
      spriteSheet: "sprites/items/birchs_bag.png",
      spriteWidth: 16,
      spriteHeight: 16,
      spriteFrame: 0,
    },
    {
      id: "r101-prof-birch",
      name: "Professor Birch",
      category: "npc",
      x: 47.5,
      y: 70,
      desc: "Cornered on Route 101 — grab a starter from his bag to help.",
      spriteSheet: "sprites/trainers/prof_birch.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 2, // west sheet frame; flip for east toward Poochyena
      spriteFlipX: true,
      note: "Route 101",
    },
    {
      id: "r101-poochyena",
      name: "Poochyena",
      category: "wild",
      x: 52.5,
      y: 70,
      desc: "Wild Poochyena chasing Professor Birch. Defeat it after choosing your starter.",
      spriteSheet: "sprites/overworld/poochyena.png",
      spriteWidth: 32,
      spriteHeight: 32,
      spriteFrame: 2, // face west toward Birch
      note: "Route 101",
    },
  ],
  insideoftruck: [
    {
      id: "truck-brendan",
      name: "Brendan",
      category: "npc",
      x: 50,
      y: 60,
      desc: "You — waking up in the moving truck as it arrives in Littleroot Town.",
      spriteSheet: "sprites/trainers/brendan_walking.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 2, // west sheet frame; flip for east toward the open door
      spriteFlipX: true,
      note: "Inside of Truck",
    },
  ],
  route103: [
    {
      id: "r103-rival-may",
      name: "May",
      category: "npc",
      x: 13.125,
      y: 18.18,
      desc: "Your rival studying Pokémon by the water — talk to her to start Rival Battle #1.",
      spriteSheet: "sprites/trainers/may_walking.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0, // south
      note: "Route 103",
    },
  ],
  littleroottown: [
    {
      id: "littleroot-mom",
      name: "Mom",
      category: "npc",
      x: 27.5,
      y: 45,
      desc: "Waiting outside your house with the Running Shoes — hold B to dash.",
      spriteSheet: "sprites/trainers/mom.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: "Littleroot Town",
    },
  ],
  "petalburgcity-gym-entrance": [
    {
      id: "gym-meet-norman",
      name: "Norman",
      category: "npc",
      x: 50,
      y: 71.43,
      desc: "Your father — he won't challenge you until you've earned four badges.",
      spriteSheet: "sprites/trainers/norman.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: "Petalburg Gym",
    },
    {
      id: "gym-meet-wally",
      name: "Wally",
      category: "npc",
      x: 61.11,
      y: 78.57,
      desc: "A frail boy who wants to catch his first Pokémon — Norman asks you to help.",
      spriteSheet: "sprites/trainers/wally.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: "Petalburg Gym",
    },
  ],
  "route102-wally": [
    {
      id: "r102-wally",
      name: "Wally",
      category: "npc",
      x: 13,
      y: 55,
      desc: "Nervous but determined — lend him Norman's Zigzagoon and watch him catch a Ralts.",
      spriteSheet: "sprites/trainers/wally.png",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 2,
      spriteFlipX: true, // face east toward Zigzagoon
      note: "Route 102",
    },
    {
      id: "r102-wally-zigzagoon",
      name: "Zigzagoon",
      category: "wild",
      x: 17,
      y: 55,
      desc: "Norman's Zigzagoon on loan — Wally uses it to weaken a wild Ralts.",
      spriteSheet: "sprites/overworld/zigzagoon.png",
      spriteWidth: 16,
      spriteHeight: 16,
      spriteFrame: 2, // west toward Wally
      note: "Route 102",
    },
  ],
};
