export interface MapRegion {
  id: string;
  label: string;
  /** Percent position on the Hoenn map image (0–100). */
  x: number;
  y: number;
  stepIds: string[];
}

/** Pin positions calibrated to Bulbapedia Hoenn Soaring ORAS map (1476×922). */
export const MAP_REGIONS: MapRegion[] = [
  { id: "littleroot", label: "Littleroot", x: 11.5, y: 83, stepIds: ["littleroot-1", "route-101-1", "secret-base", "postgame-1", "postgame-2", "postgame-3", "postgame-hoenn-4"] },
  { id: "oldale", label: "Oldale", x: 16, y: 74, stepIds: ["oldale-1", "route-103-1", "route-102-1"] },
  { id: "petalburg", label: "Petalburg", x: 14, y: 63, stepIds: ["petalburg-1", "petalburg-gym-1", "route-104-1", "petalburg-woods-1"] },
  { id: "rustboro", label: "Rustboro", x: 17.5, y: 36, stepIds: ["rustboro-1", "route-116-1", "rusturf-tunnel-1", "granite-cave-1"] },
  { id: "dewford", label: "Dewford", x: 7.5, y: 73, stepIds: ["dewford-1", "granite-cave-1"] },
  { id: "slateport", label: "Slateport", x: 39, y: 69, stepIds: ["slateport-1", "contests-lilycove-3"] },
  { id: "mauville", label: "Mauville", x: 43, y: 53, stepIds: ["mauville-1", "route-117-1", "contest-prep-2", "berry-master", "contests-postgame-1"] },
  {
    id: "route110",
    label: "Route 110",
    x: 37,
    y: 61,
    stepIds: [
      "route-110-1",
      "lucky-egg",
      "trick-1",
      "trick-2",
      "trick-3",
      "trick-4",
      "trick-5",
      "trick-6",
      "trick-7",
      "trick-8",
      "postgame-hoenn-6",
      "postgame-hoenn-8",
    ],
  },
  { id: "mt-chimney", label: "Mt. Chimney", x: 51, y: 31, stepIds: ["mt-chimney-1", "route-111-1", "route-112-1", "magma-hideout-1", "postgame-hoenn-3"] },
  { id: "fallarbor", label: "Fallarbor", x: 38, y: 20, stepIds: ["fallarbor-1", "route-113-1", "route-114-1", "postgame-hoenn-2", "postgame-hoenn-7"] },
  { id: "lavaridge", label: "Lavaridge", x: 56.5, y: 37, stepIds: ["lavaridge-1"] },
  { id: "fortree", label: "Fortree", x: 64.5, y: 44, stepIds: ["fortree-1", "fortree-3", "route-118-1", "route-119-1", "route-120-1", "route-120-3"] },
  { id: "lilycove", label: "Lilycove", x: 72, y: 44, stepIds: ["lilycove-1", "contests-lilycove-1", "contests-lilycove-2", "contests-lilycove-4", "contests-lilycove-5", "contests-postgame-2", "contests-postgame-blend", "mt-pyre-1", "postgame-events-1", "postgame-events-2", "postgame-events-3", "postgame-events-4", "postgame-events-5", "postgame-hoenn-9"] },
  { id: "mossdeep", label: "Mossdeep", x: 81, y: 41, stepIds: ["mossdeep-1", "seafloor-cavern-1", "master-ball", "postgame-hoenn-1"] },
  { id: "sootopolis", label: "Sootopolis", x: 71, y: 29, stepIds: ["sootopolis-1", "sootopolis-gym-1", "sootopolis-gym-3"] },
  { id: "sky-pillar", label: "Sky Pillar", x: 89, y: 17, stepIds: ["sky-pillar-1", "sky-pillar-2", "sky-pillar-3"] },
  { id: "sealed", label: "Sealed Chamber", x: 4.5, y: 54, stepIds: ["sealed-chamber-1", "sealed-chamber-2", "sealed-chamber-3", "sealed-chamber-4", "sealed-chamber-5"] },
  { id: "ever-grande", label: "Ever Grande", x: 87, y: 57, stepIds: ["victory-road-1", "league-1"] },
  { id: "frontier", label: "Battle Frontier", x: 77, y: 69, stepIds: ["battle-frontier-1", "battle-frontier-2", "battle-frontier-3", "battle-frontier-4", "battle-frontier-5", "battle-frontier-6", "battle-frontier"] },
  { id: "safari-zone", label: "Safari Zone", x: 54.69, y: 22.32, stepIds: ["safari-zone-1", "safari-zone-2", "safari-zone-3", "postgame-hoenn-5"] },
  { id: "pacifidlog", label: "Pacifidlog Town", x: 61.25, y: 73.11, stepIds: ["pacifidlog-1", "pacifidlog-2", "pacifidlog-3"] },
  { id: "abandoned-ship", label: "Abandoned Ship", x: 21.19, y: 95.69, stepIds: ["abandoned-ship-1", "abandoned-ship-2"] },
  { id: "shoal-cave", label: "Shoal Cave", x: 82.81, y: 20.76, stepIds: ["shoal-cave-1", "shoal-cave-2"] },
];

export function getRegionForStep(stepId: string): MapRegion | undefined {
  return MAP_REGIONS.find((r) => r.stepIds.includes(stepId));
}
