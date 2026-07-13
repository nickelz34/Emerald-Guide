import type { GuideSection } from "../types";

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
        "Held-item trade pieces include Metal Coat, Dragon Scale, King’s Rock, and the Deep Sea Tooth / Deep Sea Scale pair from the Abandoned Ship Scanner quest. Take any Everstone off before trading, or the evolution will not happen. The chart below lists every Emerald trade evolution.",
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
        "Friendship (often called taming) needs to reach about 220 before a level-up can evolve eligible species. A held Soothe Bell (free from the Route 113 Glass Workshop once you turn in enough ash) or a Luxury Ball catch speeds taming; walking, vitamins, and Center heals help too.",
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

export const pregameBreedingChapter: GuideSection = {
  id: "pregame-breeding",
  title: "Ch. 2 — Pregame: Breeding",
  description:
    "Day Care rules, egg groups, inheritance, and how to plan eggs before you reach Route 117.",
  steps: [
    {
      id: "pregame-breeding-1",
      title: "Day Care & eggs",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Leave two compatible Pokémon at the Day Care; walk until an Egg is ready, then hatch it in your party.",
      story: [
        "The Pokémon Day Care sits on Route 117 west of Mauville. You can leave up to two Pokémon with the old couple. They gain experience slowly while you adventure, and if the pair is compatible the Day Care Man will eventually have an Egg for you outside.",
        "Eggs hatch into the species of the female parent (or the non-Ditto parent when Ditto is involved), using that family’s baby form when one exists. Two special babies need an incense held by a parent: Sea Incense for Azurill from the Marill line, and Lax Incense for Wynaut from Wobbuffet. Without the incense you get Marill or Wobbuffet instead.",
        "You will reach the Day Care naturally in the story on Route 117. This pregame chapter is the rules reference; the route step is still where you first walk through the door.",
      ],
      details: [
        "Day Care: Route 117 — leave two Pokémon with the couple.",
        "When an Egg is ready, talk to the Day Care Man outside.",
        "Hatch Eggs by walking with them in your party.",
        "Offspring follows the female (or non-Ditto) parent’s family; incense babies need Sea or Lax Incense.",
      ],
      tips: [
        "The Day Care Man’s dialogue (and later PokéNav) hints how well the pair gets along — the friendlier they are, the faster Eggs appear.",
      ],
      tags: ["pregame", "breeding", "daycare", "eggs"],
    },
    {
      id: "pregame-breeding-2",
      title: "Compatibility & egg groups",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Parents must share an egg group and opposite genders, or one must be Ditto — use the lookup below to check any pair.",
      story: [
        "Every species belongs to one or two egg groups (for example Field, Water 1, or Undiscovered). Two Pokémon can breed if they share a group and are opposite genders, or if either is paired with Ditto. Two Ditto cannot breed. Genderless Pokémon only breed with Ditto. Legendary and most mythic lines sit in Undiscovered and will not produce Eggs.",
        "The Pokédex lists each species’ egg groups. Use the breeding lookup on this page to pick two Emerald species and see whether they can produce an Egg and what generally hatches.",
      ],
      details: [
        "Compatible: shared egg group + opposite genders, or either parent + Ditto.",
        "Incompatible: Undiscovered group, two Ditto, or no shared group.",
        "Genderless species breed only with Ditto.",
        "Check egg groups on Pokédex entries or with the lookup tool on this step.",
      ],
      tips: [
        "Ditto is the universal partner once you have one — the Desert Underpass Ditto is a post-game catch if you need a reliable breeder.",
      ],
      tags: ["pregame", "breeding", "egg-groups", "ditto", "breeding-lookup"],
    },
    {
      id: "pregame-breeding-3",
      title: "Inheritance — nature, IVs & egg moves",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Emerald passes natures with an Everstone, three IVs from the parents, and egg moves from the male.",
      story: [
        "Hold an Everstone on a parent in Emerald and that parent’s nature has a chance to pass to the Egg — this is the international Emerald breeding feature competitive players rely on. Match natures to contests too: Adamant leans Cool, Modest leans Beauty, and so on (see Contest Preparation).",
        "IV inheritance in Generation III copies three IVs from the two parents combined; the other three stats are random. There is no Destiny Knot in this generation, so breeding for perfect spreads takes patience.",
        "Egg moves come from the male: if the father knows a move that the child can inherit as an egg move, the hatchling can be born knowing it. Abilities in Gen III usually follow the female parent with a chance to match hers when the species has two possible abilities.",
      ],
      details: [
        "Everstone (Emerald): chance to pass the holder’s nature to the Egg.",
        "IVs: three inherited from the parents; the rest are random (no Destiny Knot).",
        "Egg moves: male parent can pass compatible egg moves to the child.",
        "Ability: Gen III — typically inherits from the female with a random chance.",
        "Contest natures: breed for the condition you want to raise with Pokéblocks.",
      ],
      tips: [
        "Keep a dedicated Everstone parent of each nature you care about — Field-group Ditto partners make that easy later.",
      ],
      tags: ["pregame", "breeding", "everstone", "ivs", "egg-moves", "natures"],
    },
    {
      id: "pregame-breeding-4",
      title: "Hatching tips & story eggs",
      location: "Hoenn region",
      summary:
        "Eggs hatch by step count only in Gen III — plan walks, story eggs, and when to return to Route 117.",
      story: [
        "In Ruby, Sapphire, and Emerald, Eggs hatch purely from steps you take with them in the party. Abilities like Flame Body and Magma Armor do not speed hatching until later generations — keep that in mind if you are used to modern games.",
        "Lavaridge Town gives a Wynaut Egg from an NPC as a story gift — a free look at hatching before you lean on the Day Care. After the Elite Four, Desert Underpass is the reliable place for wild Ditto if you want a breeding anchor.",
        "When the story reaches Route 117, leave your first breeding pair and start a cycle. Come back to this chapter whenever you need the rules; the Day Care building itself is unchanged.",
      ],
      details: [
        "Hatch by walking — Flame Body / Magma Armor do not help in Gen III.",
        "Lavaridge: receive a Wynaut Egg from a town NPC.",
        "Post-game: Desert Underpass for Ditto (optional breeding partner).",
        "Story visit remains on Route 117 — this chapter is the full ruleset.",
      ],
      tips: [
        "Fill the party with Eggs when grinding long routes or Battle Frontier runs so several hatch in one stretch of walking.",
      ],
      tags: ["pregame", "breeding", "hatching", "wynaut", "ditto"],
    },
  ],
};
