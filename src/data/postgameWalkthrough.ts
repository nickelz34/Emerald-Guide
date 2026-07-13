import type { GuideSection } from "../types";

export const postgameOpeningChapter: GuideSection = {
  id: "postgame-opening",
  title: "Ch. 45 \u2014 Post-Game Opening",
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
        "The other Eon can still appear in Battle Frontier trainer teams, but you cannot catch both on one cartridge.",
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
  title: "Ch. 46 \u2014 Battle Frontier",
  description: "Sail on the S.S. Tidal, earn BP, and challenge the seven Frontier Brains.",
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
      summary: "Silver and Gold Symbols from each Brain; Lansat and Starf Berries from Brandon and Noland.",
      story: [
        "Each facility is a different exam. Battle Tower (Anabel) is classic seven-trainer climbs with a Brain at the end. Battle Dome (Tucker) runs a sixteen-trainer single-elimination bracket. Battle Factory (Noland) rents random teams every three wins. Battle Palace (Spenser) lets AI choose moves by nature. Battle Arena (Greta) judges style over raw damage. Battle Pike (Lucy) is a luck-and-poison gauntlet of rooms. Battle Pyramid (Brandon) sends you through shifting floors with item limits and wild encounters.",
        "Beat a Brain once to earn that facility\u2019s Silver Symbol (10 BP); beat the same Brain again for the Gold Symbol (another 10 BP). Brains only battle in 3-vs-3 Single mode. Collect all seven Silver Symbols and Scott awards a Lansat Berry; all seven Gold Symbols earn a Starf Berry from Scott\u2019s house. Collecting every Gold Symbol is Emerald\u2019s long-term Frontier endgame.",
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
        "Battle Points pile up whether you are chasing symbols or grinding shorter streaks. The Exchange Service Corner on the Frontier sells competitive staples: Choice Band, Choice Specs, Leftovers duplicates, Quick Claw, Scope Lens, and vitamins for EV polishing. Tutors nearby teach powerful moves for BP \u2014 including Swagger, Seismic Toss, Mimic, Metronome, Sleep Talk, and other options depending on which tutor you speak to.",
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
  ],
};


export const postgameHoennChapter: GuideSection = {
  id: "postgame-hoenn",
  title: "Ch. 47 \u2014 Post-Game Hoenn",
  description: "Beldum, Underpass fossils, Trainer Hill, Safari expansion, and Steven\u2019s rematch.",
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
      title: "Rematches, Trick House 8, Altering Cave",
      location: "Hoenn \u2014 trainers, Route 110, Route 103",
      summary: "Match Call rematches, the final Trick House prize, and Altering Cave swarms.",
      story: [
        "The Pok\u00e9Nav Match Call list comes alive after the championship. Registered trainers start offering rematches with higher levels and revised teams, cycling on a schedule tied to place and time \u2014 the best source of experience and money in post-game.",
        "On Route 110, the Trick House finally opens its eighth puzzle when you have enough Frontier symbols, paying out a rare shard reward at the end. Meanwhile, Altering Cave on Route 103 begins rotating special swarms (watch TV in Lilycove or your house for announcements) if you are hunting niche species for the National Dex.",
      ],
      details: [
        "Use Match Call to rematch registered trainers across Hoenn.",
        "Clear Trick House puzzle 8 on Route 110 (requires Frontier progress).",
        "Visit Altering Cave on Route 103 during announced swarm events.",
      ],
      tips: [
        "Rematch teams scale sharply \u2014 heal and swap leads before accepting calls.",
      ],
      secrets: [
        "Trick House puzzle 8 stays locked until you earn enough Battle Frontier symbols.",
      ],
      tags: ["post-game", "rematch", "trick-house", "altering-cave"],
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
        "Steven\u2019s rematch team is separate from his Champion fight in the League \u2014 levels and movesets are higher here.",
      ],
      tags: ["post-game", "steven", "meteor-falls", "optional"],
    },
  ],
};
