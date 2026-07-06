import type { GuideSection } from "../types";

/**
 * Story walkthrough, organized so each map / route / town is its own chapter.
 * Events within a chapter are ordered and numbered (1, 2, 3…) in the UI so the
 * guide reads as an in-depth, accurate retelling of the Pokémon Emerald story.
 */
export const walkthrough: GuideSection[] = [
  {
    id: "littleroot",
    title: "Ch. 1 — Littleroot Town",
    description: "Moving day. Meet your rival and Professor Birch.",
    steps: [
      {
        id: "littleroot-1",
        title: "Moving into Littleroot Town",
        location: "Littleroot Town — your house",
        summary: "You arrive in the moving truck and settle into your new home.",
        story: [
          "The moving truck rumbles open and you step down into Littleroot Town, having just relocated from far-off Johto so your father, Norman, can take up his post as Petalburg City's Gym Leader. Machoke haul the last boxes inside while Mom sends you upstairs to settle in — where your first job is setting the wall clock, since the game won't budge until you do and that clock quietly governs berries and day/night encounters all game long.",
          "Grab the free Potion from your bedroom PC, then head down to catch the tail end of a TV program — you just miss seeing Dad on screen. With the boxes unpacked, the whole of Hoenn is waiting past your front door.",
        ],
        details: [
          "Step out of the moving truck and enter your house.",
          "Go upstairs to your room and set the wall clock — the game won't progress until you do.",
          "Check the PC in your room for a Potion.",
          "Talk to Mom, then watch the TV before heading outside.",
        ],
        tips: ["The in-game clock drives berry growth and day/night encounters, so set it accurately."],
        secrets: [
          "The PC in your bedroom holds a free Potion — grab it before you leave.",
          "Setting the wall clock correctly matters all game long: certain berries, tides, and encounters are tied to the real time you enter here.",
        ],
        tags: ["intro", "littleroot"],
      },
      {
        id: "littleroot-2",
        title: "Meet your rival next door",
        location: "Littleroot Town — rival's house",
        summary: "Visit the house next door and meet Brendan or May, Birch's child.",
        story: [
          "The house directly east of yours belongs to Professor Birch, the region's resident Pokémon researcher — and to his child, who's about to become your rival and travelling companion. Slip inside and their mom points you upstairs, where you'll find your new neighbour fussing over a freshly-unpacked room of their own.",
          "This is May if you're playing as Brendan, or Brendan if you're playing as May — the game always casts your rival as the opposite of whoever you chose at the title screen. The meeting is short and friendly; they mention their father has been meaning to meet you, then shoo you back out into town. Birch, it turns out, is the reason your adventure is about to begin.",
        ],
        details: [
          "Enter the house directly east of yours (the rival's home).",
          "Head upstairs to meet your rival — Brendan if you play as May, or May if you play as Brendan.",
          "Their gender is always the opposite of your chosen character.",
        ],
        secrets: [
          "Peek at the Pokémon-shaped clock and the poster in the rival's room for a bit of early flavour — small touches that make Littleroot feel lived-in.",
        ],
        tags: ["rival", "littleroot"],
      },
      {
        id: "littleroot-3",
        title: "Look for Professor Birch",
        location: "Littleroot Town — Birch's Lab",
        summary: "Birch isn't at his lab — he's out doing fieldwork on Route 101.",
        story: [
          "Naturally, you head straight for Professor Birch's Lab at the south end of town to say hello — only to find it empty except for an assistant, who explains the professor is out doing fieldwork and rarely sits still. If you want to meet him, you'll have to go to him.",
          "The only way out of Littleroot is north, through the gate and onto Route 101 where the tall grass begins. You've no Pokémon of your own yet, so stepping into that grass would normally be reckless — but before you can worry about it, a panicked voice cuts across the route. Someone is in serious trouble, and it sounds an awful lot like a professor.",
        ],
        details: [
          "Enter Professor Birch's Lab south of your house; he isn't there.",
          "Leave town heading north onto Route 101 to find him.",
          "You'll hear him shouting for help as you step into the tall grass.",
        ],
        tags: ["birch", "littleroot"],
      },
    ],
  },
  {
    id: "route-101",
    title: "Ch. 2 — Route 101",
    description: "Rescue Birch and choose your very first Pokémon.",
    steps: [
      {
        id: "route-101-1",
        title: "Rescue Professor Birch",
        location: "Route 101",
        summary: "Birch is being chased by a wild Pokémon — grab a Poké Ball from his bag.",
        story: [
          "You find Professor Birch exactly where the shouting led you: backed against a tree on Route 101, circling away from a snapping wild Poochyena with nowhere left to run. His bag lies abandoned in the grass a few steps away, and he begs you to open it — there are Poké Balls inside, and any one of them holds a Pokémon that can send this Poochyena packing.",
          "It's a strange way to be handed your very first partner, but that's Birch for you: a field researcher first and a careful man second. Pop open the bag and you're offered a choice of three Poké Balls, each containing one of Hoenn's starter Pokémon. Whichever you send out is yours to keep — so take a breath before you decide.",
        ],
        details: [
          "Birch is cornered by a wild Poochyena. Open his bag on the ground.",
          "Choose one of three starters to defend him.",
          "Whatever you pick, you keep — this is your starter for the whole game.",
        ],
        secrets: [
          "The Poochyena here is the same species you can catch a few steps later on Route 101 — a handy early Bite user if you want one.",
        ],
        tags: ["birch", "route-101"],
      },
      {
        id: "route-101-2",
        title: "Choose your starter & first battle",
        location: "Route 101",
        summary: "Treecko (Grass), Torchic (Fire), or Mudkip (Water) — then beat the wild Poochyena.",
        story: [
          "Three Poké Balls, three very different journeys. Treecko is the cool-headed forest gecko who grows into fast, hard-hitting Sceptile — a Grass-type that rewards players who like to out-speed and out-think their opponents. Torchic is the wide-eyed chick that becomes Blaziken, a Fire/Fighting powerhouse that punches through most of the game but leans on a fragile start. Mudkip is the sturdy little mudfish whose final form, Swampert, is famously forgiving: a Water/Ground wall-breaker with only a single glaring weakness to Grass.",
          "Send your pick out and the rescue becomes your first real battle. The wild Poochyena is weak and under-levelled, so a couple of Tackles settle it and Birch is saved. Flustered but grateful, the professor realises he's been conducting his research in the middle of the road — and insists you follow him back to the lab, your new Pokémon in tow.",
        ],
        details: [
          "Treecko → Grovyle → Sceptile (Grass): fast special attacker.",
          "Torchic → Combusken → Blaziken (Fire/Fighting): strong mixed attacker.",
          "Mudkip → Marshtomp → Swampert (Water/Ground): bulky and easy for a first playthrough.",
          "Defeat the wild Poochyena to end the rescue.",
        ],
        tips: [
          "Mudkip is the most forgiving pick — Swampert only fears Grass moves and covers the first two gyms.",
          "Save before the fight if you're hunting for a good starter nature.",
        ],
        secrets: [
          "Your starter's nature is rolled when the battle begins. Save in Littleroot beforehand and you can soft-reset to fish for a helpful nature like Adamant, Modest, or Jolly.",
        ],
        tags: ["starter", "route-101"],
      },
      {
        id: "route-101-3",
        title: "Get the Pokédex & Running Shoes",
        location: "Littleroot Town",
        summary: "Return to the lab for your Pokédex and Poké Balls; Mom gives you the Running Shoes.",
        story: [
          "Back at the lab, Birch makes it official. Impressed by how you handled yourself, he entrusts you with your own Pokédex — the encyclopaedia that records every species you see and catch — along with five Poké Balls to start filling it. His child, your rival, turns up moments later, and the professor suggests the two of you learn the ropes together.",
          "Step outside and your mother catches you before you can leave, pressing a pair of Running Shoes into your hands so you can keep up with your new life on the road. Hold B from now on and you'll dash everywhere. With a Pokémon at your side, a Pokédex in your bag, and the wind at your heels, the real journey north to Oldale Town finally begins.",
        ],
        details: [
          "Follow Birch back to his lab. He gives you your own Pokédex and 5 Poké Balls.",
          "Your rival gives you a Pokénav-related nudge later; for now leave the lab.",
          "Mom stops you outside to hand over the Running Shoes — hold B to run.",
          "Head north through Route 101 to Oldale Town.",
        ],
        tips: [
          "Now that you have Poké Balls, catch a second Pokémon on Route 101 (Poochyena, Zigzagoon, or Wurmple) so you aren't relying on a single partner.",
        ],
        secrets: [
          "Zigzagoon learns Pickup and can find held items after battles — and it's the key to Rock Smash and Cut later. A great second team member to grab now.",
        ],
        tags: ["pokedex", "running-shoes", "route-101"],
      },
    ],
  },
  {
    id: "oldale",
    title: "Ch. 3 — Oldale Town",
    description: "Your first town with a Poké Mart and Pokémon Center.",
    steps: [
      {
        id: "oldale-1",
        title: "First stop in Oldale Town",
        location: "Oldale Town",
        summary: "A Poké Mart clerk gives a tutorial and a few free Potions.",
        story: [
          "Oldale Town is the first proper stop on your journey, and though it's small, it teaches you two habits that will keep your team alive for the next hundred hours. The Pokémon Center — the building with the red roof — heals your entire party back to full, completely free, as many times as you like. Make a mental note of where it sits; you'll be jogging back to one after nearly every tough fight.",
          "Next door, the blue-roofed Poké Mart runs a quick shopping tutorial and sends you off with a few free Potions for your trouble. It's worth buying a handful more Poké Balls here too, since Route 102 to the west is crawling with catchable Pokémon. A researcher lingering at the north edge of town blocks the path onto Route 103 until you've spoken with them — a gentle nudge toward your next objective.",
        ],
        details: [
          "Heal for free at the Pokémon Center any time your team is worn down.",
          "A Poké Mart employee runs a short shopping tutorial and hands you Potions.",
          "A researcher blocks Route 103 to the north until you visit — talk to move on.",
        ],
        secrets: [
          "There's a hidden Potion tucked in the sandy patch on the west side of town — you can sniff it out later once you have the Itemfinder.",
        ],
        tags: ["town", "oldale"],
      },
      {
        id: "oldale-2",
        title: "Choose your path",
        location: "Oldale Town",
        summary: "Route 103 lies north; Route 102 (toward Petalburg) lies west.",
        story: [
          "Oldale sits at a crossroads. Route 103 climbs north to a quiet stretch of shoreline, while Route 102 runs west toward Petalburg City and your father's Gym. The story wants you north first: your rival has wandered up Route 103 to study the local Pokémon, and they're itching to see how your new partner measures up.",
          "Head up and settle that score, then double back through Oldale and strike out west along Route 102. There's no wrong order to explore in, but tackling the rival while your levels are fresh keeps things smooth — and gives you an excuse to thin out the grass and pad your Pokédex along the way.",
        ],
        details: [
          "Head north up Route 103 first — your rival is training there.",
          "After the rival battle you'll come back and take Route 102 west.",
          "Grab the hidden items around town with the Itemfinder later if 100% hunting.",
        ],
        tags: ["town", "oldale"],
      },
    ],
  },
  {
    id: "route-103",
    title: "Ch. 4 — Route 103",
    description: "Your first battle against your rival.",
    steps: [
      {
        id: "route-103-1",
        title: "Find your rival",
        location: "Route 103",
        summary: "Brendan/May is studying Pokémon at the north end of the route.",
        story: [
          "Route 103 is a short spur of grass and shoreline north of Oldale, and your rival has already beaten you to it — you'll find them studying Pokémon by the water at the far end. Use the walk up to thin the grass, add Wingull and Zigzagoon to your fresh Pokédex, and squeeze a level or two out of your starter before the reunion.",
        ],
        details: [
          "Walk north through the grass; wild Poochyena, Wingull, and Zigzagoon appear.",
          "Your rival is standing near the water at the top of the route.",
        ],
        tags: ["rival", "route-103"],
      },
      {
        id: "route-103-2",
        title: "Rival Battle #1",
        location: "Route 103",
        summary: "Battle your rival's starter — the one strong against yours.",
        story: [
          "Your rival leads with the starter that beats yours — Torchic if you chose Treecko, Mudkip if you chose Torchic, Treecko if you chose Mudkip — but at level 5 it's nothing a couple of clean hits won't settle. Lead with your own partner, lean on your strongest damaging move, and slot in a Potion only if things get hairy. Beaten, your rival shrugs it off and hurries back to the lab, leaving the road west wide open.",
        ],
        details: [
          "The rival uses the starter with a type advantage over yours (level 5).",
          "Lead with your starter and use your strongest damaging move; potions if needed.",
          "Win and the rival heads back to the lab.",
        ],
        tips: ["If you're struggling, catch a Poochyena/Wurmple on Route 101 and level to 6–7 first."],
        tags: ["rival", "battle", "route-103"],
      },
      {
        id: "route-103-3",
        title: "Report back to Birch",
        location: "Littleroot Town → Oldale",
        summary: "Return to the lab, then head west out of Oldale onto Route 102.",
        story: [
          "With the rival dealt with, nothing keeps you on Route 103. Dropping by Birch's lab is optional now — no new gifts are waiting — so cut back through Oldale and strike west onto Route 102, the long grassy road that winds toward Petalburg City and, eventually, your father's Gym.",
        ],
        details: [
          "The rival returns to the lab ahead of you; visiting is optional now.",
          "From Oldale, take Route 102 west toward Petalburg City.",
        ],
        tags: ["story", "route-103"],
      },
    ],
  },
  {
    id: "route-102",
    title: "Ch. 5 — Route 102",
    description: "Trainers, berries, and a rare Ralts on the way to Petalburg.",
    steps: [
      {
        id: "route-102-1",
        title: "Battle west toward Petalburg",
        location: "Route 102",
        summary: "Your first trainer battles line the route to Petalburg City.",
        story: [
          "Route 102 is where the training wheels come off. Youngsters and Bug Catchers dot the grass between here and Petalburg, and each one is easy money and steady experience for a young team — exactly what you need before the road gets serious. Beating a trainer is worth far more than any wild battle, so don't dodge them.",
          "Keep an eye on the dark, tilled soil along the way: berries are already growing there for the picking, and the empty plots are yours to plant in once you get a Wailmer Pail on Route 104. A little berry farming now pays off in free healing for the rest of the adventure.",
        ],
        details: [
          "Beat Youngster and Bug Catcher trainers for early cash and experience.",
          "Pick the berries growing in the soft soil and note the empty plots for planting.",
        ],
        secrets: [
          "The soft-soil patches here are free berry farms — plant Oran or Pecha berries and you'll never run short of cheap healing.",
        ],
        tags: ["route", "trainers", "route-102"],
      },
      {
        id: "route-102-2",
        title: "Catch a Ralts (rare)",
        location: "Route 102",
        summary: "Ralts appears at just 4% — it becomes Gardevoir, a top-tier special attacker.",
        story: [
          "If you have the patience for it, Route 102 hides one of the best long-term investments in the whole game: Ralts, a tiny Psychic/Fairy-type that appears in only 4% of grass encounters. It looks feeble now, but it grows into Kirlia and then Gardevoir — a graceful, hard-hitting special attacker that will still be pulling its weight against the Elite Four.",
          "Ralts is stubbornly rare, so bring plenty of Poké Balls and settle in for a hunt; a Surskit or two will keep you company in the morning grass while you search. It's entirely optional, but a trainer who lands a good-natured Ralts here rarely regrets the time spent.",
        ],
        details: [
          "Ralts is a rare 4% grass spawn — be patient or use Repels on a set-level lead.",
          "Ralts → Kirlia (lv 20) → Gardevoir (lv 30). In Emerald, males can become Gallade only in later gens, so expect Gardevoir here.",
          "Surskit also appears in the morning/day and evolves into Masquerain.",
        ],
        tips: ["Save before hunting; a Ralts with a good nature carries the mid-game."],
        secrets: [
          "Gardevoir learns Psychic and eventually Calm Mind — a Ralts caught here can carry your team all the way to the Champion.",
        ],
        tags: ["ralts", "rare", "route-102"],
      },
      {
        id: "route-102-3",
        title: "Enter Petalburg City",
        location: "Route 102 → Petalburg City",
        summary: "Continue west into Petalburg, home of your father's gym.",
        story: [
          "Past the last patch of grass, Route 102 opens onto Petalburg City — a tidy riverside town built around the Gym your father runs. Heal up and top off your supplies at the route's end, then walk in. You've had a Pokémon of your own for all of a day; it's time Dad saw what you can do.",
        ],
        details: ["Head into Petalburg City once you've explored the route and healed up."],
        tags: ["route", "route-102"],
      },
    ],
  },
  {
    id: "petalburg",
    title: "Ch. 6 — Petalburg City",
    description: "Meet your father Norman and help Wally catch his first Pokémon.",
    steps: [
      {
        id: "petalburg-1",
        title: "Meet your father, Norman",
        location: "Petalburg City Gym",
        summary: "Norman is the Petalburg Gym Leader, but he won't battle you yet.",
        story: [
          "Your father, Norman, is every bit the composed Gym Leader inside the Petalburg Gym — and he's not about to go easy on his own child. He tells you plainly that he won't accept your challenge until you've earned four badges, since his is the fifth Gym on the circuit. It's a gentle way of pointing you out into the wider world to prove yourself first.",
          "The moment is interrupted by Wally, a shy, sickly boy who has worked up the courage to catch his very first Pokémon and wants Norman's help. Norman turns to you instead, and just like that you're the one showing someone else the ropes.",
        ],
        details: [
          "Enter the gym to meet your father, Norman.",
          "He explains you must earn four badges before he'll face you (he's the 5th gym).",
          "A frail boy named Wally arrives wanting to catch his first Pokémon.",
        ],
        tags: ["norman", "story", "petalburg"],
      },
      {
        id: "petalburg-2",
        title: "Wally's catching tutorial",
        location: "Petalburg City → Route 102",
        summary: "Lend Wally a Pokémon and watch him catch a Ralts on Route 102.",
        story: [
          "Norman lends Wally a Zigzagoon and a single Poké Ball, and asks you to tag along in case anything goes wrong. Out on Route 102 you watch the nervous boy weaken and catch a wild Ralts of his own — a small triumph that means the world to him. He heads off to live with relatives in Verdanturf Town, his new partner in tow, and you'll cross paths with him again more than once down the road.",
          "Back in the Gym, Norman points you toward your first real objective: the Rustboro City Gym to the northwest, where Leader Roxanne awaits. Your journey finally has a heading.",
        ],
        details: [
          "Norman lends Wally a Zigzagoon and a Poké Ball; you follow along.",
          "Wally catches a Ralts and takes it home to Verdanturf Town.",
          "Afterward, Norman suggests you challenge Roxanne in Rustboro City first.",
        ],
        tags: ["wally", "tutorial", "petalburg"],
      },
      {
        id: "petalburg-3",
        title: "Prepare for the road ahead",
        location: "Petalburg City",
        summary: "Stock up, then head west to Route 104 and Petalburg Woods.",
        story: [
          "Petalburg is the last town before a long, unbroken stretch of coast, forest, and city, so treat its Poké Mart as a supply run: load up on Poké Balls and Potions before you leave. Make a mental note of the house on the west side, too — much later, once you've beaten Norman for your fifth badge, its owner hands over HM03 Surf.",
          "With your bag full, head west onto Route 104, where sea breeze and flower fields lead into the shady tangle of Petalburg Woods.",
        ],
        details: [
          "Buy Poké Balls and Potions before leaving — you're heading into a long stretch.",
          "Note the house that later gives HM03 Surf (after you beat Norman).",
          "Exit west onto Route 104.",
        ],
        secrets: [
          "The Surf HM comes from a Petalburg house, but only after you defeat Norman — remember this town for a return trip.",
        ],
        tags: ["shopping", "petalburg"],
      },
    ],
  },
  {
    id: "route-104",
    title: "Ch. 7 — Route 104",
    description: "The coastal route with Mr. Briney and the flower shop.",
    steps: [
      {
        id: "route-104-1",
        title: "Meet Mr. Briney",
        location: "Route 104 (south)",
        summary: "A retired sailor lives in the cottage on the beach with his Wingull, Peeko.",
        story: [
          "Route 104 begins on a sunny beach, and the weathered cottage on the sand belongs to Mr. Briney — a retired sailor who lives with his beloved Wingull, Peeko. He's friendly enough, though he has no reason to help you yet; remember him, because before long his little boat becomes your ticket across the sea to Dewford.",
          "The beach grass is worth a sweep, too. Taillow flit about by day and Wingull ride the coast — both are handy early Flying-types, and the deeper water hides Marill for whenever you finally learn Surf.",
        ],
        details: [
          "Mr. Briney's cottage sits on the south beach; he'll ferry you by sea later.",
          "Catch Taillow (day) and Wingull here — both are useful early fliers.",
          "The southern water needs Surf; Marill lives there for later HM duty.",
        ],
        tags: ["briney", "route-104"],
      },
      {
        id: "route-104-2",
        title: "Pretty Petal Flower Shop",
        location: "Route 104 (north)",
        summary: "Buy berries and receive a Wailmer Pail to grow them.",
        story: [
          "The northern half of Route 104 blooms with the Pretty Petal flower shop, run by a trio of green-thumbed sisters. Chat with them and one hands you the Wailmer Pail — the watering can that turns every soft-soil patch in Hoenn into a personal berry farm. They'll also sell you berries and décor for your secret base.",
          "It's worth stopping to plant a few Oran and Pecha berries in the plots nearby. They cost nothing, they water for free, and by the time you loop back this way you'll have a tidy stock of healing and status-curing snacks.",
        ],
        details: [
          "The flower shop near the Petalburg Woods exit sells berries and décor.",
          "You receive the Wailmer Pail to water planted berries.",
          "Plant Oran/Pecha berries in soft soil for free healing supplies.",
        ],
        secrets: [
          "The flower-shop sisters will sell you berries and, if you keep visiting, decorative plants for your secret base later on.",
        ],
        tags: ["berries", "route-104"],
      },
      {
        id: "route-104-3",
        title: "Grab route items & enter the Woods",
        location: "Route 104",
        summary: "Collect Potions and a Poké Ball, then head into Petalburg Woods.",
        story: [
          "Before you plunge into the trees, comb the route for freebies: a Potion and a Poké Ball sit in plain sight, and there's a hidden Antidote in the sand for the curious. A few of the small trees here won't budge until you have Cut and the Stone Badge, so make a note to swing back once Roxanne is beaten.",
          "When you've picked the route clean, step into Petalburg Woods at its northern edge — a cool, shaded maze that hides both useful Pokémon and your first brush with a shadowy team of grunts.",
        ],
        details: [
          "Sweep the beach and grass for items (Potion, Poké Ball, and a hidden Antidote).",
          "Some trees require Cut (return after the Stone Badge) for extra items.",
          "Enter Petalburg Woods from the north end of the route.",
        ],
        secrets: [
          "Cut-only trees on Route 104 hide extra items — come back after earning the Stone Badge in Rustboro.",
        ],
        tags: ["items", "route-104"],
      },
    ],
  },
  {
    id: "petalburg-woods",
    title: "Ch. 8 — Petalburg Woods",
    description: "A forest maze, your first Team Aqua encounter, and Shroomish.",
    steps: [
      {
        id: "petalburg-woods-1",
        title: "Into the forest",
        location: "Petalburg Woods",
        summary: "A shaded maze connecting the two halves of Route 104.",
        story: [
          "Petalburg Woods is the first place your adventure feels genuinely wild — a green, dim maze of trees, Bug Catchers, and rustling grass linking the two halves of Route 104. Take your time weaving through it; the trainers are gentle and the wild Pokémon here are unusually valuable.",
          "Two catches stand out. Shroomish (a 10% spawn) evolves into Breloom and eventually learns Spore, the most reliable sleep move in the entire game — worth its weight in gold for catching rare Pokémon down the line. Slakoth also lurks here, and though it's lazy now, it becomes Slaking, one of Hoenn's hardest-hitting attackers.",
        ],
        details: [
          "Battle Bug Catchers among the trees.",
          "Catch Shroomish (10%) — it learns Spore, the best sleep move in the game, and evolves into Breloom.",
          "Slakoth also appears here — it evolves into the powerful Slaking.",
        ],
        tips: ["A Breloom with Spore makes catching legendaries and rare Pokémon far easier later."],
        secrets: [
          "Grab a Shroomish now: Breloom's Spore puts anything to sleep with 100% accuracy, turning every future legendary hunt into a formality.",
        ],
        tags: ["shroomish", "petalburg-woods"],
      },
      {
        id: "petalburg-woods-2",
        title: "The Devon researcher & Team Aqua",
        location: "Petalburg Woods",
        summary: "A Team Aqua Grunt corners a Devon Corporation researcher — step in.",
        story: [
          "Deep in the woods you stumble onto trouble: a jittery Devon Corporation researcher backed against the trees by a Team Aqua Grunt, who's demanding the \"Devon Goods\" the man is carrying. It's your first real look at one of Hoenn's villainous teams — sea-obsessed pirates in striped bandanas — and the researcher clearly can't fight his own way out.",
          "Step in and the Grunt turns on you instead, throwing out a Poochyena or Zubat that your team should handle without much fuss. Sent packing, he flees, and the grateful researcher presses a Great Ball into your hands before hurrying home to Rustboro. You've just been drawn into a story far bigger than a gym circuit.",
        ],
        details: [
          "A Devon researcher is ambushed by a Team Aqua Grunt after his Devon Goods.",
          "Battle the Grunt (uses a Poochyena/Zubat) to drive him off.",
          "The grateful researcher gives you a Great Ball and heads to Rustboro.",
        ],
        tags: ["team-aqua", "story", "petalburg-woods"],
      },
      {
        id: "petalburg-woods-3",
        title: "Hidden items & exit north",
        location: "Petalburg Woods",
        summary: "Sweep the woods for hidden items, then continue to Route 104 north.",
        story: [
          "With the Grunt gone, take a moment to loot the woods properly — a hidden Paralyze Heal and a Potion or two are tucked among the roots for trainers who check. A stand of Cut-trees on the east side guards a Miracle Seed and another Great Ball, but those wait until you have the Stone Badge, so don't fret over them yet.",
          "Exit north back onto Route 104's second half and follow it up to the gates of Rustboro City, where your first Gym badge — and a much larger mystery — are waiting.",
        ],
        details: [
          "Hidden Paralyze Heal and Potions are tucked among the trees.",
          "Return later with Cut to reach the eastern items (Miracle Seed, Great Ball).",
          "Exit north back onto Route 104, then continue to Rustboro City.",
        ],
        secrets: [
          "A Miracle Seed (boosts Grass moves) hides behind the woods' Cut-trees — a great held item for a Grass starter once you can reach it.",
        ],
        tags: ["items", "petalburg-woods"],
      },
    ],
  },
  {
    id: "rustboro",
    title: "Ch. 9 — Rustboro City",
    description: "HM01 Cut, the Devon Corporation, and Gym Leader Roxanne.",
    steps: [
      {
        id: "rustboro-1",
        title: "Get HM01 Cut",
        location: "Rustboro City — Cutter's House",
        summary: "The Cutter in the house west of the Pokémon Center gives you HM01 Cut.",
        story: [
          "Rustboro is Hoenn's industrial heart — all brick, bustle, and the towering Devon Corporation — but your first stop should be the modest house just west of the Pokémon Center. The Cutter inside hands you HM01 Cut, the field move that clears those pesky little trees (once you've earned the Stone Badge to back it up).",
          "While you're wandering, poke your head into the Trainer's School in the northeast; the teacher there rewards curious students with a Quick Claw, a tidy held item that occasionally lets a slower Pokémon strike first.",
        ],
        details: [
          "Enter the house directly west of the Pokémon Center and talk to the man.",
          "He gives you HM01 Cut, which clears small trees once you have the Stone Badge.",
          "The Trainer's School (northeast) gives a Quick Claw from the teacher.",
        ],
        tips: ["Teach Cut to a spare 'HM slave' rather than your main attackers."],
        secrets: [
          "The Trainer's School hands out a free Quick Claw — and its blackboard notes are a genuinely useful refresher on status conditions.",
        ],
        tags: ["hm", "cut", "rustboro"],
      },
      {
        id: "rustboro-2",
        title: "Gym 1 — Roxanne (Stone Badge)",
        location: "Rustboro City Gym",
        summary: "Roxanne specializes in Rock-types — bring Water, Grass, or Fighting moves.",
        story: [
          "Roxanne is a star pupil turned Gym Leader, and she teaches her Rock-types with textbook precision. Her Geodude pair softens you up before Nosepass anchors the fight, chipping away with Rock Tomb (which drops your Speed) and stalling with Block so you can't switch out. Play into her weaknesses and none of it matters.",
          "This is exactly the fight Mudkip and Treecko were made for — a single Water Gun or Absorb often one-shots her whole team, and any Fighting move does the same. Win and Roxanne awards the Stone Badge along with TM39 Rock Tomb; better yet, Cut now works out in the field, opening all those trees you passed.",
        ],
        details: [
          "Roxanne's team: Geodude, Geodude, and Nosepass (lv 12–15).",
          "Nosepass knows Rock Tomb (lowers Speed) and Block — hit it hard and fast.",
          "Marshtomp, Grovyle, or a Fighting-type make this gym trivial.",
          "Win to earn the Stone Badge and TM39 Rock Tomb; Cut now works in the field.",
        ],
        tips: ["The Stone Badge boosts Attack and lets you use Cut outside battle."],
        tags: ["gym", "badge-1", "roxanne", "rustboro"],
      },
      {
        id: "rustboro-3",
        title: "Rival Battle #2 & the stolen Devon Goods",
        location: "Rustboro City",
        summary: "Battle your rival, then chase the Team Aqua thief who robs Devon Corp.",
        story: [
          "Fresh off your first badge, your rival catches you near the Pokémon School for a friendly rematch — a quick measure of how far you've both come. They've grown stronger, but so have you, and the battle is more reunion than rivalry.",
          "The celebration is short-lived. As you make your way out of town, a Team Aqua Grunt bolts from the Devon Corporation building, having stolen the very Devon Goods you helped protect in the woods, and sprints east. The panicked researcher takes off after him toward Route 116, and there's really only one thing to do: give chase.",
        ],
        details: [
          "Your rival battles you near the Pokémon School for a friendly rematch.",
          "As you leave, a Team Aqua Grunt steals the Devon Goods and flees east.",
          "The panicked Devon researcher runs toward Route 116 — follow him.",
        ],
        tags: ["rival", "team-aqua", "story", "rustboro"],
      },
    ],
  },
  {
    id: "route-116",
    title: "Ch. 10 — Route 116",
    description: "Chase the thief east toward Rusturf Tunnel.",
    steps: [
      {
        id: "route-116-1",
        title: "Chase toward Rusturf Tunnel",
        location: "Route 116",
        summary: "The Devon researcher asks you to recover the stolen goods.",
        story: [
          "Route 116 runs east from Rustboro toward the mouth of Rusturf Tunnel, and the frantic Devon researcher is waiting near the city gate. He recognizes you from the woods and begs you to run down the thief and recover the stolen goods — the tunnel ahead is where the Grunt is headed. Trainers line the road, so battle your way through and let the experience pile up.",
          "The grass here is a collector's delight. Whismur, Nincada, and the sweet-natured Skitty all roam it, but the prize is a rare Abra — a 4% spawn that grows into the devastating Alakazam if you can pin it down before it Teleports away.",
        ],
        details: [
          "Near the city exit the researcher recognizes you from Petalburg Woods and asks for help.",
          "Battle the trainers lining the route as you head east.",
          "Catch Whismur, Nincada, Skitty, and the rare Abra (4%) in the grass.",
        ],
        tips: ["Abra teleports on turn one — a Fast Ball or Mean Look/Spore helps you catch it."],
        secrets: [
          "Nincada evolves into Ninjask at level 20 — and if you have a spare Poké Ball and party slot, the evolution also drops a free Shedinja, a Pokémon with the unique Wonder Guard ability.",
        ],
        tags: ["route", "abra", "route-116"],
      },
      {
        id: "route-116-2",
        title: "Route items",
        location: "Route 116",
        summary: "Grab an HP Up and other items before entering the tunnel.",
        story: [
          "Before you duck into the tunnel, sweep the eastern end of the route — there's a hidden HP Up nestled near the entrance, a permanent boost to one Pokémon's max HP that's well worth the search. A kindly old man nearby rounds out your supplies with a handout as well.",
          "With your pockets a little heavier, step into Rusturf Tunnel, where the thief has run out of road.",
        ],
        details: [
          "A hidden HP Up sits near the tunnel entrance.",
          "An old man (Mr. Briney's friend) hands out a Repel/Great Ball nearby.",
          "Enter Rusturf Tunnel at the east end.",
        ],
        secrets: [
          "There's a hidden HP Up near the tunnel mouth — a free, permanent HP boost most players walk right past.",
        ],
        tags: ["items", "route-116"],
      },
    ],
  },
  {
    id: "rusturf-tunnel",
    title: "Ch. 11 — Rusturf Tunnel",
    description: "Catch the thief, rescue Peeko, and earn the Devon reward.",
    steps: [
      {
        id: "rusturf-tunnel-1",
        title: "Corner the Team Aqua Grunt",
        location: "Rusturf Tunnel",
        summary: "The thief is trapped at a dead end with Mr. Briney's Wingull, Peeko.",
        story: [
          "Rusturf Tunnel is only half-dug — a wall of rubble seals its western end — and the fleeing Grunt has run himself straight into that dead end. Worse for him, he's picked up a hostage: Peeko, Mr. Briney's cherished Wingull, snatched along with the Devon Goods. Cornered, he has no choice but to fight.",
          "He's no tougher than the last Aqua you faced, so put him down, free Peeko, and reclaim the goods. A tearful Mr. Briney arrives to collect his partner, and suddenly you have a sailor who owes you a very large favour.",
        ],
        details: [
          "Battle the Team Aqua Grunt at the tunnel's blocked west end.",
          "He has stolen both the Devon Goods and Peeko, Mr. Briney's Wingull.",
          "Defeat him to recover Peeko and the goods.",
        ],
        tags: ["team-aqua", "peeko", "rusturf-tunnel"],
      },
      {
        id: "rusturf-tunnel-2",
        title: "Return the goods to Devon",
        location: "Rustboro City — Devon Corporation",
        summary: "Mr. Stone rewards you and asks you to deliver a Letter and Parcel.",
        story: [
          "Carry the recovered goods back to the Devon Corporation and you're ushered right up to President Mr. Stone himself. Delighted, he thanks you with the PokéNav — the all-in-one map, radio, and trainer directory that becomes your constant companion — and then, as busy men do, immediately asks two favours: deliver a Letter to a young man named Steven in Dewford Town, and take a Parcel to Captain Stern in Slateport City.",
          "Both destinations lie across the sea, which is where your new friend Mr. Briney comes in. Head back to his cottage on Route 104 and he'll happily ferry you to Dewford aboard his little boat. The tunnel itself stays blocked for now; you'll return with Rock Smash later to clear it and claim HM04 Strength.",
        ],
        details: [
          "Return the Devon Goods to Devon Corp; President Mr. Stone thanks you.",
          "He gives you the PokéNav and asks you to deliver a Letter to Steven in Dewford.",
          "He also asks you to take a Parcel to Captain Stern in Slateport.",
          "Mr. Briney offers to sail you to Dewford Town from his Route 104 cottage.",
        ],
        tips: ["The Rusturf Tunnel is fully cleared later with Rock Smash for HM04 Strength."],
        tags: ["devon", "pokenav", "story", "rusturf-tunnel"],
      },
    ],
  },
  {
    id: "dewford",
    title: "Ch. 12 — Dewford Town",
    description: "Sail with Mr. Briney and take on Gym Leader Brawly.",
    steps: [
      {
        id: "dewford-1",
        title: "Sail to Dewford",
        location: "Route 104 → Dewford Town",
        summary: "Mr. Briney ferries you across the sea to the island town of Dewford.",
        story: [
          "Peeko safely home, Mr. Briney makes good on his promise and rows you out across the waves to Dewford Town — a breezy little island known for two things: a Fighting-type Gym and the dark, sprawling Granite Cave next door. It's your first taste of Hoenn's endless ocean, and it won't be your last.",
          "Dewford also runs on gossip. Chat with the townsfolk and you'll pick up the island's obsession with what's \"hip and happening\" — a running errand that has you carrying trendy news between Dewford and Steven, netting a few rewards along the way.",
        ],
        details: [
          "Talk to Mr. Briney at his cottage and ask to sail to Dewford.",
          "Dewford is a small island known for its gym and Granite Cave.",
          "Chat with the townsfolk to start the 'hip and happening' trend spread with Steven.",
        ],
        secrets: [
          "Spreading the \"hip and happening\" trend between Dewford and Slateport's fan club eventually earns you a Silk Scarf — a held item that boosts Normal-type moves.",
        ],
        tags: ["briney", "dewford"],
      },
      {
        id: "dewford-2",
        title: "Gym 2 — Brawly (Knuckle Badge)",
        location: "Dewford Town Gym",
        summary: "Brawly uses Fighting-types in a dark, maze-like gym.",
        story: [
          "Brawly's Gym is pitch black — a cave-like maze where each trainer you defeat lights a little more of the path forward. You can bring Flash to see the whole floor at once, but it isn't required; just follow the pools of light from fight to fight until you reach the big, laid-back leader at the far end.",
          "Brawly leans on a Machop and a Makuhita that likes to Bulk Up before hammering you with Vital Throw. Flying and Psychic types laugh it off, so a Taillow or that Ralts from Route 102 makes short work of him. Victory earns the Knuckle Badge and TM08 Bulk Up.",
        ],
        details: [
          "The gym is dark — beat trainers to light the path (Flash helps but isn't required).",
          "Brawly's team: Machop and Makuhita (lv 16–18); Makuhita knows Bulk Up + Vital Throw.",
          "Flying and Psychic types (Taillow, Ralts) dominate here.",
          "Win for the Knuckle Badge and TM08 Bulk Up.",
        ],
        tags: ["gym", "badge-2", "brawly", "dewford"],
      },
      {
        id: "dewford-3",
        title: "Head to Granite Cave",
        location: "Dewford Town",
        summary: "Steven is exploring Granite Cave — deliver Mr. Stone's Letter there.",
        story: [
          "One errand down, one to go. The Steven you're meant to deliver Mr. Stone's Letter to is exploring Granite Cave, the great rocky mouth just west of Dewford's beach. Heal up, restock, and head over — the cave is dim and rambling, so you'll want Flash before long.",
        ],
        details: [
          "Granite Cave is just west of Dewford's beach.",
          "Bring the Letter from Devon Corp to give to Steven inside.",
        ],
        tags: ["story", "dewford"],
      },
    ],
  },
  {
    id: "granite-cave",
    title: "Ch. 13 — Granite Cave",
    description: "Deliver the Letter to Steven and pick up HM05 Flash.",
    steps: [
      {
        id: "granite-cave-1",
        title: "Deliver the Letter to Steven",
        location: "Granite Cave — B1F",
        summary: "Find Steven Stone deep in the cave and hand over Mr. Stone's Letter.",
        story: [
          "You find Steven a floor down, a quiet, well-dressed young man crouched over the rocks with the eye of a serious collector. He takes Mr. Stone's Letter graciously — the two are closer than he lets on — and thanks you with TM47 Steel Wing, a solid Steel-type move that hints at where his own interests lie.",
          "There's more to Steven than a courier drop, but he keeps his cards close for now and encourages you to keep growing as a trainer. You'll meet this understated stranger again at some very important moments.",
        ],
        details: [
          "Steven is on the first basement floor; give him the Letter.",
          "He gives you TM47 Steel Wing as thanks.",
        ],
        tags: ["steven", "story", "granite-cave"],
      },
      {
        id: "granite-cave-2",
        title: "Get HM05 Flash & catch Aron",
        location: "Granite Cave",
        summary: "A Hiker gives HM05 Flash; Rock Smash rocks hide Aron and Geodude.",
        story: [
          "A friendly Hiker near the entrance hands you HM05 Flash, which finally banishes the darkness in caves like this one — teach it to a spare Pokémon and the whole cavern lights up. From there, Granite Cave is a genuine treasure trove for team-building.",
          "Makuhita and Abra wander the floors, and smashing the cracked rocks with Rock Smash (later) turns up Aron — a pint-sized Steel/Rock tank that becomes the fortress-like Aggron. The deepest floors even hide Mawile and Sableye, two of Emerald's quirkiest rares. It's easy to lose an hour down here, and worth every minute.",
        ],
        details: [
          "A Hiker on the first floor gives you HM05 Flash to light dark caves.",
          "Catch Makuhita, Abra, and (via Rock Smash) Aron — Aron becomes the tanky Aggron.",
          "Mawile and Sableye appear on the lower floors (version-flavored rares).",
        ],
        tips: ["Aron's line resists many types and is a great HM 'Rock Smash/Strength' carrier too."],
        secrets: [
          "Emerald is the only Hoenn game where both Mawile and Sableye appear on Granite Cave's lower floors — grab the pair while you're here.",
        ],
        tags: ["hm", "flash", "aron", "granite-cave"],
      },
      {
        id: "granite-cave-3",
        title: "Sail on to Slateport",
        location: "Dewford → Route 109 → Slateport",
        summary: "Return to Mr. Briney and ask to sail to Slateport City.",
        story: [
          "With the Letter delivered and your team a little richer, it's time for the second half of Mr. Stone's errand. Head back to Mr. Briney and this time ask to sail for Slateport City. He drops you on the sunlit sands of Route 109, a short stroll south of the market town — and the Devon Parcel still waiting to change hands.",
        ],
        details: [
          "Head back to Mr. Briney and choose Slateport as your next destination.",
          "You land on Route 109's beach just south of Slateport City.",
        ],
        tags: ["briney", "granite-cave"],
      },
    ],
  },
  {
    id: "slateport",
    title: "Ch. 14 — Slateport City",
    description: "The market city, the Oceanic Museum, and Team Aqua.",
    steps: [
      {
        id: "slateport-1",
        title: "Explore the market & beach",
        location: "Route 109 → Slateport City",
        summary: "Slateport hosts a busy open-air market, the Name Rater, and Energy Guru.",
        story: [
          "Slateport is the loudest, liveliest place you've seen yet — a seaside city built around a sprawling open-air market where stalls hawk everything from berry drinks to stat-boosting vitamins. The Energy Guru's stand is the big draw: expensive, but those Proteins and Carbos permanently pump up a favourite Pokémon's stats.",
          "Wander the boardwalk and you'll also find the Name Rater, who'll happily rechristen one of your team, plus the Contest Hall and the busy Harbor to the south. It's a city that rewards nosiness, so poke into every shop before you get down to business.",
        ],
        details: [
          "The market sells vitamins (Energy Guru), Dome/Helix restoration is elsewhere.",
          "The Name Rater can rename one of your Pokémon.",
          "Contest Hall and the Harbor sit on the south side.",
        ],
        secrets: [
          "A boy in the Slateport market gives out a free TM (Frustration/Return-tier flavour) — and the fan club president rewards trend-spreaders with the Silk Scarf.",
        ],
        tags: ["market", "slateport"],
      },
      {
        id: "slateport-2",
        title: "Deliver the Parcel to Captain Stern",
        location: "Slateport — Oceanic Museum",
        summary: "Team Aqua occupies the museum trying to reach Captain Stern.",
        story: [
          "Captain Stern is at the Oceanic Museum, so you pay the token ₽50 and head in — straight into a Team Aqua operation. Grunts have overrun the second floor, all trying to muscle their way to Stern and whatever the Devon Parcel contains. Battle through them one by one; they're a step up from the tunnel Grunt but nothing your growing team can't manage.",
          "At the top you finally meet the man himself: Archie, Team Aqua's charismatic leader, who sizes you up, warns you to stay out of his way, and melts back into the crowd. With the coast clear you hand the Parcel to Captain Stern — and get your first real sense that Aqua's ambitions run far deeper than petty theft.",
        ],
        details: [
          "Head to the Oceanic Museum; entry costs 50 coins... er, ₽50.",
          "Team Aqua Grunts block the second floor — battle through them.",
          "Aqua Admin Archie appears, warns you off, and retreats.",
          "Give the Devon Parcel to Captain Stern.",
        ],
        tags: ["team-aqua", "story", "slateport"],
      },
      {
        id: "slateport-3",
        title: "Head north on Route 110",
        location: "Slateport City → Route 110",
        summary: "Leave Slateport north toward Mauville, passing the Trick House.",
        story: [
          "Errands finished, your own journey pulls you north again. Grab any last supplies from the market — though Mauville, the next Gym town, is well-stocked too — and head out onto Route 110, the long causeway that runs alongside the Seaside Cycling Road. A curious puzzle house and another meeting with your rival wait along the way.",
        ],
        details: [
          "Buy any last supplies — the next gym town has plenty too.",
          "Exit north onto Route 110 toward Mauville City.",
        ],
        tags: ["route", "slateport"],
      },
    ],
  },
  {
    id: "route-110",
    title: "Ch. 15 — Route 110",
    description: "The Trick House, Cycling Road, and another rival battle.",
    steps: [
      {
        id: "route-110-1",
        title: "The Trick House",
        location: "Route 110",
        summary: "Mr. Trick's hidden house holds a series of puzzle rooms with prizes.",
        story: [
          "Tucked beside Route 110 is one of Emerald's most charming diversions: the Trick House, home to the eccentric Trick Master, who builds elaborate puzzle rooms and then hides himself away, daring passing trainers to find him. His entrance is concealed somewhere near the house — a little hunting reveals it — and the first puzzle is open to you right now.",
          "The Trick House is a gift that keeps giving: every time you earn a new badge and pass back through, a fresh room unlocks with its own trainers, a hidden scroll to read, and a TM or item as your reward. Make a habit of revisiting it, and you'll quietly stockpile some of the game's best TMs.",
        ],
        details: [
          "Find the Trick Master's hidden entrance and solve puzzle #1 now.",
          "Return after each badge to unlock new puzzle rooms and TM/item rewards.",
          "Each room hides a scroll; reading it opens the exit.",
        ],
        secrets: [
          "Each Trick House room hands out a TM — over the game you can collect prizes like TM39 Rock Tomb, TM32 Double Team, and TM12 Taunt just for solving puzzles.",
        ],
        tags: ["trick-house", "route-110"],
      },
      {
        id: "route-110-2",
        title: "Cycling Road & wild Pokémon",
        location: "Route 110",
        summary: "Electric Pokémon and Duskull (night) roam the grass beneath Cycling Road.",
        story: [
          "The grass flanking the elevated Cycling Road crackles with new faces. Electrike sparks about (later a fast, fierce Manectric), gluttonous Gulpin waddle through the weeds, and the cheerful Minun turns up for Emerald players. Come back after dark and the eerie Duskull floats out — the start of a superb Ghost-type line.",
          "The Cycling Road overhead is a one-way rush toward Slateport for now; its ramps demand the Mach Bike you'll pick up in Mauville, so file it away as another reason to return once you're on two wheels.",
        ],
        details: [
          "Catch Electrike (→ Manectric), Gulpin, Oddish, Minun, and Duskull at night.",
          "Cycling Road's ramps need the Mach Bike (from Mauville) to climb.",
          "The Seaside Cycling Road connects down toward Slateport.",
        ],
        tags: ["route", "electrike", "route-110"],
      },
      {
        id: "route-110-3",
        title: "Rival Battle #3",
        location: "Route 110 (north)",
        summary: "Your rival battles you again near the Mauville entrance with a stronger team.",
        story: [
          "Near the northern end of the route, just short of Mauville, your rival is waiting again — and this time they've filled out a proper team, a starter backed by a second Pokémon in the high teens. It's a real test of everything you've built since Littleroot, so lead into their weakness and don't be shy with your items.",
          "Beat them and they'll cheer you on toward the Mauville Gym before dashing off. Push north into the bright, breezy city, where an Electric-type leader and a brand-new bike are waiting.",
        ],
        details: [
          "The rival now has a starter plus a second Pokémon around lv 18–20.",
          "Type coverage matters — lead into their weakness.",
          "Win and continue north into Mauville City.",
        ],
        tags: ["rival", "battle", "route-110"],
      },
    ],
  },
  {
    id: "mauville",
    title: "Ch. 16 — Mauville City",
    description: "Gym Leader Wattson, Rydel's bikes, and Rock Smash.",
    steps: [
      {
        id: "mauville-1",
        title: "Rydel's bikes & Rock Smash",
        location: "Mauville City",
        summary: "Choose the Mach or Acro Bike, and get HM06 Rock Smash from a local.",
        story: [
          "Mauville's big gift is mobility. Rydel of Rydel's Cycles is so glad to have a customer that he simply gives you a bike — your choice of the speedy Mach Bike, which tears across cracked floors and up ramps, or the nimble Acro Bike, which hops and balances along thin rails. You can swap between them any time, so pick whichever suits the road ahead (the Mach Bike unlocks Cycling Road and, much later, the Sky Pillar).",
          "A local in the southeast hands over HM06 Rock Smash, letting you shatter the cracked boulders blocking so many caves. And right on cue, Wally returns — healthier and eager — with his father, and challenges you to a spirited battle to show off how far his Ralts has come.",
        ],
        details: [
          "Rydel's Cycles lets you pick the Mach Bike (speed) or Acro Bike (hops) — swap any time.",
          "The man in the southeast house gives you HM06 Rock Smash.",
          "Wally and his father appear; Wally challenges you to a quick battle.",
        ],
        tips: ["Take the Mach Bike first for Cycling Road and later Sky Pillar."],
        secrets: [
          "You can return to Rydel any time to swap bikes for free — no need to agonize over the first pick.",
        ],
        tags: ["bikes", "hm", "rock-smash", "mauville"],
      },
      {
        id: "mauville-2",
        title: "Gym 3 — Wattson (Dynamo Badge)",
        location: "Mauville City Gym",
        summary: "Wattson uses Electric-types behind a switch-puzzle gym.",
        story: [
          "Wattson is a jolly, big-bellied old inventor, and his Gym is one big electrical puzzle — a floor of gates you open and close by hitting switches in the right order to carve a path to the leader. Take it slow; there's no penalty for experimenting, and the trainers you pass give good experience.",
          "His Magnemite, Voltorb, Magneton, and Manectric hit fast and hard, but they share a glaring blind spot: Ground moves. A Geodude, Marshtomp, or any Ground-type is flat-out immune to Electric and simply walks through the whole Gym. Win and Wattson roars with laughter as he awards the Dynamo Badge and TM34 Shock Wave.",
        ],
        details: [
          "Flip the gym's electric gates in sequence to reach Wattson.",
          "His team: Magnemite, Voltorb, Magneton, and Manectric (lv 20–24).",
          "Ground-types (Geodude, Marshtomp) are immune to Electric — they hard-counter him.",
          "Win for the Dynamo Badge and TM34 Shock Wave.",
        ],
        tags: ["gym", "badge-3", "wattson", "mauville"],
      },
      {
        id: "mauville-3",
        title: "New Mauville side-quest (optional)",
        location: "Mauville City",
        summary: "Wattson later asks you to fix the New Mauville generator for TM24 Thunderbolt.",
        story: [
          "Once you've beaten him, talk to Wattson again and he'll fret about New Mauville — an underground power plant off Route 110 whose generator has gone haywire. It's an optional errand, but a lucrative one: the facility hides TM24 Thunderbolt and a Thunderstone among its Voltorb and Magnemite.",
          "You can't reach it until you have Surf, so tuck this away for the mid-game. When you finally clear it out, you'll walk away with one of the best Electric TMs in the game and a stone to evolve Pikachu or Eelektross-tier catches.",
        ],
        details: [
          "After the badge, talk to Wattson again to start the New Mauville errand.",
          "New Mauville (reached by Surf on Route 110) hides TM24 Thunderbolt and a Thunderstone.",
          "You can return for this once you have Surf.",
        ],
        secrets: [
          "New Mauville also hides an Ultra Ball, Escape Ropes, and a Full Heal — a worthwhile detour once Surf is in hand.",
        ],
        tags: ["optional", "new-mauville", "mauville"],
      },
    ],
  },
  {
    id: "route-117",
    title: "Ch. 17 — Route 117 & Verdanturf",
    description: "A peaceful berry route leading to Wally's hometown.",
    steps: [
      {
        id: "route-117-1",
        title: "Route 117 berries & Daycare",
        location: "Route 117",
        summary: "The Pokémon Day Care and berry patches sit along this short western route.",
        story: [
          "Route 117 is a gentle, sun-dappled path west of Mauville, and its centrepiece is the Pokémon Day Care. Leave two compatible Pokémon with the elderly couple and they'll mind them, level them up slowly, and — if the pair get along — produce an Egg you can hatch into a fresh, breedable Pokémon. It's the gateway to serious team-building for anyone who catches the collecting bug.",
          "The route's flowery grass is worth combing too: Marill, Oddish, Roselia, and the fireflies Illumise and Volbeat all live here, with berry patches scattered between the trainers for a little farming on the side.",
        ],
        details: [
          "Leave the Day Care two compatible Pokémon to breed for eggs.",
          "Catch Marill, Oddish, Roselia, and Illumise/Volbeat here.",
        ],
        secrets: [
          "Breeding at the Day Care can pass down egg moves and pick your Pokémon's nature (with an Everstone) — the foundation of any competitive team.",
        ],
        tags: ["route", "daycare", "route-117"],
      },
      {
        id: "route-117-2",
        title: "Verdanturf Town & Rusturf Tunnel",
        location: "Verdanturf Town",
        summary: "Wally's family lives here; the west side of Rusturf Tunnel yields HM04 Strength.",
        story: [
          "Verdanturf is a clean-aired mountain town, and it's where Wally now lives with relatives. Drop in on him and his uncle, who thanks you warmly for the kindness you showed the boy back in Petalburg — a quiet reminder that your journey touches other lives.",
          "The town also sits at the west end of Rusturf Tunnel. Now that you have Rock Smash, you can shatter the rubble from this side to reunite a woman named Wanda with her sweetheart; in gratitude he gives you HM04 Strength, the move that shoves heavy boulders and unlocks the puzzles waiting in caves like Victory Road. The local Contest Hall, meanwhile, is a fine place to try your first Pokémon Contest.",
        ],
        details: [
          "Visit Wally and his family — his uncle thanks you for helping him.",
          "Use Rock Smash on the tunnel rocks to reunite Wanda and her boyfriend.",
          "He gives you HM04 Strength, which moves heavy boulders.",
          "The Contest Hall here hosts your first Pokémon Contests.",
        ],
        tips: ["Strength opens boulder puzzles in caves like Victory Road — keep it on an HM carrier."],
        tags: ["hm", "strength", "verdanturf", "route-117"],
      },
    ],
  },
  {
    id: "route-111",
    title: "Ch. 18 — Route 111",
    description: "The Winstrate family and the great Hoenn desert.",
    steps: [
      {
        id: "route-111-1",
        title: "The Winstrate family",
        location: "Route 111 (south)",
        summary: "Battle four Winstrate family members in a row for a Macho Brace.",
        story: [
          "The Winstrate family lives in a cheerful house on Route 111, and the whole clan wants a piece of you — father, mother, daughter, and grandmother, one after another with no chance to heal in between. It's a fun gauntlet more than a real threat, but bring a full team and a Potion or two just in case.",
          "Clear all four and the grandmother rewards your endurance with the Macho Brace, a held item that doubles the effort values a Pokémon earns from battle (at the cost of some Speed). For anyone training a serious powerhouse, it's an early, invaluable prize.",
        ],
        details: [
          "The Winstrate house challenges you to four consecutive battles.",
          "Win them all and the grandmother gives you the Macho Brace (boosts EV gain).",
        ],
        secrets: [
          "The Macho Brace doubles EV gain — hand it to a Pokémon you plan to raise seriously and it'll snowball ahead of the pack.",
        ],
        tags: ["route", "winstrate", "route-111"],
      },
      {
        id: "route-111-2",
        title: "The desert & Mirage Tower",
        location: "Route 111 (desert)",
        summary: "The sandstorm desert needs Go-Goggles; Mirage Tower holds fossils.",
        story: [
          "North of the Winstrates, Route 111 opens into a howling desert where a permanent sandstorm scours anyone who tries to cross — until you have the Go-Goggles, which you won't earn until Lavaridge. It's a wall for now, but a memorable one, and it hides some of Hoenn's most exotic Pokémon: the trapdoor Trapinch, prickly Cacnea, burrowing Sandshrew, and the ancient Baltoy.",
          "The desert's real treasure is the Mirage Tower, a crumbling spire that flickers in and out of view. Climb it and you'll face a fateful choice between the Root Fossil (which revives into Lileep) and the Claw Fossil (Anorith) — you can only take one, so choose the ancient Pokémon you'd rather have. Come back once the Go-Goggles are yours.",
        ],
        details: [
          "You need the Go-Goggles (from Lavaridge later) to walk the desert safely.",
          "Mirage Tower hides the Root Fossil (Lileep) and Claw Fossil (Anorith) — pick one.",
          "Trapinch, Cacnea, Sandshrew, and Baltoy live in the sand.",
        ],
        tips: ["Come back for the desert after Lavaridge gives you the Go-Goggles."],
        secrets: [
          "Mirage Tower crumbles after you grab one fossil — the other is lost for that save file, though you can dig up the alternate fossil at the Desert Underpass much later.",
          "The Desert Ruins in the northeast sand hold Regirock — one of the Regi golems. The door stays sealed until you solve the Sealed Chamber puzzle much later.",
        ],
        tags: ["desert", "fossils", "route-111"],
      },
      {
        id: "route-111-3",
        title: "Detour to Route 112",
        location: "Route 111 → Route 112",
        summary: "The sandstorm blocks the direct path north — detour west via Route 112.",
        story: [
          "With the desert impassable, the way forward bends west onto Route 112, skirting the base of Mt. Chimney. This is the road to the Fiery Path and, beyond it, the cable car that climbs the volcano — the route that ultimately leads to Lavaridge Town and its Fire-type Gym.",
        ],
        details: [
          "Head west onto Route 112 to skirt around the impassable desert.",
          "This leads to the Fiery Path and eventually the Mt. Chimney cable car.",
        ],
        tags: ["route", "route-111"],
      },
    ],
  },
  {
    id: "route-112",
    title: "Ch. 19 — Route 112 & Fiery Path",
    description: "A volcanic route and the cave beneath Mt. Chimney.",
    steps: [
      {
        id: "route-112-1",
        title: "Route 112 (south)",
        location: "Route 112",
        summary: "Team Magma Grunts loiter near the Fiery Path entrance.",
        story: [
          "Route 112 climbs the ashy slopes beneath Mt. Chimney, and you're not the only ones here — Team Magma Grunts, Aqua's fire-loving rivals, loiter along the mountainside up to no good. Battle past them; their schemes centre on the volcano above, and you're about to walk straight into the middle of one.",
          "The cable car station perched on the eastern ledge is your eventual ride to the summit, but it's off-limits until you've cut through the Fiery Path to reach it. For now, the glowing cave mouth ahead is the way through.",
        ],
        details: [
          "Battle Team Magma members guarding the mountainside.",
          "The cable car station to Mt. Chimney is on the east ledge (used after Fiery Path).",
        ],
        tags: ["route", "team-magma", "route-112"],
      },
      {
        id: "route-112-2",
        title: "Fiery Path",
        location: "Fiery Path",
        summary: "A hot cave with Numel, Spoink, and TM06 Toxic.",
        story: [
          "The Fiery Path lives up to its name — a short, sweltering tunnel of steam vents and warm stone that connects the two halves of Route 112. It's a great spot to round out your team before the volcano: Numel (a future Camerupt), the bouncing Spoink, sturdy Torkoal, and Machop all make their home in the heat.",
          "Keep an eye out for TM06 Toxic sitting behind a Strength boulder. If you've already reunited Wanda's couple in Verdanturf, you can shove it aside now and claim one of the best stalling moves in the game; if not, make a note to return with Strength in hand.",
        ],
        details: [
          "Catch Numel (→ Camerupt), Spoink (→ Grumpig), Torkoal, and Machop.",
          "TM06 Toxic sits behind a Strength boulder — return with HM04 if needed.",
          "The path connects to the north side of Route 112.",
        ],
        secrets: [
          "There's also a hidden Fire Stone in the Fiery Path — perfect for evolving Vulpix, Growlithe, or Eevee.",
        ],
        tags: ["cave", "numel", "route-112"],
      },
    ],
  },
  {
    id: "route-113",
    title: "Ch. 20 — Route 113",
    description: "The ash-covered route with the Glass Workshop.",
    steps: [
      {
        id: "route-113-1",
        title: "Volcanic ash & Spinda",
        location: "Route 113",
        summary: "Volcanic ash blankets this route — collect it with the Soot Sack.",
        story: [
          "Route 113 lies downwind of Mt. Chimney, and a soft grey snow of volcanic ash blankets everything. Walk through the ashy grass with your Soot Sack and you'll scoop up soot with every step — a resource you can trade in shortly for custom glassware and a useful item.",
          "The ash grass hides good catches, too: the ever-unique Spinda (whose spot pattern is different on every single one you meet), burrowing Sandshrew, and the razor-winged Skarmory at a stingy 5%. Skarmory is a fantastic Steel/Flying wall, so it's worth a little patience here.",
        ],
        details: [
          "Walk through the ash grass to gather soot in your Soot Sack.",
          "Catch Spinda, Sandshrew, and the rare Skarmory (5%).",
        ],
        secrets: [
          "No two Spinda share the same spot pattern — each is tied to its personality value, making yours effectively one of a kind.",
        ],
        tags: ["route", "spinda", "route-113"],
      },
      {
        id: "route-113-2",
        title: "The Glass Workshop",
        location: "Route 113",
        summary: "Trade collected ash for flutes and a free Soothe Bell.",
        story: [
          "The Glass Workshop on Route 113 turns your collected soot into treasure. The craftsman there blows the ash into a set of flutes — the Blue Flute wakes sleeping Pokémon, the Red Flute snaps foes out of infatuation, and others cure status or heal you — plus decorative glass for a secret base.",
          "Best of all, talk to him and he'll simply give you a Soothe Bell, a held item that speeds up how quickly a Pokémon warms to you. That's the key to friendship evolutions like Golbat into Crobat. Pocket it, then continue west toward Fallarbor Town.",
        ],
        details: [
          "The Glass Workshop owner crafts flutes from ash you gather.",
          "Talk to him for a free Soothe Bell (raises friendship).",
          "Continue west to Fallarbor Town.",
        ],
        secrets: [
          "Enough soot buys the whole flute set — the Blue Flute (wakes Pokémon) and White Flute (raises encounter rates) are especially handy for hunting rares.",
        ],
        tags: ["glass-workshop", "route-113"],
      },
    ],
  },
  {
    id: "fallarbor",
    title: "Ch. 21 — Fallarbor Town",
    description: "A quiet farming town caught up in the meteorite plot.",
    steps: [
      {
        id: "fallarbor-1",
        title: "Professor Cozmo & Team Magma",
        location: "Fallarbor Town",
        summary: "Team Magma has kidnapped Professor Cozmo to find a meteorite.",
        story: [
          "Fallarbor is a quiet farming town, but the peace is a thin veneer. Locals tell you that Team Magma has kidnapped Professor Cozmo, a meteorite researcher, and hauled him off toward Meteor Falls. It's the first time Magma's land-loving ambitions feel personal — and a clear sign that the fight over Mt. Chimney is about to boil over.",
          "The town's Contest Hall hosts higher-rank contests if you want a breather, but the story is pulling you west and north toward the falls.",
        ],
        details: [
          "Learn that Team Magma abducted Professor Cozmo for the Meteorite.",
          "This foreshadows the Mt. Chimney showdown to come.",
          "The Contest Hall here hosts higher-rank contests.",
        ],
        tags: ["team-magma", "story", "fallarbor"],
      },
      {
        id: "fallarbor-2",
        title: "Move Maniac & services",
        location: "Fallarbor Town",
        summary: "The Move Maniac reteaches moves for Heart Scales.",
        story: [
          "Fallarbor's other draw is the Move Maniac, a forgetful fellow who can reteach any move a Pokémon learned at a lower level — for the price of a Heart Scale. Heart Scales are scattered across Hoenn's beaches and underwater patches, so start picking them up whenever you see one; being able to recover a crucial egg move or forgotten TM later is worth the hoarding.",
          "Heal, restock, and head west onto Route 114, where Lanette's house and the road to Meteor Falls await.",
        ],
        details: [
          "Give the Move Maniac a Heart Scale to relearn a Pokémon's forgotten move.",
          "Heal and stock up, then head west/north via Route 114.",
        ],
        secrets: [
          "Heart Scales are found on Luvdisc (Super Rod) and in hidden underwater spots — grab them whenever you can for the Move Maniac.",
        ],
        tags: ["move-maniac", "fallarbor"],
      },
    ],
  },
  {
    id: "route-114",
    title: "Ch. 22 — Route 114 & Meteor Falls",
    description: "A rocky river route leading to the Team Magma meteorite scene.",
    steps: [
      {
        id: "route-114-1",
        title: "Route 114",
        location: "Route 114",
        summary: "Lanette's house and the Fossil Maniac sit along this route.",
        story: [
          "Route 114 is a rocky, river-cut road where you'll find Lanette's house — she's the woman who designed the PC storage system, and a chat with her tidies up your boxes. Trainers and items line the path, including TM05 Roar from a gentleman near the bridge, a move that forces switches and is essential for certain legendary hunts.",
          "The grass and water hide Swablu, the snake-and-mongoose pair Seviper and Zangoose, and Lombre splashing in the shallows. It's a scenic detour with good catches before the drama at Meteor Falls.",
        ],
        details: [
          "Visit Lanette (she manages the PC storage system).",
          "Battle trainers and grab TM05 Roar from a gentleman near the bridge.",
          "Catch Swablu, Seviper/Zangoose, and Lombre near the water.",
        ],
        tags: ["route", "route-114"],
      },
      {
        id: "route-114-2",
        title: "Meteor Falls & the Meteorite",
        location: "Meteor Falls",
        summary: "Team Magma and Team Aqua clash over the meteorite here.",
        story: [
          "Meteor Falls is a misty, tiered cavern where the two villainous teams finally collide in front of you. Team Magma strong-arms the Meteorite from a shaken Professor Cozmo, and their leader Maxie announces his plan to supercharge Mt. Chimney's volcano with it — a scheme that would reshape all of Hoenn if it succeeds.",
          "You can't stop him here; the confrontation is cut short and both teams scatter. But the deeper floors (reachable later with Surf and Waterfall) hide TM02 Dragon Claw and a young Bagon — the first step toward a fearsome Salamence.",
        ],
        details: [
          "Inside Meteor Falls, Team Magma takes the Meteorite from Professor Cozmo.",
          "Maxie announces a plan to power up Mt. Chimney's volcano.",
          "Deeper areas (need Surf/Waterfall later) hide TM02 Dragon Claw and Bagon.",
        ],
        secrets: [
          "Bagon in Meteor Falls is a 5% spawn on the deepest floor — start hunting now if you want Salamence before the League.",
        ],
        tags: ["meteorite", "team-magma", "meteor-falls", "route-114"],
      },
      {
        id: "route-114-3",
        title: "To the Mt. Chimney cable car",
        location: "Route 114 → Route 112",
        summary: "Backtrack to Route 112's cable car station to climb Mt. Chimney.",
        story: [
          "With the Meteorite in Magma's hands, there's only one place to intercept them: the summit of Mt. Chimney. Backtrack along Route 113 and 112 to the cable car station on the eastern ledge, ride it up, and prepare for the biggest villain confrontation you've faced yet.",
        ],
        details: [
          "Return along Route 113/112 to the cable car station.",
          "Ride the cable car up to confront Team Magma at the summit.",
        ],
        tags: ["story", "route-114"],
      },
    ],
  },
  {
    id: "mt-chimney",
    title: "Ch. 23 — Mt. Chimney",
    description: "Stop Maxie's plan at the volcano's summit.",
    steps: [
      {
        id: "mt-chimney-1",
        title: "Confront Team Magma",
        location: "Mt. Chimney summit",
        summary: "Fight through Grunts and Admin Tabitha to reach Maxie.",
        story: [
          "The cable car deposits you on a windswept crater rim where Team Magma has rigged a machine to the volcano's heart. Grunts bar the way, then Admin Tabitha steps up with a tougher squad, and finally Maxie himself — a cold, driven man with a Mightyena, Zubat, and a Camerupt that hits like a truck.",
          "Water and Ground moves handle his Fire-types cleanly; just watch Camerupt's own Fire attacks on anything weak to them. Beat him and the machine sputters out, Magma retreats in disarray, and Hoenn's sky clears — for now.",
        ],
        details: [
          "Battle the Team Magma Grunts guarding the meteorite machine.",
          "Defeat Admin Tabitha, then face Leader Maxie (Mightyena, Zubat, Camerupt).",
          "Maxie's plan to erupt the volcano fails and Team Magma retreats.",
        ],
        tips: ["Water and Ground moves handle Maxie's Camerupt; watch for its Fire attacks."],
        tags: ["team-magma", "maxie", "mt-chimney"],
      },
      {
        id: "mt-chimney-2",
        title: "Meteorite & Jagged Pass",
        location: "Mt. Chimney → Jagged Pass",
        summary: "Grab the Meteorite, then descend Jagged Pass toward Lavaridge.",
        story: [
          "Maxie leaves the Meteorite behind in his hurry to flee — scoop it up; you'll have a use for it much later at the Space Center. The only way down is Jagged Pass, a steep, ash-choked trail where Numel, Machop, and Spoink roam freely.",
          "Halfway down, keep an eye out for a hidden entrance to the Team Magma Hideout — sealed for now, but you'll be back once the story hands you the Magma Emblem. At the bottom, Lavaridge Town's hot springs are a welcome sight.",
        ],
        details: [
          "Pick up the Meteorite Maxie leaves behind.",
          "Descend the ash-covered Jagged Pass; catch Numel, Machop, and Spoink.",
          "A hidden Team Magma Hideout entrance is on Jagged Pass (used later).",
        ],
        secrets: [
          "Hold onto the Meteorite — you can trade it to a scientist at the Mossdeep Space Center for a choice of a Sun Stone or a Moon Stone.",
        ],
        tags: ["meteorite", "jagged-pass", "mt-chimney"],
      },
    ],
  },
  {
    id: "lavaridge",
    title: "Ch. 24 — Lavaridge Town",
    description: "Hot springs, a Wynaut egg, and Gym Leader Flannery.",
    steps: [
      {
        id: "lavaridge-1",
        title: "Hot springs & Wynaut egg",
        location: "Lavaridge Town",
        summary: "The famous hot springs heal you; an old woman gives an Egg.",
        story: [
          "Lavaridge is a spa town built around natural hot springs, and the locals swear by a soak. Chat around the pools for hints, then seek out the old woman near the springs — she presses a Pokémon Egg into your hands, which will hatch into Wynaut, the pre-evolved form of the powerful Wobbuffet.",
          "While you're here, buy the Go-Goggles from the Poké Mart. With them equipped, you can finally cross the Route 111 desert and claim that Mirage Tower fossil you passed earlier.",
        ],
        details: [
          "Soak in the hot springs to chat with locals and get hints.",
          "An old woman near the springs gives you an Egg that hatches into Wynaut.",
          "Buy the Go-Goggles here to cross the Route 111 desert.",
        ],
        secrets: [
          "Wynaut learns Counter and Mirror Coat — a patient Wobbuffet can turn any reckless attacker against itself.",
        ],
        tags: ["hot-springs", "wynaut", "lavaridge"],
      },
      {
        id: "lavaridge-2",
        title: "Gym 4 — Flannery (Heat Badge)",
        location: "Lavaridge Town Gym",
        summary: "Flannery uses Fire-types in a gym of hot-spring smoke and spin tiles.",
        story: [
          "Flannery is Lavaridge's young, earnest Gym Leader, and her arena is a haze of hot-spring steam broken up by spinning warp tiles that disorient you on the way to her platform. Navigate the puzzle, beat the junior trainers, and you'll face a quartet of Fire-types led by a bulky Torkoal that loves Overheat and Attract.",
          "Water, Ground, and Rock moves melt the whole team. This is your fourth badge — one more and your father will finally accept your challenge. Flannery awards the Heat Badge and TM50 Overheat.",
        ],
        details: [
          "Navigate the smoke-and-warp-tile puzzle to reach Flannery.",
          "Her team: Numel, Slugma, Camerupt, and Torkoal (lv 24–29).",
          "Torkoal has Overheat and Attract — Water, Ground, or Rock moves win easily.",
          "Win for the Heat Badge and TM50 Overheat.",
        ],
        tags: ["gym", "badge-4", "flannery", "lavaridge"],
      },
      {
        id: "lavaridge-3",
        title: "Return to challenge Norman",
        location: "Lavaridge → Petalburg",
        summary: "With four badges, head back to Petalburg to face your father.",
        story: [
          "Four badges in hand, the road finally leads home. Cross the Route 111 desert with your new Go-Goggles — and grab that Mirage Tower fossil if you haven't — then cut back through Mauville to Petalburg City, where Norman has been waiting to see what his child has become.",
        ],
        details: [
          "Cross the Route 111 desert (now with Go-Goggles) or backtrack via Mauville.",
          "Grab the Mirage Tower fossil on the way if you haven't yet.",
          "Head to Petalburg City for the 5th gym.",
        ],
        tags: ["story", "lavaridge"],
      },
    ],
  },
  {
    id: "petalburg-gym",
    title: "Ch. 25 — Petalburg Gym (Norman)",
    description: "Face your father for the Balance Badge, then get Surf.",
    steps: [
      {
        id: "petalburg-gym-1",
        title: "Gym 5 — Norman (Balance Badge)",
        location: "Petalburg City Gym",
        summary: "Norman uses powerful Normal-types led by Slaking.",
        story: [
          "Norman's Gym is built around a clever gimmick: you choose a themed challenge room (Speed, Accuracy, Defense, or Attack) and fight your way through trainers before reaching your father at the centre. His team is deceptively dangerous — Spinda, Vigoroth, Linoone, and the enormous Slaking, whose sky-high stats are balanced by Truant, meaning it loafs every other turn.",
          "Exploit those loaf turns: set up, heal, or switch while Slaking sits idle, then hammer it on its off-turn. Fighting-types shred the whole squad. Beat your father and he awards the Balance Badge and TM42 Facade with quiet pride.",
        ],
        details: [
          "Choose a room-challenge door theme, then reach Norman.",
          "His team: Spinda, Vigoroth, Linoone, and Slaking (lv 28–31).",
          "Slaking is huge but loafs every other turn (Truant) — set up or hit hard on its off-turn.",
          "Fighting-types shred the whole team; win for the Balance Badge and TM42 Facade.",
        ],
        tips: ["Bring a Machop/Makuhita line or Breloom to trivialize Slaking."],
        tags: ["gym", "badge-5", "norman", "petalburg-gym"],
      },
      {
        id: "petalburg-gym-2",
        title: "Get HM03 Surf",
        location: "Petalburg City",
        summary: "Wally's father gives you HM03 Surf after you beat Norman.",
        story: [
          "Step outside the Gym and Wally's father finds you, overjoyed at your victory and grateful for how you've inspired his son. He presses HM03 Surf into your hands — one of the strongest Water moves in the game and the key that unlocks half of Hoenn's coastline.",
          "Teach Surf to a Water-type or a sturdy HM carrier; from here on, any stretch of blue water is a road.",
        ],
        details: [
          "Visit the house of Wally's father in Petalburg; he gives you HM03 Surf.",
          "Surf opens up huge portions of the map and is a strong Water attack.",
          "Teach it to a Water-type or capable HM carrier.",
        ],
        tips: ["Surf is one of the best HMs — Marill/Wailmer or your Water starter make great users."],
        tags: ["hm", "surf", "petalburg-gym"],
      },
      {
        id: "petalburg-gym-3",
        title: "Head east via Route 118",
        location: "Petalburg → Mauville → Route 118",
        summary: "Return to Mauville and Surf east across Route 118 toward Fortree.",
        story: [
          "With Surf in your kit, the map opens up dramatically. Loop back through Mauville and head east, where Route 118's central waterway is the first place you'll need to paddle across. Beyond it lies Route 119's rainy jungle and, eventually, Fortree City and its treetop Gym.",
        ],
        details: [
          "From Mauville, head east; Surf across the water on Route 118.",
          "This opens the path to Route 119 and Fortree City.",
        ],
        tags: ["story", "petalburg-gym"],
      },
    ],
  },
  {
    id: "route-118",
    title: "Ch. 26 — Route 118",
    description: "A coastal crossing east of Mauville.",
    steps: [
      {
        id: "route-118-1",
        title: "Surf across Route 118",
        location: "Route 118",
        summary: "Fishers and Surf-only stretches connect Mauville to Route 119.",
        story: [
          "Route 118 is a breezy coastal crossing where fishermen test your patience and Surf spans the gap between Mauville's eastern shore and the wilder country beyond. Cast a line or Surf the shallows for Tentacool, Wingull, and the occasional Carvanha.",
          "Near the eastern end, you catch a glimpse of Steven — a brief, wordless encounter that foreshadows the Devon Scope errand waiting on Route 120.",
        ],
        details: [
          "Surf across the central water to reach the eastern shore.",
          "Fish and Surf for Tentacool, Wingull, and Carvanha (rare).",
          "Steven is spotted here, hinting at events near Route 120.",
        ],
        tags: ["route", "surf", "route-118"],
      },
      {
        id: "route-118-2",
        title: "North to Route 119",
        location: "Route 118 → Route 119",
        summary: "Head north into the rainy jungle route toward the Weather Institute.",
        story: [
          "North of Route 118, the sky turns grey and the grass grows tall. Route 119 is one of Hoenn's longest wild routes, and the Weather Institute at its heart is about to become the centre of Team Aqua's next move.",
        ],
        details: ["Continue north to Route 119, where the Weather Institute stands."],
        tags: ["route", "route-118"],
      },
    ],
  },
  {
    id: "route-119",
    title: "Ch. 27 — Route 119 & Weather Institute",
    description: "Rescue the Weather Institute and receive Castform.",
    steps: [
      {
        id: "route-119-1",
        title: "Cross the jungle route",
        location: "Route 119",
        summary: "A long, rainy route with tall grass, log bridges, and rare Pokémon.",
        story: [
          "Route 119 is a rain-soaked jungle gauntlet — tall grass, log bridges that need the Acro Bike to hop, and trainers lurking at every turn. Hidden Rare Candies and TMs reward thorough exploration, and the grass itself is worth farming.",
          "Tropius drifts through at a rare 5%, Zigzagoon and Oddish are common, and invisible Kecleon pepper the route — you'll need the Devon Scope from Steven to spot them. For now, push through toward the Weather Institute rising above the canopy.",
        ],
        details: [
          "The Acro Bike is needed to hop the log bridges.",
          "Catch Tropius (5%), Zigzagoon, Oddish, and the invisible Kecleon (later with Devon Scope).",
          "Hidden Rare Candy and TMs dot the route.",
        ],
        secrets: [
          "A hidden Rare Candy sits on this route — and Tropius, if you catch one, is a solid Grass/Flying HM carrier that learns Fly.",
        ],
        tags: ["route", "tropius", "route-119"],
      },
      {
        id: "route-119-2",
        title: "Weather Institute & Team Aqua",
        location: "Weather Institute",
        summary: "Team Aqua has seized the institute — drive them out.",
        story: [
          "Team Aqua has overrun the Weather Institute, hoping to steal the weather-control technology inside. Fight your way up through Grunt after Grunt until Aqua Admin Shelly blocks the top floor with a proper battle — she's tougher than anyone you've faced in Aqua colours so far, but your badge count should see you through.",
          "With Shelly beaten, the grateful scientists thank you with Castform, a quirky Normal-type that shifts form with the weather. It's a fun novelty and a surprisingly useful rain-setter in the right hands.",
        ],
        details: [
          "Battle Aqua Grunts through the building.",
          "Defeat Aqua Admin Shelly on the top floor.",
          "The grateful scientists give you Castform, a weather-changing Pokémon.",
        ],
        tags: ["team-aqua", "castform", "route-119"],
      },
      {
        id: "route-119-3",
        title: "Rival Battle #4 & HM02 Fly",
        location: "Route 119 (north)",
        summary: "Your rival battles you outside the institute; you can grab HM02 Fly.",
        story: [
          "Just north of the institute, your rival is waiting for another showdown — and this time they've brought a full team that will genuinely test your coverage. Win and they hand over HM02 Fly, the field move that lets you warp to any visited town from the overworld menu.",
          "Fly is a game-changer for backtracking, but note that you can't use it in the field until you earn the Feather Badge from Fortree's Gym. Head there next — though a colour-shifting roadblock waits in town first.",
        ],
        details: [
          "Just past the institute, Brendan/May challenges you with a full team.",
          "Defeat them to receive HM02 Fly.",
          "Fly lets you instantly warp to any visited town — a huge convenience.",
        ],
        tips: ["Fly can't be used in the field until you have the Feather Badge from Fortree."],
        tags: ["rival", "hm", "fly", "route-119"],
      },
    ],
  },
  {
    id: "fortree",
    title: "Ch. 28 — Fortree City",
    description: "The treetop city and Gym Leader Winona.",
    steps: [
      {
        id: "fortree-1",
        title: "The invisible Kecleon",
        location: "Fortree City",
        summary: "An unseen Pokémon blocks the bridge to the gym.",
        story: [
          "Fortree is a city built in the treetops, and something invisible is squatting on the bridge to the Gym — you can bump into it, but you can't battle or move it without help. Steven appears moments later, mentions trouble on Route 120, and heads off; follow him to get the Devon Scope that reveals hidden Kecleon everywhere in Hoenn.",
          "With the Scope in hand, come back, reveal the Kecleon on the bridge, and either catch it or knock it aside. Then the Gym is yours to challenge.",
        ],
        details: [
          "An invisible Kecleon sits on the bridge — you can't pass yet.",
          "Steven appears and heads to Route 120 to help; follow him for the Devon Scope.",
          "Return, use the Devon Scope to reveal and battle/catch the Kecleon.",
        ],
        tags: ["kecleon", "story", "fortree"],
      },
      {
        id: "fortree-2",
        title: "Gym 6 — Winona (Feather Badge)",
        location: "Fortree City Gym",
        summary: "Winona commands Flying-types in a gym of rotating warp panels.",
        story: [
          "Winona's Gym is a dizzying network of rotating platforms that spin you toward trainers and away from the leader if you're not careful. Her Flying-types — Swablu, Tropius, Pelipper, Skarmory, and the dragon-bird Altaria — hit from the sky with a mix of status and power.",
          "Electric and Ice moves dominate; Ice in particular quadruples damage on Altaria. Beat Winona for the Feather Badge and TM40 Aerial Ace — and Fly finally works outside battle.",
        ],
        details: [
          "Her team: Swablu, Tropius, Pelipper, Skarmory, and Altaria (lv 29–33).",
          "Electric and Ice moves dominate; Ice hits Altaria for 4× damage.",
          "Win for the Feather Badge and TM40 Aerial Ace — and Fly now works in the field.",
        ],
        tags: ["gym", "badge-6", "winona", "fortree"],
      },
    ],
  },
  {
    id: "route-120",
    title: "Ch. 29 — Route 120",
    description: "Steven's Devon Scope and the road toward Lilycove.",
    steps: [
      {
        id: "route-120-1",
        title: "Steven & the Devon Scope",
        location: "Route 120",
        summary: "Steven gives you the Devon Scope after a Kecleon blocks the path.",
        story: [
          "On Route 120, a Kecleon ambushes you from thin air — one moment nothing, the next a battle. Steven arrives in the nick of time, helps you through it, and gives you the Devon Scope, a device that permanently reveals invisible Kecleon on routes, in towns, and even in the Safari Zone.",
          "Use it back in Fortree to clear the bridge, then keep it equipped whenever you're exploring — there are Kecleon tucked away with items all over Hoenn.",
        ],
        details: [
          "A visible-then-invisible Kecleon attacks on the route; Steven helps you.",
          "He gives you the Devon Scope, which reveals invisible Kecleon everywhere.",
          "Use it back in Fortree to clear the bridge Kecleon.",
        ],
        tags: ["steven", "devon-scope", "route-120"],
      },
      {
        id: "route-120-2",
        title: "Route items & Ancient Tomb",
        location: "Route 120",
        summary: "Catch Absol and note the Ancient Tomb (Registeel) for later.",
        story: [
          "Route 120's eastern half is rich hunting ground. Absol — the disaster Pokémon with razor-sharp claws — appears in the grass and makes a superb Dark-type attacker. More Kecleon hide here with the Scope, and Oddish fills out the undergrowth.",
          "You'll also pass the Ancient Tomb, a sealed chamber that holds Registeel — one of the legendary golem trio. It's locked until you solve the Sealed Chamber puzzle much later, so make a mental note and press on east through Route 121 to Lilycove City.",
        ],
        details: [
          "Catch Absol, Oddish, and more Kecleon in the grass.",
          "The Ancient Tomb here holds Registeel — return after the Regi puzzle.",
          "Continue east through Route 121 to Lilycove City.",
        ],
        secrets: [
          "Absol learns Swords Dance and Sucker Punch — a strong physical sweeper if you catch one with a good Attack stat.",
        ],
        tags: ["route", "absol", "route-120"],
      },
    ],
  },
  {
    id: "safari-zone",
    title: "Ch. 30 — Route 121 & the Safari Zone",
    description: "The catching preserve on Route 121 and its exclusive Pokémon.",
    steps: [
      {
        id: "safari-zone-1",
        title: "Cross Route 121 to the Safari Zone",
        location: "Route 121",
        summary: "The tree-lined route east of Fortree leads to the Safari Zone gate.",
        story: [
          "Route 121 runs east from the Route 120 forests toward Lilycove, a long grassy stretch patrolled by Team Aqua Grunts and dotted with trainers. Shuppet, Gloom, Wingull, and more Kecleon (reveal them with the Devon Scope) lurk in the grass, and hidden items reward a careful sweep.",
          "Partway along, a large gatehouse marks the entrance to the Safari Zone — Hoenn's famous catching preserve, where the rules of battle don't apply and rare Pokémon you can't find anywhere else are waiting.",
        ],
        details: [
          "Head east along Route 121, battling trainers and Aqua Grunts.",
          "Reveal Kecleon with the Devon Scope and sweep for hidden items.",
          "Enter the Safari Zone gatehouse on the route's north side.",
        ],
        tips: ["Route 121 continues east to Lilycove City — you can return to the Safari Zone any time."],
        tags: ["route", "safari-zone"],
      },
      {
        id: "safari-zone-2",
        title: "Inside the preserve",
        location: "Safari Zone",
        summary: "Pay the entry fee for 30 Safari Balls and 500 steps to catch exclusive Pokémon.",
        story: [
          "The Safari Zone works differently from anywhere else in Hoenn. Pay the 500 entry fee and you're handed 30 Safari Balls and a 500-step allowance — no fainting wild Pokémon, no whittling down HP. Instead you throw Poké Blocks or Bait to change a Pokémon's mood, then lob a Safari Ball and hope it sticks. Your run ends when the balls or the steps run out.",
          "The reward is a roster you can't catch in the wild elsewhere: Pikachu, Pinsir, Heracross, Rhyhorn, Doduo, Natu, Girafarig, Phanpy, Oddish, Gloom, Wobbuffet, and more roam the fields. It's the single best spot to round out your Pokédex mid-game.",
        ],
        details: [
          "Entry costs 500; you receive 30 Safari Balls and 500 steps.",
          "Throw Poké Blocks/Bait to affect the Pokémon, then a Safari Ball to catch it.",
          "Exclusive catches include Pikachu, Pinsir, Heracross, Rhyhorn, Girafarig, Natu, and Phanpy.",
        ],
        tips: ["Heracross and Pinsir are Safari-only physical powerhouses — worth a dedicated run."],
        secrets: [
          "A Nugget and other valuables are hidden in the grass — walk carefully to trigger the hidden-item beeps before your steps run out.",
        ],
        tags: ["safari-zone", "catching"],
      },
      {
        id: "safari-zone-3",
        title: "The bike-only expansion areas",
        location: "Safari Zone (northern extension)",
        summary: "Emerald adds Acro/Mach Bike areas with Johto Pokémon.",
        story: [
          "Emerald expands the Safari Zone with two northern areas reached only by bike. The Acro Bike section — full of bike rails and bumps — hides Aipom, Gligar, Girafarig, and Pinsir, while the Mach Bike section over sandy mud holds Phanpy, Rhyhorn, and the elusive Miltank.",
          "These extensions are also home to Johto natives you won't see anywhere else in the game: Ledyba, Spinarak, Sunkern, Marill, and more. Bring the right bike (swap at Rydel's shop in Mauville) and plenty of Safari Balls.",
        ],
        details: [
          "The north-east area needs the Acro Bike; the north-west needs the Mach Bike.",
          "Acro area: Aipom, Gligar, Girafarig, Pinsir. Mach area: Phanpy, Rhyhorn, Miltank.",
          "Johto-only species (Ledyba, Spinarak, Sunkern, Marill) appear only in these extensions.",
        ],
        secrets: [
          "Swap bikes at Rydel's Cycling Shop in Mauville before a run — you can't switch inside the Safari Zone.",
        ],
        tags: ["safari-zone", "bike", "optional"],
      },
    ],
  },
  {
    id: "lilycove",
    title: "Ch. 31 — Lilycove City",
    description: "The Department Store, a rival battle, and Team Aqua's hideout.",
    steps: [
      {
        id: "lilycove-1",
        title: "Department Store & rival",
        location: "Lilycove City",
        summary: "The huge Department Store sells TMs and items; your rival battles you outside.",
        story: [
          "Lilycove is Hoenn's grandest city — art museum, harbor, Contest Hall, and the towering Department Store where you can buy nearly every TM and evolution stone in the game. Stock up before the story pulls you into something darker.",
          "Outside the store, your rival catches you for Rival Battle #5 — their toughest team yet, a genuine checkpoint before the endgame. Win, then take a breath and explore; the Aqua Hideout on the city's east side is waiting.",
        ],
        details: [
          "Rival Battle #5 happens in front of the Department Store — their toughest team yet.",
          "Buy TMs, evolution stones, and vitamins across the store's floors.",
          "The Lilycove Contest Hall hosts the top-rank Master contests.",
        ],
        tags: ["rival", "department-store", "lilycove"],
      },
      {
        id: "lilycove-2",
        title: "Team Aqua Hideout",
        location: "Lilycove City",
        summary: "Infiltrate the Aqua Hideout east of town to stop their submarine.",
        story: [
          "East of Lilycove, tucked behind the city, is Team Aqua's Hideout — a warren of warp panels and Grunts guarding their stolen submarine. Fight through to Admin Matt, then watch Archie slip away beneath the waves in the sub, bound for the Seafloor Cavern.",
          "You can't stop the sub here, but sweep the base for items on your way out. The real Master Ball, incidentally, is in the Magma Hideout on Jagged Pass — not this one.",
        ],
        details: [
          "Enter the hideout behind the city and navigate its warp panels.",
          "Battle Grunts and Admin Matt; Archie escapes in a submarine to Seafloor Cavern.",
          "Grab a Master Ball-tier item route note: the true Master Ball is in the Magma Hideout.",
        ],
        secrets: [
          "The Aqua Hideout holds a Nest Ball and Max Revive — grab them before you leave.",
        ],
        tags: ["team-aqua", "story", "lilycove"],
      },
      {
        id: "lilycove-3",
        title: "Detour: Mt. Pyre first",
        location: "Lilycove → Route 122 → Mt. Pyre",
        summary: "Before chasing the submarine, the orbs are stolen at Mt. Pyre.",
        story: [
          "Before you can chase Archie's submarine, the plot thickens on Mt. Pyre — the sacred mountain south of Lilycove where Hoenn honours departed Pokémon. Surf down Routes 122 and 123; Team Magma is already on the move there, and the legendary orbs at the summit are the prize.",
        ],
        details: [
          "Surf south via Routes 122/123 to reach Mt. Pyre.",
          "The team plot escalates with the Red and Blue Orb theft (next chapter).",
        ],
        tags: ["story", "lilycove"],
      },
    ],
  },
  {
    id: "mt-pyre",
    title: "Ch. 32 — Mt. Pyre",
    description: "The memorial mountain where the legendary orbs are stolen.",
    steps: [
      {
        id: "mt-pyre-1",
        title: "Climb Mt. Pyre",
        location: "Mt. Pyre",
        summary: "A quiet mountain honoring departed Pokémon, home to Ghost-types.",
        story: [
          "Mt. Pyre is a solemn place — a mountain of memorial pillars where trainers leave tributes to Pokémon they've lost. Ghost-types drift through the floors: Shuppet by day, Duskull at night, and the fox-like Vulpix on the slopes.",
          "Inside the summit shrine you'll find the Cleanse Tag (which weakens wild Ghost-types when held) and TM30 Shadow Ball, one of the strongest Ghost moves in the game. Grab both before the story catches up with you.",
        ],
        details: [
          "Catch Shuppet, Duskull (night), and Vulpix on the floors.",
          "Grab the Cleanse Tag and TM30 Shadow Ball inside the summit building.",
        ],
        secrets: [
          "TM30 Shadow Ball is a permanent pickup — don't leave Mt. Pyre without it.",
        ],
        tags: ["mountain", "ghost", "mt-pyre"],
      },
      {
        id: "mt-pyre-2",
        title: "The Red & Blue Orb theft",
        location: "Mt. Pyre summit",
        summary: "Team Magma steals the Magma Emblem's key orb from the old couple.",
        story: [
          "At the summit, an elderly couple has guarded the Red and Blue Orbs for decades — orbs tied to the primal power of Groudon and Kyogre. Team Magma storms the shrine, seizes one orb, and vanishes, setting in motion the awakening that will throw all of Hoenn into crisis.",
          "The old woman entrusts you with the remaining orb and urges you to act. From here the story splits: chase Magma to their hideout on Jagged Pass, then pursue Aqua to the depths of the sea.",
        ],
        details: [
          "At the summit, an elderly couple guards the Red and Blue Orbs.",
          "Team Magma takes an orb, setting up the awakening of Groudon.",
          "The old woman gives you the remaining orb.",
        ],
        tags: ["orbs", "team-magma", "story", "mt-pyre"],
      },
    ],
  },
  {
    id: "magma-hideout",
    title: "Ch. 33 — Team Magma Hideout",
    description: "Storm Maxie's base and witness Groudon's awakening.",
    steps: [
      {
        id: "magma-hideout-1",
        title: "Infiltrate the hideout",
        location: "Jagged Pass — Magma Hideout",
        summary: "Use the Magma Emblem to open the hideout on Jagged Pass.",
        story: [
          "Return to Jagged Pass with the Magma Emblem and the hidden entrance you spotted earlier yawns open — Team Magma's secret base, a maze of cart rails and locked doors deep inside the volcano. Ride the rails, battle Grunts, and pick up the Master Ball sitting in a back room: the only one in the entire game.",
          "Save it for something that truly matters — a roaming Latios or Latias, or Rayquaza at the Sky Pillar — because you won't get another chance.",
        ],
        details: [
          "The Magma Emblem (found earlier) reveals the hideout entrance on Jagged Pass.",
          "Ride the cart rails and battle Grunts through the winding base.",
          "Pick up the Master Ball inside — the only one you get in the game.",
        ],
        tips: ["Save the Master Ball for a legendary you truly want (e.g., roaming Latios/Latias or Rayquaza)."],
        secrets: [
          "The hideout also holds a Max Revive and a Nest Ball — sweep every room before you leave.",
        ],
        tags: ["team-magma", "master-ball", "magma-hideout"],
      },
      {
        id: "magma-hideout-2",
        title: "Maxie awakens Groudon",
        location: "Magma Hideout",
        summary: "Maxie uses the orb to wake Groudon, but it flees underground.",
        story: [
          "Deeper in the hideout, Admin Tabitha and Maxie make their stand. Beat them both and you arrive moments too late: Maxie uses the stolen orb to awaken Groudon, the continent Pokémon — but the beast shakes off his control and vanishes underground, leaving Magma in disarray.",
          "The drought begins. Head back to Lilycove and chase Team Aqua's submarine to Slateport — the race for Kyogre is on.",
        ],
        details: [
          "Defeat Admin Tabitha and Maxie deeper in the base.",
          "Groudon awakens and vanishes — the drought/rain crisis begins to build.",
          "Head to Lilycove and chase Team Aqua's submarine to Slateport.",
        ],
        tags: ["groudon", "story", "magma-hideout"],
      },
    ],
  },
  {
    id: "mossdeep",
    title: "Ch. 34 — Mossdeep City",
    description: "The twin Psychic gym and the Space Center showdown.",
    steps: [
      {
        id: "mossdeep-1",
        title: "Gym 7 — Tate & Liza (Mind Badge)",
        location: "Mossdeep City Gym",
        summary: "A double battle against twin Psychic Gym Leaders.",
        story: [
          "Mossdeep's Gym is Hoenn's only Double Battle gym — you and two Pokémon against Tate and Liza's twin Psychic-types, Solrock and Lunatone. They set up with Calm Mind and Sunny Day, then hit from both sides with psychic and rock coverage.",
          "Dark, Ghost, and Bug moves hit both foes; a well-placed Earthquake tags them simultaneously. Win for the Mind Badge and TM04 Calm Mind, then turn your attention to the Space Center on the city's north side.",
        ],
        details: [
          "This is a 2-vs-2 Double Battle — bring two strong Pokémon.",
          "Their team: Solrock and Lunatone (lv 41–42) with Calm Mind and Sunny Day.",
          "Dark, Ghost, and Bug moves hit both; an Earthquake can tag both foes.",
          "Win for the Mind Badge and TM04 Calm Mind.",
        ],
        tips: ["Avoid Explosion range — bring a Pokémon that isn't frail to Solrock's coverage."],
        tags: ["gym", "badge-7", "tate-liza", "double-battle", "mossdeep"],
      },
      {
        id: "mossdeep-2",
        title: "Space Center & HM08 Dive",
        location: "Mossdeep Space Center",
        summary: "Team Magma attacks the Space Center; Steven helps and gives you Dive.",
        story: [
          "Team Magma launches a brazen raid on the Mossdeep Space Center, trying to steal rocket fuel. Steven arrives to back you up in a tag-team battle against Tabitha and Maxie — two on two, with Steven's Metang holding the line while you focus fire.",
          "Magma is driven off, and Steven invites you to his house afterward, where he entrusts you with HM08 Dive. The deep ocean south of Mossdeep is now yours to explore — and somewhere beneath the waves, Archie waits.",
        ],
        details: [
          "Team Magma tries to steal fuel from the Space Center.",
          "Fight alongside Steven (a tag battle) to defeat Tabitha and Maxie.",
          "Afterward, visit Steven's house — he gives you HM08 Dive.",
        ],
        tags: ["team-magma", "steven", "hm", "dive", "mossdeep"],
      },
      {
        id: "mossdeep-3",
        title: "Super Rod & Regi prep",
        location: "Mossdeep City",
        summary: "Fish Relicanth and Wailmer for the Regi trio puzzle later.",
        story: [
          "Before you dive after Aqua, Mossdeep's fishermen will sell you the Super Rod — upgrade your tackle and fish the surrounding waters for Wailmer and the elusive Relicanth, a 5% Super Rod catch that looks unremarkable but is essential for unlocking the Regi trio later.",
          "You'll need a Relicanth in party slot 1 and a Wailord in slot 6 at the Sealed Chamber. Start hunting now so you're not scrambling at the endgame.",
        ],
        details: [
          "The Super Rod becomes available — fish for Relicanth (5%) and Wailmer.",
          "Evolve Wailmer into Wailord; you'll need Relicanth + Wailord for the Sealed Chamber.",
          "Dive down south of Mossdeep to reach the Seafloor Cavern next.",
        ],
        secrets: [
          "Relicanth only appears at a 5% rate on the Super Rod — patience at Mossdeep's shores now saves hours later.",
        ],
        tags: ["relicanth", "regi", "mossdeep"],
      },
    ],
  },
  {
    id: "seafloor-cavern",
    title: "Ch. 35 — Seafloor Cavern",
    description: "Dive to Archie's lair where Kyogre awakens.",
    steps: [
      {
        id: "seafloor-cavern-1",
        title: "Dive to the cavern",
        location: "Routes 126–128 (Dive)",
        summary: "Use Dive in the deep water to find the underwater cavern entrance.",
        story: [
          "Surf to the dark-blue deep water south of Mossdeep and plunge beneath the surface with Dive. An underwater trench leads to a hidden cave mouth — the entrance to the Seafloor Cavern, Team Aqua's underwater fortress and the resting place of Kyogre.",
          "Inside, Strength boulders block the descent floor by floor. Push through Grunt patrols and solve the puzzles to reach the deepest chamber.",
        ],
        details: [
          "Surf to the deep-water patch south of Mossdeep and use Dive.",
          "Navigate the underwater trench to the Seafloor Cavern entrance.",
          "Inside, solve Strength-boulder puzzles to descend.",
        ],
        tags: ["dive", "seafloor-cavern"],
      },
      {
        id: "seafloor-cavern-2",
        title: "Archie awakens Kyogre",
        location: "Seafloor Cavern",
        summary: "Confront Archie as he wakes Kyogre — and loses control of it.",
        story: [
          "At the cavern's heart, Aqua Admin Matt makes a last stand before Archie himself takes the field. Beat them both and you arrive just as Archie uses the Blue Orb to awaken Kyogre — only for the sea Pokémon to ignore him entirely and surge away, unleashing endless rain across Hoenn.",
          "Groudon's drought and Kyogre's downpour collide, and the sky itself begins to tear. Save before this point if you want a safety net; the story locks you toward Sootopolis and the climax.",
        ],
        details: [
          "Battle Aqua Admin Matt, then Leader Archie deep in the cavern.",
          "Archie uses the orb to wake Kyogre; it rampages and escapes.",
          "Endless rain (and Groudon's drought) now batter Hoenn — head to Sootopolis.",
        ],
        tips: ["Save before Archie; the story locks you into the Sootopolis climax next."],
        tags: ["kyogre", "archie", "story", "seafloor-cavern"],
      },
    ],
  },
  {
    id: "sootopolis",
    title: "Ch. 36 — Sootopolis City",
    description: "The crater city at the heart of the weather crisis.",
    steps: [
      {
        id: "sootopolis-1",
        title: "The weather crisis",
        location: "Sootopolis City",
        summary: "Groudon and Kyogre clash above Sootopolis as the climate goes haywire.",
        story: [
          "Sootopolis is a city built inside a volcanic crater, and when you arrive the sky above it is a battlefield — Groudon and Kyogre circling each other as blistering sun and torrential rain alternate in seconds. The townspeople shelter indoors; the world feels like it's coming apart.",
          "Steven meets you and sends you into the Cave of Origin at the city's heart, hoping the legendaries can be calmed from within. They're not — the orbs' power is beyond anything you can suppress alone.",
        ],
        details: [
          "Reach Sootopolis (Surf/Dive/Waterfall access) to find chaos in the sky.",
          "Steven directs you to seek the only Pokémon that can stop them.",
          "Enter the Cave of Origin, but the legendaries can't be calmed from here.",
        ],
        tags: ["story", "sootopolis"],
      },
      {
        id: "sootopolis-2",
        title: "Seek Rayquaza",
        location: "Sootopolis → Sky Pillar",
        summary: "Steven sends you to the Sky Pillar near Pacifidlog to wake Rayquaza.",
        story: [
          "Steven lays it out plainly: only Rayquaza, the sky dragon sleeping in the ancient Sky Pillar east of Pacifidlog Town, has the power to quell Groudon and Kyogre. Fly or Surf toward Pacifidlog, then find the pillar on its own tiny island — a crumbling tower that will test your Mach Bike skills.",
        ],
        details: [
          "Steven meets you and points you to the Sky Pillar east of Pacifidlog Town.",
          "Surf and Fly toward Pacifidlog, then reach the Sky Pillar (next chapter).",
        ],
        tags: ["rayquaza", "story", "sootopolis"],
      },
    ],
  },
  {
    id: "pacifidlog",
    title: "Ch. 37 — Pacifidlog Town & the Open Sea",
    description: "The floating town, the ocean currents, and the way to the Sky Pillar.",
    steps: [
      {
        id: "pacifidlog-1",
        title: "Ride the currents to Pacifidlog",
        location: "Routes 132–134 / 129–131",
        summary: "Strong ocean currents on the open sea sweep you toward Pacifidlog Town.",
        story: [
          "The open water between Slateport and the eastern isles is ruled by powerful currents. On Routes 129 through 134 the sea itself pushes you along set directions — fighting the flow is slow going, so read the arrows in the waves and let them carry you where you need to go. Wailmer breach around you, and the depths below (via Dive) hide the underwater passages to the Sealed Chamber.",
          "Follow the currents east and you'll wash up at Pacifidlog Town, a settlement built entirely on a raft of Corsola atop the waves.",
        ],
        details: [
          "The sea on Routes 129–131 flows in fixed directions — follow the current arrows.",
          "Surf toward Pacifidlog; Wailmer, Tentacool, and Wingull appear on the water.",
          "Dive spots here lead to the underwater Braille routes (Sealed Chamber later).",
        ],
        tips: ["Going against a current is possible but slow — line up with the flow whenever you can."],
        tags: ["sea", "currents", "pacifidlog"],
      },
      {
        id: "pacifidlog-2",
        title: "Pacifidlog Town",
        location: "Pacifidlog Town",
        summary: "A friendship-TM gift, the Corsola raft, and the fabled Mirage Island.",
        story: [
          "Pacifidlog is a quiet town of wooden walkways floating on living Corsola. A man in one of the houses gives you a free TM every day based on your lead Pokémon's mood: TM27 Return if it's happy with you, or TM21 Frustration if it isn't — a handy source of a strong Normal-type move.",
          "Look east from town toward Mirage Island — a rare islet that only appears when a hidden daily value matches your party, home to a lone Wynaut. Most days the sea is empty there, so don't be discouraged if you see nothing.",
        ],
        details: [
          "A resident gives TM27 Return (high friendship) or TM21 Frustration (low friendship) once per day.",
          "Fish the surrounding water for Corsola, Horsea, Chinchou, and Luvdisc.",
          "Mirage Island appears east of town only on rare days — it holds a Wynaut and a Liechi Berry.",
        ],
        secrets: [
          "Mirage Island's appearance is tied to a random daily value versus your party's personality values — checking daily is the only way to catch it visible.",
        ],
        tags: ["pacifidlog", "tm", "mirage-island"],
      },
      {
        id: "pacifidlog-3",
        title: "East to the Sky Pillar",
        location: "Route 131",
        summary: "Route 131 east of Pacifidlog leads to the island of the Sky Pillar.",
        story: [
          "From Pacifidlog, Surf east along Route 131. The current here runs your way, carrying you toward a lonely island crowned by an ancient, crumbling tower — the Sky Pillar, where the sky dragon Rayquaza sleeps. This is exactly where Steven sent you from Sootopolis to end the weather crisis.",
          "Land on the island and steel yourself: the climb ahead demands the Mach Bike and steady nerves.",
        ],
        details: [
          "Surf east on Route 131 (the current helps you here).",
          "Reach the Sky Pillar island — the entrance to Rayquaza's tower.",
          "Make sure the Mach Bike is registered before you go inside.",
        ],
        tags: ["sea", "sky-pillar", "pacifidlog"],
      },
    ],
  },
  {
    id: "sky-pillar",
    title: "Ch. 38 — Sky Pillar",
    description: "Climb the ancient tower to awaken Rayquaza.",
    steps: [
      {
        id: "sky-pillar-1",
        title: "Climb the Sky Pillar",
        location: "Sky Pillar",
        summary: "A crumbling tower with cracked floors that need the Mach Bike.",
        story: [
          "The Sky Pillar is an ancient ruin where cracked floor tiles crumble the moment you stop moving on them — which means the Mach Bike isn't optional, it's mandatory. Build speed, ride straight across, and don't let up until you're on solid ground again.",
          "Golbat, Sableye, Claydol, and Altaria haunt the climb. At the summit, Rayquaza sleeps coiled around the apex, waiting.",
        ],
        details: [
          "Use the Mach Bike to speed over cracked tiles — stopping makes you fall through.",
          "Catch Golbat, Sableye, Claydol, and Altaria on the way up.",
          "Rayquaza rests at the very top.",
        ],
        tips: ["Keep the Mach Bike equipped; momentum is the whole puzzle here."],
        tags: ["mach-bike", "rayquaza", "sky-pillar"],
      },
      {
        id: "sky-pillar-2",
        title: "Rayquaza ends the crisis",
        location: "Sky Pillar summit → Sootopolis",
        summary: "Rayquaza flies to Sootopolis and calms Groudon and Kyogre.",
        story: [
          "Approach Rayquaza and a story cutscene plays — no catch battle yet. The green dragon wakes, roars, and dives from the pillar toward Sootopolis, where it confronts Groudon and Kyogre in a spectacle that ends the weather crisis once and for all.",
          "When the skies clear, you can return to the summit to catch Rayquaza at level 70. Save before the encounter — this is what your Master Ball was made for, unless you prefer the thrill of a manual catch.",
        ],
        details: [
          "Approaching Rayquaza triggers a story cutscene (not a catch fight yet).",
          "Rayquaza descends to Sootopolis and settles the two titans.",
          "You can return to catch Rayquaza (lv 70) here after the story — save first.",
        ],
        secrets: [
          "Rayquaza is level 70 and learns Dragon Ascent — the only Pokémon that can Mega Evolve into Mega Rayquaza in later games.",
        ],
        tags: ["rayquaza", "story", "sky-pillar"],
      },
      {
        id: "sky-pillar-3",
        title: "Catch Rayquaza",
        location: "Sky Pillar (summit)",
        summary: "Lv 70 — return after the story cutscene to catch the sky dragon.",
        story: [
          "Once Rayquaza has flown to Sootopolis and settled the crisis, the summit is yours alone. The dragon waits at level 70, coiled around the apex until you're ready for the catch battle.",
          "Save before you interact. Ultra Balls and Timer Balls help, but this is the encounter most players save their Master Ball for — unless you're confident with sleep and False Swipe.",
        ],
        details: [
          "Return to the Sky Pillar summit after the Sootopolis story event.",
          "Rayquaza is level 70 — save before the battle.",
          "Use status (Sleep/Paralysis), False Swipe, and Ultra or Timer Balls.",
          "Bring Pokémon around level 55–65 if you want manageable damage output.",
        ],
        tips: ["False Swipe + status makes catching much easier."],
        secrets: [
          "Rayquaza learns Dragon Ascent — the only Pokémon that can Mega Evolve into Mega Rayquaza in later games.",
        ],
        tags: ["rayquaza", "lv70", "sky-pillar"],
      },
    ],
  },
  {
    id: "sootopolis-gym",
    title: "Ch. 39 — Sootopolis Gym (Wallace)",
    description: "The eighth badge and HM07 Waterfall.",
    steps: [
      {
        id: "sootopolis-gym-1",
        title: "Get HM07 Waterfall",
        location: "Sootopolis City",
        summary: "With the crisis over, Wallace gives you HM07 Waterfall outside the gym.",
        story: [
          "Peace returns to Sootopolis, and Wallace — the city's Gym Leader and Hoenn's Pokémon Contest Master — stands outside the now-open Gym. He congratulates you on saving the region and hands over HM07 Waterfall, the move that lets you scale waterfalls and opens the path to Victory Road.",
          "Teach it to a Surf user or HM carrier, then step inside for your eighth and final badge.",
        ],
        details: [
          "After Rayquaza calms the legendaries, the gym opens.",
          "Wallace, standing near the gym, gives you HM07 Waterfall.",
          "Waterfall lets you climb waterfalls — required for Victory Road.",
        ],
        tags: ["hm", "waterfall", "sootopolis-gym"],
      },
      {
        id: "sootopolis-gym-2",
        title: "Gym 8 — Wallace (Rain Badge)",
        location: "Sootopolis City Gym",
        summary: "Wallace is a Water-type master on a gym of cracking ice floors.",
        story: [
          "Wallace's Gym is an elegant ice-floor puzzle — step on a tile and it cracks beneath you, so you have to plan your route carefully to reach the leader without trapping yourself. His Water-types are polished and tough: Luvdisc, Whiscash, Sealeo, Seaking, and the bulky ace Milotic.",
          "Electric and Grass moves tear through the team; just be ready for Milotic's high defenses. Win the Rain Badge and every Pokémon in your party obeys you, no matter the level — and the road to the Pokémon League finally opens.",
        ],
        details: [
          "Cross the ice-floor puzzle (each tile cracks) to reach Wallace.",
          "His team: Luvdisc, Whiscash, Sealeo, Seaking, and Milotic (lv 40–43).",
          "Electric and Grass moves win; Milotic is bulky, so bring strong coverage.",
          "Win for the Rain Badge — all Pokémon now obey and Victory Road opens.",
        ],
        tags: ["gym", "badge-8", "wallace", "sootopolis-gym"],
      },
      {
        id: "sootopolis-gym-3",
        title: "Kyogre & Groudon",
        location: "Marine Cave & Terra Cave",
        summary: "Lv 70 each — roaming caves unlock after the Rain Badge.",
        story: [
          "With the weather crisis over and the Rain Badge in hand, the awakened titans settle into hidden caves that shift position day to day. Kyogre waits in Marine Cave; Groudon lurks in Terra Cave. Sootopolis residents will hint at which route each cave has appeared near today.",
          "You only get one chance to battle each per save file when you find their cave — save before every encounter. Whittle HP, inflict status, and lob Ultra or Timer Balls (or spend the Master Ball if Rayquaza didn't need it). You can catch both on one save.",
        ],
        details: [
          "Marine Cave (Kyogre) rotates among Routes 105, 125, 127, 129, and 130 areas.",
          "Terra Cave (Groudon) rotates near Routes 114, 115, 116, or 118.",
          "Talk to residents in Sootopolis for location hints.",
          "Each is level 70 — save before battling.",
        ],
        tags: ["kyogre", "groudon", "lv70", "roaming-cave", "sootopolis-gym"],
      },
    ],
  },
  {
    id: "abandoned-ship",
    title: "Ch. 40 — The Abandoned Ship (Optional)",
    description: "A flooded wreck on Route 108 hiding the Scanner and rare items.",
    steps: [
      {
        id: "abandoned-ship-1",
        title: "Board the wreck on Route 108",
        location: "Route 108 — Abandoned Ship",
        summary: "Surf to the half-sunk ship between Dewford and Slateport.",
        story: [
          "Out on Route 108, between Dewford and Slateport, a half-sunk ship lists in the shallows. Surf out and climb aboard to explore its flooded cabins — a warren of locked rooms, seawater, and scattered loot. Many doors need keys you'll find on site, so expect to backtrack as you piece the puzzle together.",
          "The upper cabins give up Harbor Mail, a Revive, and TM49 (Snatch) among other odds and ends. To reach the best prize, though, you'll need to head below the surface.",
        ],
        details: [
          "Surf to the Abandoned Ship on Route 108 (east of Dewford's waters).",
          "Explore the cabins for Harbor Mail, a Revive, TM49 Snatch, and more.",
          "Some rooms are locked until you find the Room Key and Storage Key.",
        ],
        tips: ["Bring Surf; you can visit as soon as you can cross the water, but Dive unlocks the full ship."],
        tags: ["optional", "route", "abandoned-ship"],
      },
      {
        id: "abandoned-ship-2",
        title: "The Storage Key & the Scanner",
        location: "Abandoned Ship (underwater)",
        summary: "Dive to find the Storage Key, claim the Scanner, and trade it in Slateport.",
        story: [
          "In the flooded lower deck, use Dive to reach a sunken room and grab the Storage Key. That key opens the storage cabin above, where the Scanner — the ship's real treasure — is waiting. It's a device with no use of its own, but Captain Stern back at Slateport's Oceanic Museum will gladly take it off your hands.",
          "In exchange, Stern lets you choose one of two rare held items: the Deep Sea Tooth (which powers up Clamperl's Special Attack and evolves it into Huntail via trade) or the Deep Sea Scale (which boosts Special Defense and evolves Clamperl into Gorebyss). Pick the one that matches the sea-Pokémon you want.",
        ],
        details: [
          "Use Dive in the lower deck to find the Storage Key.",
          "Open the storage room and take the Scanner.",
          "Give the Scanner to Captain Stern in Slateport for a Deep Sea Tooth or Deep Sea Scale.",
        ],
        secrets: [
          "Deep Sea Tooth → Huntail (via trade) and boosts Sp. Atk; Deep Sea Scale → Gorebyss and boosts Sp. Def. You only get one, so choose deliberately.",
        ],
        tags: ["optional", "dive", "scanner", "abandoned-ship"],
      },
    ],
  },
  {
    id: "shoal-cave",
    title: "Ch. 41 — Shoal Cave (Optional)",
    description: "A tide-driven cave near Mossdeep and the Shell Bell reward.",
    steps: [
      {
        id: "shoal-cave-1",
        title: "Mind the tides",
        location: "Route 125 — Shoal Cave",
        summary: "Shoal Cave's layout changes with the real-time tide.",
        story: [
          "Northeast of Mossdeep, Surf to Route 125 and duck into Shoal Cave. This cave lives and breathes with the tide, which follows your game's real-time clock: at low tide the water recedes to reveal paths and ledges you can't reach when the sea is high, and at high tide those same passages flood over. You'll need to visit at both tides to see everything.",
          "Zubat, Golbat, Spheal, and Snorunt roam the chambers — Spheal and Snorunt are the draw here, both solid Ice-types you won't stumble across easily elsewhere.",
        ],
        details: [
          "Surf to Shoal Cave on Route 125, northeast of Mossdeep.",
          "The tide (tied to the real-time clock) opens or floods different paths.",
          "Catch Spheal and Snorunt inside, plus Zubat/Golbat.",
        ],
        tips: ["Come back at the opposite tide to reach areas that were blocked the first time."],
        tags: ["optional", "cave", "tides", "shoal-cave"],
      },
      {
        id: "shoal-cave-2",
        title: "Shoal Salt, Shells & the Focus Band",
        location: "Shoal Cave",
        summary: "Collect four Shoal Salt and four Shoal Shells for a Shell Bell.",
        story: [
          "Scattered through the cave are four Shoal Salt and four Shoal Shells, which glitter and respawn over time. Gather all eight and bring them to the old man near the entrance — he'll craft you a Shell Bell, a held item that heals the holder for an eighth of the damage it deals. It's one of the best early sustain items in the game.",
          "Deep in the cave, reachable only at low tide, an ice-walled inner room hides the Focus Band (a held item that sometimes lets a Pokémon survive a KO with 1 HP), along with a Rare Candy and a Big Pearl for the taking.",
        ],
        details: [
          "Collect 4 Shoal Salt + 4 Shoal Shells and give them to the man near the entrance for a Shell Bell.",
          "At low tide, reach the deep ice room for the Focus Band.",
          "Also grab the Rare Candy and Big Pearl hidden inside.",
        ],
        secrets: [
          "The Shoal Salt/Shell pickups regenerate, so you can return for more Shell Bells to spread across your team.",
        ],
        tags: ["optional", "shell-bell", "focus-band", "shoal-cave"],
      },
    ],
  },
  {
    id: "sealed-chamber",
    title: "Ch. 42 — Sealed Chamber & Regis",
    description: "Optional legendary golems puzzle (needs Dive, Dig, Braille).",
    steps: [
      {
        id: "sealed-chamber-1",
        title: "Open the Sealed Chamber",
        location: "Route 134 (Dive)",
        summary: "Dive on Route 134 and read the Braille to unlock the chamber.",
        story: [
          "With all eight badges, the optional legendary hunt begins at the underwater Braille wall on Route 134. Dive, read the inscription, surface at the Sealed Chamber, and use Dig at the marked wall inside to open the inner sanctum.",
          "More Braille waits within — this is a puzzle that rewards patience and a party stocked with the right Pokémon.",
        ],
        details: [
          "Surf/Dive to the underwater Braille wall on Route 134 and read it.",
          "Surface and enter the Sealed Chamber; use Dig at the marked wall.",
          "Read the Braille inside to register the unlock.",
        ],
        tags: ["dive", "braille", "sealed-chamber"],
      },
      {
        id: "sealed-chamber-2",
        title: "Party trick & the Regi trio",
        location: "Sealed Chamber",
        summary: "Place Relicanth first and Wailord last to open the Regi tombs.",
        story: [
          "The inner chamber's Braille demands a specific party: Relicanth in slot 1, Wailord in slot 6. Arrange them, read the inscription, and the game trembles — three tombs across Hoenn unlock simultaneously.",
          "Regirock waits in the Route 111 desert, Regice on a Route 105 island, and Registeel in the Ancient Tomb on Route 120. Each golem is level 40 and hits hard; save before every encounter, and bring Spore or False Swipe if you want clean catches.",
        ],
        details: [
          "Set party slot 1 = Relicanth and slot 6 = Wailord, then read the inner Braille.",
          "This opens Regirock (Route 111 desert), Regice (Route 105 island), Registeel (Route 120).",
          "Each golem is lv 40 — save before catching and use Spore/False Swipe if you can.",
        ],
        tips: ["Regis are lv 40; a Breloom with Spore + False Swipe makes captures painless."],
        secrets: [
          "All three Regis are level 40 — lower than most legendaries, making them ideal Master Ball targets if Rayquaza already has yours.",
        ],
        tags: ["regi", "sealed-chamber"],
      },
      {
        id: "sealed-chamber-3",
        title: "Catch Regirock",
        location: "Desert Ruins (Route 111)",
        summary: "Lv 40 — stand on the center panel and use Strength to open the tomb.",
        story: [
          "With the Sealed Chamber puzzle solved, the Desert Ruins in Route 111's northeast desert stir to life. Enter the inner chamber, stand on the center panel, walk right twice and down twice, then use Strength — the golem's door grinds open.",
          "Regirock hits hard for level 40. Save before the battle, and remember Emerald's quirk: if you knock it out within the first three turns, it flees instead of fainting normally.",
        ],
        details: [
          "Enter the Desert Ruins on Route 111 (Go-Goggles required for the desert).",
          "Stand on the center panel, go right twice, down twice, then use Strength.",
          "Regirock is level 40 — save before battling.",
          "Don't KO Regirock within the first 3 turns or it flees.",
        ],
        tips: ["Spore + False Swipe makes the catch painless if you brought a Breloom."],
        tags: ["regirock", "regi", "sealed-chamber"],
      },
      {
        id: "sealed-chamber-4",
        title: "Catch Regice",
        location: "Island Cave (Route 105)",
        summary: "Lv 40 — walk clockwise along the walls without touching them.",
        story: [
          "West of Dewford, a lone island on Route 105 hides the Island Cave. Inside, the Braille floor demands patience: hug the inner wall and walk clockwise all the way around without stepping off the path. Complete the loop and the chamber to Regice opens.",
          "Same three-turn flee rule applies — status and False Swipe are your friends.",
        ],
        details: [
          "Surf to the island cave on Route 105, west of Dewford.",
          "Walk clockwise hugging the wall all the way around the inner room.",
          "Regice is level 40 — save before battling.",
          "Don't KO Regice within the first 3 turns or it flees.",
        ],
        tags: ["regice", "regi", "sealed-chamber"],
      },
      {
        id: "sealed-chamber-5",
        title: "Catch Registeel",
        location: "Ancient Tomb (Route 120)",
        summary: "Lv 40 — follow the Braille movement pattern on the center panel.",
        story: [
          "You passed the Ancient Tomb on Route 120 weeks ago — now, with the Regi puzzle complete, the sealed door responds. Stand on the center panel and follow the pattern: down twice, left twice, right twice, up twice. Registeel's chamber unlocks.",
          "Its defenses are the highest of the trio; chip away with super-effective hits and wear it down carefully before throwing Balls.",
        ],
        details: [
          "Surf to the Ancient Tomb in Route 120's water area.",
          "Stand on the center panel: down twice, left twice, right twice, up twice.",
          "Registeel is level 40 — save before battling.",
          "Fighting and Ground moves help; status + False Swipe recommended.",
        ],
        secrets: [
          "All three Regis are level 40 — ideal Master Ball targets if Rayquaza already claimed yours.",
        ],
        tags: ["registeel", "regi", "sealed-chamber"],
      },
    ],
  },
  {
    id: "victory-road",
    title: "Ch. 43 — Victory Road",
    description: "The final gauntlet cave before the Pokémon League.",
    steps: [
      {
        id: "victory-road-1",
        title: "Reach Ever Grande City",
        location: "Route 128 → Ever Grande City",
        summary: "Surf and Waterfall east to Ever Grande City, home of the League.",
        story: [
          "From Sootopolis, Surf east across Route 128 and climb the great waterfall to Ever Grande City — a quiet plateau town that exists for one purpose: the Pokémon League. Heal, buy Full Restores and Revives until your bag groans, and steel yourself. There's no turning back once you enter Victory Road.",
        ],
        details: [
          "Surf east and climb the Waterfall to reach Ever Grande City's plateau.",
          "Heal and stock up on Full Restores, Revives, and status healers.",
        ],
        tags: ["ever-grande", "victory-road"],
      },
      {
        id: "victory-road-2",
        title: "Navigate Victory Road",
        location: "Victory Road",
        summary: "A cave requiring Rock Smash, Strength, Waterfall, and (optionally) Flash.",
        story: [
          "Victory Road is the last gauntlet — a sprawling cave of Strength boulders, Rock Smash barriers, and Waterfall climbs that demands an HM-laden carrier in your party. Trainers here are Elite Four calibre, and the wild Pokémon are strong.",
          "Near the entrance, Wally reappears for one last battle, his team fully evolved and genuinely dangerous. Beat him, push deeper, and keep an eye out for Bagon — a rare spawn here that evolves into the fearsome Salamence. At the far end, the League doors wait.",
        ],
        details: [
          "Solve Strength-boulder and Rock Smash puzzles to progress.",
          "Wally reappears near the entrance for a tough battle with his evolved team.",
          "Catch Golbat, Hariyama, Lairon, Medicham, and the rare Bagon (→ Salamence).",
        ],
        tips: ["Bring an HM carrier with Strength, Rock Smash, and Waterfall."],
        secrets: [
          "Bagon is a rare Victory Road spawn — if you missed the one in Meteor Falls, this is your last easy chance before the League.",
        ],
        tags: ["cave", "wally", "bagon", "victory-road"],
      },
    ],
  },
  {
    id: "league",
    title: "Ch. 44 — Pokémon League",
    description: "The Elite Four and Champion Steven.",
    steps: [
      {
        id: "league-1",
        title: "Elite Four — Sidney & Phoebe",
        location: "Pokémon League",
        summary: "Begin with Sidney (Dark) and Phoebe (Ghost).",
        story: [
          "The Pokémon League is a gauntlet of four Elite Four members with no healing between them — save before you step through the doors, because there's no exit until you win or wipe out.",
          "Sidney leads with a Dark-type squad (Mightyena, Shiftry, Cacturne, Crawdaunt, Absol) that folds to Fighting and Bug moves. Phoebe follows with Ghost-types — twin Dusclops, Banette, and Sableye — where Dark-type attacks or simply strong neutral hits carry the day. Pace yourself and don't burn through your Full Restores too early.",
        ],
        details: [
          "Sidney (Dark): Mightyena, Shiftry, Cacturne, Crawdaunt, Absol — Fighting/Bug moves help.",
          "Phoebe (Ghost): two Dusclops, Banette, Sableye — bring Dark or strong neutral hits.",
          "You cannot heal at a PC between members — pack plenty of Full Restores.",
        ],
        tips: ["Save before entering; there's no exit once you start the gauntlet."],
        tags: ["elite-four", "league"],
      },
      {
        id: "league-2",
        title: "Elite Four — Glacia & Drake",
        location: "Pokémon League",
        summary: "Continue with Glacia (Ice) and Drake (Dragon).",
        story: [
          "Glacia brings the cold — Sealeo, Glalie, and the bulky Walrein — all of which crumble to Fighting, Rock, Fire, and Steel. Drake is the real test: a full Dragon-type lineup of Shelgon, Altaria, Flygon, Kingdra, and Salamence, with the last two hitting like freight trains.",
          "Ice and Dragon moves are your friends here, but watch Salamence's Intimidate dropping your Attack on switch-in. If you've saved your strongest hits for the back half, you should have enough left to push through.",
        ],
        details: [
          "Glacia (Ice): Sealeo, Glalie, Walrein — Fighting, Rock, Fire, and Steel moves win.",
          "Drake (Dragon): Shelgon, Altaria, Flygon, Kingdra, Salamence — Ice and Dragon moves are key.",
          "Watch for Salamence's Intimidate and strong physical hits.",
        ],
        tags: ["elite-four", "league"],
      },
      {
        id: "league-3",
        title: "Champion Steven & the Hall of Fame",
        location: "Pokémon League",
        summary: "Defeat Champion Steven's Steel/Rock team to win the game.",
        story: [
          "Beyond the Elite Four waits Steven — the quiet stone collector you met in Granite Cave, now revealed as Hoenn's Champion. His team is a wall of Steel and Rock: Skarmory, Aggron, Claydol, Cradily, Armaldo, and the ace Metagross, all in the high fifties with devastating coverage.",
          "Fire, Fighting, and Ground moves punch through the Steel/Rock core, but save your best for Metagross — it knows Meteor Mash and Earthquake and will not go quietly. Defeat Steven and you enter the Hall of Fame. You've beaten Pokémon Emerald.",
        ],
        details: [
          "Steven: Skarmory, Aggron, Claydol, Cradily, Armaldo, and Metagross (lv 57–58).",
          "Fire, Fighting, and Ground coverage handle his Steel/Rock core; Metagross is the ace.",
          "Win to enter the Hall of Fame — congratulations, you've beaten Pokémon Emerald!",
        ],
        tips: ["Metagross has Meteor Mash and Earthquake — a fast, strong Fire/Ground attacker is ideal."],
        secrets: [
          "After the credits, you return home to find a National Dex upgrade waiting — the post-game opens the Battle Frontier and more optional content across Hoenn.",
        ],
        tags: ["champion", "steven", "hall-of-fame", "league"],
      },
      {
        id: "league-4",
        title: "Latios or Latias",
        location: "Littleroot Town (your house)",
        summary: "Lv 40 roamer — watch TV after becoming Champion.",
        story: [
          "The credits have rolled, the National Dex is yours, and life in Littleroot feels different. Go home and watch the living-room TV — a news report flashes about a mysterious flying Pokémon seen across Hoenn.",
          "Mom asks which colour you saw on screen: red means Latias, blue means Latios. Your choice is permanent. The bird begins roaming the region at level 40, appearing on random routes until you corner it.",
        ],
        details: [
          "After the Hall of Fame, watch TV in your Littleroot home.",
          "Choose red (Latias) or blue (Latios) on the news report.",
          "It roams Hoenn at level 40 — check the Pokédex location tab after each encounter.",
          "Mean Look, Arena Trap, or a Master Ball secures the catch.",
        ],
        tips: ["Repel + lead under lv 40 + Dex tracking helps re-trigger encounters on the same route."],
        secrets: [
          "Deoxys isn't available on a normal cartridge — it requires the AuroraTicket event item to reach Birth Island / Navel Rock.",
          "Jirachi requires the Pokémon Colosseum Bonus Disc or an official event distribution — not catchable through normal gameplay.",
        ],
        tags: ["latios", "latias", "roamer", "post-game", "littleroot"],
      },
    ],
  },
  {
    id: "battle-frontier",
    title: "Ch. 45 — Battle Frontier (Post-Game)",
    description: "The ultimate post-game challenge unlocked after the League.",
    steps: [
      {
        id: "battle-frontier-1",
        title: "Reach the Battle Frontier",
        location: "Slateport → Battle Frontier",
        summary: "After the Hall of Fame, Scott invites you to the Battle Frontier.",
        story: [
          "The credits roll, you return to Littleroot, and the world is bigger than before — roaming Latios or Latias, the full National Dex, and a visitor named Scott who has watched your journey from the shadows. Impressed, he offers passage to the Battle Frontier, an island facility built for trainers who've conquered the League and want a harder test.",
          "Catch the ferry from Slateport Harbor and sail east to the Frontier's shore.",
        ],
        details: [
          "Scott meets you (near Littleroot/Slateport) and offers passage to the Frontier.",
          "Take the ferry from Slateport Harbor to the Battle Frontier island.",
        ],
        tags: ["post-game", "battle-frontier"],
      },
      {
        id: "battle-frontier-2",
        title: "The seven facilities",
        location: "Battle Frontier",
        summary: "Battle seven Frontier Brains for Symbols and Battle Points.",
        story: [
          "The Battle Frontier is Emerald's crown jewel — seven distinct facilities, each with its own rules and a Frontier Brain guarding the top prize. The Battle Tower tests straight singles and doubles; the Dome is a tournament bracket; the Palace lets Pokémon fight by nature; the Arena judges combo potential; the Factory rents you random Pokémon; the Pike is a luck-driven gauntlet; and the Pyramid shuffles the map every run.",
          "Win streaks earn Battle Points to spend on rare TMs, held items, and move tutors. Beat each Brain twice for Silver and Gold Symbols — the ultimate proof that your teambuilding skill goes beyond the story. Here, levels are capped and over-levelled favourites won't carry you; synergy and movesets are everything.",
        ],
        details: [
          "Facilities: Battle Tower, Dome, Palace, Arena, Factory, Pike, and Pyramid.",
          "Earn Battle Points (BP) to buy rare items, TMs, and move tutors.",
          "Beat each Frontier Brain twice for the Silver and Gold Symbols.",
        ],
        tips: ["The Frontier disables over-leveling — team synergy and movesets matter most here."],
        secrets: [
          "BP shop highlights: Choice Band, Choice Specs, Leftovers, and the move tutors for elemental punches and Signal Beam — all Frontier exclusives.",
        ],
        tags: ["post-game", "frontier-brains", "battle-frontier"],
      },
    ],
  },
];
