import type { GuideSection } from "../types";

export const tips: GuideSection[] = [
  {
    id: "hm-guide",
    title: "HM Guide — Who Teaches What",
    description: "Plan your HM slaves so your main team stays strong.",
    steps: [
      {
        id: "hm-list",
        title: "All 8 HMs and locations",
        location: "Various",
        summary: "Cut, Fly, Surf, Strength, Flash, Rock Smash, Waterfall, Dive.",
        details: [
          "HM01 Cut — Petalburg Cutter's House",
          "HM02 Fly — Weather Institute (Route 119, after Aqua event)",
          "HM03 Surf — Petalburg Gym (Norman, after badge 5)",
          "HM04 Strength — Rusturf Tunnel (after Devon goods quest)",
          "HM05 Flash — Trick House puzzle 4",
          "HM06 Rock Smash — Mauville City (NPC near gym)",
          "HM07 Waterfall — Sootopolis Cave of Origin path / Seafloor Cavern area",
          "HM08 Dive — Mossdeep City (Steven's house after gym 7)",
        ],
        tips: [
          "Typical HM slave: Zigzagoon/Linoone (Pickup + Cut, Rock Smash, Strength, Surf).",
          "Tropius can learn Fly, Flash, Cut, Strength, Rock Smash — great utility.",
        ],
        tags: ["hm", "utility"],
      },
    ],
  },
  {
    id: "type-counters",
    title: "Gym Type Counters",
    description: "Quick reference for every gym leader.",
    steps: [
      {
        id: "gym-counters",
        title: "Best types per gym",
        summary: "Super-effective types for each leader.",
        details: [
          "Roxanne (Rock): Water, Grass, Fighting",
          "Brawly (Fighting): Flying, Psychic",
          "Wattson (Electric): Ground (immune to Electric!)",
          "Flannery (Fire): Water, Ground, Rock",
          "Norman (Normal): Fighting",
          "Winona (Flying): Electric, Ice, Rock",
          "Tate & Liza (Psychic): Bug, Ghost, Dark — Ground hits both in doubles",
          "Wallace (Water): Electric, Grass",
        ],
        tags: ["gym", "types"],
      },
    ],
  },
  {
    id: "team-building",
    title: "Strong Blind Playthrough Teams",
    description: "Pokémon easily caught in Hoenn that cover most gyms.",
    steps: [
      {
        id: "mudkip-line",
        title: "Mudkip starter route",
        summary: "Marshtomp/Swampert carries early and mid game.",
        details: [
          "Mudkip → Marshtomp: strong vs Roxanne, Brawly (with Ice Punch TM later), Flannery.",
          "Add Shroomish (Petalburg Woods) or Ralts (Route 102) for Psychic coverage.",
          "Pick up Manectric (Route 110) or Magnemite for Electric.",
          "Fly user: Swellow (Route 104) or Tropius.",
        ],
        tags: ["team", "mudkip"],
      },
      {
        id: "torchic-line",
        title: "Torchic starter route",
        summary: "Combusken/Blaziken dominates mid-game; watch Water gyms.",
        details: [
          "Blaziken's Fighting/Fire typing handles Brawly, Flannery, and Norman.",
          "You'll struggle vs Wallace — add an Electric-type (Manectric).",
          "Wingull/Pelipper on Route 104 gives Water/Flying for Surf.",
        ],
        tags: ["team", "torchic"],
      },
      {
        id: "treecko-line",
        title: "Treecko starter route",
        summary: "Sceptile is fast but needs type partners for several gyms.",
        details: [
          "Strong vs Wattson and Wallace; weak vs Flannery and early Roxanne.",
          "Pair with Aron/Lairon (Granite Cave) or Geodude for Rock coverage.",
          "Combusken or Hitmonchan covers Ice-less Sceptile vs Winona.",
        ],
        tags: ["team", "treecko"],
      },
    ],
  },
  {
    id: "general-tips",
    title: "General Strategy",
    description: "Quality-of-life advice for a smooth playthrough.",
    steps: [
      {
        id: "save-spots",
        title: "Always save before legendaries & Elite Four",
        summary: "Soft reset culture starts here.",
        details: [
          "Save right before every legendary battle.",
          "Buy Max Repels for cave navigation.",
          "Keep Revives and Full Restores for Elite Four — don't hoard them.",
        ],
        tags: ["strategy"],
      },
      {
        id: "pickup",
        title: "Pickup ability farming",
        summary: "Zigzagoon/Linoone find Rare Candies and nuggets while you walk.",
        details: [
          "Pickup rates improve with level (best at Lv 91+ but useful earlier).",
          "Lead with Pickup Pokémon in tall grass for passive item gain.",
        ],
        tags: ["pickup", "items"],
      },
      {
        id: "dex-nav",
        title: "PokéNav Match Call",
        summary: "Rematch trainers for EXP and money post-game.",
        details: [
          "Register gym leaders and rivals on Match Call.",
          "After Hall of Fame, rematchable trainers give huge EXP.",
          "Great for leveling before Battle Frontier.",
        ],
        tags: ["exp", "post-game"],
      },
    ],
  },
];
