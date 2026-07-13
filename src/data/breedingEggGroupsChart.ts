import type { BreedingChartSpec } from "./breedingChartTypes";

/**
 * Ch. 2 Event 2 — representative Emerald species per egg group.
 * Full compatibility is in the breeding lookup tool on this step.
 */
export const EGG_GROUPS_BREEDING_CHART: BreedingChartSpec = {
  title: "Egg groups in Emerald",
  lead: "Every breedable species belongs to one or two groups. Parents need a shared group (and opposite genders), or one parent must be Ditto.",
  ariaLabel: "Egg groups reference chart",
  groups: [
    {
      name: "Monster",
      type: "grid",
      grid: [
        { name: "Treecko", dex: 252 },
        { name: "Torchic", dex: 255 },
        { name: "Mudkip", dex: 258 },
        { name: "Aron", dex: 304 },
        { name: "Larvitar", dex: 246 },
        { name: "Rhyhorn", dex: 111 },
      ],
      gridNote: "Often pairs with Grass or Water 1 on starters and common Hoenn lines.",
    },
    {
      name: "Water 1",
      type: "grid",
      grid: [
        { name: "Mudkip", dex: 258 },
        { name: "Marill", dex: 183 },
        { name: "Psyduck", dex: 54 },
        { name: "Wingull", dex: 278 },
        { name: "Goldeen", dex: 118 },
        { name: "Magikarp", dex: 129 },
      ],
    },
    {
      name: "Bug",
      type: "grid",
      grid: [
        { name: "Wurmple", dex: 265 },
        { name: "Nincada", dex: 290 },
        { name: "Heracross", dex: 214 },
        { name: "Surskit", dex: 283 },
        { name: "Volbeat", dex: 313 },
        { name: "Illumise", dex: 314 },
      ],
    },
    {
      name: "Flying",
      type: "grid",
      grid: [
        { name: "Taillow", dex: 276 },
        { name: "Swablu", dex: 333 },
        { name: "Skarmory", dex: 227 },
        { name: "Pidgey", dex: 16 },
        { name: "Spearow", dex: 21 },
        { name: "Zubat", dex: 41 },
      ],
    },
    {
      name: "Field",
      type: "grid",
      grid: [
        { name: "Zigzagoon", dex: 263 },
        { name: "Ralts", dex: 280 },
        { name: "Eevee", dex: 133 },
        { name: "Slakoth", dex: 287 },
        { name: "Vulpix", dex: 37 },
        { name: "Growlithe", dex: 58 },
      ],
      gridNote: "Largest group in practice — Ditto partners with most Field species easily.",
    },
    {
      name: "Fairy",
      type: "grid",
      grid: [
        { name: "Marill", dex: 183 },
        { name: "Ralts", dex: 280 },
        { name: "Cleffa", dex: 173 },
        { name: "Igglybuff", dex: 174 },
        { name: "Azurill", dex: 298 },
        { name: "Skitty", dex: 300 },
      ],
    },
    {
      name: "Grass",
      type: "grid",
      grid: [
        { name: "Treecko", dex: 252 },
        { name: "Seedot", dex: 273 },
        { name: "Oddish", dex: 43 },
        { name: "Bellsprout", dex: 69 },
        { name: "Lotad", dex: 270 },
        { name: "Shroomish", dex: 285 },
      ],
    },
    {
      name: "Human-Like",
      type: "grid",
      grid: [
        { name: "Makuhita", dex: 296 },
        { name: "Meditite", dex: 307 },
        { name: "Abra", dex: 63 },
        { name: "Machop", dex: 66 },
        { name: "Ralts", dex: 280 },
        { name: "Electrike", dex: 309 },
      ],
    },
    {
      name: "Water 3",
      type: "grid",
      grid: [
        { name: "Corphish", dex: 341 },
        { name: "Carvanha", dex: 318 },
        { name: "Barboach", dex: 339 },
        { name: "Tentacool", dex: 72 },
        { name: "Staryu", dex: 120 },
        { name: "Krabby", dex: 98 },
      ],
    },
    {
      name: "Mineral",
      type: "grid",
      grid: [
        { name: "Geodude", dex: 74 },
        { name: "Nosepass", dex: 299 },
        { name: "Aron", dex: 304 },
        { name: "Onix", dex: 95 },
        { name: "Magnemite", dex: 81 },
      ],
      gridNote: "Genderless species like Magnemite and Voltorb breed only with Ditto.",
    },
    {
      name: "Amorphous",
      type: "grid",
      grid: [
        { name: "Wobbuffet", dex: 202 },
        { name: "Shuppet", dex: 353 },
        { name: "Duskull", dex: 355 },
        { name: "Gastly", dex: 92 },
        { name: "Koffing", dex: 109 },
      ],
    },
    {
      name: "Water 2",
      type: "grid",
      grid: [
        { name: "Wailmer", dex: 320 },
        { name: "Carvanha", dex: 318 },
        { name: "Goldeen", dex: 118 },
        { name: "Barboach", dex: 339 },
        { name: "Qwilfish", dex: 211 },
      ],
    },
    {
      name: "Dragon",
      type: "grid",
      grid: [
        { name: "Bagon", dex: 371 },
        { name: "Swablu", dex: 333 },
        { name: "Vibrava", dex: 329 },
        { name: "Dratini", dex: 147 },
        { name: "Horsea", dex: 116 },
      ],
    },
    {
      name: "Ditto",
      type: "grid",
      grid: [{ name: "Ditto", dex: 132 }],
      gridNote: "Ditto is its own group and can breed with any non-Undiscovered species.",
    },
    {
      name: "Undiscovered — cannot breed",
      type: "grid",
      grid: [
        { name: "Pichu", dex: 172 },
        { name: "Wynaut", dex: 360 },
        { name: "Mewtwo", dex: 150 },
        { name: "Latias", dex: 380 },
        { name: "Kyogre", dex: 382 },
        { name: "Lunatone", dex: 337 },
      ],
      gridNote:
        "Legendaries, most baby Pokémon, and several single-stage species are Undiscovered. Breed the evolved line instead (e.g. Pikachu, not Pichu).",
    },
  ],
};
