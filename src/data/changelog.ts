/**
 * Application changelog — update this file whenever you ship a user-facing change,
 * then bump `version` in package.json to match the new top entry.
 *
 * Newest release first. Group changes under clear headings and be specific enough
 * that someone reading months later knows exactly what changed.
 */

export interface ChangelogSection {
  heading: string;
  items: string[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  summary: string;
  sections: ChangelogSection[];
}

export const CHANGELOG: ChangelogRelease[] = [
  {
    version: "1.11.7",
    date: "2026-07-12",
    summary: "Emerald evolution accuracy pass: friendship list, Porygon2 trade, and Tyrogue’s unique branch.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Verified Emerald friendship evolutions in Event 4 story: threshold ~220, Soothe Bell, and the complete set (Pichu → Pikachu then Thunder Stone for Raichu, Cleffa, Igglybuff, Togepi, Azurill, plus Golbat / Chansey / Eevee) with the chart keeping the full list.",
          "Event 3 tips now call out Porygon + Up-Grade → Porygon2 on trade.",
          "Event 5 story and tips cover Tyrogue’s Attack/Defense split at Lv 20 into Hitmonlee, Hitmonchan, or Hitmontop.",
        ],
      },
      {
        heading: "Sprites & evolution charts",
        items: [
          "Synced the Up-Grade bag icon (public/sprites/items/icons/up_grade.png) and registered it in itemIconsGenerated for the Porygon2 trade chart.",
        ],
      },
    ],
  },
  {
    version: "1.11.6",
    date: "2026-07-12",
    summary: "Visual evolution charts for all Ch. 1 steps; What to do lists removed; trade-item bag icons synced.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Every Ch. 1 Pregame: Evolution step (Events 1–5) shows a visual EvolutionChart — basics, stones, trade (with held items), friendship/taming, and unique methods (Nincada/Shedinja, Feebas Beauty, etc.).",
          "Events 1 and 3–5 no longer show a What to do checklist — story text, the charts above, and tips cover the method details (Event 2 was already cleared).",
          "Trading, friendship, and unique-evolution story blurbs are shorter so they explain the method without re-listing every species the charts already show.",
          "Tips now call out Everstone-on-trade, Abandoned Ship Deep Sea items, canceling friendship evolutions, Route 119 Feebas tiles, and Beauty-friendly natures where those lines left the old checklists.",
        ],
      },
      {
        heading: "Sprites & evolution charts",
        items: [
          "Synced bag icons for Metal Coat, Dragon Scale, King’s Rock, Deep Sea Tooth, Deep Sea Scale, and Soothe Bell under public/sprites/items/icons/.",
          "Evolution chart itemIconName / itemIconPath values now match itemIconsGenerated keys and PNG filenames (Metal Coat, Dragon Scale, King’s Rock → king_s_rock.png, Deep Sea Tooth/Scale → deep_sea_tooth.png / deep_sea_scale.png, Soothe Bell).",
        ],
      },
    ],
  },
  {
    version: "1.11.5",
    date: "2026-07-12",
    summary: "Evolution stones step drops the redundant What to do checklist.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Ch. 1 Event 2 no longer shows a What to do list — story text, the stone chart, and tips cover that information.",
        ],
      },
    ],
  },
  {
    version: "1.11.4",
    date: "2026-07-12",
    summary: "Stone evolution chart layout fills the step width on desktop.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Evolution rows now sit in a responsive grid with balanced from → stone → to columns, so desktop no longer leaves a large empty strip on the right.",
        ],
      },
    ],
  },
  {
    version: "1.11.3",
    date: "2026-07-12",
    summary: "Evolution stones prose no longer duplicates the sprite chart.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Removed the long stone-by-stone species list from Ch. 1 Event 2 story text; the stone evolution chart now carries a short summary and the full visual list.",
        ],
      },
    ],
  },
  {
    version: "1.11.2",
    date: "2026-07-12",
    summary: "Pregame Evolution and Breeding steps no longer show unrelated route maps.",
    sections: [
      {
        heading: "Walkthrough — pregame",
        items: [
          "Removed map crops and area-linked encounter/secret side panels from Pregame Evolution and Breeding steps — those chapters are mechanics reference, not location guides.",
        ],
      },
    ],
  },
  {
    version: "1.11.1",
    date: "2026-07-12",
    summary: "Evolution Stones step shows in-game stone and Pokémon sprites for every Emerald stone evolution.",
    sections: [
      {
        heading: "Walkthrough — Pregame: Evolution",
        items: [
          "Ch. 1 Event 2 (Evolution stones) now includes a visual stone chart: each Fire, Water, Thunder, Leaf, Moon, and Sun Stone row shows the bag-item sprite plus Emerald front sprites for every from → to evolution (including both Gloom branches and all three stone Eeveelutions).",
          "Added the missing Sun Stone bag icon so Sun Stone evolutions render with the authentic item graphic.",
        ],
      },
    ],
  },
  {
    version: "1.11.0",
    date: "2026-07-12",
    summary:
      "Pregame Evolution & Breeding chapters, Pokédex evolution methods and egg groups, and Feebas → Milotic coverage.",
    sections: [
      {
        heading: "Walkthrough — pregame",
        items: [
          "New Ch. 1 Pregame: Evolution covers how evolution works and Everstone/B-cancel prevention, Evolution stones, trading evolutions, friendship (taming) evolutions, and unique cases (Wurmple, Shedinja, Feebas/Milotic, Gardevoir-only Kirlia).",
          "New Ch. 2 Pregame: Breeding covers Day Care eggs, egg-group compatibility, Gen 3 inheritance (Everstone natures, three parent IVs, egg moves), and hatching tips — story chapters renumber so Littleroot starts at Ch. 3.",
          "Route 117 Day Care and Contest Preparation now point back to the Breeding chapter for full rules; Contest Prep also documents Beauty Pokéblocks for Milotic.",
        ],
      },
      {
        heading: "Pokédex — evolution & breeding",
        items: [
          "Species data now includes Emerald-filtered evolution methods (branching lines like Wurmple, Eevee, Clamperl, Nincada/Shedinja) and egg groups from the offline sync.",
          "Pokédex detail shows each evolution edge with its method, plus egg groups on the species panel.",
          "Breeding compatibility lookup on the Pregame Breeding “Compatibility & egg groups” step — pick two species to see if they can produce an Egg and what generally hatches (including Ditto and incense babies).",
        ],
      },
      {
        heading: "Route 119 — Feebas",
        items: [
          "Walkthrough, area secrets, encounter table, and map pin explain Dewford-trend fishing tiles (six moving water tiles; any rod; not surf) and the Beauty 170+ path to Milotic.",
        ],
      },
      {
        heading: "Maps — pregame steps",
        items: [
          "Pregame Evolution and Breeding steps open focused Hoenn map crops (Day Care, Lilycove stones, Route 113 Soothe Bell, Abandoned Ship waters, Route 119 Feebas zone, Lavaridge Wynaut Egg).",
        ],
      },
    ],
  },
  {
    version: "1.10.77",
    date: "2026-07-12",
    summary: "Pokédex card names no longer collide with dex numbers on iOS.",
    sections: [
      {
        heading: "Pokédex — mobile",
        items: [
          "Long Pokémon names on list cards now ellipsize instead of running into the #000 number, and the number stays fixed-width so it cannot be squeezed on narrow iOS layouts.",
        ],
      },
    ],
  },
  {
    version: "1.10.76",
    date: "2026-07-12",
    summary: "Wild Pokémon map pins no longer imply different encounters per grass patch.",
    sections: [
      {
        heading: "Maps — wild encounters",
        items: [
          "Route maps now show one tall-grass pin (and one surf/fish pin where relevant) instead of separate markers on each grass clump — Emerald uses one encounter table per map + terrain type, shared by every tile of that terrain.",
          "Pin labels and details say the table applies to any matching tile on the route; Kecleon stays as a fixed-location pin because those are scripted encounters, not the grass table.",
          "Wally’s Ralts catch on Route 102 is a story POI, separate from the route-wide grass marker.",
        ],
      },
    ],
  },
  {
    version: "1.10.75",
    date: "2026-07-12",
    summary: "Walkthrough search finds items, story beats, and secrets — not just step titles.",
    sections: [
      {
        heading: "Walkthrough — search",
        items: [
          "The step search box now looks through story text, objectives, tips, secrets, tags, linked route items/hidden items, gym names, and wild Pokémon — so queries like “Master Ball” return the Magma Hideout pickup and related mentions.",
          "Matching steps show a short snippet under the title (e.g. Objectives / Story / Item) and a result count, ranked so titles and item pickups surface before looser story mentions.",
        ],
      },
    ],
  },
  {
    version: "1.10.74",
    date: "2026-07-12",
    summary: "Walkthrough search no longer leaves the page stuck zoomed in on phones.",
    sections: [
      {
        heading: "Walkthrough — mobile",
        items: [
          "The step filter box (and other search fields) now use a 16px font on mobile/touch layouts so iOS Safari does not auto-zoom into the text field while you type.",
          "That keeps the guide at normal scale while filtering steps, instead of staying magnified after you stop typing.",
        ],
      },
    ],
  },
  {
    version: "1.10.73",
    date: "2026-07-12",
    summary: "Berry and item descriptions on the Hoenn map no longer show raw game placeholders.",
    sections: [
      {
        heading: "Maps — item text",
        items: [
          "Berry pin descriptions that showed “{POKEBLOCK} ingredient… grow NANAB” now read “Pokéblock ingredient… grow Nanab,” matching cleaned Emerald text.",
          "Mart and map item descriptions normalize the same placeholders (Pokéblock / Pokémon) so names and blurbs stay consistent across the overworld map, area maps, and shop inventories.",
          "Generators clean item text when regenerating map points and marts, so future decomp syncs keep readable descriptions.",
        ],
      },
    ],
  },
  {
    version: "1.10.72",
    date: "2026-07-12",
    summary: "Walkthrough interior map titles are clean — no broken characters or double “Gym” labels.",
    sections: [
      {
        heading: "Walkthrough — maps",
        items: [
          "Fixed area-map captions like Dewford Town Gym that showed a missing-glyph control character and repeated “Gym” under the interior map.",
          "Gym map labels now read cleanly (e.g. “Dewford Town Gym”, “Lavaridge Town Gym - 1F”) across walkthrough cards and the zoom lightbox.",
        ],
      },
    ],
  },
  {
    version: "1.10.71",
    date: "2026-07-12",
    summary: "GitHub Pages deploys again — pin verification no longer blocks CI builds.",
    sections: [
      {
        heading: "Reliability",
        items: [
          "Map/shop pin verify scripts skip pokeemerald regeneration when `.calib/` is absent (as on GitHub Actions), so `npm run build` succeeds in CI while still enforcing committed pin allowlists and route centers.",
          "This unblocks Pages deploys that had been stuck on v1.10.65 after pin-accuracy checks were added to the build.",
        ],
      },
    ],
  },
  {
    version: "1.10.70",
    date: "2026-07-12",
    summary: "Mobile walkthrough gym maps no longer overflow the screen or hide the legend.",
    sections: [
      {
        heading: "Walkthrough — maps",
        items: [
          "Gym and other tall interior maps in the mobile lightbox are capped to about half the screen height and sized by their aspect ratio, so maps like Mauville and Petalburg no longer load oversized.",
          "The marker legend below the map stays visible and scrolls inside the remaining space instead of being clipped off the bottom.",
        ],
      },
    ],
  },
  {
    version: "1.10.69",
    date: "2026-07-12",
    summary: "Walkthrough map markers stay larger in opened guide maps.",
    sections: [
      {
        heading: "Maps — walkthrough zoom",
        items: [
          "Boosted marker, trainer, item, hidden-item, and berry sprite sizes in walkthrough map lightboxes so they remain readable after opening a guide map.",
          "Zooming in no longer shrinks walkthrough map markers below their original size, and gym badge pins keep an extra visibility boost.",
        ],
      },
    ],
  },
  {
    version: "1.10.68",
    date: "2026-07-12",
    summary: "Lilycove Department Store shop guide lists stock by floor and register — including the rooftop vending machine.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Lilycove Department Store detail panel now uses floor tabs (2F–5F + Rooftop) with each clerk’s stock under Left / Right register (and the four 5F decoration counters).",
          "Added the rooftop vending machine drinks (Fresh Water, Soda Pop, Lemonade) and the PokéNews clear-out sale clerk inventory.",
          "All twelve merchants keep bag-item sprites next to each listing.",
        ],
      },
    ],
  },
  {
    version: "1.10.67",
    date: "2026-07-12",
    summary: "Every main Hoenn map marker is verified against pokeemerald — towns, gyms, landmarks, items, and shops stay accurate.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Town, gym, and landmark pins on the main Hoenn map are now generated (`npm run gen:map-landmarks`): towns use each city’s composite bbox center; gyms and landmarks use outdoor entrance warp tiles from pokeemerald.",
          "Item / berry / hidden / entrance pins regenerate via `npm run gen:map-points` into `mapPointsGenerated.ts` (same true-scale tile→% formula as the composite).",
          "Hand-edited `MAP_POINTS` is limited to places not on the outdoor atlas (Sootopolis, Mt. Chimney, Battle Frontier, and indoor lobby marts), listed in `APPROXIMATE_MAP_PIN_IDS`.",
          "Build runs `npm run verify:map-pins` so curated pins cannot drift: regenerators must match committed files, route centers must match `AREA_MAP_BOUNDS`, and new hand pins must be allowlisted.",
        ],
      },
    ],
  },
  {
    version: "1.10.66",
    date: "2026-07-12",
    summary: "Slateport Market pin is now on the real market plaza — shop markers stay source-accurate.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Moved the Slateport Market shop pin from a hand-guessed spot near the shipyard to the in-game Market sign on the SW plaza (tile-exact from pokeemerald + the Hoenn composite manifest).",
          "Outdoor shop landmarks that are not building entrances are now generated by `npm run gen:shop-pins` into `shopPinsGenerated.ts` (same coordinate formula as entrance/item pins).",
          "Build runs `npm run verify:shop-pins` so new hand-placed shop pins cannot sneak in without being generated or explicitly marked approximate (Sootopolis / Frontier / League lobby only).",
        ],
      },
    ],
  },
  {
    version: "1.10.65",
    date: "2026-07-12",
    summary: "Map hover labels stay readable near the top and edges of the viewport.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Hover name bubbles on map pins (shops, towns, and other markers) now flip below or shift sideways when they would clip off the top or sides of the map frame — northern shops like Fortree no longer hide their labels.",
        ],
      },
    ],
  },
  {
    version: "1.10.64",
    date: "2026-07-12",
    summary: "Confirmed the guide runs fully offline — sprites and data stay local.",
    sections: [
      {
        heading: "Reliability",
        items: [
          "Audited the app: no runtime requests to CDNs or external APIs for sprites, fonts, maps, or shop data — everything is served from bundled `public/` assets and local TypeScript data.",
          "Added `npm run verify:local-assets` (also runs during `npm run build`) to fail if any referenced image is missing from `public/` or if app source gains an external data URL.",
          "Shop item-icon sync now caches any one-time pokeemerald downloads under `.calib/asset-cache/` and supports `OFFLINE=1` so regenerating icons does not require the network when sources are already local.",
        ],
      },
    ],
  },
  {
    version: "1.10.63",
    date: "2026-07-12",
    summary: "Shop guides show item sprites and cover every overworld storefront.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Shop detail panels now show each item’s bag sprite next to its name and price (mart icons are synced from pokeemerald).",
          "Pretty Petal Flower Shop on Route 104 is a Shops pin: plant decorations after the Dynamo Badge, plus free Wailmer Pail / daily berry notes.",
          "Also marked as shops with full merchandise panels: Fortree Decoration Shop, Route 113 Glass Workshop (ash prices), Slateport Market stalls, Battle Frontier Mart, and the Pokémon League lobby mart.",
          "Lilycove Department Store guide now includes 5F decoration clerks (dolls, cushions, posters, mats).",
        ],
      },
    ],
  },
  {
    version: "1.10.62",
    date: "2026-07-11",
    summary: "Click Poké Marts on the Hoenn map to see shop stock and prices.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Poké Mart, Herb Shop, Bike Shop, and Lilycove Department Store pins now open a shop guide modal with item lists, prices, and short descriptions from the game data.",
          "A new **Shops** legend filter (on by default with Towns & Routes) shows mart pins in teal so they are easy to find without turning on every entrance.",
          "Marts that expand mid-game (Oldale, Petalburg, Rustboro) include Early stock / Full stock tabs with unlock notes so you know when new items appear.",
          "Added a Sootopolis Mart pin on the overworld map (it was missing from generated entrance markers).",
          "Fixed map marker clicks on desktop: clicking a shop (or other pin) no longer starts a pan, so the shop guide opens immediately instead of only showing the hover label.",
        ],
      },
    ],
  },
  {
    version: "1.10.61",
    date: "2026-07-08",
    summary: "Desktop main map panning now keeps tracking through long drags.",
    sections: [
      {
        heading: "Maps — desktop panning",
        items: [
          "Main Hoenn map mouse panning now tracks movement from the window after drag start, so dragging stays responsive while crossing markers, labels, or the edge of the map viewport.",
          "Interactive controls and marker taps/clicks remain available without starting an unwanted pan.",
        ],
      },
    ],
  },
  {
    version: "1.10.60",
    date: "2026-07-08",
    summary: "Desktop main map dragging stays reliable when panning across markers.",
    sections: [
      {
        heading: "Maps — desktop panning",
        items: [
          "Mouse drags on the main Hoenn map can now begin over map markers, preventing dense marker areas from blocking pan navigation after zooming in.",
          "Marker clicks and touch marker taps still open marker details normally.",
        ],
      },
    ],
  },
  {
    version: "1.10.59",
    date: "2026-07-08",
    summary: "Walkthrough map markers stay larger while zooming, with gym badges emphasized.",
    sections: [
      {
        heading: "Maps — walkthrough zoom",
        items: [
          "Raised the minimum zoomed marker scale so sprites, item balls, hidden items, and standard markers remain easier to see.",
          "Gym badge pins now receive an additional size boost in walkthrough map lightboxes so gyms stand out from other markers.",
        ],
      },
    ],
  },
  {
    version: "1.10.58",
    date: "2026-07-08",
    summary: "Walkthrough area map image taps now open the lightbox directly from the map frame.",
    sections: [
      {
        heading: "Maps — walkthrough images",
        items: [
          "Area map frames now explicitly open the detailed zoomable lightbox in walkthrough cards, so Chapter 8 route/woods maps behave like Dewford and other Hoenn crop images.",
        ],
      },
    ],
  },
  {
    version: "1.10.57",
    date: "2026-07-08",
    summary: "Walkthrough area map images open the detailed lightbox again.",
    sections: [
      {
        heading: "Maps — walkthrough images",
        items: [
          "Clicking or tapping interior/route area map images in walkthrough cards now opens the detailed zoomable map lightbox, matching Hoenn crop maps like Dewford Town.",
          "Marker clicks still show marker details without opening the lightbox.",
        ],
      },
    ],
  },
  {
    version: "1.10.56",
    date: "2026-07-08",
    summary: "Tall desktop walkthrough maps keep marker alignment in the lightbox.",
    sections: [
      {
        heading: "Maps — desktop lightbox",
        items: [
          "Desktop crop-fit lightboxes now size their width from the crop aspect ratio, fixing tall maps like Route 104 whose markers were spread far left and right.",
          "Removed the Hoenn crop contain fallback so pins and the map image use the same coordinate box.",
        ],
      },
    ],
  },
  {
    version: "1.10.55",
    date: "2026-07-08",
    summary: "Walkthrough map pins stay readable when you zoom in.",
    sections: [
      {
        heading: "Maps — walkthrough zoom",
        items: [
          "Trainer sprites, item balls, hidden items, and other walkthrough map pins now keep a larger minimum size while zooming so they do not shrink away.",
        ],
      },
    ],
  },
  {
    version: "1.10.54",
    date: "2026-07-08",
    summary: "Desktop town map lightboxes no longer stretch square Hoenn crops.",
    sections: [
      {
        heading: "Maps — desktop lightbox",
        items: [
          "Desktop walkthrough map lightboxes now preserve the Hoenn crop aspect ratio, fixing stretched square town maps like Oldale Town.",
          "Crop-fit images use contain sizing as a safeguard against future aspect-ratio drift.",
        ],
      },
    ],
  },
  {
    version: "1.10.53",
    date: "2026-07-08",
    summary: "The changelog modal now stays within the visible viewport.",
    sections: [
      {
        heading: "Changelog",
        items: [
          "Constrained the changelog modal using dynamic viewport height and safe-area padding so the top no longer runs offscreen or gets cut off on mobile browsers.",
        ],
      },
    ],
  },
  {
    version: "1.10.52",
    date: "2026-07-08",
    summary: "The app is now branded as Emerald Guide without a dash.",
    sections: [
      {
        heading: "Branding",
        items: [
          "Updated the browser tab title, header brand, changelog subtitle, and README references to use Emerald Guide.",
        ],
      },
    ],
  },
  {
    version: "1.10.51",
    date: "2026-07-08",
    summary: "The app is now branded as Emerald Guide in browser and UI labels.",
    sections: [
      {
        heading: "Branding",
        items: [
          "Updated the browser tab title, header brand, changelog subtitle, and README references to use Emerald Guide.",
        ],
      },
    ],
  },
  {
    version: "1.10.50",
    date: "2026-07-08",
    summary: "Walkthrough position is preserved when you switch to the map and back.",
    sections: [
      {
        heading: "Walkthrough — navigation",
        items: [
          "Leaving the walkthrough for the Hoenn Map (or Pokédex) no longer resets your current step — returning picks up where you left off.",
        ],
      },
    ],
  },
  {
    version: "1.10.49",
    date: "2026-07-08",
    summary: "Item bag icons in map callouts actually render now (were blank PNGs).",
    sections: [
      {
        heading: "Maps — item icon fix",
        items: [
          "Fixed sync:item-icons palette lookup: pngjs stores palette entries as arrays, so every pixel was keyed out as transparent (81-byte blank PNGs).",
          "Icons now remap through the correct source palette baked into each pret graphic, then apply the item's own palette for shared sprites like X items and potions.",
        ],
      },
    ],
  },
  {
    version: "1.10.48",
    date: "2026-07-08",
    summary: "Item bag icons in map callouts now load reliably in the browser.",
    sections: [
      {
        heading: "Maps — item icon fix",
        items: [
          "Bag icons are now exported as RGBA PNGs with the correct per-item palette (fixes invisible or broken images in the selection callout).",
          "Each item gets its own icon file (e.g. guard_spec.png vs dire_hit.png) so shared graphics like X items render with the right colors.",
        ],
      },
    ],
  },
  {
    version: "1.10.47",
    date: "2026-07-08",
    summary: "Item and hidden-item map callouts now show the in-game bag icon beside the description.",
    sections: [
      {
        heading: "Maps — selection callout sprites",
        items: [
          "Tapping a visible item or hidden item pin shows that item's authentic bag icon (Potion, Revive, TM, etc.) in the on-map callout, scaled up for readability.",
          "Entrances, berries, towns, and other pin types keep a text-only callout.",
          "New `npm run sync:item-icons` script downloads the needed icons from pokeemerald into `public/sprites/items/icons/`.",
        ],
      },
    ],
  },
  {
    version: "1.10.46",
    date: "2026-07-08",
    summary: "Item and entrance details now appear on the map when you tap a pin.",
    sections: [
      {
        heading: "Maps — pin details on click",
        items: [
          "Clicking or tapping an item ball, berry, hidden item, or entrance now shows its name and description in a callout on the map itself instead of only in the legend panel below.",
          "Works in the full Hoenn map and the compact map modal, including on touch devices.",
        ],
      },
    ],
  },
  {
    version: "1.10.45",
    date: "2026-07-08",
    summary: "Hidden item map pins no longer show a dashed outline around the sprite.",
    sections: [
      {
        heading: "Maps — hidden item pins",
        items: [
          "Removed the dotted/dashed border overlay on hidden-item pins; they now render as the Itemfinder ball sprite only, like regular item balls.",
        ],
      },
    ],
  },
  {
    version: "1.10.44",
    date: "2026-07-08",
    summary: "Caves and dungeons are no longer a separate map layer — they show as gray entrance pins only.",
    sections: [
      {
        heading: "Maps — cave/dungeon pins",
        items: [
          "Removed the purple Caves & Dungeons layer and hand-placed cave pins from the main Hoenn map; cave and dungeon locations are covered by the existing gray entrance markers from game data.",
          "Walkthrough crop maps now mark cave, tunnel, woods, and dungeon doorways as entrance pins (gray) instead of green story POIs.",
        ],
      },
    ],
  },
  {
    version: "1.10.43",
    date: "2026-07-08",
    summary: "Berry tree map pins now use the correct in-game sprite size and ground anchoring.",
    sections: [
      {
        heading: "Maps — berry pin alignment",
        items: [
          "Berry tree pins now use the authentic 16×32 overworld sprite (one tile wide, two tall) instead of a doubled 32×32 crop that showed two trees side by side.",
          "Berry coordinates anchor to the soil at the bottom of each tile, matching trainer and NPC foot placement on the map.",
          "Walkthrough crop zoom no longer recenters berry/item sprites — they keep their ground anchor while scaling.",
        ],
      },
    ],
  },
  {
    version: "1.10.42",
    date: "2026-07-08",
    summary: "Walkthrough map pins now match the main Hoenn map with distinct colors and no stacked duplicates.",
    sections: [
      {
        heading: "Maps — walkthrough pin overhaul",
        items: [
          "Walkthrough crops now load pins from the same main-map data as the full Hoenn map (entrances, items, berries, trainers, landmarks) before adding guide-only markers.",
          "Removed stacked duplicates: overlapping entrances collapse to one gray pin; hand annotations are skipped when a main-map pin already exists at that spot.",
          "Route exit markers use blue route pins, grass/surf areas use green wild pins, and NPCs use light-blue ring pins — each visually distinct from landmarks and entrances.",
        ],
      },
    ],
  },
  {
    version: "1.10.41",
    date: "2026-07-08",
    summary: "Cave and building entrances on walkthrough maps no longer show duplicate green and gray pins.",
    sections: [
      {
        heading: "Maps — entrance deduplication",
        items: [
          "Hand-placed cave and building POI markers are now skipped when the main Hoenn map already has a gray entrance pin at the same location.",
          "Walkthrough maps show only the gray entrance marker for caves, tunnels, and woods — matching the main map.",
        ],
      },
    ],
  },
  {
    version: "1.10.40",
    date: "2026-07-08",
    summary: "Walkthrough landmark pins align correctly on crop maps and in the zoom lightbox.",
    sections: [
      {
        heading: "Maps — marker alignment",
        items: [
          "Fixed green landmark pins drifting on walkthrough maps by placing hand-authored markers in crop-local coordinates and tile-calibrated markers through the same display crop used for the image.",
          "Fixed landmark and entrance dots shifting when the map lightbox scales pins during zoom — pins now scale from their center anchor.",
        ],
      },
    ],
  },
  {
    version: "1.10.39",
    date: "2026-07-08",
    summary: "Walkthrough map pins now use the same entrance labels and categories as the main Hoenn map.",
    sections: [
      {
        heading: "Maps — walkthrough marker labels",
        items: [
          "Fixed building markers on walkthrough town/route crops showing as “Towns & Cities” instead of “Entrances”.",
          "Walkthrough crops now prefer the same game-extracted entrance pins used on the full Hoenn map, avoiding duplicate hand-placed building markers.",
        ],
      },
    ],
  },
  {
    version: "1.10.38",
    date: "2026-07-08",
    summary: "Town map pin redrawn as crisp 12×19 pixel art matching the requested marker.",
    sections: [
      {
        heading: "Maps — town markers",
        items: [
          "Replaced the blurry downscaled pin with hand-authored 12×19 pixel art: navy outline, gold cap, red body, and 2×2 white center.",
        ],
      },
    ],
  },
  {
    version: "1.10.37",
    date: "2026-07-08",
    summary: "Town map pin art updated to match the requested 14×18 teardrop marker.",
    sections: [
      {
        heading: "Maps — town markers",
        items: [
          "Town pin art replaced with the requested 14×18 teardrop marker (red body, gold cap, white center, navy outline).",
        ],
      },
    ],
  },
  {
    version: "1.10.36",
    date: "2026-07-08",
    summary: "Towns and cities on the Hoenn map now use a red map-pin sprite instead of a yellow dot.",
    sections: [
      {
        heading: "Maps — town markers",
        items: [
          "Town and city pins use a 13×17 teardrop map-pin sprite (red body, gold cap) anchored at the tip.",
          "New `npm run gen:town-pin` script regenerates public/sprites/map/town_pin.png.",
        ],
      },
    ],
  },
  {
    version: "1.10.35",
    date: "2026-07-08",
    summary: "Gym markers on the Hoenn map now show each gym's badge sprite instead of a generic diamond pin.",
    sections: [
      {
        heading: "Maps — gym badges",
        items: [
          "Each gym pin uses the corresponding Hoenn badge from the trainer card sheet (Stone, Knuckle, Dynamo, etc.).",
          "Badge sprites are synced via `npm run sync:gym-sprites` into public/sprites/gym/badges.png.",
        ],
      },
    ],
  },
  {
    version: "1.10.34",
    date: "2026-07-07",
    summary: "Hidden item map pins now use a grey-and-white Poké Ball matching the visible item ball size.",
    sections: [
      {
        heading: "Maps — collectible sprites",
        items: [
          "Hidden items no longer use the Itemfinder icon — they show a 16×16 Poké Ball with a grey top hemisphere and white bottom, derived from the same sprite as visible item balls.",
          "Dashed outline styling is kept so hidden items remain visually distinct from regular item balls.",
        ],
      },
    ],
  },
  {
    version: "1.10.33",
    date: "2026-07-07",
    summary: "Item, berry, and hidden-item map pins now use authentic game sprites instead of colored dots.",
    sections: [
      {
        heading: "Maps — collectible sprites",
        items: [
          "Visible item balls use the in-game 16×16 item ball overworld sprite on the Hoenn map, walkthrough crops, and interior area maps.",
          "Berry trees use a mature cheri berry tree sprite; hidden items use the Itemfinder icon with a dashed outline.",
          "New `npm run sync:item-sprites` script downloads sprites from pokeemerald into public/sprites/items/.",
        ],
      },
    ],
  },
  {
    version: "1.10.32",
    date: "2026-07-07",
    summary: "Interior map sprites no longer treat bedroom dolls and decoration placeholders as trainers.",
    sections: [
      {
        heading: "Walkthrough — interior sprites",
        items: [
          "Chapter 1 (player bedroom) no longer shows the Swablu doll or decoration-slot placeholders as clickable trainers.",
          "Hidden Mom and other FLAG_HIDE objects with no script are excluded from area map pins.",
          "Birch's Lab rival sprite is preserved via selective VAR_0/VAR_1 remapping only when the object has a Rival script.",
        ],
      },
    ],
  },
  {
    version: "1.10.31",
    date: "2026-07-07",
    summary: "Interior walkthrough maps now show NPC and trainer overworld sprites across caves, labs, tunnels, and dungeons.",
    sections: [
      {
        heading: "Walkthrough — interior sprites",
        items: [
          "All 96 area maps now scan pokeemerald for trainers, story NPCs, and key Pokémon overworld sprites.",
          "Birch's Lab shows Professor Birch, the aide, and your rival; Rusturf Tunnel shows Wanda, Peeko, and the Aqua grunt.",
          "Caves and story interiors include hikers, Team Magma/Aqua, Archie, Maxie, Steven, and legendaries where they appear on the map.",
          "New `npm run sync:area-map-entities` script; sprites saved under public/sprites/trainers/ and public/sprites/overworld/.",
        ],
      },
    ],
  },
  {
    version: "1.10.30",
    date: "2026-07-07",
    summary: "Gym walkthrough steps now show accurate interior maps with trainer sprites and full gym guide details.",
    sections: [
      {
        heading: "Walkthrough — gyms",
        items: [
          "Gym battle steps display pixel-perfect gym interior maps (fixes Mauville showing the Contest Hall by mistake).",
          "Trainer, gym leader, and NPC sprites appear at their in-game positions on gym floor plans — tap for party details.",
          "Gym steps embed the same leader, junior trainer, and puzzle info as clicking a gym on the Hoenn map.",
          "Multi-floor gyms (Lavaridge, Sootopolis) show both floors. New gym area maps generated via gen-area-maps.",
        ],
      },
    ],
  },
  {
    version: "1.10.29",
    date: "2026-07-07",
    summary: "Gym guide modals now show authentic overworld sprites for gym leaders and in-gym trainers.",
    sections: [
      {
        heading: "Hoenn map — gym sprites",
        items: [
          "Gym leader overworld sprites (Roxanne through Wallace) appear in the gym modal hero and leader battle section.",
          "Every junior trainer row shows their in-gym overworld sprite; tap still opens full party details.",
          "Tate & Liza display both leader sprites side by side. New `npm run sync:gym-sprites` script keeps assets in sync with pokeemerald.",
        ],
      },
    ],
  },
  {
    version: "1.10.28",
    date: "2026-07-07",
    summary: "Clicking a gym on the Hoenn map opens a full gym guide — leader, trainers, and walkthrough tips.",
    sections: [
      {
        heading: "Hoenn map — gyms",
        items: [
          "Gym markers now open a Gym guide modal with badge info, puzzle notes, walkthrough strategy, and the leader’s full party breakdown.",
          "Every junior trainer inside each gym is listed with a party preview — tap one for the same battle-details view as overworld trainers.",
          "Gym pins link to the correct walkthrough battle step; Sootopolis shows Wallace (Emerald’s 8th Gym Leader).",
        ],
      },
    ],
  },
  {
    version: "1.10.27",
    date: "2026-07-07",
    summary: "Wild encounter data is fully bundled — zero runtime data fetches.",
    sections: [
      {
        heading: "Offline data",
        items: [
          "wild_encounters.json is imported at build time instead of fetched on first Pokédex visit.",
          "The app no longer makes any network requests for guide data — everything ships in the bundle.",
        ],
      },
    ],
  },
  {
    version: "1.10.26",
    date: "2026-07-07",
    summary: "The Pokémon Finder is now simply called the Pokédex everywhere in the app.",
    sections: [
      {
        heading: "Naming",
        items: [
          "Renamed the Pokémon Finder tab and component to Pokédex — navigation, headers, and code now use consistent naming.",
        ],
      },
    ],
  },
  {
    version: "1.10.25",
    date: "2026-07-07",
    summary: "Pokédex, species stats, wild encounters, and fonts are fully offline — no runtime API calls.",
    sections: [
      {
        heading: "Offline data",
        items: [
          "Pokédex listings (Hoenn, National, All) ship as bundled data instead of PokéAPI fetches.",
          "Species detail panels (stats, types, abilities, flavor text, evolution) load from local data — no network needed.",
          "Wild encounter source JSON is bundled in the app and transformed at build time — no fetch on load.",
          "Inter font is self-hosted via @fontsource — Google Fonts CDN removed from index.html.",
          "Run npm run sync:offline-data to refresh dex, species, and wild data from upstream sources.",
        ],
      },
    ],
  },
  {
    version: "1.10.24",
    date: "2026-07-07",
    summary: "Pokémon Emerald sprites are bundled with the app — no more flaky CDN loads.",
    sections: [
      {
        heading: "Pokémon sprites",
        items: [
          "All 386 Gen 3 Emerald front sprites now live in public/sprites/pokemon/emerald/ and ship with the site.",
          "Route guide, Pokédex, and trainer party views load sprites from the same origin instead of jsDelivr.",
          "Run npm run sync:pokemon-sprites to refresh sprites from the PokeAPI sprite set if needed.",
        ],
      },
    ],
  },
  {
    version: "1.10.23",
    date: "2026-07-07",
    summary: "The main Hoenn map loads much faster with lossless compression and background preloading.",
    sections: [
      {
        heading: "Hoenn map (performance)",
        items: [
          "Losslessly compressed the full Hoenn overworld map — ~28 MB down to ~1.4 MB WebP (or ~4 MB PNG fallback) with identical pixels at full 12800×6128 resolution.",
          "Safari and modern browsers load the WebP automatically; older browsers still get the optimized PNG.",
          "The map begins preloading in the background after the app opens, and again when you open the Hoenn Map tab or walkthrough map modal.",
        ],
      },
    ],
  },
  {
    version: "1.10.22",
    date: "2026-07-07",
    summary: "Walkthrough outdoor maps load much faster on iPhone without losing map quality.",
    sections: [
      {
        heading: "Walkthrough maps (performance)",
        items: [
          "Outdoor walkthrough maps now load pre-cut crop images (~10–75 KB each) instead of downloading and decoding the full 28 MB Hoenn composite on every step.",
          "Crop images are pixel-identical to the previous CSS window into the big map — same tiles, same markers, no visual downgrade.",
          "The current step’s map image is preloaded as soon as you open the step so the lightbox is ready when you tap the map.",
        ],
      },
    ],
  },
  {
    version: "1.10.21",
    date: "2026-07-07",
    summary: "Walkthrough map lightboxes are larger on iPhone, trainer sprites align correctly, and map markers are more accurate.",
    sections: [
      {
        heading: "Walkthrough maps (mobile)",
        items: [
          "Walkthrough map lightboxes on iPhone now use nearly the full screen — map on top, legend below, with less wasted space around the edges.",
          "The map viewport matches each area’s shape (square towns, wide routes, tall caves) so square maps like Oldale Town no longer float in a tall empty frame.",
          "The legend band below the map is taller and easier to read, with a scrollable marker list that fills the remaining screen space.",
          "Pinch to zoom and drag to pan in the lightbox; map pins shrink as you zoom in so markers don’t pile on top of each other.",
          "Interior area maps (Petalburg Woods, Granite Cave, Trick House, etc.) use the same edge-to-edge lightbox layout as overworld route and town crops.",
        ],
      },
      {
        heading: "Walkthrough maps (accuracy)",
        items: [
          "Fixed walkthrough map POI positions (e.g. Oldale Town route exits) by syncing marker tiles from pokeemerald map data.",
          "Trainer markers no longer appear twice — hand-placed dots are skipped when an overworld trainer sprite already marks the same spot.",
          "Trainer sprites on walkthrough and area maps now anchor on the correct tile — feet line up with the map instead of sitting slightly to the left.",
        ],
      },
      {
        heading: "Walkthrough maps (other fixes)",
        items: [
          "Fixed walkthrough map lightbox layout on iPhone so the map stacks above the legend instead of crushing them side by side.",
          "Wide route map lightboxes no longer over-zoom on mobile.",
          "Trainer detail modal opens reliably on iPhone when tapping a trainer sprite in a walkthrough map.",
        ],
      },
    ],
  },
  {
    version: "1.10.20",
    date: "2026-07-06",
    summary: "Route labels show on the main Hoenn map by default.",
    sections: [
      {
        heading: "Maps",
        items: [
          "The main Hoenn map now shows **Routes** and **Towns & Cities** when you first open it (both legend filters are on by default).",
        ],
      },
    ],
  },
  {
    version: "1.10.19",
    date: "2026-07-06",
    summary: "Removed the experimental Walkpath map overlay.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Removed the **Walkpath** overlay and its legend toggle from the main Hoenn map.",
        ],
      },
    ],
  },
  {
    version: "1.10.16",
    date: "2026-07-06",
    summary: "Trainer details from the route guide open inside the same modal.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Clicking a trainer in the route guide now opens their full battle details inside that modal (with a Back button), instead of a second window that could appear behind the route guide.",
        ],
      },
    ],
  },
  {
    version: "1.10.15",
    date: "2026-07-06",
    summary: "Trainer battle details open on top of the route guide modal.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Fixed trainer battle details opening behind the route guide when you click a trainer in the route modal — the trainer window now stacks above it.",
        ],
      },
    ],
  },
  {
    version: "1.10.14",
    date: "2026-07-06",
    summary: "Berry descriptions no longer show raw {POKEBLOCK} game placeholders.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Fixed berry item descriptions that started with “{POKEBLOCK}” — they now read “Pokéblock ingredient…” with proper berry names (e.g. Nanab, Razz).",
        ],
      },
    ],
  },
  {
    version: "1.10.13",
    date: "2026-07-06",
    summary: "Route guide Items & Berries section uses the same callout bubble as walkthrough sections.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Items & Berries in the route guide modal now appear in their own blue callout bubble, matching the walkthrough’s secrets and tips panels.",
        ],
      },
    ],
  },
  {
    version: "1.10.12",
    date: "2026-07-06",
    summary: "Route guide secrets section matches the walkthrough bubble styling.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Secrets, Extras, & Hidden Items in the route guide modal now uses the same purple callout bubble as walkthrough steps.",
        ],
      },
    ],
  },
  {
    version: "1.10.11",
    date: "2026-07-06",
    summary: "Route guide wild Pokémon table now shows Emerald sprites beside each species.",
    sections: [
      {
        heading: "Maps",
        items: [
          "The route guide modal’s Wild Pokémon list now displays each species’ in-game Emerald sprite next to its name.",
        ],
      },
    ],
  },
  {
    version: "1.10.10",
    date: "2026-07-06",
    summary: "Clicking a route on the Hoenn map opens a full route guide with encounters, items, and trainers.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Route markers on the main Hoenn map now open a **Route guide** modal — wild Pokémon (with encounter rates), visible items & berries, trainers, and a Secrets/Extras/Hidden Items section for that route.",
          "Click any Pokémon in the route encounter table for full species stats (types, abilities, base stats). Click a trainer to open the existing battle-details modal.",
          "Routes without a curated walkthrough table still show live encounter data from pokeemerald; items and hidden pickups come from the map POI data.",
        ],
      },
    ],
  },
  {
    version: "1.10.9",
    date: "2026-07-06",
    summary: "All Hoenn routes are labeled on the main map with a new Routes layer filter.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Added labeled pins for Routes 101–134 on the main Hoenn overworld map — positions come from the true-scale composite tile bounds.",
          "New **Routes** layer in the Hoenn map legend (off by default, like other POI layers). Toggle it on to show route names across the region.",
          "Routes with a walkthrough chapter link to the guide when you open the pin and click Return to guide.",
        ],
      },
    ],
  },
  {
    version: "1.10.8",
    date: "2026-07-06",
    summary: "Walkthrough Hoenn crops show all hand-placed markers again, with main-map pin styling.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Fixed walkthrough map crops dropping story/building/grass markers — hand-tuned MAP_ANNOTATIONS and area-filtered game POIs are back.",
          "Those markers still render with hoenn-map__pin dots and POI_CATEGORIES colors (same look as the main Hoenn map); overworld trainer sprites remain when map data has them.",
        ],
      },
    ],
  },
  {
    version: "1.10.7",
    date: "2026-07-06",
    summary: "Walkthrough maps now use the true-scale Hoenn composite and matching marker colors everywhere.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Walkthrough step maps no longer fall back to legacy town/route screenshot PNGs — outdoor steps show a crop of public/maps/hoenn-map.png; interiors use generated area maps from the same pipeline as the map modal.",
          "HoennCrop pins now use the same hoenn-map__pin styles and POI_CATEGORIES colors as the main interactive map (items, berries, gyms, trainers with overworld sprites, etc.).",
          "Encounter tables and Pokédex location maps also use Hoenn composite crops or area maps instead of old annotated screenshots.",
          "Generator adds AREA_MAP_CROP and CHAPTER_MAP_CROP (57 outdoor areas, 64 chapter defaults) so every route and town resolves to the big map.",
        ],
      },
    ],
  },
  {
    version: "1.10.6",
    date: "2026-07-06",
    summary: "Hoenn overworld map can filter trainers to PokeNav Match Call rematches only.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Trainers layer on the Hoenn region map has a Rematchable only sub-filter — shows the ~78 trainers registered in Emerald's Match Call rematch table.",
          "Rematchable trainers are tagged from pokeemerald's gRematchTable when map data is generated; twin/double-object trainers are included when their battle ID matches.",
          "Filter resets when switching to an interior area map; trainer count shows filtered/total while the filter is on.",
        ],
      },
    ],
  },
  {
    version: "1.10.5",
    date: "2026-07-06",
    summary: "Trainer detail window adds prize money, full movesets, abilities, base stats, and rematch data.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Trainer generator now extracts fixed move sets and party flags from pokeemerald (854 battle definitions, up from 703).",
          "Modal shows Emerald-accurate prize money (class base × last party Pokémon's level) and Amulet Coin note.",
          "Each party Pokémon loads abilities, genus, base stat bars, BST, and per-mon EXP yield from PokéAPI.",
          "Gym leaders and rivals show exact four-move sets when defined in game data; rematch version list when multiple TRAINER_* entries exist.",
          "Larger sprites (4× trainer, 112px Pokémon) and party slot order, script, and graphics ID in encounter details.",
        ],
      },
      {
        heading: "Data",
        items: [
          "Trainer party parser fixed for nested move braces — custom-move trainers now populate correctly.",
        ],
      },
    ],
  },
  {
    version: "1.10.4",
    date: "2026-07-06",
    summary: "Trainer click modal shows larger sprites and a full battle breakdown.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Trainer detail window is wider with a 3× overworld sprite and 96px party Pokémon sprites.",
          "New battle summary: party size, level range, party types, type weaknesses and resistances, trainer items, and facing direction.",
          "Each party Pokémon is shown on its own card with types, held items, IV notes, and move list (or level-up moveset note).",
          "Encounter details section lists behavior, map ID, and trainer ID for reference.",
        ],
      },
    ],
  },
  {
    version: "1.10.3",
    date: "2026-07-06",
    summary: "Fix trainer map pins not opening the battle-details window on click.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Trainer sprite clicks no longer get swallowed by map pan/zoom — the details modal opens reliably on click.",
          "Trainer detail modal now renders above the map and lightbox layers so it is always visible.",
          "Slightly larger click target on trainer overworld sprites.",
        ],
      },
    ],
  },
  {
    version: "1.10.2",
    date: "2026-07-06",
    summary: "Trainer map pins show a quick summary on hover; click opens a full battle-details window.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Hovering a trainer sprite now shows only basic info — name, class, location note, sight range, and a one-line party preview.",
          "Clicking a trainer (on the Hoenn map, area maps, or the map index) opens a modal with the full party, moves, held items, and battle tips.",
          "The map sidebar lists a short trainer summary with a button to reopen the details window after closing it.",
        ],
      },
    ],
  },
  {
    version: "1.10.1",
    date: "2026-07-06",
    summary: "Trainer map pins show full party and battle tips on hover, not just the trainer name.",
    sections: [
      {
        heading: "Maps",
        items: [
          "Hovering a trainer sprite on the Hoenn map or area maps now opens the full trainer panel — class, party (levels, types, moves, held items), sight range, and battle tips.",
          "Click still pins the trainer and shows the same detail in the map sidebar (Hoenn map) or below the map (area lightbox).",
        ],
      },
    ],
  },
  {
    version: "1.10.0",
    date: "2026-07-06",
    summary: "Post-game walkthrough split into three chapters with Bulbapedia-accurate steps from Hall of Fame through Battle Frontier and optional Hoenn.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "New post-game chapters after the League: Post-Game Opening (S.S. Ticket, National Dex, Scott's call, Latias/Latios), Battle Frontier (S.S. Tidal, Frontier Pass, seven facilities/Brains, BP shop), and Post-Game Hoenn (Beldum, Desert Underpass, Trainer Hill, Johto starters, Safari expansion, rematches, Steven).",
          "Removed league-4 (Latias/Latios) from the League chapter — it now lives in postgame-2 (TV choice); National Dex and Scott’s call are postgame-3.",
          "Replaced the old two-step Battle Frontier chapter with four detailed Frontier steps.",
          "Contest Mastery chapter now follows Post-Game Hoenn instead of Battle Frontier.",
        ],
      },
      {
        heading: "Maps & images",
        items: [
          "Area map links for post-game steps (Littleroot house/lab, Steven's house, Safari expansion, Meteor Falls, Frontier gate).",
          "Event images for postgame-1 through postgame-3 and postgame-hoenn-1 (Mossdeep).",
          "Hoenn map pins updated for littleroot, mossdeep, Battle Frontier, route-111, and route-114 post-game steps.",
          "Battle Frontier secrets text corrected: Scott calls after National Dex and meets at the Frontier entrance.",
        ],
      },
    ],
  },
  {
    version: "1.9.5",
    date: "2026-07-06",
    summary: "Map popups scroll their legend again and show slightly larger maps.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "Fixed map lightbox legend scrolling — marker lists below the map scroll independently again instead of being clipped.",
          "Desktop map popups are a bit larger (up to 1400px wide, ~68% of the panel height for the map image).",
        ],
      },
    ],
  },
  {
    version: "1.9.4",
    date: "2026-07-06",
    summary: "Desktop map popups use more screen space with a wider legend band below the map.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "Clicking a step map in **desktop** mode opens a wider lightbox — the map is taller and the marker legend sits in a full-width band below instead of a narrow side column.",
          "Legend marker lists use a multi-column grid so more points are visible before scrolling; interior area maps scale to full panel width.",
        ],
      },
    ],
  },
  {
    version: "1.9.3",
    date: "2026-07-06",
    summary: "Wild Pokémon encounter tables use the same highlighted section style as other walkthrough blocks.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "**Wild Pokémon** now sits in its own bordered callout (matching **What to do**, **Tips**, and **Secrets, Extras, & Hidden Items**) instead of a plain heading above the table.",
        ],
      },
    ],
  },
  {
    version: "1.9.2",
    date: "2026-07-06",
    summary: "Wild Pokémon panel title simplified; area tips folded into Secrets, Extras, & Hidden Items.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "The encounter block heading is now **Wild Pokémon** (no longer “Wild Pokémon & area guide”).",
          "**Area tips** below the table are removed — those bullets are merged into **Secrets, Extras, & Hidden Items** above the wild Pokémon section on each step.",
        ],
      },
    ],
  },
  {
    version: "1.9.1",
    date: "2026-07-06",
    summary: "One unified Secrets, Extras, & Hidden Items section per walkthrough step.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "Removed duplicate **Secrets & extras** and **Secrets & hidden items** blocks — each step now has a single **Secrets, Extras, & Hidden Items** checklist that merges event secrets with area hidden-item notes.",
          "The wild Pokémon panel no longer repeats those bullets; they only appear in the merged section above it.",
        ],
      },
    ],
  },
  {
    version: "1.9.0",
    date: "2026-07-06",
    summary: "Trainer map pins show full parties, moves, and battle prep tips.",
    sections: [
      {
        heading: "Map",
        items: [
          "Clicking a trainer sprite on the Hoenn map or any walkthrough area map opens a **Trainer detail** panel: class, party species with levels and types, held items, custom moves, and auto-generated battle tips (type weaknesses, sight range, double battles, trainer items).",
          "Data is extracted from pret/pokeemerald (`trainers.h`, `trainer_parties.h`) — run `npm run gen:trainers` to refresh after map updates.",
        ],
      },
    ],
  },
  {
    version: "1.8.0",
    date: "2026-07-06",
    summary: "Full Pokémon Contest walkthrough — prep, Lilycove ranks, and post-game ribbons.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "New chapter **Contest Preparation** (after Route 117): how Emerald contests work, berry flavors and natures, combo movesets, and when to start farming — all contests are Lilycove-only in Emerald.",
          "New chapter **Pokémon Contests at Lilycove** (after Lilycove City): Contest Pass, Pokéblock Case, Berry Blender timing, condition/sheen, Fan Club scarves in Slateport, Normal→Master ranks, and Wallace.",
          "New chapter **Contest Mastery (Post-Game)** (after Battle Frontier): Berry Master password berries (CHALLENGE CONTEST, SUPER HUSTLE, etc.), Blend Master TV events, and the full twenty-ribbon sweep.",
          "Fixed incorrect references to Contest Halls in Verdanturf, Fallarbor, and Slateport — Emerald uses Battle Tents there; contests are only at Lilycove.",
        ],
      },
      {
        heading: "Map",
        items: [
          "Contest steps link to Lilycove, Slateport (Fan Club scarves), Mauville area (berry prep and Route 123 rare berries).",
        ],
      },
    ],
  },
  {
    version: "1.7.8",
    date: "2026-07-06",
    summary: "Swipe navigation works across the full step on mobile.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "Fixed mobile swipes only registering near the top of a step — you can now swipe left or right anywhere in the guide body (story, objectives, tips, encounters). Pannable map screenshots are still excluded so you can pan those normally.",
        ],
      },
    ],
  },
  {
    version: "1.7.7",
    date: "2026-07-06",
    summary: "Clearer swipe navigation hints on phones.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "On mobile and touch devices, a welcome callout explains swipe navigation when you first open the guide (dismiss with Got it or your first swipe).",
          "A swipe reminder stays visible at the top of every step, with a matching note below the Previous/Next buttons.",
        ],
      },
    ],
  },
  {
    version: "1.7.6",
    date: "2026-07-06",
    summary: "Swipe between walkthrough steps on mobile.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "On mobile, swipe left for the next step and swipe right for the previous step — maps and screenshot galleries are excluded so panning still works there.",
        ],
      },
    ],
  },
  {
    version: "1.7.5",
    date: "2026-07-06",
    summary: "Walkthrough audit — clearer objectives, new events, and missing locations.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "\"What to do\" is now a numbered checklist in its own highlighted section (matching Tips and Secrets & extras).",
          "Verified story flow against Bulbapedia/IGN/Serebii; added events for Scorched Slab (TM11 Sunny Day), Fortree Hidden Power treehouse (TM10), Secret Power & secret bases in Slateport, Route 115 (TM01 Focus Punch), and Route 106 Heart Scale notes.",
          "Fixed Scorched Slab area map linking to the correct Route 120 step (was wrongly tied to Route 112).",
        ],
      },
    ],
  },
  {
    version: "1.7.4",
    date: "2026-07-06",
    summary: "Taller chapter list on desktop walkthrough.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "On desktop, the chapter and event list now runs the full height of the window beside the guide (not tucked under the page title), so you can see many more steps before scrolling.",
          "The step filter stays pinned at the top of the list while you scroll through chapters.",
        ],
      },
    ],
  },
  {
    version: "1.7.3",
    date: "2026-07-06",
    summary: "Map pin button renamed to “Return to guide”.",
    sections: [
      {
        heading: "Hoenn map",
        items: [
          "Renamed “View guide steps” to “Return to guide” on map pins — it closes the map and takes you back to the walkthrough, not to a new set of steps.",
        ],
      },
    ],
  },
  {
    version: "1.7.2",
    date: "2026-07-06",
    summary: "“View guide steps” on the map modal works again.",
    sections: [
      {
        heading: "Hoenn map",
        items: [
          "Fixed “View guide steps” on map pins — the button was nested inside the pin control, which browsers block from receiving clicks.",
          "Choosing a location from the map modal now always closes the modal and returns you to the walkthrough.",
        ],
      },
    ],
  },
  {
    version: "1.7.1",
    date: "2026-07-06",
    summary: "“Show on Hoenn map” works again on desktop and mobile.",
    sections: [
      {
        heading: "Walkthrough map",
        items: [
          "“Show on Hoenn map” again pans and zooms the Hoenn overworld to the step’s location instead of jumping to an interior area map (area maps remain in the step gallery).",
          "The map modal uses a compact layout with a guaranteed minimum viewport height so the map is visible on phones and small windows.",
        ],
      },
    ],
  },
  {
    version: "1.7.0",
    date: "2026-07-05",
    summary: "Legendary catch guides are now part of the story walkthrough — no separate tab.",
    sections: [
      {
        heading: "Walkthrough",
        items: [
          "Removed the standalone Legendaries section; Rayquaza, Kyogre, Groudon, the Regi trio, and Latios/Latias are covered at the story beats where you naturally encounter them.",
          "New steps: catch Rayquaza (Sky Pillar), Kyogre & Groudon (post–Rain Badge), each Regi tomb after the Sealed Chamber puzzle, and Latios/Latias (post–Hall of Fame TV event).",
          "Event-only Deoxys and Jirachi notes moved to secrets on the Latios/Latias step.",
        ],
      },
    ],
  },
  {
    version: "1.6.8",
    date: "2026-07-05",
    summary: "Interior area maps now appear in walkthrough steps with item and trainer pins.",
    sections: [
      {
        heading: "Walkthrough maps",
        items: [
          "Dungeon and interior steps (Petalburg Woods, Granite Cave, Magma Hideout, Safari Zone, Battle Pyramid, and more) now show the interactive area maps from the map switcher instead of static renders — with field items and trainer pins you can click.",
          "Multi-floor chapters show every relevant floor (e.g. Victory Road 1F–B2F, Mt. Pyre exterior through summit, all Battle Pyramid squares).",
          "\"Show on Hoenn map\" from a step opens the matching interior area map when one exists, not just the overworld.",
          "New `npm run verify:step-area-maps` ensures every generated area map is linked to at least one walkthrough step.",
        ],
      },
    ],
  },
  {
    version: "1.6.7",
    date: "2026-07-05",
    summary: "Full Battle Pyramid coverage — all 19 room layouts in the map switcher.",
    sections: [
      {
        heading: "Hoenn map — Battle Pyramid",
        items: [
          "Added Battle Pyramid Lobby, Floor, and Top (Brandon) as selectable area maps alongside the existing 16 battle room squares.",
          "Pyramid room trainers now appear on area maps as Pyramid Trainer sprites with sight-range notes.",
          "New `npm run verify:area-assets` script checks every area map has matching pokeemerald source data, `areaMaps.ts` entry, and PNG file — use it after regenerating maps to catch gaps like missing Battle Pyramid layouts.",
        ],
      },
    ],
  },
  {
    version: "1.6.6",
    date: "2026-07-05",
    summary: "All 422 field pickups are now on the map — including Battle Pyramid and story interiors.",
    sections: [
      {
        heading: "Hoenn map — complete item coverage",
        items: [
          "Added 21 previously skipped area maps: 16 Battle Pyramid room layouts (3 random-item balls each) plus Professor Birch's Lab (Johto starters), Steven's house (Beldum), both player bedroom rival balls, and the Contest Hall stage ball.",
          "Every fixed field pickup in Pokémon Emerald is now mapped: 222 item balls, 112 hidden items, and 88 berry trees (422 total). Battle Pyramid balls are labeled Random Item with a note that the reward varies each run.",
          "Stacked Poké Balls on the same tile (e.g. Birch's Lab starters) are spread slightly so each remains clickable on the area map.",
        ],
      },
    ],
  },
  {
    version: "1.6.5",
    date: "2026-07-05",
    summary: "Map switcher dropdown text is readable on desktop.",
    sections: [
      {
        heading: "Hoenn map",
        items: [
          "Fixed the area map switcher menu on desktop: the dropdown now uses a dark color scheme and solid backgrounds so map names and floor labels stay legible when the list is open.",
        ],
      },
    ],
  },
  {
    version: "1.6.4",
    date: "2026-07-04",
    summary: "Verdanturf Town building roofs no longer clipped on the Hoenn map.",
    sections: [
      {
        heading: "Composite map alignment",
        items: [
          "Fixed north-edge buildings in Verdanturf Town (Poké Mart and Pokémon Center) showing with roofs cut off: Route 116 and Verdanturf share a 2-tile connection strip in the game data, and the composite renderer was drawing the route over the town.",
          "The Hoenn map renderer now paints towns and cities after routes so local map graphics win at connection overlaps. Re-run `npm run render:hoenn` after manifest changes.",
        ],
      },
    ],
  },
  {
    version: "1.6.3",
    date: "2026-07-04",
    summary: "Cycling triathlete sprites on the map now render at full 32×32 size.",
    sections: [
      {
        heading: "Trainer sprite sizing",
        items: [
          "Bike-riding trainers (Cycling Triathletes on Route 110, etc.) use 32×32 overworld frames in the game — the map now reads each sprite's width and height from pokeemerald's object-event graphics data instead of assuming every trainer is 16×32, so cyclists are no longer clipped.",
        ],
      },
    ],
  },
  {
    version: "1.6.2",
    date: "2026-07-04",
    summary: "Trainer sprites on the map no longer show a green box — they blend in like in-game.",
    sections: [
      {
        heading: "Trainer sprite rendering",
        items: [
          "Trainer overworld sprites now have the pret palette-0 mint green keyed out to true transparency, so characters sit on the map tiles without a visible bounding box.",
          "Replaced the rectangular drop-shadow with a small ground oval under each trainer (matching the in-game OAM shadow) for a cleaner, less \"sticker\" look.",
        ],
      },
    ],
  },
  {
    version: "1.6.1",
    date: "2026-07-04",
    summary: "Trainer markers on the Hoenn Map use authentic in-game overworld sprites.",
    sections: [
      {
        heading: "Trainer map layer",
        items: [
          "New Trainers layer on the Hoenn Map and every area map in the switcher — toggle it in Map layers to show all 295 overworld trainers plus 92 more in caves, Victory Road, the Trick House, hideouts, and other standalone areas.",
          "Each trainer is rendered with their real GBA overworld sprite (Youngster, Lass, Hiker, Aqua Grunt, etc.) at the correct facing direction, anchored on the tile where they stand — the same look as walking past them in-game.",
          "Click a trainer for their class and name (resolved from the game's trainer data, e.g. \"Youngster Calvin\") plus sight range where applicable.",
          "Run `npm run gen:trainers` to regenerate from pokeemerald after map data changes; sprite sheets live in `public/sprites/trainers/`.",
        ],
      },
    ],
  },
  {
    version: "1.6.0",
    date: "2026-07-04",
    summary: "New area-map switcher on the Hoenn Map — explore 62 caves, dungeons, and underwater routes with their items.",
    sections: [
      {
        heading: "Area maps",
        items: [
          "Added a map switcher above the Map layers panel: pick any of 62 standalone areas that aren't part of the stitched overworld — caves (Granite Cave, Victory Road, Meteor Falls, Shoal Cave, Seafloor Cavern, New Mauville), the four Underwater routes, Safari Zone sections, Mt. Pyre, Petalburg Woods, Jagged Pass, Fiery Path, Rusturf Tunnel, the Aqua/Magma hideouts, the Abandoned Ship, Artisan Cave, the Trick House puzzles, and more.",
          "Multi-floor dungeons list one entry per floor (e.g. Granite Cave 1F / B1F / B2F), grouped under the dungeon name.",
          "Each area map is a pixel-exact render straight from the game's tile data, shown crisply upscaled, with its own item and hidden-item markers (authentic in-game names and descriptions). Together these cover all 51 hidden items that live off the main overworld map.",
          "Selecting an area auto-enables its Item/Hidden layers and zooms to fit; a \"← Hoenn\" button (or picking \"Hoenn Region (overworld)\") returns to the full region map.",
        ],
      },
    ],
  },
  {
    version: "1.5.2",
    date: "2026-07-03",
    summary: "More map-crop markers and tighter pin alignment on the Hoenn composite.",
    sections: [
      {
        heading: "Missing area markers",
        items: [
          "Added areaId to five outdoor events that were missing it: Route 109 (granite-cave-3), Verdanturf Town (route-117-2), Route 112 (route-111-3, route-112-1), and Route 122 (lilycove-3) — so generated POI pins (items, entrances, berries) now appear on those map crops.",
        ],
      },
      {
        heading: "Marker alignment",
        items: [
          "Walkthrough annotation pins on map crops now use pret tile coordinates projected onto the true-scale Hoenn composite (same source as game-extracted map points), instead of screenshot percentages — so trainers, grass, and story markers line up with map tiles in the crop window.",
        ],
      },
    ],
  },
  {
    version: "1.5.1",
    date: "2026-07-03",
    summary: "POI markers on walkthrough map crops — items, grass, trainers, and story points.",
    sections: [
      {
        heading: "Map crop markers",
        items: [
          "Outdoor town/route map windows now show the same POI pins as the annotated area maps: trainers, items, grass patches, buildings, and story points.",
          "Markers are projected from the true-scale Hoenn map coordinates into each crop frame, combining hand-tuned walkthrough annotations with game-extracted item/entrance data.",
          "Click a pin for details; the lightbox adds a filterable legend and a full marker list.",
          "Inline views show a marker count badge when pins are present.",
        ],
      },
    ],
  },
  {
    version: "1.5.0",
    date: "2026-07-03",
    summary: "Walkthrough town/route events now show a live window into the full Hoenn map.",
    sections: [
      {
        heading: "Map-driven event imagery",
        items: [
          "Outdoor town and route events (40 of them) now display a framed \u201Cwindow\u201D into the shared true-scale Hoenn map instead of separate per-event images \u2014 so what you see in the walkthrough is the exact same map (and exact same spot) as the interactive Hoenn map.",
          "Crops are computed pixel-perfectly from the composite\u2019s tile data (.calib/manifest.json), at 16px per game tile, so each route/town is framed accurately with a little surrounding context.",
          "Only one map image loads and it\u2019s reused across the whole app (walkthrough + map modal), so there are no extra per-event downloads for these areas.",
          "Click any framed map to open it larger in the lightbox.",
        ],
      },
      {
        heading: "Unchanged",
        items: [
          "Interiors, caves, and gyms (houses, Gym rooms, Granite Cave, Sootopolis, Mt. Chimney, hideouts, Sky Pillar, Elite Four rooms, etc.) keep their dedicated pixel-perfect renders, since they aren\u2019t part of the outdoor map.",
        ],
      },
      {
        heading: "Under the hood",
        items: [
          "Added scripts/gen-map-crops.mjs to generate src/data/mapCrops.ts (event \u2192 crop rectangle) and a new HoennCrop component that renders the map window via CSS.",
        ],
      },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-07-03",
    summary: "Filled in the missing regions — four new walkthrough chapters covering optional areas.",
    sections: [
      {
        heading: "New chapters",
        items: [
          "Ch. 30 — Route 121 & the Safari Zone: crossing Route 121, how the Safari Zone's Poké Block/Safari Ball catching works, its exclusive Pokémon (Pikachu, Pinsir, Heracross, Girafarig, Phanpy…), and the Emerald-only Acro/Mach Bike expansion areas.",
          "Ch. 37 — Pacifidlog Town & the Open Sea: navigating the fixed ocean currents on Routes 129–134, the daily Return/Frustration TM gift, Mirage Island, and the sea route east to the Sky Pillar.",
          "Ch. 40 — The Abandoned Ship (optional): the Route 108 wreck, the Room/Storage Key puzzle, using Dive for the Storage Key, and trading the Scanner to Captain Stern for a Deep Sea Tooth or Deep Sea Scale.",
          "Ch. 41 — Shoal Cave (optional): the real-time tide mechanic, collecting 4 Shoal Salt + 4 Shoal Shells for the Shell Bell, and the deep-room Focus Band.",
        ],
      },
      {
        heading: "Structure",
        items: [
          "The walkthrough now runs 45 chapters (up from 41); every chapter from Lilycove onward was renumbered to keep the sequence chronological.",
          "The four new areas are linked on the Hoenn map — their pins now have a “View guide steps” button, and the new steps show a “Show on Hoenn map” button that focuses the location.",
        ],
      },
    ],
  },
  {
    version: "1.3.2",
    date: "2026-07-03",
    summary: "“Show on Hoenn map” now actually focuses the step's location.",
    sections: [
      {
        heading: "Fixes",
        items: [
          "Clicking “Show on Hoenn map” on a walkthrough step now opens the map and pans/zooms straight to that location instead of just showing the default whole-region view.",
          "The step's map layer is auto-enabled and its marker is selected/highlighted so you immediately see where the step takes place.",
          "The Hoenn map was ignoring the active step entirely (the activeStepId prop was passed in but never used); it now resolves each step to its matching point, including regions whose id differs from the point (Route 110 → Trick House, Sealed Chamber → Pacifidlog area, Battle Frontier).",
        ],
      },
    ],
  },
  {
    version: "1.3.1",
    date: "2026-07-03",
    summary: "Restore point-of-interest markers on town and route event maps.",
    sections: [
      {
        heading: "Fixes",
        items: [
          "Town and route event images now show their POI markers again (items, grass, gyms, exits, story points) — v1.3.0 had disabled overlays on all event maps.",
          "Markers are only enabled where the per-event render exactly matches the calibrated map scale (verified for all 42 outdoor town/route events), so pins stay pixel-accurate.",
          "Interior renders (houses, gym rooms, caves, labs) intentionally stay marker-free since they have no calibrated overlay data.",
        ],
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-07-03",
    summary: "Every walkthrough event now has its own pixel-perfect location image from game data.",
    sections: [
      {
        heading: "Per-event location images",
        items: [
          "All 103 story events now show a dedicated top-down map render of the exact location where that event happens — interiors included (your bedroom, Birch's Lab, each Gym room, Weather Institute, etc.).",
          "Images are composited straight from pokeemerald tile/palette/metatile data (same pipeline as the Hoenn map), not emulator screenshots, so layouts match the real game.",
          "Each event is mapped to its best-fit map in .calib/event-map.json (83 unique layouts across 103 events).",
          "Captions describe what you're looking at (e.g. “Dewford Gym — Brawly (dark maze)”).",
          "Small interiors scale up crisply with pixelated rendering; click any image to open the lightbox for a closer look.",
        ],
      },
      {
        heading: "Build pipeline",
        items: [
          "New scripts: npm run render:events (render + optimize PNGs into public/screenshots/events/) and npm run render:events:list (print all renderable map IDs).",
          "Renderer: .calib/render-locations.mjs; source mapping: .calib/event-map.json.",
        ],
      },
      {
        heading: "UI",
        items: [
          "Event location renders skip POI marker overlays (chapter markers would be misaligned on these standalone maps).",
          "New annotated-map--location styles center the map and keep pixel art sharp in the step card.",
        ],
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-07-03",
    summary: "Clickable version badge opens a full changelog of every release.",
    sections: [
      {
        heading: "Version & changelog",
        items: [
          "The version badge next to “Emerald Guide” is now a button — click it to open a detailed changelog.",
          "Every release is listed with date, summary, and grouped change notes.",
          "Changelog data lives in src/data/changelog.ts and must be updated alongside any app change.",
        ],
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-07-03",
    summary: "Story walkthrough revamp — every event reads like a Prima strategy guide.",
    sections: [
      {
        heading: "Walkthrough narrative",
        items: [
          "All 100 story events across 41 chapters rewritten as concise, in-character prose (1–2 paragraphs each).",
          "Each event keeps a bold summary lead-in, then flowing story text with an emerald drop-cap on the first paragraph.",
          "“What to do” checklists remain beneath the story for quick skimming during play.",
          "New “Secrets & extras” block per event for hidden items, missables, and bonus tips (purple callout).",
          "Existing Tips block unchanged (green callout) for strategy advice.",
        ],
      },
      {
        heading: "Data model",
        items: [
          "GuideStep type extended with optional story (string[]) and secrets (string[]) fields.",
          "Events without story prose still render cleanly from summary + checklist only.",
        ],
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-03",
    summary: "Initial public release — interactive Hoenn guide from Littleroot to the Hall of Fame.",
    sections: [
      {
        heading: "Story walkthrough",
        items: [
          "Full Pokémon Emerald story guide organized into 41 chapters (one per town, route, or dungeon).",
          "100 numbered events with locations, summaries, objectives, tips, and screenshots.",
          "Step browser with search, prev/next navigation, progress bar, and “show on Hoenn map” links.",
          "Wild encounter tables per step where applicable.",
        ],
      },
      {
        heading: "Hoenn map",
        items: [
          "True-scale Hoenn map rendered from pokeemerald tile data for pixel-perfect marker placement.",
          "Pan and zoom with crisp rendering; map viewport matches the content width below it.",
          "Toggleable marker layers: Towns & Cities, Gyms, Caves, Items, Hidden Items, Berries, Entrances.",
          "Map layers default to Towns & Cities only; “clear all” option to uncheck every layer.",
          "Click a marker for point details; hover for a brief tooltip; item list below the map for active layers.",
        ],
      },
      {
        heading: "Pokédex",
        items: [
          "Hoenn (202), National (185), and full 387-species views.",
          "Official Emerald in-game sprites in list and detail views (via PokéAPI CDN).",
          "Types, stats, abilities, evolution chains, and catch locations per species.",
        ],
      },
      {
        heading: "Legendaries",
        items: [
          "Catch guide for every legendary available on a normal Emerald cartridge.",
        ],
      },
      {
        heading: "Layout & navigation",
        items: [
          "Desktop: compact top bar with inline navigation groups (Playthrough / Reference).",
          "Mobile: hamburger menu collapses nav; view-mode toggle moves inside the menu dropdown.",
          "Mobile: collapsible “Steps” panel so content appears immediately without scrolling past the full step list.",
          "Mobile: tighter spacing on step cards, navigation keys, and header.",
          "Horizontal map legend bar below the map (replacing the side legend).",
          "App version badge displayed next to the Emerald Guide title.",
          "Removed standalone Tips and Secrets top-level sections (tips/secrets now live inside walkthrough events).",
        ],
      },
      {
        heading: "Build & deploy",
        items: [
          "React + TypeScript + Vite; version injected at build time from package.json.",
          "GitHub Actions workflow for GitHub Pages deployment with VITE_BASE_PATH support.",
        ],
      },
    ],
  },
];

/** Most recent release — should match package.json version after each bump. */
export function getLatestRelease(): ChangelogRelease {
  return CHANGELOG[0];
}
