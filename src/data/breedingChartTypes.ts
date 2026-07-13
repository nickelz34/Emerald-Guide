/** One Pokémon shown in a breeding chart (sprite + label). */
export interface BreedingMonRef {
  name: string;
  dex: number;
  /** Short role label, e.g. "♀ parent" or "♂ father". */
  subtitle?: string;
}

/** Parent pair → Egg → offspring row. */
export interface BreedingPairEdge {
  parentA: BreedingMonRef;
  parentB: BreedingMonRef;
  itemIconName?: string;
  itemIconPath?: string;
  methodLabel?: string;
  offspring: BreedingMonRef[];
  note?: string;
}

/** Species tile in an egg-group grid. */
export interface BreedingGridSpecies {
  name: string;
  dex: number;
}

export interface BreedingChartGroup {
  name: string;
  headerIconName?: string;
  headerIconPath?: string;
  type: "pairs" | "grid";
  pairs?: BreedingPairEdge[];
  grid?: BreedingGridSpecies[];
  gridNote?: string;
}

export interface BreedingChartSpec {
  title: string;
  lead: string;
  ariaLabel: string;
  groups: BreedingChartGroup[];
}
