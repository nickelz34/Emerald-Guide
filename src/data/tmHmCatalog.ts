/** Emerald TM01–TM50 + HM01–HM08 catalog with obtain locations and field notes. */

export interface TmHmCatalogRow {
  id: string;
  move: string;
  /** Primary and alternate obtain locations. */
  locations: string[];
  /** Battle type of the taught move (informational). */
  type?: string;
  /** Field-use badge (HMs only). */
  fieldBadge?: string;
  fieldBadgeNumber?: number;
  notes?: string;
}

export const EMERALD_TM_CATALOG: TmHmCatalogRow[] = [
  {
    id: "TM01",
    move: "Focus Punch",
    type: "Fighting",
    locations: ["Route 115 — item ball (Surf from Rustboro / west coast)"],
  },
  {
    id: "TM02",
    move: "Dragon Claw",
    type: "Dragon",
    locations: ["Meteor Falls B1F — item ball (Surf + Waterfall)"],
  },
  {
    id: "TM03",
    move: "Water Pulse",
    type: "Water",
    locations: ["Sootopolis Gym — Juan (Rain Badge reward)"],
  },
  {
    id: "TM04",
    move: "Calm Mind",
    type: "Psychic",
    locations: ["Mossdeep Gym — Tate & Liza (Mind Badge reward)"],
  },
  {
    id: "TM05",
    move: "Roar",
    type: "Normal",
    locations: ["Route 114 — gentleman near the bridge"],
  },
  {
    id: "TM06",
    move: "Toxic",
    type: "Poison",
    locations: ["Fiery Path — item ball behind Strength boulder"],
  },
  {
    id: "TM07",
    move: "Hail",
    type: "Ice",
    locations: ["Shoal Cave — low-tide ice room item ball"],
  },
  {
    id: "TM08",
    move: "Bulk Up",
    type: "Fighting",
    locations: ["Dewford Gym — Brawly (Knuckle Badge reward)"],
  },
  {
    id: "TM09",
    move: "Bullet Seed",
    type: "Grass",
    locations: ["Route 104 — girl near Pretty Petal flower shop area"],
  },
  {
    id: "TM10",
    move: "Hidden Power",
    type: "Normal",
    locations: [
      "Fortree City — treehouse puzzle (answer Right, Right, Left)",
      "Slateport Market — buy for ₽3,000",
    ],
  },
  {
    id: "TM11",
    move: "Sunny Day",
    type: "Fire",
    locations: [
      "Scorched Slab (Route 120 lake) — item ball (Surf)",
      "Trainer Hill — Normal mode under 12:00 (postgame)",
    ],
  },
  {
    id: "TM12",
    move: "Taunt",
    type: "Dark",
    locations: ["Trick House — puzzle #5 reward (needs Feather Badge)"],
  },
  {
    id: "TM13",
    move: "Ice Beam",
    type: "Ice",
    locations: [
      "Abandoned Ship — Storage Room (needs Storage Key / Dive)",
      "Mauville Game Corner — 4,000 coins",
    ],
  },
  {
    id: "TM14",
    move: "Blizzard",
    type: "Ice",
    locations: ["Lilycove Department Store 4F — buy for ₽5,500"],
  },
  {
    id: "TM15",
    move: "Hyper Beam",
    type: "Normal",
    locations: ["Lilycove Department Store 4F — buy for ₽7,500"],
  },
  {
    id: "TM16",
    move: "Light Screen",
    type: "Psychic",
    locations: ["Lilycove Department Store 4F — buy for ₽3,000"],
  },
  {
    id: "TM17",
    move: "Protect",
    type: "Normal",
    locations: ["Lilycove Department Store 4F — buy for ₽3,000"],
  },
  {
    id: "TM18",
    move: "Rain Dance",
    type: "Water",
    locations: ["Abandoned Ship — Hidden Floor rooms (Dive + scanner keys)"],
  },
  {
    id: "TM19",
    move: "Giga Drain",
    type: "Grass",
    locations: [
      "Route 123 — girl near the Berry Master's house",
      "Trainer Hill — Unique mode under 12:00 (postgame)",
    ],
  },
  {
    id: "TM20",
    move: "Safeguard",
    type: "Normal",
    locations: ["Lilycove Department Store 4F — buy for ₽3,000"],
  },
  {
    id: "TM21",
    move: "Frustration",
    type: "Normal",
    locations: [
      "Pacifidlog Town — daily house gift when your lead has low friendship",
    ],
  },
  {
    id: "TM22",
    move: "SolarBeam",
    type: "Grass",
    locations: ["Safari Zone — northwest area item ball"],
  },
  {
    id: "TM23",
    move: "Iron Tail",
    type: "Steel",
    locations: ["Meteor Falls 1F — item ball"],
  },
  {
    id: "TM24",
    move: "Thunderbolt",
    type: "Electric",
    locations: [
      "New Mauville — Wattson's gift after shutting down the generator",
      "Mauville Game Corner — 4,000 coins",
    ],
  },
  {
    id: "TM25",
    move: "Thunder",
    type: "Electric",
    locations: ["Lilycove Department Store 4F — buy for ₽5,500"],
  },
  {
    id: "TM26",
    move: "Earthquake",
    type: "Ground",
    locations: ["Seafloor Cavern — final chamber item ball (before legendary)"],
  },
  {
    id: "TM27",
    move: "Return",
    type: "Normal",
    locations: [
      "Pacifidlog Town — daily house gift when your lead has high friendship",
      "Fallarbor Town — woman who checks friendship",
    ],
  },
  {
    id: "TM28",
    move: "Dig",
    type: "Ground",
    locations: ["Fallarbor Town — Fossil Maniac's brother (tunnel house / Route 114 link)"],
  },
  {
    id: "TM29",
    move: "Psychic",
    type: "Psychic",
    locations: [
      "Mauville Game Corner — 3,500 coins",
      "Victory Road B1F — item ball",
    ],
  },
  {
    id: "TM30",
    move: "Shadow Ball",
    type: "Ghost",
    locations: ["Mt. Pyre 6F — item ball"],
  },
  {
    id: "TM31",
    move: "Brick Break",
    type: "Fighting",
    locations: [
      "Sootopolis City — Black Belt west of the Pokémon Center",
      "Trainer Hill — Expert mode under 12:00 (postgame)",
    ],
  },
  {
    id: "TM32",
    move: "Double Team",
    type: "Normal",
    locations: [
      "Mauville Game Corner — 1,500 coins",
      "Route 113 — hidden item",
    ],
  },
  {
    id: "TM33",
    move: "Reflect",
    type: "Psychic",
    locations: ["Lilycove Department Store 4F — buy for ₽3,000"],
  },
  {
    id: "TM34",
    move: "Shock Wave",
    type: "Electric",
    locations: ["Mauville Gym — Wattson (Dynamo Badge reward)"],
  },
  {
    id: "TM35",
    move: "Flamethrower",
    type: "Fire",
    locations: ["Mauville Game Corner — 4,000 coins"],
  },
  {
    id: "TM36",
    move: "Sludge Bomb",
    type: "Poison",
    locations: [
      "Dewford Town — man after Team Magma clears out of Mt. Chimney",
    ],
  },
  {
    id: "TM37",
    move: "Sandstorm",
    type: "Rock",
    locations: ["Route 111 desert — item ball"],
  },
  {
    id: "TM38",
    move: "Fire Blast",
    type: "Fire",
    locations: ["Lilycove Department Store 4F — buy for ₽5,500"],
  },
  {
    id: "TM39",
    move: "Rock Tomb",
    type: "Rock",
    locations: ["Rustboro Gym — Roxanne (Stone Badge reward)"],
  },
  {
    id: "TM40",
    move: "Aerial Ace",
    type: "Flying",
    locations: ["Fortree Gym — Winona (Feather Badge reward)"],
  },
  {
    id: "TM41",
    move: "Torment",
    type: "Dark",
    locations: ["Slateport City — sailor after the Oceanic Museum Aqua event"],
  },
  {
    id: "TM42",
    move: "Facade",
    type: "Normal",
    locations: ["Petalburg Gym — Norman (Balance Badge reward)"],
  },
  {
    id: "TM43",
    move: "Secret Power",
    type: "Normal",
    locations: [
      "Slateport City — man in house north of the market (free)",
      "Route 111 — man by the tree (north of the desert)",
      "Slateport Market — buy for ₽3,000",
    ],
  },
  {
    id: "TM44",
    move: "Rest",
    type: "Psychic",
    locations: ["Lilycove City — man in an east residential house"],
  },
  {
    id: "TM45",
    move: "Attract",
    type: "Normal",
    locations: ["Verdanturf Town — woman in a house"],
  },
  {
    id: "TM46",
    move: "Thief",
    type: "Dark",
    locations: ["Slateport Oceanic Museum — after defeating Team Aqua"],
  },
  {
    id: "TM47",
    move: "Steel Wing",
    type: "Steel",
    locations: ["Granite Cave — Steven's gift for delivering Mr. Stone's Letter"],
  },
  {
    id: "TM48",
    move: "Skill Swap",
    type: "Psychic",
    locations: ["Mt. Pyre exterior — item ball"],
  },
  {
    id: "TM49",
    move: "Snatch",
    type: "Dark",
    locations: ["S.S. Tidal — sailor (postgame voyage to the Battle Frontier)"],
    notes: "Not on the Abandoned Ship — that ball is TM13 Ice Beam.",
  },
  {
    id: "TM50",
    move: "Overheat",
    type: "Fire",
    locations: ["Lavaridge Gym — Flannery (Heat Badge reward)"],
  },
];

/** HM obtain + field badge gates (aligned with hmUnlock.ts). */
export const EMERALD_HM_CATALOG: TmHmCatalogRow[] = [
  {
    id: "HM01",
    move: "Cut",
    type: "Normal",
    locations: ["Rustboro City — cutter's house"],
    fieldBadge: "Stone Badge",
    fieldBadgeNumber: 1,
    notes: "Cuts small trees on the overworld; works in battle anytime once taught.",
  },
  {
    id: "HM02",
    move: "Fly",
    type: "Flying",
    locations: ["Route 119 — rival gift after Rival Battle #4"],
    fieldBadge: "Feather Badge",
    fieldBadgeNumber: 6,
    notes: "Warps to visited Pokémon Centers / towns on the Town Map.",
  },
  {
    id: "HM03",
    move: "Surf",
    type: "Water",
    locations: ["Petalburg City — Wally's father after the Balance Badge"],
    fieldBadge: "Balance Badge",
    fieldBadgeNumber: 5,
    notes: "Crosses water tiles and starts Surf wild encounters.",
  },
  {
    id: "HM04",
    move: "Strength",
    type: "Normal",
    locations: ["Rusturf Tunnel west / Verdanturf side — after reuniting Wanda's couple"],
    fieldBadge: "Heat Badge",
    fieldBadgeNumber: 4,
    notes: "Pushes Strength boulders; required for several caves and Fiery Path's TM06.",
  },
  {
    id: "HM05",
    move: "Flash",
    type: "Normal",
    locations: ["Granite Cave 1F — hiker near the entrance"],
    fieldBadge: "Knuckle Badge",
    fieldBadgeNumber: 2,
    notes: "Lights dark caves; usable in battle as a accuracy drop.",
  },
  {
    id: "HM06",
    move: "Rock Smash",
    type: "Fighting",
    locations: ["Mauville City — southeast house"],
    fieldBadge: "Dynamo Badge",
    fieldBadgeNumber: 3,
    notes: "Breaks cracked rocks; may trigger a wild encounter.",
  },
  {
    id: "HM07",
    move: "Waterfall",
    type: "Water",
    locations: ["Sootopolis City — Wallace outside the Gym"],
    fieldBadge: "Rain Badge",
    fieldBadgeNumber: 8,
    notes: "Climbs waterfall tiles; strong Water STAB in battle.",
  },
  {
    id: "HM08",
    move: "Dive",
    type: "Water",
    locations: ["Mossdeep City — Steven's house"],
    fieldBadge: "Mind Badge",
    fieldBadgeNumber: 7,
    notes: "Sinks on deep-water Dive tiles; resurfaces at matching spots.",
  },
];

export const EMERALD_TM_HM_CATALOG: TmHmCatalogRow[] = [
  ...EMERALD_TM_CATALOG,
  ...EMERALD_HM_CATALOG,
];
