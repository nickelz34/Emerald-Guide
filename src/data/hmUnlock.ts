export interface HmUnlockRow {
  hm: string;
  move: string;
  obtainStepId: string;
  obtainLocation: string;
  /** Badge required before the HM works in the field (Emerald). */
  fieldBadge: string;
  fieldBadgeNumber: number;
}

/** Emerald HM acquisition and field-use badge gates. */
export const HM_UNLOCK_TABLE: HmUnlockRow[] = [
  {
    hm: "HM01",
    move: "Cut",
    obtainStepId: "rustboro-1",
    obtainLocation: "Rustboro City — cutter's house",
    fieldBadge: "Stone Badge",
    fieldBadgeNumber: 1,
  },
  {
    hm: "HM05",
    move: "Flash",
    obtainStepId: "granite-cave-2",
    obtainLocation: "Granite Cave B2F — hiker",
    fieldBadge: "Knuckle Badge",
    fieldBadgeNumber: 2,
  },
  {
    hm: "HM06",
    move: "Rock Smash",
    obtainStepId: "mauville-1",
    obtainLocation: "Mauville City — southeast house",
    fieldBadge: "Dynamo Badge",
    fieldBadgeNumber: 3,
  },
  {
    hm: "HM04",
    move: "Strength",
    obtainStepId: "route-117-2",
    obtainLocation: "Verdanturf / Rusturf Tunnel west end",
    fieldBadge: "Heat Badge",
    fieldBadgeNumber: 4,
  },
  {
    hm: "HM03",
    move: "Surf",
    obtainStepId: "petalburg-gym-2",
    obtainLocation: "Petalburg Gym — Norman after badge 5",
    fieldBadge: "Balance Badge",
    fieldBadgeNumber: 5,
  },
  {
    hm: "HM02",
    move: "Fly",
    obtainStepId: "route-119-2",
    obtainLocation: "Weather Institute — bed after Shelly",
    fieldBadge: "Feather Badge",
    fieldBadgeNumber: 6,
  },
  {
    hm: "HM08",
    move: "Dive",
    obtainStepId: "mossdeep-2",
    obtainLocation: "Mossdeep City — Steven's house",
    fieldBadge: "Mind Badge",
    fieldBadgeNumber: 7,
  },
  {
    hm: "HM07",
    move: "Waterfall",
    obtainStepId: "sootopolis-gym-1",
    obtainLocation: "Sootopolis City — Wallace outside gym",
    fieldBadge: "Rain Badge",
    fieldBadgeNumber: 8,
  },
];
