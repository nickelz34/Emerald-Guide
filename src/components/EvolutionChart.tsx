import type { EvolutionChartEdge, EvolutionChartSpec } from "../data/evolutionCharts";
import { itemIconUrl } from "../data/evolutionCharts";
import { emeraldSpriteUrl } from "../data/species";
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
      className={className ?? "evo-chart__item-icon"}
      src={src}
      alt=""
      width={24}
      height={24}
      draggable={false}
    />
  );
}

function MonSprite({ name, dex }: { name: string; dex: number }) {
  const src = emeraldSpriteUrl(dex);
  return (
    <span className="evo-chart__mon">
      {src ? (
        <img
          className="evo-chart__mon-sprite"
          src={src}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <span className="evo-chart__mon-fallback" aria-hidden="true">
          ?
        </span>
      )}
      <span className="evo-chart__mon-name">{name}</span>
    </span>
  );
}

function EdgeArrow({ edge }: { edge: EvolutionChartEdge }) {
  const itemSrc = resolveItemSrc(edge.itemIconName, edge.itemIconPath);
  return (
    <span className="evo-chart__arrow" aria-hidden="true">
      {itemSrc && (
        <img className="evo-chart__arrow-item" src={itemSrc} alt="" width={24} height={24} draggable={false} />
      )}
      {edge.methodLabel && <span className="evo-chart__method">{edge.methodLabel}</span>}
      <span className="evo-chart__arrow-mark">→</span>
    </span>
  );
}

function EvolutionRow({ edge, groupKey }: { edge: EvolutionChartEdge; groupKey: string }) {
  const sameForm = edge.fromDex === edge.toDex && edge.fromName === edge.toName;
  return (
    <li
      key={`${groupKey}-${edge.fromName}-${edge.toName}-${edge.methodLabel ?? ""}`}
      className={`evo-chart__row${sameForm ? " evo-chart__row--blocked" : ""}`}
    >
      <MonSprite name={edge.fromName} dex={edge.fromDex} />
      <EdgeArrow edge={edge} />
      <span className="evo-chart__result">
        <MonSprite name={edge.toName} dex={edge.toDex} />
        {edge.alsoGets?.map((extra) => (
          <span key={extra.dex} className="evo-chart__also">
            <span className="evo-chart__also-plus" aria-hidden="true">
              +
            </span>
            <MonSprite name={extra.name} dex={extra.dex} />
          </span>
        ))}
      </span>
    </li>
  );
}

export function EvolutionChart({ chart }: { chart: EvolutionChartSpec }) {
  return (
    <section className="evo-chart" aria-label={chart.ariaLabel}>
      <h3 className="evo-chart__title">{chart.title}</h3>
      <p className="evo-chart__lead">{chart.lead}</p>
      <div className="evo-chart__groups">
        {chart.groups.map((group) => (
          <article key={group.name} className="evo-chart__group">
            <header className="evo-chart__group-head">
              <ItemIcon name={group.headerIconName} fallbackPath={group.headerIconPath} />
              <h4 className="evo-chart__group-name">{group.name}</h4>
            </header>
            <ul className="evo-chart__list">
              {group.evolutions.map((edge) => (
                <EvolutionRow
                  key={`${group.name}-${edge.fromName}-${edge.toName}-${edge.methodLabel ?? edge.itemIconName ?? ""}`}
                  edge={edge}
                  groupKey={group.name}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
