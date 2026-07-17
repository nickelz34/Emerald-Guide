import type { GuideSection } from "../types";

/**
 * Pregame reference chapter — catching, water travel, fishing, caves,
 * Poké Balls, and trading — shown after Battles & Training, before Evolution.
 */
export const pregameFieldChapter: GuideSection = {
  id: "pregame-field",
  title: "Ch. 1 — Pregame: Catching, Travel & Trading",
  description:
    "How wild encounters, water HMs, fishing, caves, Poké Balls, and trades work in Emerald — read once, then use the story chapters as you play.",
  steps: [
    {
      id: "pregame-field-1",
      title: "Catching in tall grass",
      location: "Hoenn routes — tall grass",
      summary:
        "You cannot catch until you have Poké Balls from Birch’s lab; then tall grass is where most early partners come from.",
      story: [
        "Wild Pokémon appear when you walk through tall grass (and later caves, water, and fishing spots). You cannot throw a Ball at a trainer’s Pokémon — only at wild battles. Catching also waits until after your first rival battle on Route 103: back at Birch’s lab you receive the Pokédex, and your rival hands you your first five Poké Balls. Poké Marts start stocking Balls once that lab visit is done.",
        "In grass, the usual recipe is simple: lower the target’s HP without knocking it out, add a status if you can, then throw. Sleep and freeze double catch odds; paralysis, poison, and burn give a smaller boost. Gen III Emerald has no Fast Ball or Dusk Ball — stock Poké, Great, and Ultra Balls early, and learn the special Balls later (covered in the Poké Balls event). On Route 102 you will watch Wally weaken and catch a Ralts with Norman’s Zigzagoon — that cutscene is the game’s own catching lesson once you reach Petalburg.",
      ],
      details: [],
      tips: [
        "Save before a long rare hunt (for example Route 102’s 4% Ralts) so a faint or blackout does not waste a long streak of encounters.",
        "False Swipe (TM later in the game) leaves 1 HP — ideal for legendaries and stubborn catches once you have it.",
        "Abilities like Arena Trap or moves that prevent escape help when a wild Pokémon might flee (Abra, legendary roamers later).",
      ],
      tags: ["pregame", "catching", "grass", "poke-ball"],
    },
    {
      id: "pregame-field-2",
      title: "Surfing & diving",
      location: "Petalburg Gym · Mossdeep · underwater routes",
      summary:
        "Surf opens the sea after the Balance Badge; Dive reaches the ocean floor after the Mind Badge.",
      story: [
        "HM03 Surf comes from Wally’s father in Petalburg right after you beat Norman for the Balance Badge (badge 5) — he meets you when you leave the Gym (or you can visit his house in town). You can teach Surf as soon as you hold the disc, but field use still needs that badge. Surf lets a party Pokémon carry you across water tiles, trigger Surf wild encounters, and reach islands, coastal routes, and places like Route 118’s east shore.",
        "HM08 Dive comes from Steven’s house in Mossdeep City and works in the field only with the Mind Badge (badge 7 from Tate & Liza). On deep-water tiles marked for Dive you sink to underwater routes (124–128 and beyond), swim to dark spots and seafloor landmarks, then resurface at matching Dive tiles. Waterfall (HM07) is a separate climb for cascading water and needs the Rain Badge — do not confuse it with Surf or Dive. The walkthrough marks each Surf and Dive gate when you arrive; this event is the rules overview.",
      ],
      details: [],
      tips: [
        "Keep a Water-type or other Surf user ready before Norman if you want to cross Route 118 immediately after Petalburg Gym.",
        "Underwater maps have no oxygen timer in Emerald — use the area maps for dark spots, currents, and resurface Dive tiles.",
        "Dive Balls work better while you are surfing, fishing, or underwater — stock them in Mossdeep’s mart before long ocean trips.",
      ],
      secrets: [
        "You can receive an HM before its badge, but the move stays usable only in battle until the matching badge unlocks field use.",
      ],
      tags: ["pregame", "surf", "dive", "hm", "water"],
    },
    {
      id: "pregame-field-3",
      title: "Fishing",
      location: "Dewford · Route 118 · Mossdeep",
      summary:
        "Three free rods unlock better fishing tables: Old Rod (Dewford), Good Rod (Route 118), Super Rod (Mossdeep). Rod tables are not the same as Surf.",
      story: [
        "Emerald fishing is short and mechanical: face water → use a rod from the Bag → press A when you see “Oh! A bite!” Better rods need more successful prompts in a row. Miss or walk away and you can try the same tile again.",
        `<strong class="story-heading">The three rods</strong>
All three are free gifts — none are sold in marts.
<ul>
<li><strong>Old Rod</strong> — Dewford south shore by the Gym. Fast prompts; Magikarp and Tentacool / Goldeen.</li>
<li><strong>Good Rod</strong> — Route 118 east shore (needs Surf / Balance Badge). Mid-level tables.</li>
<li><strong>Super Rod</strong> — Mossdeep house east of the Gym. The Super Rod is a free gift (never sold). Strongest map tables (see the chart below).</li>
</ul>`,
        `<strong class="story-heading">Feebas &amp; Relicanth</strong>
<ul>
<li><strong>Feebas (Route 119)</strong> — six active fishing-spot IDs from Dewford’s trendy phrase (enter your seed in the Feebas tiles panel); any rod; ~50% on a correct tile. Surf never finds it. Change the trendy phrase to reshuffle. Full river access and a story-timed hunt sit after Rival Battle #4 on Route 119 (optional walkthrough step).</li>
<li><strong>Relicanth</strong> — Dive encounter on Underwater Routes 124 / 126, not Super Rod. Needed with Wailord for the Regi puzzle.</li>
</ul>`,
      ],
      details: [],
      tips: [
        "Register a rod in Key Items so Select casts it without opening the Bag.",
        "Old Rod is the fastest tool when sweeping Route 119 tiles for Feebas.",
        "You can fish from bridges, beaches, and while surfing — any adjacent water tile the rod can reach.",
        "Suction Cups / Sticky Hold on the lead raises the chance of getting a bite.",
      ],
      secrets: [
        "The Super Rod in Mossdeep is free — nobody sells it; talk to the fisherman in the house east of the Gym.",
      ],
      tags: ["pregame", "fishing", "old-rod", "good-rod", "super-rod", "feebas"],
      blockOrder: [
        "panel:feebas-tiles",
        "summary",
        "story",
        "media",
        "panel:fishing-table",
        "tips",
        "secrets",
        "tags",
      ],
    },
    {
      id: "pregame-field-4",
      title: "Exploring caves",
      location: "Granite Cave and other Hoenn caves",
      summary:
        "Caves use their own wild tables, often need Flash or Rock Smash, and reward careful mapping with Escape Rope exits.",
      story: [
        "Hoenn’s caves — Granite Cave is the first big example — replace tall grass with dark floors, ladders, and rock formations. Wild battles still start from steps on cave floor tiles; the Pokédex lists those encounters under a cave method separate from route grass. Many caves are dim until HM05 Flash (from the Hiker on Granite Cave 1F) works in the field with Brawly’s Knuckle Badge. Rock Smash, Strength, and Waterfall unlock other rooms later once you have the matching badges.",
        "Carry Escape Ropes (or Dig) for a one-way exit to the cave mouth, and pack Repels when you only want a legendary, an item, or a story NPC. Granite Cave already shows the pattern: branching floors, Steven’s room, and items tucked off the main path. Later you will reuse the same habits in Meteor Falls, Shoal Cave, Seafloor Cavern, Victory Road, and optional hideouts — the story chapters cover each layout when you arrive.",
      ],
      details: [],
      tips: [
        "Buy Escape Ropes and Repels in Rustboro or Dewford before Granite Cave if your bag is light.",
        "Flash is optional but far more comfortable in Granite Cave’s lower floors — grab it from the entrance Hiker after the Knuckle Badge.",
        "Mark ladder connections on the guide’s area maps; caves often hide stairs behind rocks or one-way ledges.",
      ],
      secrets: [
        "Dig and Escape Rope both send you to the entrance warp of the cave dungeon you are in — they do not drop you on an arbitrary floor mid-complex.",
      ],
      tags: ["pregame", "caves", "flash", "escape-rope"],
    },
    {
      id: "pregame-field-5",
      title: "Every Poké Ball",
      location: "Marts, Safari Zone, Magma Hideout & more",
      summary:
        "Emerald’s full Ball list — catch-rate multipliers, where they shine, and where to get them.",
      story: [
        "Every Ball multiplies the catch formula (except the Master Ball, which always succeeds). Lower HP and sleep/freeze help every Ball; the table below lists each Emerald Ball’s multiplier and the situations where special Balls outperform Ultra Balls. Safari Balls exist only inside the Safari Zone with the special bait/rock rules — you never stock them in your bag for overworld use.",
        "Early game you live on Poké and Great Balls. Mid game Ultra Balls and Nest/Net Balls cover weak wilds and Bug/Water targets. Late game Timer Balls reward long battles, Repeat Balls reward dex completion, Dive Balls pair with ocean work, and Luxury Balls speed friendship evolutions. The Master Ball is a unique Magma Hideout pickup — save it for a roamer or a legendary you do not want to risk. Premier Balls are a mart bonus (buy ten Poké Balls at once) with the same catch rate as a plain Poké Ball.",
      ],
      details: [],
      tips: [
        "For legendaries, combine sleep or freeze with False Swipe, then Timer Balls after many turns — or spend the Master Ball if you prefer certainty.",
        "Luxury Balls do not catch better than Poké Balls; use them when you plan to raise friendship (Eevee, Golbat, Chansey lines, and so on).",
        "Gen III has no Fast Ball, Quick Ball, Dusk Ball, or Heal Ball — ignore guides written for later games.",
      ],
      secrets: [
        "Buying ten Poké Balls in one purchase at a Poké Mart adds one free Premier Ball to the sale.",
      ],
      tags: ["pregame", "poke-ball", "great-ball", "ultra-ball", "master-ball"],
    },
    {
      id: "pregame-field-6",
      title: "Trading Pokémon",
      location: "Pokémon Center Cable Club · link play",
      summary:
        "Trade at a Center’s Cable Club for evolutions and friends — FireRed/LeafGreen cannot link with Emerald until National Dex and Celio’s Network Machine are done.",
      story: [
        "Trades happen on the second floor of Pokémon Centers (Cable Club / Union Room) over a Game Boy Advance Game Link Cable or, between compatible titles, the Wireless Adapter. Both trainers need at least two Pokémon in the party. Pokémon that still know an HM move cannot be offered until that move is forgotten. Some species evolve only when traded — sometimes while holding an item; the Evolution pregame chapter lists every Emerald trade evolution, including Clamperl’s Deep Sea items and Porygon’s Up-Grade.",
        "You cannot trade from FireRed or LeafGreen with Emerald until that Kanto save is postgame-ready. On FireRed/LeafGreen: become Champion, earn the National Pokédex, then finish Celio’s Network Machine quest on the Sevii Islands by delivering the Ruby and the Sapphire. On Emerald: beat the Elite Four and let Birch upgrade you to the National Pokédex before full cross-game trading. Until those gates clear, FRLG will refuse Hoenn-region trades. In-game NPC trades inside Emerald (for example later cosmetically Kanto-flavored swaps) do not replace link trades for trade evolutions — you still need another cartridge, emulator link, or a second game that meets the same rules.",
      ],
      details: [],
      tips: [
        "Take Everstone off a trade-evolution species before the trade, or the evolution will not trigger on the receiving side.",
        "Eggs can be traded once both games allow egg trades under National Dex rules — handy for breeding projects across copies.",
        "After Emerald’s National Dex, traded Kanto and Johto species register properly and open postgame dex goals (including Birch’s Johto starter reward at 200 species).",
      ],
      secrets: [
        "FireRed and LeafGreen can trade ordinary Kanto natives with each other earlier, but linking those games to Ruby, Sapphire, or Emerald still requires the National Pokédex plus Celio’s completed Network Machine.",
      ],
      tags: ["pregame", "trading", "national-dex", "firered", "leafgreen", "cable-club"],
    },
  ],
};
