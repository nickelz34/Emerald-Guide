import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { assetUrl } from "../lib/assetUrl";
import { ModalBackdrop, ModalCloseButton } from "../lib/touchSafeClose";
import { getItemBagIcon } from "../data/itemIconsGenerated";
import {
  formatMartPrice,
  getMartForMapPoint,
  type MartData,
  type MartItem,
  type MartSection,
} from "../data/martData";
import type { MapPoint } from "../data/mapPoints";

interface MartDetailModalProps {
  martPoint: MapPoint | null;
  onClose: () => void;
  onJumpToGuide?: (point: MapPoint) => void;
}

function ItemIcon({ item }: { item: MartItem }) {
  const icon = getItemBagIcon(item.name);
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

function StockTable({ section }: { section: MartSection }) {
  return (
    <div className="mart-modal__section">
      <div className="mart-modal__section-head">
        <h4>{section.label}</h4>
        {section.unlockNote && <p className="mart-modal__unlock">{section.unlockNote}</p>}
      </div>
      <table className="mart-modal__table">
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
                      <div className="mart-modal__item-desc">{item.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="mart-modal__price">{formatMartPrice(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MartGuidePanel({ mart }: { mart: MartData }) {
  const hasUnlockTabs =
    mart.kind === "mart" &&
    mart.sections.length === 2 &&
    mart.sections.some((s) => s.unlockNote);

  const [tab, setTab] = useState(0);

  const visibleSections = useMemo(() => {
    if (!hasUnlockTabs) return mart.sections;
    return [mart.sections[tab]].filter(Boolean);
  }, [hasUnlockTabs, mart.sections, tab]);

  return (
    <div className="mart-modal__guide">
      {mart.notes.length > 0 && (
        <ul className="mart-modal__notes">
          {mart.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      {hasUnlockTabs && (
        <div className="mart-modal__tabs" role="tablist" aria-label="Stock stages">
          {mart.sections.map((section, i) => (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={`mart-modal__tab${tab === i ? " is-active" : ""}`}
              onClick={() => setTab(i)}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}

      {visibleSections.map((section) => (
        <StockTable key={section.id} section={section} />
      ))}

      {mart.sections.length === 0 && (
        <p className="mart-modal__empty">No shop inventory data for this location.</p>
      )}
    </div>
  );
}

export function MartDetailModal({ martPoint, onClose, onJumpToGuide }: MartDetailModalProps) {
  const mart = martPoint ? getMartForMapPoint(martPoint) : undefined;

  useEffect(() => {
    if (!martPoint) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [martPoint, onClose]);

  if (!martPoint || !mart) return null;

  const kindLabel =
    mart.kind === "department" ? "Department store" : mart.kind === "specialty" ? "Specialty shop" : "Pok\u00e9 Mart";

  return createPortal(
    <ModalBackdrop className="mart-modal" onClose={onClose} aria-labelledby="mart-modal-title">
      <div className="mart-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="mart-modal__head">
          <div>
            <h3 id="mart-modal-title">
              {mart.location} {mart.name}
            </h3>
            <p className="mart-modal__subtitle">{kindLabel}</p>
          </div>
          <ModalCloseButton className="mart-modal__close" onClose={onClose} />
        </div>

        <div className="mart-modal__body">
          <MartGuidePanel mart={mart} />
        </div>

        {onJumpToGuide && martPoint.stepId && (
          <div className="mart-modal__foot">
            <button type="button" className="btn btn--primary" onClick={() => onJumpToGuide(martPoint)}>
              Open walkthrough step
            </button>
          </div>
        )}
      </div>
    </ModalBackdrop>,
    document.body,
  );
}
