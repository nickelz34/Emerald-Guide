import { assetUrl } from "../lib/assetUrl";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import { getMartById, formatMartPrice, type MartItem, type MartSection } from "../data/martData";
import { formatItemDescription } from "../lib/itemText";
import { KEY_ITEM_UNLOCKS } from "../data/keyItems";

const MART_ID = "pretty-petal-flower-shop";

function ItemIcon({ item }: { item: MartItem }) {
  const icon =
    getItemBagIcon(item.name) ??
    (item.const === "ITEM_CHERI_BERRY" ? getItemBagIcon("Cheri Berry") : undefined) ??
    (item.const === "ITEM_WAILMER_PAIL" ? getItemBagIcon("Wailmer Pail") : undefined);
  if (!icon) {
    return <span className="mart-modal__item-icon mart-modal__item-icon--empty" aria-hidden="true" />;
  }
  return (
    <img
      className="mart-modal__item-icon"
      src={assetUrl(icon.spriteSheet)}
      alt=""
      width={icon.spriteWidth}
      height={icon.spriteHeight}
      draggable={false}
    />
  );
}

function StockSection({ section }: { section: MartSection }) {
  return (
    <div className="flower-shop-guide__section">
      <div className="flower-shop-guide__section-head">
        <h5>{section.label}</h5>
        {section.unlockNote && <p className="flower-shop-guide__unlock">{section.unlockNote}</p>}
      </div>
      <div className="flower-shop-guide__table-scroll">
        <table className="mart-modal__table flower-shop-guide__table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((item) => (
              <tr key={item.const}>
                <td>
                  <div className="mart-modal__item">
                    <ItemIcon item={item} />
                    <div>
                      <div className="mart-modal__item-name">{item.name}</div>
                      {item.description && (
                        <div className="mart-modal__item-desc">
                          {formatItemDescription(item.description)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="mart-modal__price">{formatMartPrice(item.price, item.priceUnit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Info-rich Pretty Petal panel — Wailmer Pail callout + free gifts / décor stock. */
export function FlowerShopGuidePanel({ className = "" }: { className?: string }) {
  const mart = getMartById(MART_ID);
  const pail = KEY_ITEM_UNLOCKS.find((k) => k.id === "wailmer-pail");
  const pailIcon = getItemBagIcon("Wailmer Pail");

  if (!mart) return null;

  const gifts = mart.sections.find((s) => s.id === "flower-shop-gifts");
  const plants = mart.sections.find((s) => s.id === "Route104_PrettyPetalFlowerShop_Pokemart_Plants");

  return (
    <div className={`flower-shop-guide ${className}`.trim()}>
      <section className="flower-shop-guide__pail" aria-label="Wailmer Pail">
        <div className="flower-shop-guide__pail-icon" aria-hidden="true">
          {pailIcon ? (
            <img
              src={assetUrl(pailIcon.spriteSheet)}
              alt=""
              width={pailIcon.spriteWidth * 2}
              height={pailIcon.spriteHeight * 2}
              draggable={false}
            />
          ) : null}
        </div>
        <div className="flower-shop-guide__pail-copy">
          <h4 className="flower-shop-guide__title">Wailmer Pail</h4>
          <p>
            Key item from the sister near the stools. Use it on any soft-soil patch after planting a
            berry — watering each growth stage raises your harvest. Without it, plots still grow, but
            you miss the bigger yields that keep Oran and Pecha stocked for free.
          </p>
          {pail?.note && <p className="flower-shop-guide__note">{pail.note}</p>}
        </div>
      </section>

      <section className="flower-shop-guide__how" aria-label="How this shop works">
        <h5 className="flower-shop-guide__subtitle">How Pretty Petal works</h5>
        <ul className="flower-shop-guide__bullets">
          {mart.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          <li>
            Soft-soil plots sit just west of the shop — plant Oran (restore 10 HP) or Pecha (cure
            poison) first for early free healing.
          </li>
        </ul>
      </section>

      {gifts && <StockSection section={gifts} />}
      {plants && <StockSection section={plants} />}
    </div>
  );
}

export function FlowerShopGuidePanelForStep({
  stepId,
  className,
}: {
  stepId: string;
  className?: string;
}) {
  if (stepId !== "route-104-2") return null;
  return <FlowerShopGuidePanel className={className} />;
}
