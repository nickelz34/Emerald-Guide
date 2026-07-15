/** All 25 Gen III natures — +/− stat modifiers and contest flavor ties (Emerald). */

export interface NatureRow {
  name: string;
  raised: string | null;
  lowered: string | null;
  /** Contest condition favored by this nature’s preferred Pokéblock flavors. */
  contest: string | null;
  /** Preferred berry/Pokéblock flavor (Gen III). */
  likes: string | null;
  /** Disliked flavor (Gen III). */
  dislikes: string | null;
}

export const NATURE_TABLE: NatureRow[] = [
  { name: "Hardy", raised: null, lowered: null, contest: null, likes: null, dislikes: null },
  { name: "Lonely", raised: "Attack", lowered: "Defense", contest: "Cool", likes: "Spicy", dislikes: "Sour" },
  { name: "Brave", raised: "Attack", lowered: "Speed", contest: "Cool", likes: "Spicy", dislikes: "Sweet" },
  { name: "Adamant", raised: "Attack", lowered: "Sp. Atk", contest: "Cool", likes: "Spicy", dislikes: "Dry" },
  { name: "Naughty", raised: "Attack", lowered: "Sp. Def", contest: "Cool", likes: "Spicy", dislikes: "Bitter" },
  { name: "Bold", raised: "Defense", lowered: "Attack", contest: "Tough", likes: "Sour", dislikes: "Spicy" },
  { name: "Docile", raised: null, lowered: null, contest: null, likes: null, dislikes: null },
  { name: "Relaxed", raised: "Defense", lowered: "Speed", contest: "Tough", likes: "Sour", dislikes: "Sweet" },
  { name: "Impish", raised: "Defense", lowered: "Sp. Atk", contest: "Tough", likes: "Sour", dislikes: "Dry" },
  { name: "Lax", raised: "Defense", lowered: "Sp. Def", contest: "Tough", likes: "Sour", dislikes: "Bitter" },
  { name: "Timid", raised: "Speed", lowered: "Attack", contest: "Cute", likes: "Sweet", dislikes: "Spicy" },
  { name: "Hasty", raised: "Speed", lowered: "Defense", contest: "Cute", likes: "Sweet", dislikes: "Sour" },
  { name: "Serious", raised: null, lowered: null, contest: null, likes: null, dislikes: null },
  { name: "Jolly", raised: "Speed", lowered: "Sp. Atk", contest: "Cute", likes: "Sweet", dislikes: "Dry" },
  { name: "Naive", raised: "Speed", lowered: "Sp. Def", contest: "Cute", likes: "Sweet", dislikes: "Bitter" },
  { name: "Modest", raised: "Sp. Atk", lowered: "Attack", contest: "Beauty", likes: "Dry", dislikes: "Spicy" },
  { name: "Mild", raised: "Sp. Atk", lowered: "Defense", contest: "Beauty", likes: "Dry", dislikes: "Sour" },
  { name: "Quiet", raised: "Sp. Atk", lowered: "Speed", contest: "Beauty", likes: "Dry", dislikes: "Sweet" },
  { name: "Bashful", raised: null, lowered: null, contest: null, likes: null, dislikes: null },
  { name: "Rash", raised: "Sp. Atk", lowered: "Sp. Def", contest: "Beauty", likes: "Dry", dislikes: "Bitter" },
  { name: "Calm", raised: "Sp. Def", lowered: "Attack", contest: "Smart", likes: "Bitter", dislikes: "Spicy" },
  { name: "Gentle", raised: "Sp. Def", lowered: "Defense", contest: "Smart", likes: "Bitter", dislikes: "Sour" },
  { name: "Sassy", raised: "Sp. Def", lowered: "Speed", contest: "Smart", likes: "Bitter", dislikes: "Sweet" },
  { name: "Careful", raised: "Sp. Def", lowered: "Sp. Atk", contest: "Smart", likes: "Bitter", dislikes: "Dry" },
  { name: "Quirky", raised: null, lowered: null, contest: null, likes: null, dislikes: null },
];

/** Nature multiplies the raised/lowered battle stats by 1.1 / 0.9; HP is never affected. */
export const NATURE_STAT_MOD = { raised: 1.1, lowered: 0.9 } as const;
