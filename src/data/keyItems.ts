export interface KeyItemUnlock {
  id: string;
  name: string;
  obtainLocation: string;
  walkthroughStepId: string;
  prerequisite?: string;
  note?: string;
}

export const KEY_ITEM_UNLOCKS: KeyItemUnlock[] = [
  {
    id: "pokenav",
    name: "PokéNav",
    obtainLocation: "Rustboro — Devon Corp (Mr. Stone)",
    walkthroughStepId: "rusturf-tunnel-2",
    note: "Includes Map, Condition, and Match Call.",
  },
  {
    id: "old-rod",
    name: "Old Rod",
    obtainLocation: "Dewford Town — fisherman by the Gym",
    walkthroughStepId: "dewford-1",
    note: "Basic fishing on water tiles.",
  },
  {
    id: "good-rod",
    name: "Good Rod",
    obtainLocation: "Route 118 — fisherman on the east shore",
    walkthroughStepId: "route-118-1",
    prerequisite: "Balance Badge (Surf)",
    note: "Better species and Feebas-compatible on Route 119.",
  },
  {
    id: "super-rod",
    name: "Super Rod",
    obtainLocation: "Mossdeep City — fisherman near the shore",
    walkthroughStepId: "mossdeep-3",
    prerequisite: "Mind Badge",
    note: "Relicanth and Wailmer for Regi puzzle.",
  },
  {
    id: "itemfinder",
    name: "Itemfinder",
    obtainLocation: "Slateport City — market house (Devon worker)",
    walkthroughStepId: "slateport-1",
    prerequisite: "Return Devon Goods to Mr. Stone",
    note: "Beeps on hidden items you have already picked up once.",
  },
  {
    id: "coin-case",
    name: "Coin Case",
    obtainLocation: "Mauville City — woman in the house next to Game Corner",
    walkthroughStepId: "mauville-1",
    note: "Required to play slots and buy Game Corner TMs.",
  },
  {
    id: "devon-scope",
    name: "Devon Scope",
    obtainLocation: "Route 120 — Steven after Kecleon",
    walkthroughStepId: "route-120-2",
    note: "Reveals invisible Kecleon on routes and in towns.",
  },
  {
    id: "go-goggles",
    name: "Go-Goggles",
    obtainLocation: "Lavaridge Town — rival after Flannery",
    walkthroughStepId: "lavaridge-2",
    note: "Cross Route 111 desert and Desert Ruins.",
  },
  {
    id: "contest-pass",
    name: "Contest Pass",
    obtainLocation: "Lilycove Contest Hall — left receptionist",
    walkthroughStepId: "contests-lilycove-1",
    note: "Also gives the Pokéblock Case.",
  },
];
