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

const DEPT_FLOOR_ORDER = ["2F", "3F", "4F", "5F", "Rooftop"];

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

function StockTable({ section, showFloor }: { section: MartSection; showFloor?: boolean }) {
  const title = section.counter
    ? section.counter
    : showFloor && section.floor
      ? `${section.floor} · ${section.label}`
      : section.label;
  const subtitle =
    section.counter && section.label && section.label !== section.counter ? section.label : null;

  return (
    <div className="mart-modal__section">
      <div className="mart-modal__section-head">
        <h4>{title}</h4>
        {subtitle && <p className="mart-modal__section-theme">{subtitle}</p>}
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
              <td className="mart-modal__price">{formatMartPrice(item.price, item.priceUnit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentGuidePanel({ mart }: { mart: MartData }) {
  const floors = useMemo(() => {
    const byFloor = new Map<string, MartSection[]>();
    for (const section of mart.sections) {
      const floor = section.floor || "Other";
      if (!byFloor.has(floor)) byFloor.set(floor, []);
      byFloor.get(floor)!.push(section);
    }
    const ordered = DEPT_FLOOR_ORDER.filter((f) => byFloor.has(f));
    for (const f of byFloor.keys()) {
      if (!ordered.includes(f)) ordered.push(f);
    }
    return ordered.map((floor) => ({ floor, sections: byFloor.get(floor)! }));
  }, [mart.sections]);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    setTab(0);
  }, [mart.id]);

  const current = floors[Math.min(tab, Math.max(floors.length - 1, 0))];

  return (
    <div className="mart-modal__guide">
      {mart.notes.length > 0 && (
        <ul className="mart-modal__notes">
          {mart.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      {floors.length > 1 && (
        <div className="mart-modal__tabs" role="tablist" aria-label="Store floors">
          {floors.map((group, i) => (
            <button
              key={group.floor}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={`mart-modal__tab${tab === i ? " is-active" : ""}`}
              onClick={() => setTab(i)}
            >
              {group.floor}
            </button>
          ))}
        </div>
      )}

      {current && (
        <div className="mart-modal__floor" role="tabpanel" aria-label={`${current.floor} stock`}>
          <h3 className="mart-modal__floor-title">{current.floor}</h3>
          {current.sections.map((section) => (
            <StockTable key={section.id} section={section} />
          ))}
        </div>
      )}

      {mart.sections.length === 0 && (
        <p className="mart-modal__empty">No shop inventory data for this location.</p>
      )}
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

  if (mart.kind === "department") {
    return <DepartmentGuidePanel mart={mart} />;
  }

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
    mart.kind === "department"
      ? "Department store"
      : mart.kind === "specialty"
        ? "Specialty shop"
        : "Pok\u00e9 Mart";

  return createPortal(
    <ModalBackdrop className="mart-modal" onClose={onClose} aria-labelledby="mart-modal-title">
      <div
        className={`mart-modal__panel${mart.kind === "department" ? " mart-modal__panel--department" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
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
