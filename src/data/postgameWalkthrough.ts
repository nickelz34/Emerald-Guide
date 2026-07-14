import type { GuideSection } from "../types";

export const postgameOpeningChapter: GuideSection = {
  id: "postgame-opening",
  title: "Ch. 45 \u2014 Postgame: Opening",
  description: "S.S. Ticket, the Eon roamer, and the National Dex.",
  steps: [
    {
      id: "postgame-1",
      title: "Norman\u2019s S.S. Ticket",
      location: "Littleroot Town \u2014 your house (2F)",
      summary: "After the Hall of Fame, Dad gives you the S.S. Ticket so you can sail east.",
      story: [
        "The credits finish and you wake in your bedroom in Littleroot. Head downstairs \u2014 Norman has come from Petalburg with a gift from Mr. Briney: the S.S. Ticket for Captain Stern\u2019s ferry, the S.S. Tidal. That pass unlocks travel between Slateport and Lilycove and, eventually, the Battle Frontier.",
        "Stock up in town if you need to, then plan your first voyage. You can board from Lilycove Harbor or Slateport\u2019s docks once you are ready to leave mainland Hoenn for the Frontier.",
      ],
      details: [
        "Wake in your bedroom after the Hall of Fame credits.",
        "Go downstairs and talk to Norman.",
        "Receive the S.S. Ticket from Mr. Briney via Norman.",
        "Board later from Slateport or Lilycove Harbor.",
      ],
      tips: [
        "You do not need the ticket to finish the story, but you cannot reach the Battle Frontier without it.",
      ],
      secrets: [
        "Norman\u2019s gift is the only S.S. Ticket in the game \u2014 there is no duplicate later.",
      ],
      tags: ["post-game", "littleroot", "ss-ticket"],
    },
    {
      id: "postgame-2",
      title: "Latias or Latios on TV",
      location: "Littleroot Town \u2014 your house",
      summary: "A news report on the Eon Pok\u00e9mon; Mom asks whether it was red or blue.",
      story: [
        "Back downstairs, the living-room TV is buzzing with a special report: a mysterious flying Pok\u00e9mon has been spotted over Hoenn. Mom pulls you over and asks what color you remember on the screen \u2014 red or blue. Your answer does not change the news story, but it does decide which legendary roamer will haunt your map from now on.",
        "Choose red and Latias (Psychic/Flying) roams at level 40; choose blue and Latios takes that role instead. Only one appears per save, it flees on the first turn unless you block trapping moves, and it will not show in your Pok\u00e9dex until you actually see it in the wild.",
      ],
      details: [
        "Watch the TV in your house after receiving the S.S. Ticket.",
        "Mom asks whether the Pok\u00e9mon on the report was red or blue.",
        "Red \u2192 Latias roams Hoenn at level 40; blue \u2192 Latios at level 40.",
        "The roamer is a one-time encounter per save and runs from battle unless trapped.",
      ],
      tips: [
        "Save before interacting with the TV if you care which Eon you get.",
        "Mean Look, Shadow Tag, or a Master Ball are the reliable ways to finish the chase.",
      ],
      secrets: [
        "The other Eon can still appear in Battle Frontier trainer teams, but you cannot catch both as roamers on one cartridge.",
        "Southern Island (Eon Ticket) lets you catch the non-roamer Eon holding Soul Dew \u2014 see Postgame: Mystery Gift & Event Islands.",
        "Event-only mythicals such as Deoxys (AuroraTicket / Birth Island) and Jirachi (Colosseum bonus disc or Pok\u00e9mon Channel) are covered in the event-islands chapter; they are not wild encounters in a normal cartridge playthrough.",
      ],
      tags: ["post-game", "latias", "latios", "roamer", "littleroot"],
    },
    {
      id: "postgame-3",
      title: "National Dex & Scott\u2019s call",
      location: "Littleroot Town \u2014 Professor Birch\u2019s Lab",
      summary: "Birch upgrades your Pok\u00e9dex; Scott rings your Pok\u00e9Nav about the Battle Frontier.",
      story: [
        "After the TV report, step outside and Professor Birch is waiting with your rival. He leads you both to his lab and upgrades your Pok\u00e9dexes to National Mode \u2014 every species from Kanto, Johto, and Hoenn combined. This opens trades, post-game areas, and the path toward the full National Dex.",
        "The moment the National Dex is in your hands, your Pok\u00e9Nav rings. Scott, the enthusiastic collector of strong trainers you have bumped into all game, invites you to the Battle Frontier aboard the S.S. Tidal. He is not just being polite \u2014 every Frontier facility and BP shop opens from this point forward.",
      ],
      details: [
        "Leave your house after the TV event (postgame-2).",
        "Professor Birch and your rival wait outside \u2014 follow them to the lab.",
        "Receive the National Pok\u00e9dex upgrade from Birch.",
        "Scott calls on the Pok\u00e9Nav when you leave the lab.",
      ],
      tips: [
        "National Dex registration matters for trades, post-game captures, and the 200-species Johto starter reward later.",
      ],
      secrets: [
        "Scott\u2019s call is tied to the National Dex, not to boarding the ship \u2014 you can finish Littleroot events before sailing.",
      ],
      tags: ["post-game", "national-dex", "birch", "scott", "littleroot"],
    },
  ],
};


export const postgameFrontierChapter: GuideSection = {
  id: "battle-frontier",
  title: "Ch. 46 \u2014 Postgame: Battle Frontier",
  description:
    "Sail on the S.S. Tidal, earn BP, clear side catches, and challenge the seven Frontier Brains.",
  steps: [
    {
      id: "battle-frontier-1",
      title: "S.S. Tidal to the Frontier",
      location: "S.S. Tidal (lower deck)",
      summary: "Board with the S.S. Ticket; Scott, Snatch, Leftovers, and Briney await.",
      story: [
        "Show the S.S. Ticket at Lilycove Harbor or Slateport and step onto the S.S. Tidal. Scott is on the lower deck, as promised on the Pok\u00e9Nav, and he formally welcomes you to the Battle Frontier before handing over the Frontier Pass. That card is checked at every facility gate from here on.",
        "The voyage is short but not empty. A sailor on the ship gives TM49 (Snatch), a girl returns a lost Leftovers to you, and near the rail you will find Captain Briney with Peeko \u2014 a quiet reunion after so many routes crossed by sea. When the ship docks, you step straight onto the Battle Frontier grounds west of Lilycove.",
      ],
      details: [
        "Board the S.S. Tidal from Lilycove or Slateport with the S.S. Ticket.",
        "Meet Scott on the lower deck; he gives you the Frontier Pass.",
        "Pick up TM49 (Snatch) from the sailor on the ship.",
        "Receive Leftovers from the girl who lost the item.",
        "Talk to Captain Briney and Peeko before disembarking.",
      ],
      tips: [
        "Snatch is niche in single-player but strong in Frontier sets that rely on stat boosts.",
      ],
      secrets: [
        "Leftovers on the Tidal is a free held item with no fight attached \u2014 grab it before you leave the ship.",
      ],
      tags: ["post-game", "battle-frontier", "ss-tidal", "frontier-pass"],
    },
    {
      id: "battle-frontier-2",
      title: "Frontier Pass & Scott\u2019s house",
      location: "Battle Frontier \u2014 entrance & Scott\u2019s house",
      summary: "Register at the gate; visit Scott\u2019s house for 1\u20134 bonus BP.",
      story: [
        "Past the entrance, the Battle Frontier spreads into seven facilities, each with its own rules and a Frontier Brain waiting at the end of a streak. Your Frontier Pass records symbols and Battle Points (BP), the currency for the shops and move tutors scattered across the park.",
        "Scott\u2019s house sits between the Battle Dome and Battle Tower. On your first visit he tallies every Scott conversation you had during the main game and awards 1, 2, 3, or 4 BP total depending on how many of the 13 sightings you found \u2014 use the checklist on this step. That lump sum jump-starts shopping, but only once, so spend or save it deliberately. While you are here, note the rules board: most cover legendaries and mythicals are banned from every facility, so plan teams without Mewtwo, the weather trio, Eon roamers, and similar restricted species.",
      ],
      details: [
        "Use the Frontier Pass to enter each facility at the front desks.",
        "Visit Scott\u2019s house between the Dome and Tower on your first Frontier trip.",
        "Receive 1\u20134 bonus BP on first visit (based on total Scott sightings: 5\u21921, 6\u20138\u21922, 9\u201312\u21923, all 13\u21924).",
        "Banned Pok\u00e9mon include Mewtwo, Mew, Ho-Oh, Lugia, Celebi, Kyogre, Groudon, Rayquaza, Jirachi, Deoxys, Latias, Latios, and the Regi trio.",
      ],
      tips: [
        "Open Level facilities use your highest-level Pok\u00e9mon (auto-capped at 100); Level 50 modes cap at 50.",
      ],
      secrets: [
        "Scott\u2019s BP bonus is a one-time payout \u2014 it does not repeat on later visits.",
      ],
      tags: ["post-game", "battle-frontier", "scott", "battle-points"],
    },
    {
      id: "battle-frontier-3",
      title: "Seven facilities & Frontier Brains",
      location: "Battle Frontier",
      summary: "Silver and Gold Symbols from each Brain; Lansat and Starf Berries from Scott\u2019s house.",
      story: [
        "Each facility is a different exam. Battle Tower (Anabel) is classic seven-trainer climbs with a Brain at the end. Battle Dome (Tucker) runs a sixteen-trainer single-elimination bracket. Battle Factory (Noland) rents random teams every three wins. Battle Palace (Spenser) lets AI choose moves by nature. Battle Arena (Greta) judges style over raw damage. Battle Pike (Lucy) is a luck-and-poison gauntlet of rooms. Battle Pyramid (Brandon) sends you through shifting floors with item limits and wild encounters.",
        "Beat a Brain once to earn that facility\u2019s Silver Symbol (10 BP); beat the same Brain again for the Gold Symbol (another 10 BP). Brains only battle in 3-vs-3 Single mode. Collect all seven Silver Symbols and Scott awards a Lansat Berry; all seven Gold Symbols earn a Starf Berry from Scott\u2019s house. Collecting every Gold Symbol is Emerald\u2019s long-term Frontier endgame and one of the four Trainer Card stars.",
      ],
      details: [
        "Battle Tower \u2014 Anabel: seven trainers, then the Brain; repeat the full streak for Gold.",
        "Battle Dome \u2014 Tucker: win the 16-trainer knockout, then beat Tucker again for Gold.",
        "Battle Factory \u2014 Noland (Knowledge Symbol): battles 21 and 42.",
        "Battle Palace \u2014 Spenser: three-Pok\u00e9mon battles decided by nature AI.",
        "Battle Arena \u2014 Greta: three-on-three arena judging; defeat Greta twice for Gold.",
        "Battle Pike \u2014 Lucy: survive rooms of hazards and trainers to reach Lucy.",
        "Battle Pyramid \u2014 Brandon (Brave Symbol): 3 and 6 clears.",
      ],
      tips: [
        "Factory and Pyramid reward berries only on Gold Symbols \u2014 plan two successful Brain rematches.",
        "Save before Brain battles; one loss sends you back to the facility lobby.",
      ],
      secrets: [
        "Scott\u2019s house: Silver Shield (50 Tower wins), Gold Shield (100 wins), Lansat Berry (all Silver Symbols), Starf Berry (all Gold Symbols).",
      ],
      tags: ["post-game", "battle-frontier", "frontier-brain", "symbols"],
    },
    {
      id: "battle-frontier-4",
      title: "BP shop & move tutors",
      location: "Battle Frontier \u2014 Exchange Service Corner",
      summary: "Spend BP on TMs, held items, vitamins, and tutor moves.",
      story: [
        "Battle Points pile up whether you are chasing symbols or grinding shorter streaks. The Exchange Service Corner on the Frontier sells competitive staples: Choice Band, Choice Specs, Leftovers duplicates, Quick Claw, Scope Lens, and vitamins for EV polishing. Tutors nearby teach powerful moves for BP \u2014 including Softboiled, Body Slam, elemental punches, and other options depending on which tutor you speak to.",
        "Because Scott\u2019s house bonus only pays once, steady BP income comes from repeating facilities you are comfortable with. Many players farm Battle Dome or Battle Factory once teams are tuned, then blow the balance on TMs and held items before attempting Gold Symbols on harder Brains.",
      ],
      details: [
        "Find the BP shop and tutors on the Battle Frontier grounds (Exchange Service Corner).",
        "Buy held items, TMs, and vitamins with Battle Points.",
        "Speak to move tutors to teach BP-priced moves to compatible Pok\u00e9mon.",
        "BP is shared across all facilities \u2014 symbols do not reset your point total.",
      ],
      tips: [
        "Choice Band, Choice Specs, and Leftovers are the usual first purchases for Frontier teams.",
      ],
      secrets: [
        "Some tutor moves are unique to the Frontier in Emerald \u2014 check each tutor\u2019s list before spending BP.",
      ],
      tags: ["post-game", "battle-frontier", "battle-points", "tutors"],
    },
    {
      id: "battle-frontier-5",
      title: "Sudowoodo & Artisan Cave",
      location: "Battle Frontier \u2014 SE grounds & Artisan Cave",
      summary: "Water the strange tree for Sudowoodo, then Surf to Artisan Cave for wild Smeargle.",
      story: [
        "Southeast of the facilities, past the Battle Palace area, an old woman frets over a motionless tree. Use the Wailmer Pail (from the Pretty Petal Flower Shop on Route 104) on it to force a battle with Sudowoodo at level 40 \u2014 Emerald\u2019s only in-game catch for the species without Colosseum. Save before you water it; there is one per save file.",
        "After Sudowoodo is caught or defeated, Surf the newly opened water path, take the waterfall stretch, and enter Artisan Cave to the west. The two-floor cave is packed with wild Smeargle (the only Gen III wild source without Colosseum), a Rare Candy, and a convenient shortcut that exits beside the Battle Tower.",
      ],
      details: [
        "Bring the Wailmer Pail from Route 104\u2019s Pretty Petal Flower Shop if you skipped it earlier.",
        "Use the Wailmer Pail on the strange tree southeast of the Frontier for Sudowoodo (level 40).",
        "Surf past the cleared path, continue west, and enter Artisan Cave.",
        "Catch Smeargle on both floors; grab the Rare Candy; exit beside the Battle Tower if you want a shortcut.",
      ],
      tips: [
        "Rock / Water / Fighting / Steel coverage makes the Sudowoodo fight quick \u2014 False Swipe helps for a clean catch.",
        "Artisan Cave Smeargle only know Sketch at catch; plan breeding or Sketch setups later.",
      ],
      secrets: [
        "There is no legendary in Artisan Cave despite long-tail rumors \u2014 only Smeargle.",
      ],
      tags: ["post-game", "battle-frontier", "sudowoodo", "artisan-cave", "smeargle"],
    },
    {
      id: "battle-frontier-6",
      title: "Meowth trade & BP betting",
      location: "Battle Frontier \u2014 houses near Tower & Pyramid",
      summary: "Trade Skitty for Meowth, then bet BP with the Hiker after three Silver Symbols.",
      story: [
        "In a house near the Battle Tower, a trainer offers an in-game trade: your Skitty for their Meowth (nickname Meowow regionally). Meowth is otherwise a FireRed/LeafGreen Kanto catch, so the trade is a handy National Dex filler if you lack those games \u2014 Skitty is rarer in FRLG, so weigh the swap carefully.",
        "Once you have earned any three Silver Symbols, visit the house under the Battle Pyramid. A Hiker offers daily BP bets on a rotating Frontier challenge (Tower Multi, Dome Double, and so on). Stake 5, 10, or 15 BP; win the requested facility mode that day and he pays double. The challenge rotates with the RTC clock, so a live battery matters.",
      ],
      details: [
        "Trade Skitty for Meowth in the house near the Battle Tower.",
        "Earn any three Silver Symbols from Frontier Brains.",
        "Talk to the Hiker in the house under the Battle Pyramid to bet 5, 10, or 15 BP.",
        "Clear his requested facility mode that day to receive double BP.",
      ],
      tips: [
        "Do not bet your last BP before a Gold Symbol run you cannot afford to restart.",
      ],
      secrets: [
        "The Hiker\u2019s board only opens after three Silver Symbols \u2014 Silver Shields and Tower ribbons are separate Scott rewards.",
      ],
      tags: ["post-game", "battle-frontier", "meowth", "battle-points"],
    },
  ],
};


export const postgameHoennChapter: GuideSection = {
  id: "postgame-hoenn",
  title: "Ch. 47 \u2014 Postgame: Hoenn",
  description:
    "Beldum, Underpass fossils, Trainer Hill, Safari expansion, rematches, outbreaks, diplomas, and Steven\u2019s rematch.",
  steps: [
    {
      id: "postgame-hoenn-1",
      title: "Beldum in Steven\u2019s house",
      location: "Mossdeep City \u2014 Steven\u2019s house",
      summary: "Steven leaves a level 5 Beldum in his house after you become Champion.",
      story: [
        "Champion status changes how NPCs treat you, and Steven Stone is no exception. Fly to Mossdeep and enter the house southeast of the Space Center. Inside, a Pok\u00e9 Ball on the table holds Beldum, the Iron Ball Pok\u00e9mon that eventually becomes the pseudo-legendary Metagross.",
        "It arrives at level 5 with only Take Down, so raising it is a project \u2014 but the stats at evolution are worth the patience. There is only one gift Beldum per save, so choose whether to train it yourself or hatch a custom nature from a later bred Metagross.",
      ],
      details: [
        "Go to Steven\u2019s house in Mossdeep City after the Hall of Fame.",
        "Take the Pok\u00e9 Ball on the table to receive Beldum (level 5).",
        "Beldum evolves into Metang at level 20 and Metagross at level 45.",
      ],
      tips: [
        "Beldum cannot learn many moves until Metang \u2014 plan TMs and tutoring after evolution.",
      ],
      secrets: [
        "This is the only in-game Beldum without trading in Emerald.",
      ],
      tags: ["post-game", "beldum", "metagross", "mossdeep", "steven"],
    },
    {
      id: "postgame-hoenn-2",
      title: "Desert Underpass & Ditto",
      location: "Route 114 \u2014 Desert Underpass",
      summary: "Recover your chosen fossil and catch wild Ditto in the reopened tunnel.",
      story: [
        "The collapsed tunnel on Route 114 north of Fallarbor reopens after the championship. Inside the Desert Underpass you can finally claim whichever fossil you could not take at the Devon dig site \u2014 the Claw or Root fossil you skipped earlier sits waiting on the ground.",
        "Wild encounters fill the cave as well, most notably Ditto at a rare rate. Bring False Swipe and status if you want a breeding anchor without hunting through endless random transforms.",
      ],
      details: [
        "Enter the Desert Underpass from Route 114 after becoming Champion.",
        "Pick up the fossil you did not choose at the Devon Researcher\u2019s Route 111 site.",
        "Catch Ditto in the cave (rare wild encounter).",
      ],
      tips: [
        "Revive the second fossil at the Devon Corporation in Rustboro when you are ready.",
      ],
      secrets: [
        "Ditto is one of the few places in Hoenn to catch it without trades.",
      ],
      tags: ["post-game", "fossil", "ditto", "route-114"],
    },
    {
      id: "postgame-hoenn-3",
      title: "Trainer Hill prizes",
      location: "Route 111 \u2014 Trainer Hill",
      summary: "Beat each mode under twelve minutes for TMs and an Elixir.",
      story: [
        "East of the desert on Route 111, Trainer Hill opens as a timed gauntlet of NPC trainers spread across four floors. Each difficulty label tracks a different layout, and the clock stops when you reach the owner on the roof.",
        "Clear any run in under twelve minutes to earn that mode\u2019s prize: Normal mode pays TM11 (Sunny Day), Variety mode gives an Elixir, Unique mode awards TM19 (Giga Drain), and Expert mode grants TM31 (Brick Break). Faster times are bragging rights only \u2014 the rewards do not stack per day, so grab each mode once when your team is ready.",
      ],
      details: [
        "Enter Trainer Hill on Route 111 post-game.",
        "Finish Normal mode in under 12:00 for TM11 (Sunny Day).",
        "Finish Variety mode in under 12:00 for an Elixir.",
        "Finish Unique mode in under 12:00 for TM19 (Giga Drain).",
        "Finish Expert mode in under 12:00 for TM31 (Brick Break).",
      ],
      tips: [
        "Bring a fast sweeper and Fly users to cut backtracking between floors.",
      ],
      secrets: [
        "The twelve-minute threshold is the same for every mode \u2014 only the prize item changes.",
      ],
      tags: ["post-game", "trainer-hill", "route-111", "tm"],
    },
    {
      id: "postgame-hoenn-4",
      title: "Johto starters from Birch",
      location: "Littleroot Town \u2014 Professor Birch\u2019s Lab",
      summary: "Show Birch a completed 200-species Hoenn Dex to pick Chikorita, Cyndaquil, or Totodile.",
      story: [
        "Professor Birch\u2019s National Dex upgrade was only the beginning. Once you have seen 200 Hoenn Pok\u00e9mon, return to his lab and he will offer a choice of Johto\u2019s starters as a reward for your fieldwork.",
        "Pick Chikorita, Cyndaquil, or Totodile in the same spirit as your original starter choice \u2014 you receive only one gift per save. They arrive at level 5 and open breeding lines for the rest of the Johto dex if you are chasing completion.",
      ],
      details: [
        "Catch all 200 Hoenn Pok\u00e9dex species (owned, not just seen).",
        "Talk to Professor Birch in Littleroot Lab.",
        "Choose Chikorita, Cyndaquil, or Totodile (level 5).",
      ],
      tips: [
        "Use the National Dex and trades if you are short on Hoenn exclusives.",
      ],
      secrets: [
        "Version exclusives and trade evolutions are the usual bottlenecks \u2014 Ditto breeding in the Underpass helps.",
      ],
      tags: ["post-game", "johto", "starters", "birch", "littleroot"],
    },
    {
      id: "postgame-hoenn-5",
      title: "Safari Zone expansion",
      location: "Safari Zone",
      summary: "New areas and encounters, including Goldeen in the added waters.",
      story: [
        "With the main story cleared, the Safari Zone north of Lilycove expands. New map chunks open to the northeast, northwest, and across additional blocks, each with its own encounter tables and item balls tucked in tall grass or along shores.",
        "Among the fresh catches is Goldeen in the expansion waters \u2014 handy for dex completion and evolution into Seaking. Bring the right blocks and patience; Safari mechanics still apply, so step counts and bait matter.",
      ],
      details: [
        "Enter the Safari Zone after becoming Champion.",
        "Explore the newly opened expansion areas.",
        "Fish or surf for Goldeen in the added water tiles.",
        "Collect items scattered through the new zones.",
      ],
      tips: [
        "Stock Safari Balls in Lilycove before long hunting sessions.",
      ],
      secrets: [
        "The expansion is the primary in-game spot for several dex fillers without trades.",
      ],
      tags: ["post-game", "safari-zone", "goldeen"],
    },
    {
      id: "postgame-hoenn-6",
      title: "Match Call rematches",
      location: "Hoenn \u2014 Pok\u00e9Nav Match Call",
      summary: "Gym Leader tiers, Wattson\u2019s New Mauville lock, and scaled trainer rematches.",
      story: [
        "Route trainers auto-register for Match Call after the Balance Badge. After the Hall of Fame, Gym Leaders and the Elite Four join the list. A flashing Pok\u00e9 Ball icon means they are ready \u2014 call from the Pok\u00e9Nav; you cannot force a rematch before the icon appears. Rematch teams hit harder each cycle and are the best money/experience loop outside the Frontier.",
        "Gym Leaders use four rematch tiers. Every leader\u2019s tier N team must be beaten before any leader offers tier N+1. After the Elite Four, every 60 wild encounters, 20 trainer battles, or 20 Battle Frontier battles rolls a 31% chance to unlock a Gym rematch. Wattson refuses rematches until you finish his New Mauville errand (Surf into the underground plant on Route 110) \u2014 that lock also stalls later tiers for everyone. Elite Four and Wallace rematches stay available but do not scale their teams.",
      ],
      details: [
        "Watch for flashing Pok\u00e9 Ball icons on Match Call entries.",
        "Clear Wattson\u2019s New Mauville side quest before chasing Gym rematch tiers.",
        "Beat every Gym Leader\u2019s current rematch tier before the next tier unlocks.",
        "Use the rematch and schedule panels on this step for per-trainer timing.",
      ],
      tips: [
        "Stand on a trainer\u2019s map section for a guaranteed rematch offer when they are ready.",
        "Lightning Rod on the lead slightly increases off-route rematch call frequency.",
      ],
      secrets: [
        "Wally rematches at Victory Road near the exit; Steven\u2019s Meteor Falls fight is one-time and separate from Match Call.",
      ],
      tags: ["post-game", "rematch", "match-call", "wattson"],
    },
    {
      id: "postgame-hoenn-7",
      title: "Steven in Meteor Falls",
      location: "Meteor Falls \u2014 back chamber",
      summary: "Optional battle with Steven and his full champion-level team.",
      story: [
        "Steven does not stay in Mossdeep after gifting Beldum. When you are ready for one of the toughest optional fights in Hoenn, return to Meteor Falls \u2014 the same cave where you first met him \u2014 and venture to the back chamber accessible after the championship.",
        "He greets you with a full post-game roster anchored by high-level steel and dragon types. Winning is pure bragging rights: no item reward, but proof your team can hang with the former Champion. Save before you accept, because his Metagross hits hard.",
      ],
      details: [
        "Enter Meteor Falls from Route 114 after the Hall of Fame.",
        "Reach the back chamber (Surf and Waterfall required).",
        "Talk to Steven to start an optional high-level battle.",
      ],
      tips: [
        "Bring Fighting, Fire, and Ground coverage for his Steel types.",
      ],
      secrets: [
        "Steven\u2019s Meteor Falls team is his post-game challenge in Emerald \u2014 Wallace is the League Champion, not Steven.",
      ],
      tags: ["post-game", "steven", "meteor-falls", "optional"],
    },
    {
      id: "postgame-hoenn-8",
      title: "Mass outbreaks & Altering Cave",
      location: "Hoenn TV & Route 103",
      summary: "Post-HoF swarm TV news (one natural outbreak per save) and Zubat-only Altering Cave.",
      story: [
        "After the Hall of Fame, finishing ordinary wild or trainer battles (not Safari, Frontier, or link) has roughly a 0.5% chance to schedule a mass outbreak. The next day a TV news report announces the swarm; watch it to activate the outbreak, which then lasts until the end of the following day and replaces half of that route\u2019s wild rolls with the swarm species. Emerald can only generate one natural outbreak per save without record mixing \u2014 mix with another cartridge to unlock further swarm generations, including species such as Surskit that Emerald does not roll on its own.",
        "Altering Cave also opens on Route 103 after the championship. In released Emerald it forever contains only wild Zubat; the Wonder Spot Johto fauna event that would have changed the table was never distributed. Use Safari expansion and Artisan Cave for those species instead.",
      ],
      details: [
        "Battle on routes after HoF until a swarm is queued (rare ~0.5% roll).",
        "Watch the TV outbreak report the next day to activate it.",
        "Hunt while the swarm is live (ends at the close of the following day).",
        "Visit Altering Cave on Route 103 only if you want Zubat \u2014 no event fauna in stock Emerald.",
      ],
      tips: [
        "A working RTC battery is required for TV days and outbreak duration.",
        "Record mix to import foreign outbreaks and to regenerate after your one natural swarm.",
      ],
      secrets: [
        "Altering Cave\u2019s unused table listed Mareep, Aipom, Pineco, Shuckle, Teddiursa, Houndour, Stantler, and Smeargle.",
      ],
      tags: ["post-game", "outbreak", "altering-cave", "tv"],
    },
    {
      id: "postgame-hoenn-9",
      title: "Diplomas & Trainer Card stars",
      location: "Lilycove Cove Lily Motel & region milestones",
      summary: "Game Freak diplomas plus the four Trainer Card star conditions.",
      story: [
        "On the upper floor of the Cove Lily Motel in Lilycove, Game Freak staff congratulate completionists. The Game Designer awards the Pok\u00e9 Diploma when your Hoenn Pok\u00e9dex is finished (Jirachi and Deoxys are not required). Return again after finishing the National Dex for the National Diploma recognition on the same visit path.",
        "Emerald\u2019s Trainer Card can earn four stars: (1) enter the Hall of Fame, (2) complete the Hoenn Dex excluding Jirachi and Deoxys, (3) hang all five Master Rank contest paintings in Lilycove Museum (win Master with a high score \u2014 about 800 points triggers the artist), and (4) collect all seven Gold Frontier Symbols. Five museum paintings also earn a Glass Ornament from the curator for your Secret Base.",
      ],
      details: [
        "Visit Game Freak on Cove Lily Motel 2F for the Hoenn Pok\u00e9 Diploma.",
        "Return after National Dex completion for the National Diploma acknowledgment.",
        "Earn Trainer Card stars: HoF, Hoenn Dex, five museum paintings, seven Gold Symbols.",
        "Win Master contests at ~800+ points so the artist offers museum paintings; claim the Glass Ornament at five paintings.",
      ],
      tips: [
        "Johto starters from Birch and Frontier Gold Symbols are the usual bottlenecks for stars 2 and 4.",
      ],
      secrets: [
        "Museum paintings are separate from the twenty contest ribbons \u2014 you need a high-scoring Master win per category, not merely a Master Ribbon.",
      ],
      tags: ["post-game", "diploma", "trainer-card", "lilycove"],
    },
  ],
};


/** Mystery Gift / distribution islands \u2014 capstone after cartridge post-game chapters. */
export const postgameEventsChapter: GuideSection = {
  id: "postgame-events",
  title: "Ch. 49 \u2014 Postgame: Mystery Gift & Event Islands",
  description:
    "Enable Mystery Gift, then chase Eon Ticket, MysticTicket, AuroraTicket, and Old Sea Map destinations.",
  steps: [
    {
      id: "postgame-events-1",
      title: "Enable Mystery Gift",
      location: "Any Pok\u00e9 Mart \u2014 then title / main menu",
      summary: "Unlock Mystery Gift with the mart questionnaire Easy Chat phrase, then receive Wonder Cards at a Pok\u00e9mon Center.",
      story: [
        "Official Nintendo Wonder Spot distributions for English Emerald have ended, but the cartridge still contains the full Mystery Gift pipeline. To turn the option on, talk to the questionnaire girl in any Pok\u00e9 Mart basement and answer Easy Chat questions until you can enter the phrase LINK TOGETHER WITH ALL (the standard English Emerald unlock string).",
        "After you save and reset, Mystery Gift appears on the title-screen / continue menu. Connecting at a Wonder Spot (or injecting a Wonder Card with modern tools) queues a delivery: speak to the delivery person upstairs in a Pok\u00e9mon Center (2F) to receive the ticket item. Only MysticTicket and AuroraTicket use this path on international Emerald \u2014 the Eon Ticket and Old Sea Map follow different rules covered in the next steps.",
      ],
      details: [
        "Talk to the Pok\u00e9 Mart questionnaire attendant.",
        "Enter Easy Chat phrase LINK TOGETHER WITH ALL when prompted.",
        "Save, soft-reset, and open Mystery Gift from the title / main menu.",
        "Receive Wonder Cards historically via Nintendo Wonder Spot (wireless); claim delivered items from the Pok\u00e9mon Center 2F delivery person.",
      ],
      tips: [
        "You still need the S.S. Ticket (Postgame: Opening) before Lilycove Harbor will accept event tickets for island voyages.",
      ],
      secrets: [
        "Altering Cave on Route 103 was coded for Wonder Spot Johto fauna, but that Mystery Gift was never held \u2014 the cave stays Zubat-only in released Emerald.",
        "Direct mythicals such as Jirachi (Colosseum bonus disc / Pok\u00e9mon Channel) and Celebi were separate promotions, not Lilycove ferry tickets.",
      ],
      tags: ["post-game", "mystery-gift", "events"],
    },
    {
      id: "postgame-events-2",
      title: "Eon Ticket \u2014 Southern Island",
      location: "Pok\u00e9mon Center Record Corner \u2192 Lilycove Harbor \u2192 Southern Island",
      summary: "Record-mix the Eon Ticket onto international Emerald, then catch the non-roamer Latias or Latios with Soul Dew.",
      story: [
        "The Eon Ticket opens Southern Island so you can catch whichever Eon Pok\u00e9mon you did not choose as the post-Hall of Fame roamer. On international Emerald this ticket is not a Wonder Spot Mystery Gift \u2014 Emerald lacks Mystery Event, so the only legitimate path is mixing records at a Pok\u00e9mon Center with a Ruby or Sapphire (or Emerald) that holds an original e-Card / event Eon Ticket. Tickets received only by mixing cannot be shared further (original holders can redistribute up to 30 times).",
        "After a successful mix the Eon Ticket appears in your Key Items pocket. With it and the S.S. Ticket in your bag, speak to the sailor at Lilycove Harbor and choose Southern Island on the S.S. Tidal. Inside, a static Latias or Latios (level 50) waits holding Soul Dew \u2014 the only legitimate Gen III source of that item. Emerald lets you return to the island later with the ticket still in inventory (Ruby/Sapphire locked you out after leaving).",
      ],
      details: [
        "Mix records with a game that has an original (not mix-only) Eon Ticket \u2014 the only path on international Emerald.",
        "Confirm the Eon Ticket is in your Key Items pocket after the mix.",
        "Sail from Lilycove Harbor to Southern Island (requires S.S. Ticket).",
        "Catch the non-roamer Latias or Latios at level 50 holding Soul Dew.",
      ],
      tips: [
        "Save before the encounter \u2014 only one island Eon appears per save file.",
        "Mean Look / trapping still helps if you want a non-Master Ball catch.",
      ],
      secrets: [
        "Soul Dew boosts Latias/Latios Special Attack and Special Defense in Gen III \u2014 it is banned in the Battle Frontier along with the Eon pair.",
      ],
      tags: ["post-game", "eon-ticket", "southern-island", "latias", "latios", "events"],
    },
    {
      id: "postgame-events-3",
      title: "MysticTicket \u2014 Navel Rock",
      location: "Lilycove Harbor \u2192 Navel Rock",
      summary: "Board with the MysticTicket for level-70 Lugia and Ho-Oh.",
      story: [
        "The MysticTicket was distributed via Mystery Gift at Nintendo events (Pok\u00e9mon Centers, Rocks America, and similar Wonder Spots). Once the Wonder Card is claimed and the ticket sits in your Key Items pocket, show it at Lilycove Harbor \u2014 you must already own the S.S. Ticket. The sailor will offer Navel Rock as a destination on the S.S. Tidal.",
        "Navel Rock is a tall Sevii Island cavern. Take the upward stairs for Ho-Oh (level 70) on the summit and the downward path for Lugia (level 70) in the depths. Use the Itemfinder near the top for Sacred Ash. Both legendaries are among the highest-level static encounters in Emerald, so bring Ultra Balls, status, and a sturdy lead.",
      ],
      details: [
        "Obtain MysticTicket via Mystery Gift Wonder Card (historical Nintendo events).",
        "Board the S.S. Tidal from Lilycove Harbor with both the S.S. Ticket and MysticTicket.",
        "Climb to Navel Rock Top for Ho-Oh (level 70); descend for Lugia (level 70).",
        "Search the summit with the Itemfinder for Sacred Ash.",
      ],
      tips: [
        "Stock Full Restores and status moves before the climb \u2014 both birds hit hard at level 70.",
        "Save on the exterior before either fight if you prefer not to re-sail after a KO.",
      ],
      secrets: [
        "Navel Rock never appears on the Pok\u00e9Nav map in Emerald until you have visited it.",
      ],
      tags: ["post-game", "mystic-ticket", "navel-rock", "lugia", "ho-oh", "events"],
    },
    {
      id: "postgame-events-4",
      title: "AuroraTicket \u2014 Birth Island",
      location: "Lilycove Harbor \u2192 Birth Island",
      summary: "Solve the triangle puzzle for level-30 Deoxys (Speed Forme after capture in Emerald).",
      story: [
        "The AuroraTicket unlocks Birth Island the same way the MysticTicket unlocks Navel Rock: receive it through Mystery Gift, then sail from Lilycove Harbor with your S.S. Ticket. Japanese Emerald cartridges were historically excluded from AuroraTicket distributions, while other language Emeralds and FireRed/LeafGreen could receive it.",
        "Birth Island itself is nearly empty rock around a black stone triangle. Speak to the triangle, then walk the shortest possible path to its new position; repeat until the stone glows red hot. Deoxys then appears at level 30. Catch carefully \u2014 it is fragile compared with Navel Rock\u2019s birds. After the battle, Emerald converts the caught Deoxys to Speed Forme for that cartridge (stats follow the destination game\u2019s form rules in Gen III link battles).",
      ],
      details: [
        "Obtain AuroraTicket via Mystery Gift Wonder Card.",
        "Sail from Lilycove Harbor to Birth Island.",
        "Interact with the triangle and approach via the shortest path until it turns red.",
        "Catch Deoxys at level 30; it becomes Speed Forme on Emerald after capture.",
      ],
      tips: [
        "If Deoxys faints, re-enter the Hall of Fame and return \u2014 it can respawn after another champion clear.",
        "False Swipe and a status condition make the level-30 catch reliable.",
      ],
      secrets: [
        "You cannot change Deoxys\u2019s form on a single Gen III cart \u2014 trading it into FireRed or LeafGreen changes the displayed forme while it is on that cartridge.",
      ],
      tags: ["post-game", "aurora-ticket", "birth-island", "deoxys", "events"],
    },
    {
      id: "postgame-events-5",
      title: "Old Sea Map \u2014 Faraway Island",
      location: "Lilycove Harbor \u2192 Faraway Island",
      summary: "Japan/Taiwan Emerald distributions only: find Mew on Faraway Island.",
      story: [
        "The Old Sea Map was distributed only for Japanese (and later Taiwanese) Emerald at Pok\u00e9mon Festa / Pok\u00e9Park events. It was never released for English, European, or other international Emerald cartridges. Those players received Mew through other promotions instead of this ferry ticket.",
        "If the Old Sea Map is present in the Key Items pocket (legitimately on a JP/TW save, or injected into an international ROM), Lilycove Harbor adds Faraway Island to the S.S. Tidal destinations. Explore the island forest to encounter Mew at level 30. International carts still contain the maps and scripts \u2014 only the official Wonder Card distribution was region-locked.",
      ],
      details: [
        "Old Sea Map: Japan Pok\u00e9mon Festa / Pok\u00e9Park 2005 and Taiwan Pok\u00e9Park 2006 Emerald distributions only.",
        "Board from Lilycove Harbor with the S.S. Ticket and Old Sea Map.",
        "Find and catch Mew at level 30 on Faraway Island.",
      ],
      tips: [
        "Treat this step as historical / regional documentation if you play an English cart without the map.",
      ],
      secrets: [
        "Faraway Island encounter data is excluded from the guide\u2019s normal wild-dex sweep because the island is event-gated.",
      ],
      tags: ["post-game", "old-sea-map", "faraway-island", "mew", "events"],
    },
  ],
};
