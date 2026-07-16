import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import { assetUrl } from "../lib/assetUrl";
import { reorderList } from "../lib/reorderList";
import type { GuideSpriteItem, GuideSpriteKind } from "../types";
import { AdminDragHandle } from "./AdminDragHandle";
import { createAdminId } from "./adminIds";
import {
  filterSpriteCatalog,
  type SpriteCatalogEntry,
  type SpriteCatalogKind,
} from "./spriteCatalog";

interface SpriteEditorProps {
  stepId: string;
  sprites: GuideSpriteItem[];
  onChange: (sprites: GuideSpriteItem[]) => void;
}

const KIND_FILTERS: Array<{ id: SpriteCatalogKind | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "pokemon", label: "Pokémon" },
  { id: "trainer", label: "Trainers" },
  { id: "item", label: "Items" },
  { id: "other", label: "Other" },
];

function catalogToItem(entry: SpriteCatalogEntry): GuideSpriteItem {
  return {
    id: createAdminId("sprite"),
    kind: entry.kind as GuideSpriteKind,
    src: entry.src,
    label: entry.label,
  };
}

export function SpriteEditor({ stepId, sprites, onChange }: SpriteEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SpriteCatalogKind | "all">("all");

  const matches = useMemo(() => filterSpriteCatalog(query, kind).slice(0, 120), [query, kind]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    onChange(reorderList(sprites, result.source.index, result.destination.index));
  };

  const addEntry = (entry: SpriteCatalogEntry) => {
    onChange([...sprites, catalogToItem(entry)]);
  };

  return (
    <div className="admin-sprites">
      <div className="admin-sprites__head">
        <strong>Sprites</strong>
        <div className="admin-sprites__head-actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setPickerOpen((o) => !o)}
          >
            {pickerOpen ? "Close picker" : "+ Add sprite"}
          </button>
          {sprites.length > 0 ? (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                if (window.confirm("Remove all sprites from this step?")) onChange([]);
              }}
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>
      <p className="admin-muted">
        Add Pokémon, trainer, or item sprites from this project. Drag to reorder; remove any sprite
        on this step. Specialty-panel sprites (wild encounters, gym parties) still follow game data
        unless you hide that panel.
      </p>

      {pickerOpen ? (
        <div className="admin-sprite-picker" role="dialog" aria-label="Choose a project sprite">
          <div className="admin-sprite-picker__filters">
            <input
              type="search"
              className="admin-field__input"
              placeholder="Search sprites…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="admin-sprite-picker__kinds" role="tablist" aria-label="Sprite kind">
              {KIND_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={kind === filter.id}
                  className={`btn btn--ghost btn--sm${
                    kind === filter.id ? " admin-sprite-picker__kind--active" : ""
                  }`}
                  onClick={() => setKind(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-sprite-picker__grid">
            {matches.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="admin-sprite-picker__cell"
                title={entry.label}
                onClick={() => addEntry(entry)}
              >
                <img src={assetUrl(entry.src)} alt="" loading="lazy" draggable={false} />
                <span>{entry.label}</span>
              </button>
            ))}
            {matches.length === 0 ? (
              <p className="admin-muted">No sprites match that search.</p>
            ) : null}
          </div>
          {matches.length >= 120 ? (
            <p className="admin-muted">Showing first 120 matches — refine your search.</p>
          ) : null}
        </div>
      ) : null}

      {sprites.length === 0 ? (
        <p className="admin-muted">No sprites on this step yet.</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`sprites-${stepId}`}>
            {(provided) => (
              <ul
                className="admin-sprites__list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {sprites.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(drag, snapshot) => (
                      <li
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        className={`admin-sprites__card${
                          snapshot.isDragging ? " admin-sprites__card--dragging" : ""
                        }`}
                      >
                        <AdminDragHandle
                          label={`Drag ${item.label}`}
                          dragHandleProps={drag.dragHandleProps}
                        />
                        <img
                          className="admin-sprites__preview"
                          src={assetUrl(item.src)}
                          alt=""
                          draggable={false}
                        />
                        <label className="admin-field">
                          <span className="admin-field__label">Label</span>
                          <input
                            className="admin-field__input"
                            value={item.label}
                            onChange={(e) => {
                              const next = sprites.slice();
                              next[index] = { ...item, label: e.target.value };
                              onChange(next);
                            }}
                          />
                        </label>
                        <label className="admin-field">
                          <span className="admin-field__label">Caption</span>
                          <input
                            className="admin-field__input"
                            value={item.caption ?? ""}
                            placeholder="Optional"
                            onChange={(e) => {
                              const next = sprites.slice();
                              next[index] = {
                                ...item,
                                caption: e.target.value || undefined,
                              };
                              onChange(next);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => onChange(sprites.filter((s) => s.id !== item.id))}
                        >
                          Remove
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
