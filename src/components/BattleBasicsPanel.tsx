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
    title: "Wild battle",
    blurb:
      "One wild Pokémon — tall grass, caves, Surf, or fishing. Poké Balls and Run work here.",
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
      "One foe at a time from a trainer’s party. No Balls, no Run — win for prize money.",
    species: [
      { name: "Treecko", dex: 252, types: ["Grass"] },
      { name: "Torchic", dex: 255, types: ["Fire"] },
      { name: "Mudkip", dex: 258, types: ["Water"] },
    ],
  },
  {
    id: "doubles",
    title: "Double battle",
    blurb:
      "Two of yours vs two foes. Pick targets carefully — Surf hits both enemies; Earthquake hits your ally too.",
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
    detail: "Pick one of four moves. Watch type, power cues, and remaining PP.",
  },
  {
    id: "bag",
    label: "Bag",
    hint: "Items",
    detail: "Potions, status heals, X items. Poké Balls only in wild battles.",
  },
  {
    id: "pokemon",
    label: "Pokémon",
    hint: "Party",
    detail: "Switch leads, check status, or use an item on a benched Pokémon.",
  },
  {
    id: "run",
    label: "Run",
    hint: "Escape",
    detail: "Flee wild battles only. Fails sometimes — Speed helps you get away.",
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

/** In-game sprites + command cards for Pregame Battles Event 1. */
export function BattleBasicsPanel({ className = "" }: { className?: string }) {
  return (
    <section
      className={`battle-basics ${className}`.trim()}
      aria-label="Battle types and commands"
    >
      <h5 className="battle-basics__title">Battle types at a glance</h5>
      <p className="battle-basics__lead">
        Emerald battle sprites for the three fight shapes you will see in Hoenn — wild singles,
        trainer singles, and doubles — plus what each menu command does.
      </p>

      <div className="battle-basics__examples">
        {BATTLE_EXAMPLES.map((ex) => (
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
        {COMMANDS.map((cmd) => (
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
