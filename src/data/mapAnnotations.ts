export type MarkerType = "trainer" | "item" | "npc" | "building" | "poi" | "wild";

export interface MapMarker {
  id: string;
  type: MarkerType;
  label: string;
  detail?: string;
  /** Horizontal position 0–100 (% from left). */
  x: number;
  /** Vertical position 0–100 (% from top). */
  y: number;
}

export interface MapAnnotation {
  title: string;
  markers: MapMarker[];
}

export const MARKER_LEGEND: { type: MarkerType; label: string; color: string; symbol: string }[] = [
  { type: "trainer", label: "Trainer battle", color: "#f56565", symbol: "⚔" },
  { type: "item", label: "Item / hidden item", color: "#ecc94b", symbol: "◆" },
  { type: "npc", label: "Important NPC", color: "#63b3ed", symbol: "●" },
  { type: "building", label: "Building / shop", color: "#b794f4", symbol: "■" },
  { type: "poi", label: "Story / point of interest", color: "#38b2ac", symbol: "!" },
  { type: "wild", label: "Wild Pokémon (grass/surf)", color: "#48bb78", symbol: "🌿" },
];

/**
 * Marker positions from pret/pokeemerald map tile coords (16px/tile).
 * Formula: pct = ((tile*16+8) / screenshotDimension) * 100
 * Hand-tuned for cropped screenshots (granite-cave, victory-road, marine-cave, battle-frontier).
 * Regenerate: node scripts/apply-marker-calibration.mjs
 */
export const MAP_ANNOTATIONS: Record<string, MapAnnotation> = {
  littleroot: {
    title: "Littleroot Town",
    markers: [
      { id: "lr-player", type: "building", label: "Your house", detail: "Top-left house — set clock; Mom gives Running Shoes.", x: 27.5, y: 42.5 },
      { id: "lr-rival", type: "building", label: "Rival's house", detail: "Top-right house.", x: 72.5, y: 42.5 },
      { id: "lr-lab", type: "building", label: "Professor Birch's Lab", detail: "Big building with the observatory dome.", x: 37.5, y: 82.5 },
      { id: "lr-route101", type: "poi", label: "To Route 101", detail: "North exit out of town.", x: 52.5, y: 2.5 },
      { id: "lr-sign", type: "poi", label: "Sign", x: 77.5, y: 67.5 },
    ],
  },
  oldale: {
    title: "Oldale Town",
    markers: [
      { id: "old-house", type: "building", label: "House (NW)", x: 27.5, y: 37.5 },
      { id: "old-mart", type: "building", label: "Poké Mart", detail: "NE shop.", x: 72.5, y: 32.5 },
      { id: "old-center", type: "building", label: "Pokémon Center", detail: "SW — heal here.", x: 32.5, y: 82.5 },
      { id: "old-house2", type: "building", label: "House (SE)", x: 77.5, y: 82.5 },
      { id: "old-sign", type: "poi", label: "Town sign", x: 57.5, y: 47.5 },
      { id: "old-r101", type: "poi", label: "To Route 101 / Littleroot", x: 52.5, y: 2.5 },
      { id: "old-r102", type: "poi", label: "To Route 102 / Petalburg", x: 2.5, y: 52.5 },
      { id: "old-r103", type: "poi", label: "To Route 103", x: 97.5, y: 52.5 },
    ],
  },
  "route-101": {
    title: "Route 101",
    markers: [
      { id: "r101-oldale", type: "poi", label: "To Oldale Town", x: 52.5, y: 2.5 },
      {
        id: "r101-birch",
        type: "poi",
        label: "Birch rescue",
        detail: "Starter event — Prof. Birch is attacked in the east grass.",
        x: 47.5,
        y: 67.5,
      },
      { id: "r101-grass-nw", type: "wild", label: "Grass (NW)", detail: "Poochyena, Wurmple, Zigzagoon.", x: 17.5, y: 22.5 },
      { id: "r101-grass-ne", type: "wild", label: "Grass (NE)", x: 72.5, y: 22.5 },
      { id: "r101-grass-e", type: "wild", label: "Grass (east)", x: 67.5, y: 62.5 },
      { id: "r101-grass-sw", type: "wild", label: "Grass (SW)", x: 17.5, y: 77.5 },
      { id: "r101-littleroot", type: "poi", label: "To Littleroot", x: 52.5, y: 97.5 },
    ],
  },
  "route-102": {
    title: "Route 102",
    markers: [
      { id: "r102-petalburg", type: "poi", label: "To Petalburg", x: 1, y: 57.5 },
      { id: "r102-oldale", type: "poi", label: "To Oldale", x: 99, y: 47.5 },
      { id: "r102-grass-w", type: "wild", label: "Grass (west)", detail: "Ralts 4%.", x: 11, y: 27.5 },
      { id: "r102-pond", type: "wild", label: "Grass (NE)", detail: "Ralts 4% — Wally catches his here.", x: 77, y: 22.5 },
      { id: "r102-grass-c", type: "wild", label: "Grass (center)", x: 39, y: 52.5 },
      { id: "r102-grass-e", type: "wild", label: "Grass (east)", x: 59, y: 67.5 },
      { id: "r102-calvin", type: "trainer", label: "Youngster Calvin", detail: "South path past the central trees.", x: 67, y: 72.5 },
      { id: "r102-tiana", type: "trainer", label: "Lass Tiana", detail: "Lower path near the central trees.", x: 17, y: 37.5 },
    ],
  },
  "route-103": {
    title: "Route 103",
    markers: [
      { id: "r103-sign", type: "poi", label: "Route sign", x: 14.4, y: 43.2 },
      { id: "r103-grass-w", type: "wild", label: "Grass (west)", x: 10.6, y: 20.5 },
      { id: "r103-rival", type: "trainer", label: "Rival battle", detail: "May/Brendan on the west ledge.", x: 13.1, y: 15.9 },
      { id: "r103-cave", type: "poi", label: "Cave entrance", detail: "North cliff cave on the east side.", x: 56.9, y: 29.5 },
      { id: "r103-water", type: "wild", label: "Surf / fish", detail: "Central water — Wingull, Magikarp.", x: 45.6, y: 29.5 },
      { id: "r103-grass-e", type: "wild", label: "Grass (east)", x: 75.6, y: 25 },
      { id: "r103-path", type: "poi", label: "Sandy path east", x: 81.9, y: 34.1 },
    ],
  },
  "petalburg-woods": {
    title: "Petalburg Woods",
    markers: [
      { id: "pw-exit-n", type: "poi", label: "Exit to Route 104 (north)", x: 32.3, y: 12.5 },
      { id: "pw-exit-sw", type: "poi", label: "Exit to Route 104 (southwest)", x: 36.5, y: 87.5 },
      { id: "pw-exit-se", type: "poi", label: "Exit to Route 104 (southeast)", x: 78.1, y: 87.5 },
      { id: "pw-grunt", type: "trainer", label: "Team Aqua Grunt", detail: "Story battle — Great Ball reward.", x: 55.2, y: 39.8 },
      { id: "pw-item1", type: "item", label: "Paralyze Heal", detail: "Item ball — west side.", x: 9.4, y: 60.2 },
      { id: "pw-item2", type: "item", label: "Potion", detail: "Hidden item — east side.", x: 82.3, y: 80.7 },
      { id: "pw-grass", type: "wild", label: "Tall grass", detail: "Shroomish 10%.", x: 40.6, y: 42 },
    ],
  },
  "route-104": {
    title: "Route 104",
    markers: [
      { id: "r104-rustboro", type: "poi", label: "To Rustboro (north)", x: 51.3, y: 0.6 },
      { id: "r104-woods", type: "poi", label: "Petalburg Woods entrance", x: 28.8, y: 38.1 },
      { id: "r104-flower", type: "building", label: "Pretty Petal shop", detail: "Buy berries and decorations.", x: 13.8, y: 23.1 },
      { id: "r104-berry", type: "npc", label: "Berry florist", detail: "White Herb florist east of the flower shop.", x: 21.3, y: 24.4 },
      { id: "r104-grass-n", type: "wild", label: "Grass (north)", detail: "Taillow day-only.", x: 73.8, y: 10.6 },
      { id: "r104-grass-s", type: "wild", label: "Grass (mid-route)", x: 78.8, y: 30.6 },
      { id: "r104-surf", type: "poi", label: "Mr. Briney's boat", detail: "South shore — Surf to reach later areas.", x: 31.3, y: 68.1 },
    ],
  },
  petalburg: {
    title: "Petalburg City",
    markers: [
      { id: "pet-woods", type: "poi", label: "To Route 104 (west)", x: 1.7, y: 51.7 },
      { id: "pet-wally", type: "building", label: "Wally's family house", detail: "Top-left house.", x: 25, y: 18.3 },
      { id: "pet-gym", type: "building", label: "Petalburg Gym", detail: "Norman — closed until 4 badges.", x: 51.7, y: 28.3 },
      { id: "pet-mart", type: "building", label: "Poké Mart", x: 85, y: 41.7 },
      { id: "pet-center", type: "building", label: "Pokémon Center", x: 68.3, y: 55 },
      { id: "pet-house", type: "building", label: "House", x: 35, y: 65 },
      { id: "pet-house2", type: "building", label: "House", x: 68.3, y: 81.7 },
    ],
  },
  rustboro: {
    title: "Rustboro City",
    markers: [
      { id: "rust-r104", type: "poi", label: "To Route 104 (south)", x: 51.3, y: 99.2 },
      { id: "rust-r116", type: "poi", label: "To Route 116 (east)", x: 98.8, y: 17.5 },
      { id: "rust-devon", type: "building", label: "Devon Corp", detail: "Big multi-story building (NW). Letter, PokéNav, Exp. Share.", x: 28.8, y: 25.8 },
      { id: "rust-gym", type: "building", label: "Rustboro Gym", detail: "Roxanne — badge #1.", x: 68.8, y: 32.5 },
      { id: "rust-school", type: "building", label: "Trainer's School", x: 68.8, y: 57.5 },
      { id: "rust-center", type: "building", label: "Pokémon Center", x: 41.3, y: 64.2 },
      { id: "rust-mart", type: "building", label: "Poké Mart", x: 41.3, y: 75.8 },
      { id: "rust-cut", type: "npc", label: "Cutter's House", detail: "Small house west of the center.", x: 23.8, y: 64.2 },
    ],
  },
  "route-116": {
    title: "Route 116",
    markers: [
      { id: "r116-rustboro", type: "poi", label: "To Rustboro (west)", x: 0.5, y: 52.5 },
      { id: "r116-cottage", type: "building", label: "Route house", x: 38.5, y: 42.5 },
      { id: "r116-tunnel", type: "building", label: "Rusturf Tunnel", detail: "East cave entrance — Devon Goods event.", x: 47.5, y: 42.5 },
      { id: "r116-hp", type: "item", label: "HP Up", detail: "Item ball — east end past the tunnel.", x: 80.5, y: 42.5 },
      { id: "r116-grass-w", type: "wild", label: "Grass (west)", detail: "Abra 4%, Nincada, Whismur.", x: 12.5, y: 37.5 },
      { id: "r116-grass-c", type: "wild", label: "Grass (center)", x: 26.5, y: 82.5 },
    ],
  },
  "rusturf-tunnel": {
    title: "Rusturf Tunnel area",
    markers: [
      { id: "rt-west", type: "poi", label: "West path", x: 12.5, y: 43.8 },
      { id: "rt-east", type: "poi", label: "East path", x: 81.9, y: 68.8 },
      { id: "rt-cave-w", type: "poi", label: "Tunnel entrance (west)", x: 12.5, y: 43.8 },
      { id: "rt-cave-e", type: "poi", label: "Tunnel entrance (east)", x: 81.9, y: 68.8 },
      { id: "rt-grass", type: "wild", label: "Grass outside tunnel", detail: "Screenshot shows the exterior approach, not the cave interior.", x: 51.4, y: 85.4 },
    ],
  },
  "granite-cave": {
    title: "Granite Cave exterior",
    markers: [
      {
        id: "gc-entrance",
        type: "poi",
        label: "Granite Cave entrance",
        detail: "Wild Pokémon and Steven are inside — use Flash on dark floors.",
        x: 51,
        y: 78,
      },
      { id: "gc-beach", type: "poi", label: "Dewford beach", detail: "Route 106 sand and surf — no tall grass here.", x: 72, y: 42 },
    ],
  },
  dewford: {
    title: "Dewford Town",
    markers: [
      { id: "dew-house1", type: "building", label: "House (NW)", x: 17.5, y: 17.5 },
      { id: "dew-center", type: "building", label: "Pokémon Center", x: 12.5, y: 52.5 },
      { id: "dew-house2", type: "building", label: "House", x: 42.5, y: 42.5 },
      { id: "dew-gym", type: "building", label: "Dewford Gym", detail: "Brawly — badge #2.", x: 42.5, y: 87.5 },
      { id: "dew-house3", type: "building", label: "House (SE)", x: 87.5, y: 72.5 },
      { id: "dew-dock", type: "poi", label: "Dock (Surf out)", detail: "Mr. Briney's boat — Surf east to Granite Cave.", x: 62.5, y: 47.5 },
    ],
  },
  slateport: {
    title: "Slateport City",
    markers: [
      { id: "sl-north", type: "poi", label: "To Route 110 (north)", x: 51.3, y: 0.8 },
      { id: "sl-south", type: "poi", label: "To Route 109 / beach", x: 51.3, y: 99.2 },
      { id: "sl-museum", type: "building", label: "Oceanic Museum", detail: "Orange-roof building (NE). Team Aqua story event.", x: 76.3, y: 44.2 },
      { id: "sl-pc", type: "building", label: "Pokémon Center", x: 48.8, y: 32.5 },
      { id: "sl-mart", type: "building", label: "Poké Mart", x: 33.8, y: 44.2 },
      { id: "sl-fan", type: "npc", label: "Pokémon Fan Club", x: 11.3, y: 44.2 },
      { id: "sl-contest", type: "building", label: "Contest Hall", x: 26.3, y: 20.8 },
      { id: "sl-stern", type: "building", label: "Stern's Shipyard", detail: "Large gray building — submarine plot.", x: 66.3, y: 64.2 },
      { id: "sl-harbor", type: "poi", label: "Harbor / boats", x: 71.3, y: 20.8 },
      { id: "sl-market", type: "building", label: "Slateport Market", detail: "Open-air stalls (SW).", x: 36.3, y: 85.8 },
      { id: "sl-secret", type: "item", label: "Energy Guru", detail: "Buy Vitamins in the Slateport Market (SW).", x: 13.8, y: 79.2 },
    ],
  },
  mauville: {
    title: "Mauville City",
    markers: [
      { id: "mau-r110", type: "poi", label: "To Route 110 (north)", x: 51.3, y: 2.5 },
      { id: "mau-r117", type: "poi", label: "To Route 117 (west)", x: 1.3, y: 52.5 },
      { id: "mau-r118", type: "poi", label: "To Route 118 (east)", x: 98.8, y: 52.5 },
      { id: "mau-gym", type: "building", label: "Mauville Gym", detail: "Wattson — badge #3 (building with the dark archway).", x: 21.3, y: 27.5 },
      { id: "mau-pc", type: "building", label: "Pokémon Center", x: 56.3, y: 27.5 },
      { id: "mau-bike", type: "building", label: "Rydel's Bike Shop", detail: "Near the parked bikes — Acro or Mach Bike.", x: 88.8, y: 27.5 },
      { id: "mau-game", type: "building", label: "Game Corner", detail: "Tan-roof building (NW).", x: 21.3, y: 67.5 },
      { id: "mau-mart", type: "building", label: "Poké Mart", x: 58.8, y: 72.5 },
    ],
  },
  "route-110": {
    title: "Route 110",
    markers: [
      { id: "r110-north", type: "poi", label: "To Mauville", x: 51.3, y: 0.5 },
      { id: "r110-south", type: "poi", label: "To Slateport", x: 51.3, y: 99.5 },
      { id: "r110-trick", type: "poi", label: "Trick House", detail: "Pink-roof house near the lower-left route.", x: 28.8, y: 66.5 },
      { id: "r110-cycle-n", type: "poi", label: "Cycling Road north gate", detail: "Elevated road near Mauville.", x: 41.3, y: 16.5 },
      { id: "r110-cycle-s", type: "poi", label: "Cycling Road south gate", x: 43.8, y: 88.5 },
      { id: "r110-rival", type: "trainer", label: "Rival battle", detail: "On the main road near the east grass strip.", x: 86.3, y: 54.5 },
      { id: "r110-grass-w", type: "wild", label: "Grass (west strip)", detail: "Oddish, Gulpin, Electrike.", x: 8.8, y: 39.5 },
      { id: "r110-grass-e", type: "wild", label: "Grass (east strip)", x: 83.8, y: 40.5 },
      { id: "r110-secret", type: "poi", label: "Secret Base tree", x: 83.8, y: 39.5 },
      { id: "r110-gulpin", type: "wild", label: "Southern grass", detail: "Route 110 encounter grass.", x: 51.3, y: 94.5 },
    ],
  },
  "route-117": {
    title: "Route 117",
    markers: [
      { id: "r117-mauville", type: "poi", label: "To Mauville (east)", x: 99.2, y: 52.5 },
      { id: "r117-daycare", type: "building", label: "Pokémon Day Care", x: 85.8, y: 27.5 },
      { id: "r117-grass", type: "wild", label: "Tall grass", detail: "Marill, Oddish, etc.", x: 42.5, y: 62.5 },
    ],
  },
  "route-118": {
    title: "Route 118",
    markers: [
      { id: "r118-mauville", type: "poi", label: "To Mauville (west)", x: 0.6, y: 52.5 },
      { id: "r118-wally", type: "poi", label: "Steven cutscene", detail: "After Norman — Steven on the east path.", x: 55.6, y: 37.5 },
      { id: "r118-grass", type: "wild", label: "Tall grass", detail: "West-side grass; Surf needed for east patches.", x: 66.9, y: 62.5 },
    ],
  },
  "fiery-path": {
    title: "Fiery Path",
    markers: [],
  },
  "mt-chimney": {
    title: "Mt. Chimney",
    markers: [
      { id: "mc-cable", type: "poi", label: "Cable car station", x: 43.8, y: 77.7 },
      { id: "mc-maxie", type: "trainer", label: "Maxie battle", detail: "Summit — Team Magma leader.", x: 33.8, y: 13.8 },
      { id: "mc-meteor", type: "item", label: "Meteorite", detail: "Path down from summit.", x: 51.3, y: 88.3 },
      { id: "mc-wild", type: "wild", label: "Tall grass", detail: "Numel, Spoink on the slopes.", x: 41.3, y: 39.4 },
    ],
  },
  "route-113": {
    title: "Route 113",
    markers: [
      { id: "r113-fallarbor", type: "poi", label: "To Fallarbor", x: 0.5, y: 52.5 },
      { id: "r113-glass", type: "npc", label: "Glass Workshop", detail: "Free Soothe Bell.", x: 33.5, y: 27.5 },
      { id: "r113-ash-grass", type: "wild", label: "Ash grass", detail: "Spinda, Sandshrew, rare Skarmory.", x: 45.5, y: 32.5 },
      { id: "r113-east", type: "poi", label: "East exit", x: 99.5, y: 52.5 },
    ],
  },
  lavaridge: {
    title: "Lavaridge Town",
    markers: [
      { id: "lav-springs", type: "poi", label: "Hot springs", detail: "Northwest pool — heal Pokémon.", x: 27.5, y: 22.5 },
      { id: "lav-pc", type: "building", label: "Pokémon Center", x: 47.5, y: 32.5 },
      { id: "lav-mart", type: "building", label: "Poké Mart", x: 77.5, y: 27.5 },
      { id: "lav-gym", type: "building", label: "Lavaridge Gym", detail: "Flannery — badge #4 (bottom-left building).", x: 27.5, y: 77.5 },
      { id: "lav-houses", type: "building", label: "Town houses", x: 82.5, y: 77.5 },
    ],
  },
  fallarbor: {
    title: "Fallarbor Town",
    markers: [
      { id: "fall-r113", type: "poi", label: "To Route 113 (east)", x: 97.5, y: 52.5 },
      { id: "fall-contest", type: "building", label: "Contest Hall", detail: "Domed building (top-center).", x: 42.5, y: 37.5 },
      { id: "fall-pc", type: "building", label: "Pokémon Center", x: 72.5, y: 37.5 },
      { id: "fall-meteor", type: "building", label: "Cozmo's house", detail: "Meteorite plot — Team Magma ambush.", x: 32.5, y: 87.5 },
      { id: "fall-maniac", type: "npc", label: "Move Maniac", detail: "Heart Scales for moves.", x: 7.5, y: 32.5 },
      { id: "fall-mart", type: "building", label: "Poké Mart", x: 77.5, y: 77.5 },
    ],
  },
  "route-119": {
    title: "Route 119",
    markers: [
      { id: "r119-north", type: "poi", label: "North exit", x: 51.3, y: 0.4 },
      { id: "r119-institute", type: "building", label: "Weather Institute", detail: "Team Aqua event and Castform gift.", x: 16.3, y: 23.2 },
      { id: "r119-fly", type: "item", label: "HM02 Fly", detail: "Gift after Weather Institute event.", x: 16.3, y: 23.2 },
      { id: "r119-bridge1", type: "poi", label: "Acro Bike bridge", detail: "Narrow white bridge near the north river.", x: 21.3, y: 6.1 },
      { id: "r119-kecleon", type: "wild", label: "Kecleon", detail: "Invisible encounter — north section.", x: 78.8, y: 4.6 },
      { id: "r119-tropius", type: "wild", label: "Tall grass (south)", detail: "Tropius 5%.", x: 31.3, y: 88.2 },
      { id: "r119-south-grass", type: "wild", label: "Southern grass", x: 31.3, y: 88.2 },
      { id: "r119-south", type: "poi", label: "South exit", x: 51.3, y: 99.6 },
    ],
  },
  fortree: {
    title: "Fortree City",
    markers: [
      { id: "ft-pc", type: "building", label: "Pokémon Center", x: 13.8, y: 32.5 },
      { id: "ft-mart", type: "building", label: "Poké Mart", x: 11.3, y: 72.5 },
      { id: "ft-house", type: "building", label: "Central house", x: 43.8, y: 17.5 },
      { id: "ft-treehouses", type: "poi", label: "Treehouses", detail: "Residents live in the elevated tree homes.", x: 56.3, y: 17.5 },
      { id: "ft-treehouse-sw", type: "poi", label: "Treehouse (SW)", x: 31.3, y: 67.5 },
      { id: "ft-gym", type: "building", label: "Fortree Gym (east)", detail: "Winona — badge #6; Kecleon blocks the path until you have the Devon Scope.", x: 56.3, y: 57.5 },
    ],
  },
  "route-120": {
    title: "Route 120",
    markers: [
      { id: "r120-north", type: "poi", label: "To Fortree", x: 51.3, y: 0.5 },
      { id: "r120-steven", type: "npc", label: "Steven / Devon Scope", detail: "Kecleon on the bridge — receive Devon Scope.", x: 33.8, y: 15.5 },
      { id: "r120-kecleon", type: "wild", label: "Kecleon", detail: "Invisible — blocks the bridge until scoped.", x: 31.3, y: 16.5 },
      { id: "r120-grass-n", type: "wild", label: "Tall grass (north)", x: 81.3, y: 14.5 },
      { id: "r120-grass-c", type: "wild", label: "Tall grass maze", x: 76.3, y: 50.5 },
      { id: "r120-ancient", type: "poi", label: "Ancient Tomb area", detail: "Registeel puzzle area is on Route 120.", x: 18.8, y: 55.5 },
      { id: "r120-south", type: "poi", label: "South exit", x: 51.3, y: 99.5 },
    ],
  },
  mossdeep: {
    title: "Mossdeep City",
    markers: [
      { id: "mos-gym", type: "building", label: "Mossdeep Gym", detail: "Tate & Liza — badge #7.", x: 48.1, y: 23.8 },
      { id: "mos-space", type: "building", label: "Space Center", detail: "Rocket towers (NE). Team Magma attack after gym.", x: 80.6, y: 38.8 },
      { id: "mos-pc", type: "building", label: "Pokémon Center", x: 35.6, y: 41.3 },
      { id: "mos-mart", type: "building", label: "Poké Mart", x: 46.9, y: 46.3 },
      { id: "mos-sun", type: "item", label: "White rock", detail: "Sun Stone spot in the open grass.", x: 71.9, y: 53.8 },
      { id: "mos-house", type: "building", label: "Houses (north)", x: 35.6, y: 23.8 },
      { id: "mos-dive", type: "poi", label: "Dive water (south)", detail: "Use Dive from nearby ocean routes.", x: 50.6, y: 88.8 },
    ],
  },
  sootopolis: {
    title: "Sootopolis City",
    markers: [
      { id: "soo-cave", type: "poi", label: "Cave of Origin", detail: "Dark entrance in the north rock face — legendary story.", x: 52.5, y: 27.5 },
      { id: "soo-gym", type: "building", label: "Sootopolis Gym", detail: "Juan — badge #8 (central island building).", x: 52.5, y: 54.2 },
      { id: "soo-mart", type: "building", label: "Poké Mart", x: 29.2, y: 49.2 },
      { id: "soo-pc", type: "building", label: "Pokémon Center", x: 72.5, y: 52.5 },
      { id: "soo-rod", type: "wild", label: "Central lake", detail: "Fish / surf in the central lake.", x: 52.5, y: 67.5 },
      { id: "soo-dive", type: "poi", label: "Underwater exit (south)", x: 52.5, y: 92.5 },
    ],
  },
  lilycove: {
    title: "Lilycove City",
    markers: [
      { id: "lily-dept", type: "building", label: "Department Store", detail: "Large white building (NW). TMs, stones, items.", x: 34.4, y: 16.3 },
      { id: "lily-pc", type: "building", label: "Pokémon Center", x: 30.6, y: 36.3 },
      { id: "lily-contest", type: "building", label: "Contest Hall / Museum", x: 29.4, y: 61.3 },
      { id: "lily-motel", type: "building", label: "Cove Lily Motel", x: 46.9, y: 61.3 },
      { id: "lily-delete", type: "npc", label: "Move Deleter house", x: 45.6, y: 16.3 },
      { id: "lily-harbor", type: "poi", label: "Harbor / ferries (east shore)", x: 15.6, y: 81.3 },
      { id: "lily-hideout", type: "poi", label: "Team Aqua Hideout (east)", detail: "Across the eastern shore behind the city.", x: 88.1, y: 13.8 },
    ],
  },
  pacifidlog: {
    title: "Pacifidlog Town",
    markers: [
      { id: "pac-pc", type: "building", label: "Pokémon Center", x: 42.5, y: 38.8 },
      { id: "pac-mirage", type: "npc", label: "Mirage Island man", detail: "Daily PID hint (west hut).", x: 17.5, y: 56.3 },
      { id: "pac-houses", type: "building", label: "Floating houses", x: 62.5, y: 61.3 },
      { id: "pac-surf", type: "wild", label: "Surf", detail: "Tentacool, Wingull.", x: 42.5, y: 51.3 },
    ],
  },
  "sky-pillar": {
    title: "Sky Pillar",
    markers: [
      { id: "sp-entrance", type: "poi", label: "Sky Pillar entrance", x: 51.8, y: 23.9 },
      { id: "sp-beach", type: "poi", label: "Beach approach", x: 51.8, y: 89.1 },
      { id: "sp-rocks", type: "poi", label: "Rocky exterior", x: 37.5, y: 54.3 },
    ],
  },
  "victory-road": {
    title: "Victory Road entrance",
    markers: [
      { id: "vr-cave", type: "poi", label: "Victory Road cave", x: 47, y: 88 },
      { id: "vr-league-path", type: "poi", label: "Path to Pokémon League", x: 72, y: 14 },
      { id: "vr-exterior", type: "wild", label: "Exterior grass", x: 55, y: 38 },
    ],
  },
  "sealed-chamber": {
    title: "Sealed Chamber",
    markers: [
      { id: "sc-entrance", type: "poi", label: "Chamber entrance", x: 50, y: 84.8 },
      { id: "sc-braille", type: "poi", label: "Braille wall", detail: "Use Dig at the back wall.", x: 50, y: 19.6 },
      { id: "sc-regi", type: "poi", label: "Regi unlock room", detail: "Wailord slot 1, Relicanth slot 6.", x: 50, y: 54.3 },
      { id: "sc-tablets", type: "poi", label: "Braille tablets", x: 50, y: 41.3 },
    ],
  },
  "marine-cave": {
    title: "Marine Cave",
    markers: [
      { id: "mc-kyogre", type: "poi", label: "Kyogre", detail: "Save before interacting.", x: 52, y: 35 },
      { id: "mc-player", type: "poi", label: "Approach point", x: 50, y: 62 },
      { id: "mc-exit", type: "poi", label: "Cave exit", x: 50, y: 88 },
    ],
  },
  "ever-grande": {
    title: "Ever Grande City",
    markers: [
      { id: "eg-league", type: "building", label: "Pokémon League", detail: "Elite Four + Steven.", x: 46.3, y: 6.9 },
      { id: "eg-vr", type: "poi", label: "Victory Road entrance", x: 46.3, y: 51.9 },
    ],
  },
  "battle-frontier": {
    title: "Battle Frontier",
    markers: [
      { id: "bf-arena", type: "building", label: "Battle Arena", x: 74.6, y: 41 },
      { id: "bf-factory", type: "building", label: "Battle Factory", x: 9, y: 53.5 },
      { id: "bf-tower", type: "building", label: "Battle Tower", x: 56.6, y: 20.1 },
      { id: "bf-exchange", type: "npc", label: "BP exchange", detail: "TMs and held items.", x: 52, y: 39.6 },
    ],
  },
  "route-105": {
    title: "Route 105",
    markers: [
      { id: "r105-island", type: "poi", label: "Island Cave", detail: "Regice — walk clockwise on wall.", x: 23.8, y: 25.6 },
      { id: "r105-surf", type: "wild", label: "Surf / rods", x: 48.8, y: 50.6 },
      { id: "r105-south-isles", type: "poi", label: "Southern islands", x: 11.3, y: 73.1 },
    ],
  },
  "route-111": {
    title: "Route 111",
    markers: [
      { id: "r111-north", type: "poi", label: "North section", x: 51.3, y: 0.4 },
      { id: "r111-desert", type: "poi", label: "Desert Ruins", detail: "Regirock puzzle chamber in the desert.", x: 73.8, y: 62.5 },
      { id: "r111-sand", type: "poi", label: "Desert", detail: "Need Go-Goggles.", x: 73.8, y: 57.5 },
      { id: "r111-grass", type: "wild", label: "Desert grass", detail: "Sandshrew, Spinda, Skarmory.", x: 56.3, y: 55.4 },
      { id: "r111-winstrate", type: "trainer", label: "Winstrate family", detail: "House south of the desert.", x: 33.8, y: 81.1 },
      { id: "r111-south", type: "poi", label: "South exit", x: 51.3, y: 99.6 },
    ],
  },
};

/** Screenshot filename stem → annotation key. */
const IMAGE_ALIASES: Record<string, string> = {
  littleroot_town_e: "littleroot",
  littleroot: "littleroot",
  oldale: "oldale",
  petalburg_city_e: "petalburg",
  rustboro_city_e: "rustboro",
  dewford_town_e: "dewford",
  slateport_city_e: "slateport",
  mauville_city_e: "mauville",
  lavaridge_town_e: "lavaridge",
  fortree_city_e: "fortree",
  mossdeep_city_e: "mossdeep",
  sootopolis_city_e: "sootopolis",
  victory_road_e: "victory-road",
  battle_frontier_e: "battle-frontier",
  mt_chimney_e: "mt-chimney",
  route110: "route-110",
  "marine-cave": "marine-cave",
  emeraldtitle: "littleroot",
};

export function resolveAnnotationKey(imageSrc: string, areaId?: string): string | undefined {
  if (areaId && MAP_ANNOTATIONS[areaId]) return areaId;
  const file = imageSrc.split("/").pop()?.replace(/\.png$/i, "") ?? "";
  if (MAP_ANNOTATIONS[file]) return file;
  if (IMAGE_ALIASES[file] && MAP_ANNOTATIONS[IMAGE_ALIASES[file]]) return IMAGE_ALIASES[file];
  return undefined;
}

export function getMapAnnotation(imageSrc: string, areaId?: string): MapAnnotation | undefined {
  const key = resolveAnnotationKey(imageSrc, areaId);
  return key ? MAP_ANNOTATIONS[key] : undefined;
}
