import type { GuideSection } from "../types";

export const legendaries: GuideSection[] = [
  {
    id: "story-legends",
    title: "Story Legendaries",
    description: "Kyogre, Groudon, and Rayquaza — the weather trio.",
    steps: [
      {
        id: "rayquaza-catch",
        title: "Rayquaza",
        location: "Sky Pillar (top floor)",
        summary: "Lv 70 — catch after the Sootopolis story event.",
        details: [
          "Sky Pillar is east of Pacifidlog Town — need Mach Bike to pass cracked floors.",
          "Rayquaza is mandatory for story (cutscene) but you can catch it afterward.",
          "Save before the battle. Ultra/Timer Balls, Sleep/Paralysis recommended.",
          "Bring Pokémon around level 55–65 for manageable damage output.",
        ],
        tips: ["False Swipe + status makes catching much easier."],
        tags: ["rayquaza", "lv70"],
      },
      {
        id: "kyogre",
        title: "Kyogre",
        location: "Marine Cave (roaming location)",
        summary: "Lv 70 — appears after story; location changes daily.",
        details: [
          "After defeating/catching Rayquaza and beating Wallace, Kyogre waits in Marine Cave.",
          "Location rotates: check Route 105, 125, 127, 129, or 130 areas.",
          "Talk to residents in Sootopolis — they'll hint at current location.",
          "Only one chance per save file in the cave — save before battling.",
        ],
        tags: ["kyogre", "lv70", "roaming-cave"],
      },
      {
        id: "groudon",
        title: "Groudon",
        location: "Terra Cave (roaming location)",
        summary: "Lv 70 — counterpart to Kyogre, also in a shifting cave.",
        details: [
          "Terra Cave appears in a rotating spot (Route 114, 115, 116, 118 area).",
          "Same level and catch strategy as Kyogre.",
          "You can have both Kyogre and Groudon on one team after catching both.",
        ],
        tags: ["groudon", "lv70", "roaming-cave"],
      },
    ],
  },
  {
    id: "regi-trio",
    title: "Regirock, Regice & Registeel",
    description: "Unlock via Sealed Chamber, then catch all three golems.",
    steps: [
      {
        id: "regirock",
        title: "Regirock",
        location: "Desert Ruins (Route 111)",
        summary: "Lv 40 — don't use damage moves for 3 turns or it runs.",
        details: [
          "Solve Sealed Chamber puzzle first (see Secrets section).",
          "Enter Desert Ruins — stand on the center panel, go right twice, down twice, use Strength.",
          "Regirock opens. In battle: don't KO it for 3 turns or it flees (Emerald mechanic).",
        ],
        tags: ["regirock", "regi"],
      },
      {
        id: "regice",
        title: "Regice",
        location: "Island Cave (Route 105)",
        summary: "Lv 40 — walk clockwise along the walls without touching them.",
        details: [
          "Enter Island Cave on Route 105.",
          "Walk clockwise hugging the wall all the way around the inner room.",
          "Door opens. Same 3-turn catch caution as Regirock.",
        ],
        tags: ["regice", "regi"],
      },
      {
        id: "registeel",
        title: "Registeel",
        location: "Ancient Tomb (Route 120)",
        summary: "Lv 40 — stand on center panel, go down twice, left twice, right twice, up twice.",
        details: [
          "Ancient Tomb is in the water area of Route 120 — need Surf.",
          "Follow the exact Braille movement pattern to open the inner chamber.",
          "Registeel has high defenses — status + False Swipe helps.",
        ],
        tags: ["registeel", "regi"],
      },
    ],
  },
  {
    id: "post-game-legends",
    title: "Post-Game & Roamers",
    description: "Latios/Latias and event-only Pokémon.",
    steps: [
      {
        id: "latios-latias",
        title: "Latios or Latias",
        location: "Roams Hoenn after TV event",
        summary: "Lv 40 — watch TV in Littleroot after Elite Four.",
        details: [
          "After becoming Champion, watch TV in your house.",
          "News report about a flying Pokémon — you choose red (Latias) or blue (Latios).",
          "It roams — use Mean Look/Shadow Tag or save Master Ball.",
          "Check Pokédex location tab to track last seen area.",
        ],
        tips: ["Repel + lead under lv 40 + use Dex to re-trigger encounters on same route."],
        tags: ["latios", "latias", "roamer"],
      },
      {
        id: "deoxys-note",
        title: "Deoxys (event only)",
        location: "Birth Island — AuroraTicket required",
        summary: "Not available in a normal cartridge without a Nintendo event item.",
        details: [
          "Emerald supports Deoxys only with the AuroraTicket (official event distribution).",
          "Without the ticket, you cannot reach Birth Island legitimately.",
          "Listed for completionists — don't waste time searching in vanilla Emerald.",
        ],
        tags: ["deoxys", "event"],
      },
      {
        id: "jirachi-note",
        title: "Jirachi (bonus disc / event)",
        location: "Birth Island or bonus disc transfer",
        summary: "Requires Pokémon Colosseum Bonus Disc or event distribution.",
        details: [
          "Not catchable through normal gameplay.",
          "Bonus Disc was a GameCube exclusive for US players.",
        ],
        tags: ["jirachi", "event"],
      },
    ],
  },
];
