export interface ScottSighting {
  id: number;
  location: string;
  /** When to talk to Scott before he leaves. */
  timing: string;
  walkthroughStepId?: string;
  mandatory: boolean;
}

/**
 * All 13 Scott conversations in Emerald (Bulbapedia order).
 * First visit to Scott's house awards 1–4 BP total based on how many you found:
 * 5 → 1 BP, 6–8 → 2 BP, 9–12 → 3 BP, all 13 → 4 BP.
 */
export const SCOTT_SIGHTINGS: ScottSighting[] = [
  {
    id: 1,
    location: "Petalburg City",
    timing: "After Wally’s catch — when you leave west toward Route 104",
    walkthroughStepId: "petalburg-3",
    mandatory: true,
  },
  {
    id: 2,
    location: "Rustboro Pokémon Trainer's School",
    timing: "Before the Stone Badge",
    walkthroughStepId: "rustboro-1",
    mandatory: false,
  },
  {
    id: 3,
    location: "Rustboro Pokémon Trainer's School",
    timing: "After Stone Badge, before Devon Goods in Rusturf Tunnel",
    walkthroughStepId: "rustboro-3",
    mandatory: false,
  },
  {
    id: 4,
    location: "Slateport City — Oceanic Museum",
    timing: "After driving Team Aqua out of the museum",
    walkthroughStepId: "slateport-2",
    mandatory: true,
  },
  {
    id: 5,
    location: "Slateport City — Battle Tent",
    timing: "After the museum encounter, before leaving town",
    walkthroughStepId: "slateport-5",
    mandatory: false,
  },
  {
    id: 6,
    location: "Mauville City",
    timing: "After Wally's battle (post–Rock Smash)",
    walkthroughStepId: "mauville-1",
    mandatory: true,
  },
  {
    id: 7,
    location: "Verdanturf Town — Battle Tent",
    timing: "After Dynamo Badge, before Fiery Path",
    walkthroughStepId: "route-117-2",
    mandatory: false,
  },
  {
    id: 8,
    location: "Fallarbor Town — Battle Tent",
    timing: "Before Team Magma steals the Meteorite",
    walkthroughStepId: "fallarbor-1",
    mandatory: false,
  },
  {
    id: 9,
    location: "Route 119",
    timing: "After Rival Battle #4 north of the Weather Institute",
    walkthroughStepId: "route-119-3",
    mandatory: true,
  },
  {
    id: 10,
    location: "Fortree City",
    timing: "PokéNav phone call after the Feather Badge",
    walkthroughStepId: "fortree-2",
    mandatory: true,
  },
  {
    id: 11,
    location: "Lilycove City — Cove Lily Motel",
    timing: "Before Aqua steals the submarine from Slateport",
    walkthroughStepId: "lilycove-1",
    mandatory: false,
  },
  {
    id: 12,
    location: "Mossdeep City — Space Center",
    timing: "Before the Steven tag battle with Maxie",
    walkthroughStepId: "mossdeep-2",
    mandatory: false,
  },
  {
    id: 13,
    location: "Ever Grande City — Pokémon Center",
    timing: "Before the Elite Four",
    walkthroughStepId: "league-1",
    mandatory: false,
  },
];

export function scottBpBonus(count: number): number {
  if (count >= 13) return 4;
  if (count >= 9) return 3;
  if (count >= 6) return 2;
  if (count >= 5) return 1;
  return 0;
}
