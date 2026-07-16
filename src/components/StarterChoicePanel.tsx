import { useState } from "react";
import { SPECIES_BY_SLUG } from "../data/speciesDataGenerated";
import { emeraldSpriteUrl, TYPE_COLORS, type SpeciesInfo } from "../data/species";
import { STARTER_CHOICE_INTRO, STARTER_GUIDE, type StarterGuideEntry } from "../data/starterChoice";
import { defenseProfile } from "../lib/typeChart";
import { StatBars } from "./Pokedex";

type StatView = "base" | "final";

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

function EvolutionRow({ species }: { species: SpeciesInfo }) {
  const methods = species.evolutionMethods ?? [];
  const chain = species.evolution;
  return (
    <ol className="starter-choice__evo" aria-label={`${chain[0]} evolution line`}>
      {chain.map((name, i) => {
        const slug = name.toLowerCase();
        const info = SPECIES_BY_SLUG[slug];
        const method = i > 0 ? methods.find((m) => m.to === name)?.method : undefined;
        return (
          <li key={name} className="starter-choice__evo-step">
            {i > 0 && (
              <span className="starter-choice__evo-arrow" aria-hidden="true">
                →
                {method ? <span className="starter-choice__evo-method">{method}</span> : null}
              </span>
            )}
            <Sprite nationalNumber={info?.dexNumber} name={name} size="sm" />
            <span className="starter-choice__evo-name">{name}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StarterCard({
  guide,
  base,
  final,
  selected,
  onSelect,
  statView,
}: {
  guide: StarterGuideEntry;
  base: SpeciesInfo;
  final: SpeciesInfo;
  selected: boolean;
  onSelect: () => void;
  statView: StatView;
}) {
  const shown = statView === "base" ? base : final;
  const difficultyClass =
    guide.difficulty === "Easiest"
      ? "starter-choice__diff--easy"
      : guide.difficulty === "Balanced"
        ? "starter-choice__diff--mid"
        : "starter-choice__diff--hard";

  return (
    <article
      className={`starter-choice__card${selected ? " starter-choice__card--selected" : ""}`}
      style={{ ["--starter-accent" as string]: guide.accent }}
      aria-labelledby={`starter-${guide.slug}-name`}
    >
      <button
        type="button"
        className="starter-choice__select"
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className="starter-choice__hero">
          <Sprite nationalNumber={base.dexNumber} name={base.slug} size="lg" />
          {statView === "final" && (
            <Sprite nationalNumber={final.dexNumber} name={final.slug} size="md" />
          )}
        </span>
        <header className="starter-choice__head">
          <h3 id={`starter-${guide.slug}-name`} className="starter-choice__name">
            {base.slug.charAt(0).toUpperCase() + base.slug.slice(1)}
            {base.dexNumber != null && (
              <span className="starter-choice__dex">#{String(base.dexNumber).padStart(3, "0")}</span>
            )}
          </h3>
          <TypeChips types={base.types} />
          <p className="starter-choice__genus">{base.genus}</p>
          <p className="starter-choice__tagline">{guide.tagline}</p>
          <span className={`starter-choice__diff ${difficultyClass}`}>{guide.difficulty}</span>
        </header>
      </button>

      <div className="starter-choice__body">
        <p className="starter-choice__flavor">{base.flavor}</p>

        <dl className="starter-choice__facts">
          <div>
            <dt>Ability (Emerald)</dt>
            <dd>{base.abilities[0] ?? "—"}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>
              {base.heightM ?? "—"} m · {base.weightKg ?? "—"} kg
            </dd>
          </div>
          <div>
            <dt>Base total</dt>
            <dd>{base.total}</dd>
          </div>
          <div>
            <dt>Final total</dt>
            <dd>
              {final.total}{" "}
              <TypeChips types={final.types} />
            </dd>
          </div>
        </dl>

        <EvolutionRow species={base} />

        <div className="starter-choice__stats-block">
          <h4 className="starter-choice__subhead">
            {statView === "base" ? "Base stats (Lv 5 gift)" : `Final form — ${final.slug.charAt(0).toUpperCase()}${final.slug.slice(1)}`}
          </h4>
          <StatBars stats={shown.stats} total={shown.total} />
        </div>

        <h4 className="starter-choice__subhead">
          {final.slug.charAt(0).toUpperCase() + final.slug.slice(1)} type matchups
        </h4>
        <DefenseChips types={final.types} />

        <h4 className="starter-choice__subhead">Best for</h4>
        <p className="starter-choice__blurb">{guide.bestFor}</p>

        <h4 className="starter-choice__subhead">Early gyms</h4>
        <p className="starter-choice__blurb">{guide.earlyGyms}</p>

        <h4 className="starter-choice__subhead">Route 103 rival</h4>
        <p className="starter-choice__blurb">{guide.rivalFaces}</p>

        <h4 className="starter-choice__subhead">Recommended natures</h4>
        <ul className="starter-choice__natures">
          {guide.natures.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function StarterChoicePanel({
  className = "",
  intro = STARTER_CHOICE_INTRO,
  entries = STARTER_GUIDE,
}: {
  className?: string;
  intro?: string;
  entries?: StarterGuideEntry[];
}) {
  const [statView, setStatView] = useState<StatView>("base");
  const [focused, setFocused] = useState<string | null>(null);

  const cards = entries.map((guide) => {
    const base = SPECIES_BY_SLUG[guide.slug];
    const finalSlug = (base?.evolution[base.evolution.length - 1] ?? guide.slug).toLowerCase();
    const final = SPECIES_BY_SLUG[finalSlug] ?? base;
    return { guide, base, final };
  }).filter((c): c is { guide: StarterGuideEntry; base: SpeciesInfo; final: SpeciesInfo } =>
    Boolean(c.base && c.final),
  );

  return (
    <section className={`starter-choice ${className}`.trim()} aria-label="Starter Pokémon comparison">
      <header className="starter-choice__intro">
        <h3 className="starter-choice__title">Compare the three Hoenn starters</h3>
        <p className="starter-choice__lead">{intro}</p>
        <div className="starter-choice__toolbar" role="group" aria-label="Stat view">
          <button
            type="button"
            className={`starter-choice__toggle${statView === "base" ? " is-active" : ""}`}
            onClick={() => setStatView("base")}
            aria-pressed={statView === "base"}
          >
            Base form stats
          </button>
          <button
            type="button"
            className={`starter-choice__toggle${statView === "final" ? " is-active" : ""}`}
            onClick={() => setStatView("final")}
            aria-pressed={statView === "final"}
          >
            Final evolution stats
          </button>
        </div>
      </header>

      <div className="starter-choice__grid">
        {cards.map(({ guide, base, final }) => (
          <StarterCard
            key={guide.slug}
            guide={guide}
            base={base}
            final={final}
            selected={focused === guide.slug}
            onSelect={() => setFocused((cur) => (cur === guide.slug ? null : guide.slug))}
            statView={statView}
          />
        ))}
      </div>

      <aside className="starter-choice__quick">
        <h4 className="starter-choice__subhead">Quick picks</h4>
        <ul>
          <li>
            <strong>First playthrough / easiest badge road:</strong> Mudkip → Swampert
          </li>
          <li>
            <strong>Speed & special offense:</strong> Treecko → Sceptile
          </li>
          <li>
            <strong>High offensive ceiling (Fire/Fighting):</strong> Torchic → Blaziken
          </li>
        </ul>
        <p className="starter-choice__hint">
          Tip: save in Littleroot before opening Birch&apos;s bag if you want to soft-reset for a nature — it rolls when the Poochyena battle starts.
        </p>
      </aside>
    </section>
  );
}

export function StarterChoicePanelForStep({
  stepId,
  className,
  intro,
  entries,
}: {
  stepId: string;
  className?: string;
  intro?: string;
  entries?: StarterGuideEntry[];
}) {
  if (stepId !== "route-101-2") return null;
  return <StarterChoicePanel className={className} intro={intro} entries={entries} />;
}
