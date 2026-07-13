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
        "Compatibility requires either opposite genders in a shared egg group, or one parent being Ditto. Two Ditto cannot breed. Genderless species such as Voltorb, Magnemite, Staryu, and Beldum breed only with Ditto. Species in the Undiscovered egg group — most legendaries, most baby Pokémon, and a handful of single-stage species — never produce Eggs at all.",
        "When the pair is compatible, the game checks for an Egg after every 256 steps you take. The Day Care Man eventually stands outside with an Egg when one is ready — only one Egg waits at a time. Pick it up and it goes straight into your party (you need an empty slot; there is no Egg pocket in the Bag). The Egg hatches into the female parent's family when genders are involved; with Ditto, the offspring matches the non-Ditto parent. Baby forms hatch when the species has one (Pichu from Pikachu, for example), except for the two incense babies covered in Event 3.",
        "Hatchlings emerge at level 5 in Generation III. You will reach the Day Care naturally in the story on Route 117. This pregame chapter is the full rules reference; the route walkthrough step is still where you first walk through the door.",
      ],
      details: [],
      tips: [
        "The Day Care Man's dialogue — and later your PokéNav Plus — reports how well the pair gets along. Friendlier couples produce Eggs faster on each 256-step check.",
        "An Egg's nature is fixed when the Day Care Man offers it — not when it hatches. Use an Everstone on a parent before pickup to pass that nature down.",
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
        "Two special exceptions to remember: Nidorina and Nidoqueen cannot breed even though Nidoran♀ can — breed Nidoran♀ or Nidorino instead. The chart below lists representative species per group. Use the breeding lookup on this page to test any two Emerald species.",
      ],
      details: [],
      tips: [
        "Undiscovered is the wall: you cannot breed Pichu, Wynaut, Mewtwo, or most legendaries — breed their evolved or alternate forms instead.",
        "Field is the largest group in practice; a single Ditto can cover most breeding projects once you reach the Desert Underpass.",
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
        "Emerald passes natures through Everstone on the mother or Ditto, three IVs from the parents, and a random ability slot in Gen III.",
      story: [
        "Pokémon Emerald adds nature inheritance: hold an Everstone on the mother (in a male–female pair) or on Ditto, and that Pokémon's nature has a 50% chance to pass to the Egg. Competitive players keep a library of Everstone Dittos — one per useful nature — because Ditto pairs with almost everything.",
        "Individual Values (IVs) are the hidden 0–31 stats rolled on each Pokémon. When an Egg is generated, Generation III copies exactly three IVs from the two parents combined and randomises the other three. The second inherited IV cannot be HP, and the third cannot be HP or Defense — so those stats are slightly harder to breed for. There is no Destiny Knot in this generation.",
        "Abilities in Generations III and IV are not inherited from parents. When a species has two possible abilities, the hatchling simply has a 50/50 chance of either slot regardless of what the parents have. Hidden Abilities do not exist in Emerald.",
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
      title: "Egg moves, TMs & HMs",
      location: "Route 117 — Pokémon Day Care",
      summary:
        "The male parent passes egg moves plus any compatible TM or HM moves it knows; Light Ball can produce Volt Tackle Pichu.",
      story: [
        "Egg moves are moves a Pokémon can be born knowing even though it would not learn them by level-up alone. In Generation III the father passes egg moves: leave a male parent at the Day Care that knows the move, paired with a compatible female.",
        "Prior to Generation VI, the father also passes any TM or HM move it knows that the child can learn by machine in that game. Level-up moves the father knows count when they appear on the child's egg-move list — a male Swampert can pass Ancient Power to Mudkip, for example.",
        "Cross-species egg-move breeding works when both species share an egg group and the move is legal for the child. Field-group chains are the richest source of composite egg-move sets in Hoenn.",
        "Emerald adds one more special case: if either parent holds a Light Ball while breeding Pikachu or Raichu, the resulting Pichu can be born knowing Volt Tackle. Plan breeding before you evolve or delete the father.",
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
        "Eggs hatch from steps in your party at level 5. Flame Body and Magma Armor halve egg cycles in Emerald.",
      story: [
        "In Ruby, Sapphire, and Emerald, Eggs hatch purely from the number of steps you take while the Egg is in your party. Biking back and forth on Route 117, looping through Mauville, or walking the Battle Frontier all count. Each species has a fixed egg-cycle count; every 256 steps drops one cycle, or two cycles if a party member has Flame Body or Magma Armor (both abilities halve hatch time in Emerald).",
        "Slugma on Route 113 and in Fiery Path, and Numel on Route 112 and Route 113, are the practical Flame Body / Magma Armor carriers most players catch for breeding. Keep one in your party (not at the Day Care) while you walk Eggs. Fill empty party slots with multiple Eggs when grinding long routes so several hatch in one session.",
        "Lavaridge Town's old woman near the hot springs gives a Wynaut Egg as a story gift. After the Elite Four, Desert Underpass on Route 114 is the reliable wild Ditto location at a low encounter rate. Steven's house in Mossdeep gifts Beldum after you become Champion. Complete the Hoenn Pokédex and Professor Birch in Littleroot offers your choice of Chikorita, Cyndaquil, or Totodile for breeding those dex lines.",
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
