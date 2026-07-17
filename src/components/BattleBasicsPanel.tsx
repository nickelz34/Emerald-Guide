import { emeraldSpriteUrl, TYPE_COLORS } from "../data/species";
import { assetUrl } from "../lib/assetUrl";

type FaceKind = "pokemon" | "trainer";

interface BattleFace {
  id: string;
  kind: FaceKind;
  name: string;
  /** Shown under the name (class, location, etc.). */
  subtitle?: string;
  /** National Dex for Pokémon faces. */
  dex?: number;
  types?: string[];
  /** Overworld trainer sheet under public/. */
  spriteSheet?: string;
  spriteWidth?: number;
  spriteHeight?: number;
  spriteFrame?: number;
}

interface BattleExample {
  id: string;
  title: string;
  blurb: string;
  /** Short verified rules shown as a checklist under the faces. */
  rules: string[];
  faces: BattleFace[];
}

interface CommandTile {
  id: string;
  label: string;
  hint: string;
  detail: string;
}

const BATTLE_EXAMPLES: BattleExample[] = [
  {
    id: "wild",
    title: "Wild battle",
    blurb:
      "Always one wild Pokémon. Grass, caves, Surf, and fishing all use this 1-on-1 screen.",
    rules: [
      "Poké Balls work; Run is allowed",
      "Run always works if your Speed ≥ the foe’s; slower = chance that rises each try",
      "Sleep / freeze give ×2 catch odds; paralysis / poison / burn give ×1.5",
    ],
    faces: [
      { id: "poochyena", kind: "pokemon", name: "Poochyena", dex: 261, types: ["Dark"], subtitle: "Route 101" },
      { id: "zigzagoon", kind: "pokemon", name: "Zigzagoon", dex: 263, types: ["Normal"], subtitle: "Early routes" },
      { id: "ralts", kind: "pokemon", name: "Ralts", dex: 280, types: ["Psychic"], subtitle: "Route 102 (rare)" },
    ],
  },
  {
    id: "trainer",
    title: "Trainer battle (singles)",
    blurb:
      "Triggered by line of sight or talking. One of yours vs one of theirs until a side is out.",
    rules: [
      "No catching their Pokémon",
      "Run is refused (“Can’t escape!”)",
      "Win prize money when their party faints",
    ],
    faces: [
      {
        id: "calvin",
        kind: "trainer",
        name: "Calvin",
        subtitle: "Youngster · Route 102",
        spriteSheet: "sprites/trainers/youngster.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0,
      },
      {
        id: "haley",
        kind: "trainer",
        name: "Haley",
        subtitle: "Lass · Route 104",
        spriteSheet: "sprites/trainers/lass.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0, // forward (south) for portrait cards — not map facing
      },
      {
        id: "roxanne",
        kind: "trainer",
        name: "Roxanne",
        subtitle: "Gym Leader · Rustboro",
        spriteSheet: "sprites/trainers/roxanne.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0,
      },
    ],
  },
  {
    id: "doubles",
    title: "Double battle (2-on-2)",
    blurb:
      "Two of your Pokémon vs two foes. Emerald’s set-piece example is Mossdeep’s Tate & Liza.",
    rules: [
      "Also: Twins / Young Couple pairs, or two trainers spotting you at once (Emerald)",
      "Both-foes moves (Surf, Rock Slide…) deal half damage each when two foes are present",
      "Earthquake hits every other battler at full power — including your ally",
    ],
    faces: [
      {
        id: "tate",
        kind: "trainer",
        name: "Tate",
        subtitle: "Gym Leader · Mossdeep",
        spriteSheet: "sprites/trainers/tate.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0,
      },
      {
        id: "liza",
        kind: "trainer",
        name: "Liza",
        subtitle: "Gym Leader · Mossdeep",
        spriteSheet: "sprites/trainers/liza.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0,
      },
      {
        id: "twins",
        kind: "trainer",
        name: "Amy & Liv",
        subtitle: "Twins · Route 103",
        spriteSheet: "sprites/trainers/twin.png",
        spriteWidth: 16,
        spriteHeight: 32,
        spriteFrame: 0,
      },
    ],
  },
];

const COMMANDS: CommandTile[] = [
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
];

function TypeChips({ types }: { types: string[] }) {
  return (
    <span className="type-chips">
      {types.map((t) => (
        <span key={t} className="type-chip" style={{ background: TYPE_COLORS[t] ?? "#666" }}>
          {t}
        </span>
      ))}
    </span>
  );
}

function PokemonFace({ face }: { face: BattleFace }) {
  const src = face.dex != null ? emeraldSpriteUrl(face.dex) : undefined;
  return (
    <span className="battle-basics__sprite battle-basics__sprite--pokemon">
      {src ? (
        <img src={src} alt={face.name} width={64} height={64} loading="lazy" decoding="async" />
      ) : (
        <span className="battle-basics__sprite-fallback" aria-hidden>
          ?
        </span>
      )}
    </span>
  );
}

/** 3× overworld frame (same crop math as gym / map trainer pins). */
function TrainerFace({ face }: { face: BattleFace }) {
  const fw = face.spriteWidth ?? 16;
  const fh = face.spriteHeight ?? 32;
  const frame = face.spriteFrame ?? 0;
  const scale = 3;
  if (!face.spriteSheet) {
    return (
      <span className="battle-basics__sprite battle-basics__sprite--trainer">
        <span className="battle-basics__sprite-fallback" aria-hidden>
          ?
        </span>
      </span>
    );
  }
  return (
    <span
      className="battle-basics__sprite battle-basics__sprite--trainer"
      style={{
        ["--trainer-fw" as string]: fw * scale,
        ["--trainer-fh" as string]: fh * scale,
        ["--trainer-frame" as string]: frame,
      }}
      aria-hidden
    >
      <span className="battle-basics__trainer-frame">
        <img src={assetUrl(face.spriteSheet)} alt="" draggable={false} />
      </span>
    </span>
  );
}

export interface BattleBasicsContent {
  lead?: string;
  examples?: Array<{ id: string; title: string; blurb: string }>;
  commands?: Array<{ id: string; label: string; hint: string; detail: string }>;
}

/** In-game sprites + command cards for Pregame Battles Section 1. */
export function BattleBasicsPanel({
  className = "",
  content,
}: {
  className?: string;
  content?: BattleBasicsContent;
}) {
  const lead =
    content?.lead ??
    "Quick visual guide to Emerald’s three battle setups. Wild fights show Pokémon; trainer fights show the NPCs you actually face. Rules checked against Bulbapedia, Serebii, and Gen III battle docs.";
  const examples = BATTLE_EXAMPLES.map((ex) => {
    const override = content?.examples?.find((item) => item.id === ex.id);
    return override ? { ...ex, title: override.title, blurb: override.blurb } : ex;
  });
  const commands = COMMANDS.map((cmd) => {
    const override = content?.commands?.find((item) => item.id === cmd.id);
    return override
      ? { ...cmd, label: override.label, hint: override.hint, detail: override.detail }
      : cmd;
  });

  return (
    <section
      className={`battle-basics ${className}`.trim()}
      aria-label="Battle types and commands"
    >
      <h5 className="battle-basics__title">Battle types at a glance</h5>
      <p className="battle-basics__lead">{lead}</p>

      <div className="battle-basics__examples">
        {examples.map((ex) => (
          <article key={ex.id} className={`battle-basics__card battle-basics__card--${ex.id}`}>
            <header className="battle-basics__card-header">
              <h6 className="battle-basics__card-title">{ex.title}</h6>
              <p className="battle-basics__card-blurb">{ex.blurb}</p>
            </header>

            <ul className="battle-basics__faces" aria-label={`${ex.title} examples`}>
              {ex.faces.map((face) => (
                <li key={face.id} className={`battle-basics__face battle-basics__face--${face.kind}`}>
                  {face.kind === "trainer" ? <TrainerFace face={face} /> : <PokemonFace face={face} />}
                  <span className="battle-basics__face-name">{face.name}</span>
                  {face.subtitle ? (
                    <span className="battle-basics__face-sub">{face.subtitle}</span>
                  ) : null}
                  {face.types?.length ? <TypeChips types={face.types} /> : null}
                </li>
              ))}
            </ul>

            <ul className="battle-basics__rules">
              {ex.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h5 className="battle-basics__title battle-basics__title--commands">Battle commands</h5>
      <ul className="battle-basics__commands">
        {commands.map((cmd) => (
          <li key={cmd.id} className={`battle-basics__command battle-basics__command--${cmd.id}`}>
            <span className="battle-basics__command-label">{cmd.label}</span>
            <span className="battle-basics__command-hint">{cmd.hint}</span>
            <p className="battle-basics__command-detail">{cmd.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
