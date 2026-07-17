import { emeraldSpriteUrl, TYPE_COLORS } from "../data/species";

interface BattleExample {
  id: string;
  title: string;
  blurb: string;
  species: { name: string; dex: number; types: string[] }[];
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
    title: "Wild battle (always 1-on-1)",
    blurb:
      "Tall grass, caves, Surf, or fishing. Poké Balls work. Run succeeds if you are faster (or equal Speed); slower = chance that improves each try.",
    species: [
      { name: "Poochyena", dex: 261, types: ["Dark"] },
      { name: "Zigzagoon", dex: 263, types: ["Normal"] },
      { name: "Ralts", dex: 280, types: ["Psychic"] },
    ],
  },
  {
    id: "trainer",
    title: "Trainer battle (singles)",
    blurb:
      "Line of sight or talk. No catching. Run is refused. Win prize money when their party is out.",
    species: [
      { name: "Treecko", dex: 252, types: ["Grass"] },
      { name: "Torchic", dex: 255, types: ["Fire"] },
      { name: "Mudkip", dex: 258, types: ["Water"] },
    ],
  },
  {
    id: "doubles",
    title: "Double battle (2-on-2)",
    blurb:
      "Pair classes, two trainers spotting you at once (Emerald), or Tate & Liza. Surf hits both foes at half damage each; Earthquake hits your ally too at full power.",
    species: [
      { name: "Solrock", dex: 338, types: ["Rock", "Psychic"] },
      { name: "Lunatone", dex: 337, types: ["Rock", "Psychic"] },
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

function Sprite({ dex, name }: { dex: number; name: string }) {
  const src = emeraldSpriteUrl(dex);
  return (
    <span className="battle-basics__sprite">
      {src ? (
        <img src={src} alt={name} width={64} height={64} loading="lazy" decoding="async" />
      ) : (
        <span className="battle-basics__sprite-fallback" aria-hidden>
          ?
        </span>
      )}
    </span>
  );
}

export interface BattleBasicsContent {
  lead?: string;
  examples?: Array<{ id: string; title: string; blurb: string }>;
  commands?: Array<{ id: string; label: string; hint: string; detail: string }>;
}

/** In-game sprites + command cards for Pregame Battles Event 1. */
export function BattleBasicsPanel({
  className = "",
  content,
}: {
  className?: string;
  content?: BattleBasicsContent;
}) {
  const lead =
    content?.lead ??
    "Emerald battle sprites for wild 1-on-1s, trainer singles, and doubles — plus Fight / Bag / Pokémon / Run as documented in Gen III (Bulbapedia, Prima Emerald, Serebii doubles notes).";
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
          <article key={ex.id} className="battle-basics__card">
            <h6 className="battle-basics__card-title">{ex.title}</h6>
            <p className="battle-basics__card-blurb">{ex.blurb}</p>
            <ul className="battle-basics__sprites">
              {ex.species.map((s) => (
                <li key={s.dex} className="battle-basics__mon">
                  <Sprite dex={s.dex} name={s.name} />
                  <span className="battle-basics__mon-name">{s.name}</span>
                  <TypeChips types={s.types} />
                </li>
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
