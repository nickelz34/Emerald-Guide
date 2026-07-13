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
      details: [
        "Triggers in Emerald: level-up, Evolution stone, trade (with or without a held item), or high friendship on level-up.",
        "Hold B on the evolution screen to cancel a level-up or friendship evolution for that attempt.",
        "Hold an Everstone to block evolution entirely until you remove it.",
        "Stone and trade evolutions are not cancelled with B the same way — remove the Everstone or decline the stone/trade if you are not ready.",
      ],
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
      details: [
        "Stones in Emerald: Fire, Water, Thunder, Leaf, Moon, Sun.",
        "Use a stone from the Bag on a party Pokémon that can evolve with it.",
        "Stock up at Lilycove Department Store; grab story pickups (New Mauville, Fiery Path, Route 119, and later towns) as you go.",
        "Eevee’s stone forms are Flareon, Vaporeon, and Jolteon — Espeon and Umbreon use friendship and time of day instead.",
      ],
      tips: [
        "Gloom can become either Vileplume (Leaf Stone) or Bellossom (Sun Stone) — choose before you use the stone.",
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
        "Four classic lines evolve on a plain trade with no held item: Kadabra → Alakazam, Machoke → Machamp, Graveler → Golem, and Haunter → Gengar. You need another Game Boy Advance (or emulator link) and a trade partner; the evolution happens when the trade completes on the receiving side.",
        "Other species must hold an item during the trade. Onix or Scyther holding a Metal Coat become Steelix or Scizor. Seadra holding a Dragon Scale becomes Kingdra. Poliwhirl or Slowpoke holding a King’s Rock become Politoed or Slowking. Clamperl holding a Deep Sea Tooth becomes Huntail; holding a Deep Sea Scale becomes Gorebyss — you find those items with the Scanner quest on the Abandoned Ship.",
        "After the trade evolution, you can trade the Pokémon back if you want it on your original save. Remove any leftover held item afterward if you do not want it consuming a slot.",
      ],
      details: [
        "Pure trade: Kadabra, Machoke, Graveler, Haunter.",
        "Trade + Metal Coat: Onix → Steelix, Scyther → Scizor.",
        "Trade + Dragon Scale: Seadra → Kingdra.",
        "Trade + King’s Rock: Poliwhirl → Politoed, Slowpoke → Slowking.",
        "Trade + Deep Sea Tooth / Scale: Clamperl → Huntail / Gorebyss (Abandoned Ship Scanner rewards).",
      ],
      tips: [
        "An Everstone on a trade-evolution species will still block the evolution — take it off before you trade.",
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
        "Friendship (often called taming in older guides) is a hidden value that rises as you walk with a Pokémon, feed it vitamins, heal it without letting it faint, use certain haircuts or massages, and keep it happy in battle. Catching in a Luxury Ball or holding a Soothe Bell speeds the process. When friendship is high enough, the next level-up can trigger evolution for eligible species.",
        "Hoenn examples include Golbat → Crobat, Chansey → Blissey, and Azurill → Marill. Eevee becomes Espeon if it levels up with high friendship during the day, or Umbreon at night — the in-game clock you set in Littleroot controls day and night.",
        "The Glass Workshop on Route 113 gives a free Soothe Bell once you have turned in enough volcanic ash. Hold it on the Pokémon you are raising. Pacifidlog later offers TM27 Return or TM21 Frustration based on friendship — useful checks that your taming is paying off.",
      ],
      details: [
        "Raise friendship by walking, vitamins, gentle battling, Luxury Ball, and Soothe Bell.",
        "Friendship evolutions check on level-up — cancel with B if you are not ready.",
        "Free Soothe Bell: Glass Workshop on Route 113 (ash trades).",
        "Eevee: high friendship + day → Espeon; high friendship + night → Umbreon.",
        "Other Emerald examples: Golbat → Crobat, Chansey → Blissey, Azurill → Marill.",
      ],
      tips: [
        "Fainting, energy powder-style herbal medicine, and some bitter items can lower friendship — prefer standard Potions and Poké Center heals while taming.",
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
        "Wurmple’s evolution is decided by its personality value when it hits level 7: one path is Silcoon → Beautifly, the other is Cascoon → Dustox. You cannot choose at the evolution screen — catch or breed multiple Wurmple if you want both lines.",
        "Nincada evolves into Ninjask at level 20. If you have an empty party slot and a spare Poké Ball in your Bag at that moment, a Shedinja with Wonder Guard also appears. No spare ball or full party means you only get Ninjask.",
        "Feebas evolves into Milotic when it levels up with a Beauty condition of at least 170. Raise Beauty with Dry-flavor Pokéblocks (see Contest Preparation), watch sheen so you do not cap feeds early, then level it up. Catching Feebas itself means fishing the special trend tiles on Route 119 — covered on that route’s walkthrough step.",
        "In Emerald, Kirlia only evolves into Gardevoir (level 30). Gallade does not exist in this generation. Use the Pokédex evolution panel for method text on every other line.",
      ],
      details: [
        "Wurmple Lv 7 → Silcoon or Cascoon (personality); then Beautifly or Dustox at Lv 10.",
        "Nincada Lv 20 → Ninjask; also Shedinja if a party slot and Poké Ball are free.",
        "Feebas → Milotic: Beauty ≥ 170, then level-up (Pokéblocks / contests).",
        "Fish Feebas on Route 119’s trend water tiles — see that chapter.",
        "Kirlia → Gardevoir only in Emerald (no Gallade).",
      ],
      tips: [
        "Modest and other Beauty-friendly natures help Feebas gain Beauty from Pokéblocks faster — breed or catch with that in mind.",
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
