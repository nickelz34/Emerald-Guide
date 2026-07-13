/** Match Call rematch mechanics (pokeemerald match_call.c / battle_setup.c). */

export const MATCH_CALL_RULES = [
  {
    title: "When rematches unlock",
    body: "Route trainers auto-register after you earn the Balance Badge from Norman. Gym Leaders and the Elite Four join the rotation after entering the Hall of Fame.",
  },
  {
    title: "How to trigger a battle",
    body: "A flashing Poké Ball beside a name means they are ready. Call them from the PokéNav — you cannot force a rematch by calling before the icon appears.",
  },
  {
    title: "Same area bonus",
    body: "Stand in the trainer's map section (region map area, not necessarily the exact tile). Eligible trainers on your current section always request a battle when you call.",
  },
  {
    title: "Off-route rolls",
    body: "Elsewhere, the game randomly offers rematches as you walk. Leading with a Pokémon that has Lightning Rod slightly increases call frequency for registered trainers.",
  },
  {
    title: "Gym Leader cadence",
    body: "After the Elite Four, every 60 wild encounters, 20 trainer battles, or 20 Battle Frontier battles gives a 31% chance that a Gym Leader becomes ready. Wattson requires finishing New Mauville; leaders must be beaten in rematch tier order (all first sets before second, and so on).",
  },
] as const;

export type { MatchCallScheduleRow } from "./matchCallSchedule.generated";
export { MATCH_CALL_SCHEDULE_ROWS } from "./matchCallSchedule.generated";
