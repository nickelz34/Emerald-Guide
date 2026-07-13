/** One Pokémon shown in a breeding chart (sprite + label). */
export interface BreedingMonRef {
  name: string;
  /** National dex # for emeraldSpriteUrl; omit when kind is \"egg\". */
  dex?: number;
  /** ♀ / ♂ badge — separate from subtitle so mobile layout stays aligned. */
  gender?: "female" | "male";
  /** Extra line under the name (egg group, move, step count, etc.). */
  subtitle?: string;
  /** Render the Emerald Egg sprite instead of a Pokémon. */
  kind?: "pokemon" | "egg";
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
  gender?: "female" | "male";
  subtitle?: string;
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
