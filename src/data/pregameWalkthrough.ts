import type { GuideSection } from "../types";
import { pregameBreedingChapter } from "./pregameBreedingChapter";

export { pregameBreedingChapter };

/**
 * Pregame reference chapters — Evolution & Breeding — shown before Littleroot.
 * Renumbered to Ch. 1 / Ch. 2 when assembled in walkthrough.ts.
 */
export const pregameEvolutionChapter: GuideSection = {
  id: "pregame-evolution",
  title: "Ch. 1 — Pregame: Evolution",
  description:
    "How Pokémon evolve in Emerald, how to stop it, and every special method you will meet.",
  steps: [
    {
      id: "pregame-evolution-1",
      title: "How evolution works & preventing it",
      location: "Hoenn region",
      summary:
        "Most Pokémon evolve by level, stone, trade, or friendship — and you can cancel or block evolution when you need to.",
      story: [
        "Evolution is how many Pokémon grow into stronger forms. In Emerald the usual triggers are reaching a certain level, using an Evolution stone from the Bag, completing a trade (sometimes while holding a specific item), or leveling up when friendship — sometimes called taming — is high enough. A few species use one-off rules of their own; those are covered in the Unique evolutions step.",
        "When a level-up or friendship evolution starts, the evolution screen appears. Hold B to cancel that attempt. The Pokémon keeps the levels it just gained and can try again the next time it levels up (as long as it still meets the condition). Stone evolutions happen the moment you use the stone — there is no B-cancel screen like a level-up. Trade evolutions happen when the trade finishes.",
        "The Everstone is the permanent brake. Give it to a Pokémon as its held item and that Pokémon will not evolve at all until you take the stone off. Everstones turn up as hidden items on several routes and matter for breeding too — see the Breeding chapter for nature inheritance.",
      ],
      details: [],
      tips: [
        "Cancel early evolutions if you want a move learned later in the pre-evolution’s level-up list — many species learn key moves only before they evolve.",
      ],
      tags: ["pregame", "evolution", "everstone", "intro"],
    },
    {
      id: "pregame-evolution-2",
      title: "Evolution stones",
      location: "Lilycove Department Store & story pickups",
      summary:
        "Fire, Water, Thunder, Leaf, Moon, and Sun Stones turn specific species in one use from the Bag.",
      story: [
        "Emerald’s Evolution stones are Fire, Water, Thunder, Leaf, Moon, and Sun. Use one from the Bag on a compatible Pokémon in your party — if it can evolve that way, it changes immediately.",
        "Lilycove’s Department Store eventually sells stones once you reach the city. Earlier in the story you can also find individual stones as pickups or rewards — Thunderstone in New Mauville, Fire Stone in Fiery Path, Leaf Stone on Route 119, and Moon/Sun options tied to Meteor Falls and Mossdeep trades or shops. Check each area’s walkthrough step when you arrive.",
      ],
      details: [],
      tips: [
        "Gloom can become either Vileplume (Leaf Stone) or Bellossom (Sun Stone) — choose before you use the stone.",
        "Eevee’s stone forms are Flareon, Vaporeon, and Jolteon — Espeon and Umbreon use friendship and time of day instead.",
      ],
      tags: ["pregame", "evolution", "stones", "eevee"],
    },
    {
      id: "pregame-evolution-3",
      title: "Trading evolutions",
      location: "Link cable / local trade",
      summary:
        "Some Pokémon evolve only when traded — a few must also hold a specific item during the trade.",
      story: [
        "Some Pokémon evolve only when traded over a link cable (or emulator link). Four lines evolve on a plain trade with no held item; others must hold a specific item during the trade. The evolution finishes on the receiving side when the trade completes — then you can trade them back to your original save.",
        "Held-item trade pieces include Metal Coat, Dragon Scale, King's Rock, and the Deep Sea Tooth / Deep Sea Scale pair from the Abandoned Ship Scanner quest. Take any Everstone off before trading, or the evolution will not happen. The chart below lists every Emerald trade evolution.",
      ],
      details: [],
      tips: [
        "An Everstone on a trade-evolution species will still block the evolution — take it off before you trade.",
        "Deep Sea Tooth and Deep Sea Scale come from Capt. Stern’s Scanner quest on the Abandoned Ship — pick Huntail or Gorebyss before you choose which item to keep on Clamperl.",
        "Porygon holding an Up-Grade evolves into Porygon2 when traded.",
      ],
      tags: ["pregame", "evolution", "trade", "clamperl"],
    },
    {
      id: "pregame-evolution-4",
      title: "Friendship (taming) evolutions",
      location: "Route 113 — Glass Workshop & elsewhere",
      summary:
        "High friendship — taming — plus a level-up evolves several species, including Eevee’s day and night forms.",
      story: [
        "Friendship (often called taming) needs to reach about 220 before a level-up can evolve eligible species. A held Soothe Bell (free from the Route 113 Glass Workshop owner the first time you talk to him) or a Luxury Ball catch speeds taming; walking, vitamins, and Center heals help too.",
        "Baby lines that evolve this way include Pichu → Pikachu (then use a Thunder Stone for Raichu), Cleffa, Igglybuff, Togepi, and Azurill, plus Golbat, Chansey, and Eevee’s day/night forms. The chart below has the full list; Pacifidlog’s Return/Frustration TMs are handy friendship checks.",
      ],
      details: [],
      tips: [
        "Fainting, energy powder-style herbal medicine, and some bitter items can lower friendship — prefer standard Potions and Poké Center heals while taming.",
        "Friendship evolutions still check on level-up — hold B to cancel if you are not ready yet.",
      ],
      tags: ["pregame", "evolution", "friendship", "taming", "soothe-bell"],
    },
    {
      id: "pregame-evolution-5",
      title: "Unique evolutions",
      location: "Hoenn region",
      summary:
        "Wurmple’s branch, Shedinja from Nincada, Feebas → Milotic via Beauty, and Emerald-only limits like Gardevoir.",
      story: [
        "A few Emerald lines use one-off rules instead of ordinary level, stone, trade, or friendship triggers. Wurmple’s Silcoon vs Cascoon split is fixed by personality value at level 7. Nincada becomes Ninjask at level 20, and Shedinja appears only if you have an empty party slot and a spare Poké Ball at that moment.",
        "Tyrogue branches at level 20 by Attack vs Defense: higher Attack → Hitmonlee, higher Defense → Hitmonchan, equal stats → Hitmontop. Feebas evolves into Milotic by leveling up with Beauty at least 170 (Dry-flavor Pokéblocks / contests) — not friendship. In Emerald, Kirlia only becomes Gardevoir; Gallade does not exist here. Use the chart and Pokédex panels for the full unique-method list.",
      ],
      details: [],
      tips: [
        "Fish Feebas on Route 119’s special trend water tiles — see that route’s walkthrough step for the tiling trick.",
        "Modest and other Beauty-friendly natures help Feebas gain Beauty from Pokéblocks faster — breed or catch with that in mind.",
        "Tyrogue’s Hitmonlee / Hitmonchan / Hitmontop split is locked in by its Attack and Defense at the level-20 evolution — EV train or check stats beforehand if you want a specific form.",
      ],
      secrets: [
        "Feebas Beauty is a contest condition, not friendship — Soothe Bell will not evolve it into Milotic.",
      ],
      tags: ["pregame", "evolution", "unique", "feebas", "milotic", "shedinja", "wurmple"],
    },
  ],
};

