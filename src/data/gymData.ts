import type { TrainerPoint } from "./mapTrainersGenerated";
import {
  GYM_LEADER_EXTRA_SPRITES,
  GYM_TRAINER_SPRITES,
  type GymTrainerSprite,
} from "./gymSpritesGenerated";

export interface GymJunior {
  name: string;
  trainerClass: string;
  trainerId: string;
  note?: string;
}

export interface GymData {
  mapPointId: string;
  gymName: string;
  city: string;
  gymNumber: number;
  leaderName: string;
  specialty: string;
  badgeName: string;
  leaderTrainerId: string;
  walkthroughStepId: string;
  doubleBattle?: boolean;
  puzzleNote?: string;
  juniors: GymJunior[];
}

export const GYMS: GymData[] = [
  {
    mapPointId: "gym-rustboro",
    gymName: "Rustboro City Gym",
    city: "Rustboro City",
    gymNumber: 1,
    leaderName: "Roxanne",
    specialty: "Rock",
    badgeName: "Stone Badge",
    leaderTrainerId: "TRAINER_ROXANNE_1",
    walkthroughStepId: "rustboro-2",
    juniors: [
      { name: "Josh", trainerClass: "Youngster", trainerId: "TRAINER_JOSH" },
      { name: "Tommy", trainerClass: "Youngster", trainerId: "TRAINER_TOMMY" },
      { name: "Marc", trainerClass: "Hiker", trainerId: "TRAINER_MARC" },
    ],
  },
  {
    mapPointId: "gym-dewford",
    gymName: "Dewford Town Gym",
    city: "Dewford Town",
    gymNumber: 2,
    leaderName: "Brawly",
    specialty: "Fighting",
    badgeName: "Knuckle Badge",
    leaderTrainerId: "TRAINER_BRAWLY_1",
    walkthroughStepId: "dewford-2",
    puzzleNote: "The gym is pitch black — each trainer you beat lights more of the path (Flash helps).",
    juniors: [
      { name: "Takao", trainerClass: "Black Belt", trainerId: "TRAINER_TAKAO" },
      { name: "Jocelyn", trainerClass: "Battle Girl", trainerId: "TRAINER_JOCELYN" },
      { name: "Laura", trainerClass: "Black Belt", trainerId: "TRAINER_LAURA" },
      { name: "Cristian", trainerClass: "Black Belt", trainerId: "TRAINER_CRISTIAN" },
      { name: "Lilith", trainerClass: "Battle Girl", trainerId: "TRAINER_LILITH" },
      { name: "Brenden", trainerClass: "Battle Girl", trainerId: "TRAINER_BRENDEN" },
    ],
  },
  {
    mapPointId: "gym-mauville",
    gymName: "Mauville City Gym",
    city: "Mauville City",
    gymNumber: 3,
    leaderName: "Wattson",
    specialty: "Electric",
    badgeName: "Dynamo Badge",
    leaderTrainerId: "TRAINER_WATTSON_1",
    walkthroughStepId: "mauville-2",
    puzzleNote: "Step on floor switches to raise and lower barriers between trainers.",
    juniors: [
      { name: "Shawn", trainerClass: "Youngster", trainerId: "TRAINER_SHAWN" },
      { name: "Vivian", trainerClass: "Battle Girl", trainerId: "TRAINER_VIVIAN" },
      { name: "Ben", trainerClass: "Youngster", trainerId: "TRAINER_BEN" },
      { name: "Kirk", trainerClass: "Guitarist", trainerId: "TRAINER_KIRK" },
      { name: "Angelo", trainerClass: "Guitarist", trainerId: "TRAINER_ANGELO" },
    ],
  },
  {
    mapPointId: "gym-lavaridge",
    gymName: "Lavaridge Town Gym",
    city: "Lavaridge Town",
    gymNumber: 4,
    leaderName: "Flannery",
    specialty: "Fire",
    badgeName: "Heat Badge",
    leaderTrainerId: "TRAINER_FLANNERY_1",
    walkthroughStepId: "lavaridge-2",
    puzzleNote: "Navigate hot-spring smoke and spinning warp tiles to reach Flannery.",
    juniors: [
      { name: "Jeff", trainerClass: "Kindler", trainerId: "TRAINER_JEFF" },
      { name: "Jace", trainerClass: "Kindler", trainerId: "TRAINER_JACE", note: "May double with Hiker Eli" },
      { name: "Eli", trainerClass: "Hiker", trainerId: "TRAINER_ELI", note: "May double with Kindler Jace" },
      { name: "Cole", trainerClass: "Kindler", trainerId: "TRAINER_COLE", note: "May double with Cooltrainer Gerald" },
      { name: "Gerald", trainerClass: "Cooltrainer", trainerId: "TRAINER_GERALD", note: "May double with Kindler Cole" },
      { name: "Axle", trainerClass: "Kindler", trainerId: "TRAINER_AXLE" },
      { name: "Keegan", trainerClass: "Kindler", trainerId: "TRAINER_KEEGAN" },
    ],
  },
  {
    mapPointId: "gym-petalburg",
    gymName: "Petalburg City Gym",
    city: "Petalburg City",
    gymNumber: 5,
    leaderName: "Norman",
    specialty: "Normal",
    badgeName: "Balance Badge",
    leaderTrainerId: "TRAINER_NORMAN_1",
    walkthroughStepId: "petalburg-gym-1",
    puzzleNote: "Choose a challenge room — Speed, Accuracy, Defense, or Attack — then reach Norman at the center.",
    juniors: [
      { name: "Mary", trainerClass: "Lass", trainerId: "TRAINER_MARY" },
      { name: "Randall", trainerClass: "Cooltrainer", trainerId: "TRAINER_RANDALL", note: "Speed room" },
      { name: "Parker", trainerClass: "Cooltrainer", trainerId: "TRAINER_PARKER", note: "Accuracy room" },
      { name: "Alexia", trainerClass: "Cooltrainer", trainerId: "TRAINER_ALEXIA", note: "Defense room" },
      { name: "George", trainerClass: "Cooltrainer", trainerId: "TRAINER_GEORGE", note: "Attack room" },
      { name: "Jody", trainerClass: "Cooltrainer", trainerId: "TRAINER_JODY" },
      { name: "Berke", trainerClass: "Black Belt", trainerId: "TRAINER_BERKE" },
    ],
  },
  {
    mapPointId: "gym-fortree",
    gymName: "Fortree City Gym",
    city: "Fortree City",
    gymNumber: 6,
    leaderName: "Winona",
    specialty: "Flying",
    badgeName: "Feather Badge",
    leaderTrainerId: "TRAINER_WINONA_1",
    walkthroughStepId: "fortree-2",
    puzzleNote: "Rotating gates block the path — use the switches to line up a route to Winona.",
    juniors: [
      { name: "Jared", trainerClass: "Bird Keeper", trainerId: "TRAINER_JARED" },
      { name: "Flint", trainerClass: "Bird Keeper", trainerId: "TRAINER_FLINT" },
      { name: "Ashley", trainerClass: "Bird Keeper", trainerId: "TRAINER_ASHLEY" },
      { name: "Edwardo", trainerClass: "Bird Keeper", trainerId: "TRAINER_EDWARDO" },
      { name: "Humberto", trainerClass: "Bird Keeper", trainerId: "TRAINER_HUMBERTO" },
      { name: "Darius", trainerClass: "Bird Keeper", trainerId: "TRAINER_DARIUS" },
    ],
  },
  {
    mapPointId: "gym-mossdeep",
    gymName: "Mossdeep City Gym",
    city: "Mossdeep City",
    gymNumber: 7,
    leaderName: "Tate & Liza",
    specialty: "Psychic",
    badgeName: "Mind Badge",
    leaderTrainerId: "TRAINER_TATE_AND_LIZA_1",
    walkthroughStepId: "mossdeep-1",
    doubleBattle: true,
    puzzleNote: "Paired junior trainers fight double battles on the way to Tate & Liza.",
    juniors: [
      { name: "Preston", trainerClass: "Psychic", trainerId: "TRAINER_PRESTON", note: "Doubles with Maura" },
      { name: "Maura", trainerClass: "Psychic", trainerId: "TRAINER_MAURA", note: "Doubles with Preston" },
      { name: "Blake", trainerClass: "Psychic", trainerId: "TRAINER_BLAKE", note: "Doubles with Samantha" },
      { name: "Samantha", trainerClass: "Psychic", trainerId: "TRAINER_SAMANTHA", note: "Doubles with Blake" },
      { name: "Virgil", trainerClass: "Psychic", trainerId: "TRAINER_VIRGIL", note: "Doubles with Hannah" },
      { name: "Hannah", trainerClass: "Psychic", trainerId: "TRAINER_HANNAH", note: "Doubles with Virgil" },
      { name: "Nate", trainerClass: "Psychic", trainerId: "TRAINER_NATE", note: "Doubles with Sylvia" },
      { name: "Sylvia", trainerClass: "Psychic", trainerId: "TRAINER_SYLVIA", note: "Doubles with Nate" },
      { name: "Clifford", trainerClass: "Psychic", trainerId: "TRAINER_CLIFFORD", note: "Doubles with Macey" },
      { name: "Macey", trainerClass: "Psychic", trainerId: "TRAINER_MACEY", note: "Doubles with Clifford" },
      { name: "Kathleen", trainerClass: "Psychic", trainerId: "TRAINER_KATHLEEN", note: "Doubles with Nicholas" },
      { name: "Nicholas", trainerClass: "Psychic", trainerId: "TRAINER_NICHOLAS", note: "Doubles with Kathleen" },
    ],
  },
  {
    mapPointId: "gym-sootopolis",
    gymName: "Sootopolis City Gym",
    city: "Sootopolis City",
    gymNumber: 8,
    leaderName: "Wallace",
    specialty: "Water",
    badgeName: "Rain Badge",
    leaderTrainerId: "TRAINER_WALLACE",
    walkthroughStepId: "sootopolis-gym-2",
    puzzleNote: "Ice-floor tiles crack after you step on them — plan your path to Wallace carefully.",
    juniors: [],
  },
];

export const GYM_BY_MAP_ID = Object.fromEntries(GYMS.map((g) => [g.mapPointId, g])) as Record<string, GymData>;

export function getGymForWalkthroughStep(stepId: string): GymData | undefined {
  return GYMS.find((g) => g.walkthroughStepId === stepId);
}

export function getGymForMapPoint(mapPointId: string): GymData | undefined {
  return GYM_BY_MAP_ID[mapPointId];
}

export function getGymLeaderExtraSprites(gym: GymData): GymTrainerSprite[] {
  return GYM_LEADER_EXTRA_SPRITES[gym.leaderTrainerId] ?? [];
}

function withGymSprite(point: TrainerPoint, trainerId: string): TrainerPoint {
  const sprite = GYM_TRAINER_SPRITES[trainerId];
  if (!sprite) return point;
  return {
    ...point,
    graphicsId: sprite.graphicsId,
    spriteSheet: sprite.spriteSheet,
    spriteWidth: sprite.spriteWidth,
    spriteHeight: sprite.spriteHeight,
    spriteFrame: sprite.spriteFrame,
  };
}

export function gymLeaderTrainerPoint(gym: GymData): TrainerPoint {
  return withGymSprite(
    {
      id: `${gym.mapPointId}-leader`,
      name: gym.leaderName,
      category: "trainer",
      x: 0,
      y: 0,
      trainerClass: "Gym Leader",
      trainerName: gym.leaderName,
      trainerId: gym.leaderTrainerId,
      graphicsId: "",
      spriteSheet: "",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: `${gym.gymName} · ${gym.badgeName}`,
      desc: gym.doubleBattle ? "Double battle" : "Gym Leader battle",
    },
    gym.leaderTrainerId,
  );
}

export function gymJuniorTrainerPoint(gym: GymData, junior: GymJunior): TrainerPoint {
  return withGymSprite(
    {
      id: `${gym.mapPointId}-${junior.trainerId}`,
      name: `${junior.trainerClass} ${junior.name}`,
      category: "trainer",
      x: 0,
      y: 0,
      trainerClass: junior.trainerClass,
      trainerName: junior.name,
      trainerId: junior.trainerId,
      graphicsId: "",
      spriteSheet: "",
      spriteWidth: 16,
      spriteHeight: 32,
      spriteFrame: 0,
      note: junior.note ?? gym.gymName,
      desc: junior.note,
    },
    junior.trainerId,
  );
}
