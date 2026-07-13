import type { GuideSection } from "../types";

/** Ch. 2 — Pregame: Breeding (split from pregameWalkthrough for maintainability). */
export const pregameBreedingChapter: GuideSection = {
  id: "pregame-breeding",
  title: "Ch. 2 — Pregame: Breeding",
  description:
    "Day Care rules, egg groups, incense babies, inheritance, egg moves, and hatching — a full Emerald breeding reference before Route 117.",
  steps: [
    {
      id: "pregame-breeding-1",
      title: "Day Care & how Eggs work",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Leave two compatible Pokémon with the old couple on Route 117, walk until an Egg appears, then hatch it in your party.",
      story: [
        "The Pokémon Day Care sits on Route 117 west of Mauville City. Talk to the old man inside to leave up to two Pokémon with the couple. While you adventure elsewhere, those Pokémon gain experience slowly — about half the usual rate — and the game quietly tracks whether the pair is compatible.",
        "Compatibility requires either opposite genders in a shared egg group, or one parent being Ditto. Two Ditto cannot breed. Genderless species such as Voltorb, Magnemite, and Staryu breed only with Ditto. Species in the Undiscovered egg group — most legendaries, most baby Pokémon, and a handful of single-stage species — never produce Eggs at all.",
        "When the pair is compatible, the Day Care Man eventually stands outside with an Egg. Each Egg you receive takes one open slot in your Bag's Poké Ball pocket. The Egg hatches into the female parent's family when genders are involved; with Ditto, the offspring matches the non-Ditto parent. Baby forms hatch when the species has one (Pichu from Pikachu, for example), except for the two incense babies covered in Event 3.",
        "You will reach the Day Care naturally in the story on Route 117. This pregame chapter is the full rules reference; the route walkthrough step is still where you first walk through the door.",
      ],
      details: [],
      tips: [
        "The Day Care Man's dialogue — and later your PokéNav — reports how well the pair gets along. Friendlier couples produce Eggs faster.",
        "Take parents back before leaving incompatible pairs for long stretches; you pay a small fee per level gained when you collect them.",
      ],
      tags: ["pregame", "breeding", "daycare", "eggs"],
    },
    {
      id: "pregame-breeding-2",
      title: "Egg groups & compatibility",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Every breedable species belongs to one or two egg groups. Parents need a shared group and opposite genders, or one must be Ditto.",
      story: [
        "Egg groups are the hidden tags that decide whether two species can breed. Emerald uses fifteen practical groups: Monster, Water 1, Bug, Flying, Field, Fairy, Grass, Human-Like, Water 3, Mineral, Amorphous, Water 2, Dragon, Ditto, and Undiscovered. Most species sit in one or two groups — Mudkip is Monster + Water 1, while Skarmory is only Flying.",
        "For a normal pair (no Ditto), both parents must share at least one non-Ditto, non-Undiscovered group and be opposite genders. Same-species breeding always works when genders differ. Cross-species breeding works when the groups overlap: a female Marill (Water 1 + Fairy) can pair with a male Psyduck (Water 1 + Field) because both share Water 1.",
        "Ditto is the universal breeder. It can pair with any breedable Pokémon regardless of gender, including genderless species. That makes post-game Desert Underpass Ditto one of the most valuable dex-completion tools in Emerald.",
        "The chart below lists representative species per group. Use the breeding lookup on this page to test any two Emerald species and see whether they can produce an Egg and what generally hatches.",
      ],
      details: [],
      tips: [
        "Undiscovered is the wall: you cannot breed Pichu, Wynaut, Mewtwo, or most legendaries — breed their evolved or alternate forms instead.",
        "Field is the largest group in practice; a single high-level Ditto can cover most of your breeding projects once you reach the Desert Underpass.",
      ],
      tags: ["pregame", "breeding", "egg-groups", "ditto", "breeding-lookup"],
    },
    {
      id: "pregame-breeding-3",
      title: "Incense babies & offspring species",
      location: "Slateport Market & Route 117",
      summary:
        "Sea Incense and Lax Incense are the only items that change which baby hatches; all other lines follow the female parent's family.",
      story: [
        "Most breeding outcomes are straightforward: the Egg hatches into the female parent's species, using the lowest baby form in that line when one exists. Breed a female Pikachu and you get Pichu; breed a female Kirlia and you get Ralts.",
        "Emerald adds exactly two incense exceptions sold in Slateport City's market. Sea Incense, held on a parent in the Marill line, causes the Egg to hatch into Azurill instead of Marill. Lax Incense does the same for Wobbuffet, producing Wynaut instead of another Wobbuffet. Either parent may hold the incense. Without it, Marill and Azumarill mothers hatch Marill, and Wobbuffet mothers hatch Wobbuffet.",
        "Wynaut itself is in the Undiscovered group and cannot breed. To hatch Wynaut you must breed a female Wobbuffet (or pair Wobbuffet with Ditto) while holding Lax Incense. The Lavaridge story Egg is a separate gift Wynaut — handy for dex completion before you have incense.",
        "The visual chart below shows both incense lines side by side with ordinary outcomes for comparison.",
      ],
      details: [],
      tips: [
        "Buy Sea Incense and Lax Incense in Slateport as soon as you reach the market — they are inexpensive and permanently useful for dex completion.",
        "Incense is not consumed — you must keep holding it during breeding; the item returns to your Bag afterward.",
      ],
      tags: ["pregame", "breeding", "incense", "azurill", "wynaut"],
    },
    {
      id: "pregame-breeding-4",
      title: "Nature, IVs & abilities",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "Emerald passes natures through Everstone, three IVs from the parents, and usually the female's ability slot.",
      story: [
        "International Emerald (and all modern copies) can pass natures through the Everstone. Give an Everstone to either parent and that parent's nature has a 50% chance to pass to the Egg. Competitive players keep a library of Everstone Dittos — one per useful nature — because Ditto pairs with almost everything.",
        "Individual Values (IVs) are the hidden 0–31 stats rolled on each Pokémon. When an Egg is generated, Generation III copies exactly three IVs from the two parents combined and randomises the other three. There is no Destiny Knot in this generation, so perfect spreads require many Eggs and patience. Plan which parent supplies which stat — a high Speed IV Ditto is a common starting point.",
        "Abilities in Gen III usually follow the female parent when a species has two possible abilities. Emerald only has two abilities per species at most, and the mother's slot biases what the child receives. When Ditto breeds with a genderless parent, the genderless parent's ability rules apply.",
        "Natures also matter for contests: Adamant raises Cool growth, Modest raises Beauty, Calm raises Cute, and so on. Breed the nature you want before investing Pokéblocks — see Contest Preparation for the full table.",
      ],
      details: [],
      tips: [
        "Everstones are held items, not consumed — one stone can serve every breeding project.",
        "IV breeding in Gen III is slow; target one or two stats per generation rather than chasing a full perfect spread immediately.",
      ],
      tags: ["pregame", "breeding", "everstone", "ivs", "natures", "abilities"],
    },
    {
      id: "pregame-breeding-5",
      title: "Egg moves",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "The male parent can pass egg moves to the child when the move appears on the offspring's egg-move list.",
      story: [
        "Egg moves are moves a Pokémon can be born knowing even though it would not learn them by level-up alone. In Generation III the father passes egg moves: leave a male parent at the Day Care that knows the move, paired with a compatible female of the same egg group.",
        "The move must be on the child's egg-move list. TMs taught to the father only pass if the move is also a legitimate egg move for the child. Level-up moves the father knows count when they appear on the child's egg list — Swampert fathers can pass Ancient Power to Mudkip, for example.",
        "Cross-species egg-move breeding works when both species share an egg group and the move is legal for the child. Field-group chains are the richest source of composite egg-move sets in Hoenn.",
        "Plan egg-move breeding before you evolve or delete the father. Once a species cannot learn the move by any means, you may need to re-catch or re-breed a new father.",
      ],
      details: [],
      tips: [
        "Check each species' egg-move list on its Pokédex page before you invest TMs or rare tutors in a breeding father.",
        "Male-only lines pair with Ditto for egg-move projects when you lack a compatible female.",
      ],
      tags: ["pregame", "breeding", "egg-moves"],
    },
    {
      id: "pregame-breeding-6",
      title: "Hatching, Ditto & story resources",
      location: "Hoenn region",
      summary:
        "Eggs hatch from steps in your party; Flame Body does not help in Gen III. Lavaridge, Desert Underpass, and Steven's gift cover early and post-game breeding anchors.",
      story: [
        "In Ruby, Sapphire, and Emerald, Eggs hatch purely from the number of steps you take while the Egg is in your party. Biking back and forth on Route 117, looping through Mauville, or walking the Battle Frontier all count. Abilities like Flame Body and Magma Armor do not reduce step counts until later generations — do not rely on them here.",
        "Each species has a fixed Egg cycle length that determines how many steps are required. Fill empty party slots with multiple Eggs when grinding long routes so several hatch in one session. The Day Care and your Bag combined let you run five Eggs at once with one active Pokémon.",
        "Lavaridge Town's old man gives a Wynaut Egg as a story gift — a free introduction to hatching before Route 117 matters. After the Elite Four, Desert Underpass on Route 114 is the reliable wild Ditto location at a low encounter rate; False Swipe and status help. Steven's house in Mossdeep gifts one Johto starter (Chikorita, Cyndaquil, or Totodile) for breeding those dex lines.",
        "When the story reaches Route 117, leave your first serious breeding pair and start a cycle. Return to this chapter whenever you need the rules; the Day Care building itself never changes.",
      ],
      details: [],
      tips: [
        "Stack Eggs during long post-game grinds — Battle Frontier coins, EV training routes, and Safari Zone trips all hatch Eggs for free.",
        "A single Ditto plus Everstone natures and a handful of high-IV catches covers most competitive and dex-completion breeding in Emerald.",
      ],
      tags: ["pregame", "breeding", "hatching", "wynaut", "ditto"],
    },
  ],
};
