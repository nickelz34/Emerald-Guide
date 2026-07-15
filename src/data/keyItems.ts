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
    id: "wailmer-pail",
    name: "Wailmer Pail",
    obtainLocation: "Route 104 — Pretty Petal Flower Shop",
    walkthroughStepId: "route-104-2",
    note: "Water soft-soil berry plots after planting. Required for larger berry harvests across Hoenn.",
  },
  {
    id: "pokenav",
    name: "PokéNav",
    obtainLocation: "Rustboro — Devon Corp (Mr. Stone)",
    walkthroughStepId: "rusturf-tunnel-2",
    note: "Map and Condition at first; Match Call added when you leave Devon Corp.",
  },
  {
    id: "exp-share",
    name: "Exp. Share",
    obtainLocation: "Rustboro — Devon Corp 3F (Mr. Stone)",
    walkthroughStepId: "granite-cave-1",
    prerequisite: "Deliver Mr. Stone's Letter to Steven",
    note: "Return to Devon Corp after Granite Cave.",
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
    obtainLocation: "Mossdeep City — house east of the Gym",
    walkthroughStepId: "mossdeep-3",
    note: "Free gift from the fisherman; fish Relicanth and Wailmer for the Regi puzzle.",
  },
  {
    id: "itemfinder",
    name: "Itemfinder",
    obtainLocation: "Route 110 — from your rival after battle #3",
    walkthroughStepId: "route-110-3",
    prerequisite: "Defeat May/Brendan on Route 110",
    note: "Use outdoors to ping for buried items.",
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
