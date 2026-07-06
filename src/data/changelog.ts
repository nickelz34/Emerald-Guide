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
