import type {
  BreedingChartSpec,
  BreedingMonRef,
  BreedingPairEdge,
} from "../data/breedingChartTypes";
import { itemIconUrl } from "../data/evolutionCharts";
import { eggSpriteUrl, emeraldSpriteUrl } from "../data/species";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { assetUrl } from "../lib/assetUrl";

function resolveItemSrc(name?: string, fallbackPath?: string): string | undefined {
  if (name) {
    const icon = getItemBagIcon(name);
    if (icon) return assetUrl(icon.spriteSheet);
  }
  if (fallbackPath) return itemIconUrl(fallbackPath);
  return undefined;
}

function ItemIcon({
  name,
  fallbackPath,
  className,
}: {
  name?: string;
  fallbackPath?: string;
  className?: string;
}) {
  const src = resolveItemSrc(name, fallbackPath);
  if (!src) return null;
  return (
    <img
      className={className ?? "breed-chart__item-icon"}
      src={src}
      alt=""
      width={24}
      height={24}
      draggable={false}
    />
  );
}

function GenderBadge({ gender }: { gender: "female" | "male" }) {
  return (
    <span className={`breed-chart__gender breed-chart__gender--${gender}`} aria-hidden="true">
      {gender === "female" ? "♀" : "♂"}
    </span>
  );
}

function MonSprite({ mon }: { mon: BreedingMonRef }) {
  const isEgg = mon.kind === "egg";
  const src = isEgg ? eggSpriteUrl() : mon.dex != null && mon.dex > 0 ? emeraldSpriteUrl(mon.dex) : undefined;
  return (
    <span className={`breed-chart__mon${isEgg ? " breed-chart__mon--egg" : ""}`}>
      {mon.gender && <GenderBadge gender={mon.gender} />}
      {src ? (
        <img
          className={`breed-chart__mon-sprite${isEgg ? " breed-chart__mon-sprite--egg" : ""}`}
          src={src}
          alt={mon.name}
          width={64}
          height={isEgg ? 128 : 64}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <span className="breed-chart__mon-fallback" aria-hidden="true">
          ?
        </span>
      )}
      <span className="breed-chart__mon-name">{mon.name}</span>
      {mon.subtitle && <span className="breed-chart__mon-sub">{mon.subtitle}</span>}
    </span>
  );
}

function PairArrow({ edge }: { edge: BreedingPairEdge }) {
  const itemSrc = resolveItemSrc(edge.itemIconName, edge.itemIconPath);
  const blocked = edge.offspring.length === 0;
  const showEgg = edge.methodLabel === "Egg" && !blocked;
  const eggSrc = showEgg ? eggSpriteUrl() : undefined;
  return (
    <span
      className={`breed-chart__arrow${blocked ? " breed-chart__arrow--blocked" : ""}`}
      aria-hidden="true"
    >
      {itemSrc && (
        <img className="breed-chart__arrow-item" src={itemSrc} alt="" width={24} height={24} draggable={false} />
      )}
      {eggSrc && (
        <img className="breed-chart__arrow-egg" src={eggSrc} alt="" width={64} height={128} draggable={false} />
      )}
      {edge.methodLabel && edge.methodLabel !== "Egg" && (
        <span className="breed-chart__method">{edge.methodLabel}</span>
      )}
      <span className="breed-chart__arrow-mark">{blocked ? "✕" : "→"}</span>
    </span>
  );
}

function PairRow({ edge, groupKey }: { edge: BreedingPairEdge; groupKey: string }) {
  const blocked = edge.offspring.length === 0;
  return (
    <li
      key={`${groupKey}-${edge.parentA.name}-${edge.parentB.name}-${edge.methodLabel ?? ""}`}
      className={`breed-chart__row${blocked ? " breed-chart__row--blocked" : ""}`}
    >
      <div className="breed-chart__parents">
        <MonSprite mon={edge.parentA} />
        <span className="breed-chart__times" aria-hidden="true">
          ×
        </span>
        <MonSprite mon={edge.parentB} />
      </div>
      <PairArrow edge={edge} />
      <div className="breed-chart__offspring">
        {edge.offspring.map((mon) => (
          <MonSprite key={`${mon.dex}-${mon.name}-${mon.subtitle ?? ""}-${mon.gender ?? ""}`} mon={mon} />
        ))}
      </div>
      {edge.note && <p className="breed-chart__note">{edge.note}</p>}
    </li>
  );
}

export function BreedingChart({ chart }: { chart: BreedingChartSpec }) {
  return (
    <section className="breed-chart" aria-label={chart.ariaLabel}>
      <h3 className="breed-chart__title">{chart.title}</h3>
      <p className="breed-chart__lead">{chart.lead}</p>
      <div className="breed-chart__groups">
        {chart.groups.map((group) => (
          <article key={group.name} className="breed-chart__group">
            <header className="breed-chart__group-head">
              <ItemIcon name={group.headerIconName} fallbackPath={group.headerIconPath} />
              <h4 className="breed-chart__group-name">{group.name}</h4>
            </header>
            {group.type === "pairs" && group.pairs && (
              <ul className="breed-chart__list">
                {group.pairs.map((edge) => (
                  <PairRow
                    key={`${group.name}-${edge.parentA.name}-${edge.parentB.name}-${edge.methodLabel ?? edge.itemIconName ?? ""}`}
                    edge={edge}
                    groupKey={group.name}
                  />
                ))}
              </ul>
            )}
            {group.type === "grid" && group.grid && (
              <>
                <ul className="breed-chart__grid">
                  {group.grid.map((mon) => (
                    <li key={`${group.name}-${mon.dex}-${mon.name}`} className="breed-chart__grid-cell">
                      <MonSprite mon={mon} />
                    </li>
                  ))}
                </ul>
                {group.gridNote && <p className="breed-chart__note breed-chart__note--group">{group.gridNote}</p>}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
