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
