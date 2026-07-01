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
  { id: "littleroot", label: "Littleroot", x: 11.5, y: 83, stepIds: ["start", "secret-base"] },
  { id: "petalburg", label: "Petalburg", x: 14, y: 63, stepIds: ["petalburg", "norman"] },
  { id: "rustboro", label: "Rustboro", x: 17.5, y: 36, stepIds: ["stone-badge", "exp-share", "dex-nav"] },
  { id: "dewford", label: "Dewford", x: 7.5, y: 73, stepIds: ["knuckle-badge"] },
  { id: "slateport", label: "Slateport", x: 39, y: 69, stepIds: ["slateport-museum"] },
  { id: "mauville", label: "Mauville", x: 43, y: 53, stepIds: ["dynamo-badge", "berry-master"] },
  {
    id: "route110",
    label: "Route 110",
    x: 37,
    y: 61,
    stepIds: [
      "weather-institute",
      "lucky-egg",
      "trick-1",
      "trick-2",
      "trick-3",
      "trick-4",
      "trick-5",
      "trick-6",
      "trick-7",
      "trick-8",
    ],
  },
  { id: "mt-chimney", label: "Mt. Chimney", x: 51, y: 31, stepIds: ["chimney", "groudon"] },
  { id: "lavaridge", label: "Lavaridge", x: 56.5, y: 37, stepIds: ["heat-badge"] },
  { id: "fortree", label: "Fortree", x: 64.5, y: 44, stepIds: ["feather-badge"] },
  { id: "mossdeep", label: "Mossdeep", x: 81, y: 41, stepIds: ["mind-badge", "master-ball", "latios-latias"] },
  { id: "sootopolis", label: "Sootopolis", x: 71, y: 29, stepIds: ["seafloor-cavern", "sootopolis-rayquaza", "rain-badge", "kyogre"] },
  { id: "sky-pillar", label: "Sky Pillar", x: 89, y: 17, stepIds: ["rayquaza-catch"] },
  { id: "sealed", label: "Sealed Chamber", x: 4.5, y: 54, stepIds: ["regi-puzzle", "regirock", "regice", "registeel"] },
  { id: "ever-grande", label: "Ever Grande", x: 87, y: 57, stepIds: ["victory-road"] },
  { id: "frontier", label: "Battle Frontier", x: 77, y: 69, stepIds: ["battle-frontier"] },
];

export function getRegionForStep(stepId: string): MapRegion | undefined {
  return MAP_REGIONS.find((r) => r.stepIds.includes(stepId));
}
