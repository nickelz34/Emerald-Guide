import type { GuideSection } from "../types";

/**
 * Fourth pregame reference chapter — battles, types, status, natures, vitamins,
 * and the full TM/HM catalog — shown after Breeding, before Littleroot.
 */
export const pregameBattlesChapter: GuideSection = {
  id: "pregame-battles",
  title: "Ch. 1 — Pregame: Battles & Training",
  description:
    "How Emerald battles work — commands, move targets, types, multipliers, status, natures, vitamins, and every TM and HM.",
  steps: [
    {
      id: "pregame-battles-1",
      title: "Battle types & commands",
      location: "Hoenn — trainer & wild battles",
      summary:
        "Wild and trainer fights share the same menu; singles are the default, doubles appear for pairs, and Escape never works against a trainer.",
      story: [
        "Every fight in Emerald is either a wild battle or a trainer battle. Wild battles start when you walk through tall grass, cave floors, surfing water, or land a bite with a fishing rod. Trainer battles start when you step into a walking NPC’s line of sight (or talk to them). You cannot throw a Poké Ball at a trainer’s Pokémon, and you cannot use Escape / Run to leave a trainer fight — only Switch, Bag, or Fight until one side is out of usable Pokémon.",
        "Most fights are single battles: one of your Pokémon faces one foe. Double battles put two of yours against two foes — common for twin trainers, Tate & Liza, and some later pairs. In a double battle each of your battlers picks a move (or switch) each turn; moves that hit “both foes” or “everyone” matter far more here than in singles.",
        "The battle menu always offers Fight, Bag, Pokémon, and Run. Fight opens the four-move list. Bag lets you use medicines, Balls (wild only), and battle items. Pokémon opens the party to switch, check status, or use an item on a benched mon. Run attempts escape from wild Pokémon only — success chance depends on Speed. If your whole party faints you black out, lose some money, and return to the last Pokémon Center (or your home early on).",
      ],
      details: [],
      tips: [
        "Save before tough gym leaders and legendaries — a wipe still costs money and sends you back to the last Center.",
        "In doubles, watch both foes’ types before locking in a move that hits only one target.",
        "You can switch before the foe’s move resolves if you open the Pokémon menu — the incoming Pokémon takes the hit.",
      ],
      tags: ["pregame", "battles", "commands", "wild", "trainer", "doubles"],
    },
    {
      id: "pregame-battles-2",
      title: "Using moves",
      location: "Hoenn — battle targeting",
      summary:
        "Moves aim at one foe, both foes, a random foe, all other Pokémon, the user, an ally, or the whole field — targeting changes between singles and doubles.",
      story: [
        "Every move has a targeting rule. In a single battle most attacks simply hit the one opponent — Surf, Thunderbolt, and Earthquake all behave the same against a lone foe. Status moves like Growl, Thunder Wave, or Toxic also lock onto that one target unless they are self- or field-targeted.",
        "In a double battle those same moves diverge. Single-target attacks ask you to pick which foe (or sometimes which ally) to hit — useful when one Pokémon resists your STAB and the other does not. Moves aimed at both foes — Surf, Rock Slide, Hyper Voice — strike each enemy once without hitting your partner. Moves that hit every other battler — Earthquake, Explosion, Magnitude, Selfdestruct — damage both foes and your ally; Protect on your partner, or a Ground / Flying / Levitate immunity, keeps the friendly fire down.",
        "A few moves pick a random opponent each turn they lock on — Outrage, Thrash, and Petal Dance can force you onto an awkward target in doubles if the first foe faints. Weather and screen moves — Rain Dance, Sunny Day, Sandstorm, Hail, Light Screen, Reflect, Safeguard — affect the whole field or your side rather than a single HP bar. Self-targeting moves (Swords Dance, Calm Mind, Recover, Rest) never ask for a foe. Ally-helpers such as Helping Hand need you to pick your partner.",
        "Rule of thumb: “the foe” is single-target; “both foes” hits the enemy pair only; Earthquake-style moves can hit your side too. Read the move when you teach a TM — Mossdeep’s double gym and the Battle Frontier punish careless Earthquake clicks.",
      ],
      details: [],
      tips: [
        "Surf is safe spread damage in doubles — it never hits your partner.",
        "Earthquake hits everyone except airborne / Levitate / Flying Pokémon, including your ally — plan Protect or dual Ground resists.",
        "Weather and screens last five turns in Emerald — reapply before a long gym fight fades them.",
      ],
      secrets: [
        "You can still teach an HM before its field badge; the move works in battle immediately and unlocks on the overworld when you earn the badge.",
      ],
      tags: ["pregame", "battles", "moves", "targeting", "doubles"],
    },
    {
      id: "pregame-battles-3",
      title: "Types & damage multipliers",
      location: "Hoenn — type chart",
      summary:
        "Seventeen types control matchups: super-effective hits deal 2× (or 4× on dual types), resists deal ½× or ¼×, and immunities deal 0×.",
      story: [
        "Emerald uses Generation III’s seventeen types — Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, and Steel. Every damaging move has one type. Every Pokémon has one or two types that decide how that move multiplies.",
        "A super-effective hit multiplies damage by 2. A resistance multiplies by ½. An immunity multiplies by 0 and the battle message reports that it does not affect the target. Dual-typed Pokémon stack those factors: Water/Ground takes 4× from Grass (2× from each type), while Fire/Flying takes only ¼× from Grass. The chart table on this page lists every attacker × defender pair used by this guide’s trainers and starters.",
        "Same-Type Attack Bonus (STAB) is separate from the chart: if a Pokémon uses a damage move matching one of its types, that move deals 1.5× before type multipliers. A Swampert Earthquake therefore hits hard twice over — STAB Ground plus the chart. Weather can nudge Fire and Water further (sun / rain), and abilities like Thick Fat or Levitate rewrite specific matchups, but the printed chart is still the foundation for every gym and the Elite Four.",
      ],
      details: [],
      tips: [
        "Pack at least one answer for each gym’s specialty type before you challenge the leader.",
        "Immunities (Ground vs Electric, Flying vs Ground, Dark vs Psychic, Ghost vs Normal/Fighting, Steel vs Poison) win fights that resists only prolong.",
        "Ice is rare among Hoenn wilds early — keep an Ice TM or move for Dragon-types like Altaria.",
      ],
      tags: ["pregame", "battles", "types", "multipliers", "stab"],
    },
    {
      id: "pregame-battles-4",
      title: "Battle strategies",
      location: "Hoenn — practical tips",
      summary:
        "Win Emerald’s story fights with type coverage, smart switches, setup turns, early status, and weather — not Perfect IVs.",
      story: [
        "You do not need a competitive team to clear Hoenn. You do need coverage: one or two moves that hit the types your STAB cannot. A Fire starter that also learns a Ground or Fighting move sails through Wattson and Juan far more comfortably than Flamethrower alone. Check each gym specialty in the walkthrough and bring the counter type on your lead or in the first switch slot.",
        "Switching is free information. If Roxanne’s Geodude appears and you locked in Absorb, you still swap to a Water- or Grass-type before the Rock Tomb lands. Setup moves — Bulk Up, Calm Mind, Dragon Dance, Swords Dance — turn a safe switch-in into a sweep if the foe must struggle through a resist. Status speeds the same plan: Thunder Wave or Toxic on a wall, then stall; sleep from Spore or Hypnosis creates a free turn to set rain or sun.",
        "Weather is a Hoenn specialty. Rain boosts Water and weakens Fire; sun does the opposite and powers SolarBeam’s charge; sand and hail chip each turn. Gym leaders and teams often play into one weather — Flannery’s sun, Juan’s rain — so packing the opposing weather move or a type that ignores the chip keeps you ahead. Keep Potions and status heals stocked; a Full Heal before the Elite Four is worth more than a third Rare Candy.",
      ],
      details: [],
      tips: [
        "Lead with a Pokémon that resists the gym’s STAB so your first switch is on your terms.",
        "False Swipe plus a sleep move is the catching core for legendaries later — teach it when you find the TM path.",
        "Do not overlevel one starter past the rest of the party; shared Exp and the Exp. Share keep coverage online.",
      ],
      tags: ["pregame", "battles", "strategy", "coverage", "weather"],
    },
    {
      id: "pregame-battles-5",
      title: "Battle messages",
      location: "Hoenn — in-battle text",
      summary:
        "Emerald tells you the chart result, crits, misses, and status applications in plain text at the bottom of the battle screen.",
      story: [
        "Watch the message window after every move. “It’s super effective!” means a 2× or 4× chart hit. “It’s not very effective…” means ½× or ¼×. “It doesn’t affect [Pokémon]…” means a 0× immunity — spare the PP and switch. Critical hits announce “A critical hit!” and ignore defensive stat drops while applying a Gen III crit multiplier; they can turn a resisted hit into a KO you did not expect.",
        "Misses and fails are different. “The attack missed!” means accuracy / evasion check failed. “But it failed!” covers blocked cases — Protect, a sleep move landing on an already sleeping foe, Light Screen when screens already stand, and similar. Stat changes narrate “Attack rose!” / “sharply rose!” / “fell!” so you can track Swords Dance stacks without opening the summary.",
        "Status lines tell you what stuck: “was burned,” “was poisoned,” “was badly poisoned,” “is paralyzed,” “fell asleep,” “was frozen solid,” “became confused,” or “fell in love.” Flinch simply skips the turn with a short “flinched” line. Learning to read these flashes keeps you from wasting a second Thunderbolt into a Ground-type or a Fire Blast into a Dry Skin myth — Emerald has no Dry Skin, but the same habit saves PP against immunities all League long.",
      ],
      details: [],
      tips: [
        "If you see “doesn’t affect,” do not repeat the same move — switch or pick coverage.",
        "Confused Pokémon can hurt themselves; wait it out or use a Persim Berry / Yellow Flute.",
        "Screen messages (“Light Screen raised Special Defense”) last five turns — pressure before they fade.",
      ],
      tags: ["pregame", "battles", "messages", "critical", "miss"],
    },
    {
      id: "pregame-battles-6",
      title: "Status anomalies & cures",
      location: "Hoenn — status conditions",
      summary:
        "Burn, freeze, paralysis, poison, sleep, confusion, infatuation, and flinch each change how a Pokémon acts — and each has a clear cure item or berry.",
      story: [
        "Non-volatile statuses — burn, freeze, paralysis, poison (and Toxic’s bad poison), and sleep — stick until cured and block other non-volatile statuses from applying. Burn halves Attack and chips HP. Freeze skips turns until thaw. Paralysis cuts Speed and can full-para a turn. Poison chips every turn; Toxic ramps. Sleep locks moves for a few turns. Volatile conditions — confusion, infatuation, flinch — clear on switch or short timers and can coexist with a burn or paralysis.",
        "Bag cures are cheap insurance. Antidote, Burn Heal, Ice Heal, Awakening, and Parlyz Heal each clear one status; Full Heal and Full Restore clear all status (Full Restore also refills HP). Status berries — Cheri, Chesto, Pecha, Rawst, Aspear, Persim — held or used from the Bag auto-fix when the matching problem hits. Party-wide Heal Bell or Aromatherapy and a Pokémon Center visit clear everything between fights. Blue, Yellow, and Red Flutes handle sleep, confusion, and infatuation in battle without spending a medicine slot.",
        "Moves matter too. Rest sleeps the user for two turns and heals to full — a controlled status. Refresh clears poison, paralysis, and burn on the user. Safeguard blocks status from landing for five turns. The table on this page lists every common anomaly with its effect and cures so you can stock Slateport and Lilycove shops before the desert and long ocean routes.",
      ],
      details: [],
      tips: [
        "Sleep and freeze make wild catches much easier — see Catching in tall grass in the Field chapter.",
        "Steel- and Poison-types ignore poison; Electric-types ignore paralysis in Gen III.",
        "Keep Persim Berries for confusion on your own sweepers heading into doubles.",
      ],
      tags: ["pregame", "battles", "status", "berries", "medicine"],
    },
    {
      id: "pregame-battles-7",
      title: "Pokémon Natures",
      location: "Hoenn — natures & contests",
      summary:
        "All 25 natures raise one battle stat 10%, lower another 10%, or do nothing — and they also steer Pokéblock / contest flavors.",
      story: [
        "Every Pokémon is born with one of twenty-five natures. Twenty natures raise one battle stat by 10% and lower another by 10%; five natures (Hardy, Docile, Serious, Bashful, Quirky) are neutral and leave stats alone. Nature never changes Attack / Defense / Sp. Atk / Sp. Def / Speed through vitamins or Rare Candies — it is a permanent multiplier applied after EVs and IVs. HP is never raised or lowered by nature.",
        "Pick natures that match how the species attacks. Adamant (+Atk, −Sp. Atk) and Jolly (+Speed, −Sp. Atk) shine on physical attackers; Modest (+Sp. Atk, −Atk) and Timid (+Speed, −Atk) shine on special attackers; Impish or Careful help bulky supports. You can soft-reset wild or gift Pokémon for a nature, or breed with an Everstone — Emerald passes the Everstone holder’s nature 50% of the time when held by the mother or by Ditto. Full breeding rules live in the Breeding chapter.",
        "Natures also steer contests. The raised-stat natures prefer a Pokéblock flavor (Spicy, Sour, Sweet, Dry, or Bitter) that feeds Cool, Tough, Cute, Beauty, or Smart. Feed matching Pokéblocks and the condition climbs faster — important for Feebas Beauty or Contest ribbons. The full table on this page lists every nature with its +/− stats, liked and disliked flavors, and contest condition.",
      ],
      details: [],
      tips: [
        "Synchronize leads (Ralts line, later) help soft-reset wild natures — early on, soft-reset gifts or breed with Everstone.",

        "Neutral natures are fine for a casual story run if the Pokémon is already strong.",
        "Check the summary screen’s red / blue stat names to see which nature you rolled.",
      ],
      tags: ["pregame", "battles", "natures", "everstone", "contests"],
    },
    {
      id: "pregame-battles-8",
      title: "Manually raising stats",
      location: "Slateport Market · Lilycove Dept Store 3F",
      summary:
        "Vitamins add Effort Values: HP Up, Protein, Iron, Calcium, Zinc, and Carbos each give +10 EV to one stat, up to 100 EV from vitamins in that stat.",
      story: [
        "Beneath level and nature, Emerald tracks Effort Values (EVs) from defeated foes. Vitamins are the manual shortcut. HP Up raises HP EVs, Protein raises Attack, Iron raises Defense, Calcium raises Sp. Atk, Zinc raises Sp. Def, and Carbos raises Speed. Each use adds 10 EV to that stat. A vitamin will fail once that stat already has 100 EVs from any source — the Gen III per-stat vitamin / early EV soft cap for these items — and the whole Pokémon is limited to 510 EVs total across all stats.",
        "Buy all six vitamins for ₽9,800 each from the Energy Guru in Slateport’s market and from Lilycove Department Store 3F (Battle Frontier marts sell them postgame too). Overworld pickups also scatter Calcium, Carbos, and friends on later routes — grab them when the walkthrough marks an item ball. Vitamins never change nature or IVs; they only feed the EV pool that finalizes at level 100 (and still helps at mid levels).",
        "Hold a Macho Brace (Winstrate house on Route 111 after you beat all four family members) to double EV gain from battles while cutting Speed in the fight. Pair brace farming with vitamins: vitamins fill the first 100 EV quickly, then battle the right wild types for the rest. Rare Candies raise level without granting EVs — useful for hatches, useless for EV training.",
      ],
      details: [],
      tips: [
        "Dump Carbos into slow walls you want to outspeed specific gym leads — Speed EVs matter as much as Attack.",
        "Do not waste Calcium on a pure physical attacker; protein is the better buy.",
        "Pokérus (rare) doubles EV gain and stacks with Macho Brace — keep an infected party member if you ever get it.",
      ],
      tags: ["pregame", "battles", "vitamins", "evs", "calcium", "carbos", "macho-brace"],
    },
    {
      id: "pregame-battles-9",
      title: "TMs & HMs",
      location: "Hoenn — machines & field moves",
      summary:
        "Technical Machines teach a move once and are reusable in Gen III; Hidden Machines teach field moves locked behind badges — this page lists every TM01–TM50 and HM01–HM08.",
      story: [
        "TMs and HMs are discs you use from the Bag on a compatible party Pokémon. In Generation III a TM is reusable — teaching Thunderbolt does not destroy TM24 — so you can spread coverage freely. HMs are also reusable but the taught move cannot be forgotten by the Move Deleter until you no longer need that field utility (or you plan carefully which party member holds Cut, Surf, and Fly).",
        "Each gym badge unlocks the matching HM for field use: Stone → Cut, Knuckle → Flash, Dynamo → Rock Smash, Heat → Strength, Balance → Surf, Feather → Fly, Mind → Dive, Rain → Waterfall. You can receive the disc early and still use the move in battle; the overworld prompt appears only after the badge. Field effects are why HMs matter as much as their battle stats — Surf crosses oceans, Dive reaches Regi puzzles, Waterfall climbs Sootopolis approaches and Meteor Falls B1F.",
        "The catalog table on this page lists every TM01 through TM50 with move name and obtain location (gym rewards, item balls, shops, Game Corner coin prizes, and NPC gifts) plus all eight HMs with badge gates. Gym TMs arrive automatically when you win; shop TMs wait until Lilycove’s fourth floor or Slateport’s market; a few are postgame-only (TM49 Snatch on the S.S. Tidal). When the walkthrough says a machine is nearby, this list is the master checklist.",
      ],
      details: [],
      tips: [
        "Put Surf / Dive / Waterfall on Water-types that already want those STAB moves in battle.",
        "Keep one HM slave early if you hate cluttering your ace’s moveset — a surplus Zigzagoon works for Cut / Rock Smash.",
        "Game Corner coins buy Ice Beam, Thunderbolt, Psychic, Flamethrower, and Double Team — worth farming before the League.",
      ],
      secrets: [
        "Abandoned Ship’s storage TM is Ice Beam (TM13), not Snatch — Snatch is TM49 from a sailor on the S.S. Tidal after the Elite Four.",
      ],
      tags: ["pregame", "battles", "tm", "hm", "field-moves"],
    },
  ],
};
