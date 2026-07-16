import { getAreasForStep } from "../data/areaData";
import { STARTER_CHOICE_INTRO, STARTER_GUIDE } from "../data/starterChoice";
import {
  RALTS_ABILITIES_NOTE,
  RALTS_HUNT_TIPS,
  RALTS_NATURES,
  RALTS_SPOTLIGHT_INTRO,
  RALTS_STAGES,
} from "../data/raltsSpotlight";
import { getGymForWalkthroughStep } from "../data/gymData";
import { getRivalForWalkthroughStep } from "../data/rivalData";
import { getStoryTrainerForWalkthroughStep } from "../data/storyTrainerBattles";
import { HM_UNLOCK_TABLE } from "../data/hmUnlock";
import { KEY_ITEM_UNLOCKS } from "../data/keyItems";
import { POKE_BALL_TABLE } from "../data/pokeBalls";
import { STATUS_CONDITION_TABLE } from "../data/statusConditions";
import { NATURE_TABLE } from "../data/natures";
import { VITAMIN_TABLE } from "../data/vitamins";
import { SCOTT_SIGHTINGS } from "../data/scottSightings";
import { EMERALD_HM_CATALOG, EMERALD_TM_CATALOG } from "../data/tmHmCatalog";
import type { GuideStep, StepSpecialtyData } from "../types";
import { getAvailablePanelsForStep } from "./availablePanels";

const BATTLE_BASICS_DEFAULT = {
  lead:
    "Pokémon Emerald uses the same battle screen everywhere. Use these quick examples to read wild fights, trainer singles, and doubles.",
  examples: [
    {
      id: "wild",
      title: "Wild battle (always 1-on-1)",
      blurb:
        "Tall grass, caves, Surf, or fishing. Poké Balls work. Run succeeds if you are faster (or equal Speed); slower = chance that improves each try.",
    },
    {
      id: "trainer",
      title: "Trainer battle (singles)",
      blurb:
        "Line of sight or talk. No catching. Run is refused. Win prize money when their party is out.",
    },
    {
      id: "doubles",
      title: "Double battle (2-on-2)",
      blurb:
        "Pair classes, two trainers spotting you at once (Emerald), or Tate & Liza. Surf hits both foes; Earthquake hits your ally too.",
    },
  ],
  commands: [
    {
      id: "fight",
      label: "Fight",
      hint: "Moves",
      detail: "Choose a move (name, type, PP). Priority brackets act before Speed within the turn.",
    },
    {
      id: "bag",
      label: "Bag",
      hint: "Items",
      detail: "Potions, status heals, X items. Poké Balls only vs wild Pokémon. Uses your turn.",
    },
    {
      id: "pokemon",
      label: "Pokémon",
      hint: "Party",
      detail: "View summaries and switch. A voluntary switch happens before moves — the new lead is hit.",
    },
    {
      id: "run",
      label: "Run",
      hint: "Escape",
      detail: "Wild only. Always works if Speed ≥ the foe; otherwise chance rises each attempt. Fails vs trainers.",
    },
  ],
};

/** Ensure specialty overrides exist for every panel available on this step. */
export function seedSpecialtyForStep(step: GuideStep): StepSpecialtyData {
  const specialty: StepSpecialtyData = { ...(step.specialty ?? {}) };
  const available = new Set(getAvailablePanelsForStep(step).map((p) => p.id));

  if (available.has("gym") && !specialty.gym) {
    const gym = getGymForWalkthroughStep(step.id);
    if (gym) specialty.gym = structuredClone(gym);
  }
  if (available.has("rival") && !specialty.rival) {
    const rival = getRivalForWalkthroughStep(step.id);
    if (rival) specialty.rival = structuredClone(rival);
  }
  if (available.has("story-trainer") && !specialty.storyTrainer) {
    const story = getStoryTrainerForWalkthroughStep(step.id);
    if (story) {
      specialty.storyTrainer = {
        walkthroughStepId: story.walkthroughStepId,
        title: story.title,
        intro: story.intro,
        note: story.note,
        trainerName: story.trainer.trainerName ?? story.trainer.name,
        trainerClass: story.trainer.trainerClass,
        trainerNote: story.trainer.note,
        trainerDesc: story.trainer.desc,
        trainerId: story.trainer.trainerId,
      };
    }
  }
  if (available.has("starter") && !specialty.starter) {
    specialty.starter = {
      intro: STARTER_CHOICE_INTRO,
      entries: STARTER_GUIDE.map((e) => ({ ...e, natures: [...e.natures] })),
    };
  }
  if (available.has("ralts") && !specialty.ralts) {
    specialty.ralts = {
      intro: RALTS_SPOTLIGHT_INTRO,
      huntTips: [...RALTS_HUNT_TIPS],
      natures: [...RALTS_NATURES],
      abilitiesNote: RALTS_ABILITIES_NOTE,
      stages: RALTS_STAGES.map((s) => ({ ...s })),
    };
  }
  if (available.has("flower-shop") && !specialty.flowerShop) {
    specialty.flowerShop = {
      pailBlurb:
        "Talk to the girl by the Wailmer Pail to receive it — you’ll need it to water berries planted in soft soil.",
      softSoilNote:
        "Soft soil plots around Hoenn grow berries over time. Plant, water with the Wailmer Pail, and come back later.",
    };
  }
  if (available.has("battle-basics") && !specialty.battleBasics) {
    specialty.battleBasics = structuredClone(BATTLE_BASICS_DEFAULT);
  }
  if (available.has("hm-table") && !specialty.hmTable) {
    specialty.hmTable = structuredClone(HM_UNLOCK_TABLE);
  }
  if (available.has("key-items") && !specialty.keyItems) {
    specialty.keyItems = structuredClone(KEY_ITEM_UNLOCKS);
  }
  if (available.has("poke-balls") && !specialty.pokeBalls) {
    specialty.pokeBalls = structuredClone(POKE_BALL_TABLE);
  }
  if (available.has("status-table") && !specialty.statusTable) {
    specialty.statusTable = structuredClone(STATUS_CONDITION_TABLE);
  }
  if (available.has("nature-table") && !specialty.natures) {
    specialty.natures = structuredClone(NATURE_TABLE);
  }
  if (available.has("vitamins-table") && !specialty.vitamins) {
    specialty.vitamins = structuredClone(VITAMIN_TABLE);
  }
  if (available.has("tm-hm-table") && !specialty.tmHmTable) {
    specialty.tmHmTable = {
      lead:
        "Generation III TMs are reusable. HMs are reusable too, but field use waits for the matching gym badge — the move still works in battle as soon as you teach it.",
      tms: structuredClone(EMERALD_TM_CATALOG),
      hms: structuredClone(EMERALD_HM_CATALOG),
    };
  }
  if (available.has("type-chart") && !specialty.typeChart) {
    specialty.typeChart = {
      lead:
        "Pick an attacking move type to see how it hits every defending type. Dual-typed Pokémon multiply both factors (for example Water/Ground takes 4× from Grass). STAB (1.5×) is separate and applies when the move matches the user’s type.",
    };
  }
  if (available.has("scott") && !specialty.scott) {
    specialty.scott = structuredClone(SCOTT_SIGHTINGS);
  }
  if (available.has("encounters") && !specialty.encounters) {
    const tips: string[] = [];
    const secrets: string[] = [];
    // Area tips/secrets stay in areaData; provide editable step-level extras buckets.
    void getAreasForStep(step.id);
    specialty.encounters = { tips, secrets };
  }

  return specialty;
}
