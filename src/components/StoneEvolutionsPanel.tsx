import { EVOLUTION_STONE_GROUPS, stoneIconUrl } from "../data/evolutionStones";
import { emeraldSpriteUrl } from "../data/species";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { assetUrl } from "../lib/assetUrl";

function StoneIcon({ name, fallbackPath }: { name: string; fallbackPath: string }) {
  const icon = getItemBagIcon(name);
  const src = icon ? assetUrl(icon.spriteSheet) : assetUrl(fallbackPath);
  const size = icon?.spriteWidth ?? 24;
  return (
    <img
      className="stone-evo__stone-icon"
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
    />
  );
}

function MonSprite({ name, dex }: { name: string; dex: number }) {
  const src = emeraldSpriteUrl(dex);
  return (
    <span className="stone-evo__mon">
      {src ? (
        <img
          className="stone-evo__mon-sprite"
          src={src}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ) : (
        <span className="stone-evo__mon-fallback" aria-hidden="true">
          ?
        </span>
      )}
      <span className="stone-evo__mon-name">{name}</span>
    </span>
  );
}

export function StoneEvolutionsPanel() {
  return (
    <section className="stone-evo" aria-label="Evolution stone chart">
      <h3 className="stone-evo__title">Stone evolution chart</h3>
      <p className="stone-evo__lead">
        Every Emerald stone evolution at a glance — Fire, Water, Thunder, Leaf, Moon, and Sun.
      </p>
      <div className="stone-evo__groups">
        {EVOLUTION_STONE_GROUPS.map((group) => (
          <article key={group.name} className="stone-evo__group">
            <header className="stone-evo__group-head">
              <StoneIcon name={group.itemIconName} fallbackPath={group.iconPath} />
              <h4 className="stone-evo__group-name">{group.name}</h4>
            </header>
            <ul className="stone-evo__list">
              {group.evolutions.map((edge) => (
                <li key={`${group.name}-${edge.fromName}-${edge.toName}`} className="stone-evo__row">
                  <MonSprite name={edge.fromName} dex={edge.fromDex} />
                  <span className="stone-evo__arrow" aria-hidden="true">
                    <img
                      className="stone-evo__arrow-stone"
                      src={stoneIconUrl(group)}
                      alt=""
                      width={24}
                      height={24}
                      draggable={false}
                    />
                    <span className="stone-evo__arrow-mark">→</span>
                  </span>
                  <MonSprite name={edge.toName} dex={edge.toDex} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
