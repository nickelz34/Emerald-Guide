import { useState } from "react";
import { SPECIES_BY_SLUG } from "../data/speciesDataGenerated";
import { emeraldSpriteUrl, TYPE_COLORS, type SpeciesInfo } from "../data/species";
import {
  RALTS_ABILITIES_NOTE,
  RALTS_EMERALD_TYPES,
  RALTS_HUNT_TIPS,
  RALTS_NATURES,
  RALTS_SPOTLIGHT_INTRO,
  RALTS_STAGES,
  type RaltsStageGuide,
} from "../data/raltsSpotlight";
import { defenseProfile } from "../lib/typeChart";
import { StatBars } from "./Pokedex";

function emeraldTypes(_species: SpeciesInfo): string[] {
  return [...RALTS_EMERALD_TYPES];
}

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

function Sprite({
  nationalNumber,
  name,
  size = "lg",
}: {
  nationalNumber?: number;
  name: string;
  size?: "lg" | "md" | "sm";
}) {
  const src = emeraldSpriteUrl(nationalNumber);
  return (
    <span className={`starter-choice__sprite starter-choice__sprite--${size}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          width={size === "lg" ? 160 : size === "md" ? 72 : 48}
          height={size === "lg" ? 160 : size === "md" ? 72 : 48}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="starter-choice__sprite-fallback" aria-label={name}>
          ?
        </span>
      )}
    </span>
  );
}

function DefenseChips({ types }: { types: string[] }) {
  const profile = defenseProfile(types);
  const rows: { label: string; list: string[]; className: string }[] = [
    { label: "4× weak", list: profile.x4, className: "starter-choice__matchup--x4" },
    { label: "2× weak", list: profile.x2, className: "starter-choice__matchup--x2" },
    { label: "½× resist", list: profile.x05, className: "starter-choice__matchup--resist" },
    { label: "Immune", list: profile.x0, className: "starter-choice__matchup--immune" },
  ].filter((r) => r.list.length > 0);

  if (rows.length === 0) return null;

  return (
    <div className="starter-choice__matchups">
      {rows.map((row) => (
        <div key={row.label} className={`starter-choice__matchup ${row.className}`}>
          <span className="starter-choice__matchup-label">{row.label}</span>
          <TypeChips types={row.list} />
        </div>
      ))}
    </div>
  );
}

function StageCard({
  guide,
  species,
  selected,
  onSelect,
}: {
  guide: RaltsStageGuide;
  species: SpeciesInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  const types = emeraldTypes(species);
  const displayName = guide.slug.charAt(0).toUpperCase() + guide.slug.slice(1);

  return (
    <article
      className={`starter-choice__card${selected ? " starter-choice__card--selected" : ""}`}
      style={{ ["--starter-accent" as string]: guide.accent }}
      aria-labelledby={`ralts-stage-${guide.slug}`}
    >
      <button
        type="button"
        className="starter-choice__select"
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className="starter-choice__hero">
          <Sprite nationalNumber={species.dexNumber} name={displayName} size="lg" />
        </span>
        <header className="starter-choice__head">
          <h3 id={`ralts-stage-${guide.slug}`} className="starter-choice__name">
            {displayName}
            {species.dexNumber != null && (
              <span className="starter-choice__dex">#{String(species.dexNumber).padStart(3, "0")}</span>
            )}
          </h3>
          <TypeChips types={types} />
          <p className="starter-choice__genus">{species.genus}</p>
          <p className="starter-choice__tagline">{guide.tagline}</p>
          {guide.slug === "ralts" && (
            <span className="starter-choice__diff starter-choice__diff--mid">4% rare</span>
          )}
          {guide.slug === "kirlia" && (
            <span className="starter-choice__diff starter-choice__diff--easy">Lv 20</span>
          )}
          {guide.slug === "gardevoir" && (
            <span className="starter-choice__diff starter-choice__diff--hard">Lv 30</span>
          )}
        </header>
      </button>

      <div className="starter-choice__body">
        <p className="starter-choice__flavor">{species.flavor}</p>

        <dl className="starter-choice__facts">
          <div>
            <dt>Abilities (Emerald)</dt>
            <dd>{(species.abilities ?? []).slice(0, 2).join(" / ") || "—"}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>
              {species.heightM ?? "—"} m · {species.weightKg ?? "—"} kg
            </dd>
          </div>
          <div>
            <dt>BST</dt>
            <dd>{species.total}</dd>
          </div>
          <div>
            <dt>Type (Emerald)</dt>
            <dd>
              <TypeChips types={types} />
            </dd>
          </div>
        </dl>

        <div className="starter-choice__stats-block">
          <h4 className="starter-choice__subhead">{displayName} base stats</h4>
          <StatBars stats={species.stats} total={species.total} />
        </div>

        <h4 className="starter-choice__subhead">Type matchups</h4>
        <DefenseChips types={types} />

        <h4 className="starter-choice__subhead">Team role</h4>
        <p className="starter-choice__blurb">{guide.role}</p>

        <h4 className="starter-choice__subhead">Emerald note</h4>
        <p className="starter-choice__blurb">{guide.note}</p>
      </div>
    </article>
  );
}

export function RaltsSpotlightPanel({ className = "" }: { className?: string }) {
  const [focused, setFocused] = useState<string>("ralts");

  const stages = RALTS_STAGES.map((guide) => {
    const species = SPECIES_BY_SLUG[guide.slug];
    return species ? { guide, species } : null;
  }).filter((s): s is { guide: RaltsStageGuide; species: SpeciesInfo } => Boolean(s));

  const ralts = SPECIES_BY_SLUG.ralts;
  const kirlia = SPECIES_BY_SLUG.kirlia;
  const gardevoir = SPECIES_BY_SLUG.gardevoir;

  return (
    <section
      className={`starter-choice ralts-spotlight ${className}`.trim()}
      aria-label="Ralts catch spotlight"
    >
      <header className="starter-choice__intro">
        <h3 className="starter-choice__title">Catch spotlight — Ralts line</h3>
        <p className="starter-choice__lead">{RALTS_SPOTLIGHT_INTRO}</p>
      </header>

      {ralts && kirlia && gardevoir && (
        <ol className="ralts-spotlight__chain" aria-label="Evolution path">
          <li>
            <Sprite nationalNumber={ralts.dexNumber} name="Ralts" size="md" />
            <span>Ralts</span>
          </li>
          <li className="ralts-spotlight__chain-arrow" aria-hidden="true">
            → <span>Lv 20</span>
          </li>
          <li>
            <Sprite nationalNumber={kirlia.dexNumber} name="Kirlia" size="md" />
            <span>Kirlia</span>
          </li>
          <li className="ralts-spotlight__chain-arrow" aria-hidden="true">
            → <span>Lv 30</span>
          </li>
          <li>
            <Sprite nationalNumber={gardevoir.dexNumber} name="Gardevoir" size="md" />
            <span>Gardevoir</span>
          </li>
        </ol>
      )}

      <div className="starter-choice__grid">
        {stages.map(({ guide, species }) => (
          <StageCard
            key={guide.slug}
            guide={guide}
            species={species}
            selected={focused === guide.slug}
            onSelect={() => setFocused(guide.slug)}
          />
        ))}
      </div>

      <aside className="starter-choice__quick">
        <h4 className="starter-choice__subhead">Hunt checklist</h4>
        <ul>
          {RALTS_HUNT_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>

        <h4 className="starter-choice__subhead">Recommended natures</h4>
        <ul className="starter-choice__natures ralts-spotlight__natures">
          {RALTS_NATURES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <p className="starter-choice__hint">{RALTS_ABILITIES_NOTE}</p>
        <p className="starter-choice__hint">
          Gen III note: Ralts / Kirlia / Gardevoir are <strong>Psychic only</strong> in Emerald. Fairy typing and Gallade arrive in later games.
        </p>
      </aside>
    </section>
  );
}

export function RaltsSpotlightPanelForStep({
  stepId,
  className,
}: {
  stepId: string;
  className?: string;
}) {
  if (stepId !== "route-102-2") return null;
  return <RaltsSpotlightPanel className={className} />;
}
