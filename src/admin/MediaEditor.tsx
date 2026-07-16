import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { getStepImages } from "../data/stepImages";
import { assetUrl } from "../lib/assetUrl";
import { reorderList } from "../lib/reorderList";
import type { GuideMediaItem } from "../types";
import { AreaMapView } from "../components/AreaMapView";
import { HoennCrop } from "../components/HoennCrop";
import { createAdminId } from "./adminIds";

interface MediaEditorProps {
  stepId: string;
  media: GuideMediaItem[];
  useCustomMedia?: boolean;
  onChange: (media: GuideMediaItem[], useCustomMedia: boolean) => void;
}

function resolvePreviewUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  return assetUrl(url.replace(/^\//, ""));
}

function derivedToMedia(stepId: string): GuideMediaItem[] {
  return getStepImages(stepId).map((shot) => {
    if (shot.areaMapId) {
      return {
        id: createAdminId("media"),
        type: "area-map" as const,
        url: "",
        caption: shot.caption,
        areaMapId: shot.areaMapId,
      };
    }
    if (shot.crop) {
      return {
        id: createAdminId("media"),
        type: "hoenn-crop" as const,
        url: shot.src || "",
        caption: shot.caption,
        areaId: shot.areaId,
        crop: { ...shot.crop },
      };
    }
    return {
      id: createAdminId("media"),
      type: "screenshot" as const,
      url: shot.src || "",
      caption: shot.caption,
    };
  });
}

export function MediaEditor({
  stepId,
  media,
  useCustomMedia = false,
  onChange,
}: MediaEditorProps) {
  const derivedCount = getStepImages(stepId).length;

  const commit = (nextMedia: GuideMediaItem[], nextCustom = true) => {
    onChange(nextMedia, nextCustom);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    commit(reorderList(media, result.source.index, result.destination.index), true);
  };

  const updateAt = (index: number, patch: Partial<GuideMediaItem>) => {
    commit(
      media.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      true,
    );
  };

  const removeAt = (index: number) => {
    commit(
      media.filter((_, i) => i !== index),
      true,
    );
  };

  const addItem = () => {
    commit(
      [
        ...media,
        {
          id: createAdminId("media"),
          type: "screenshot",
          url: "",
          caption: "",
        },
      ],
      true,
    );
  };

  const importDerived = () => {
    commit(derivedToMedia(stepId), true);
  };

  const clearAll = () => {
    if (!window.confirm("Remove all media from this step gallery?")) return;
    commit([], true);
  };

  const restoreDerived = () => {
    if (
      !window.confirm(
        "Stop using the custom gallery and show the auto-derived maps again?",
      )
    ) {
      return;
    }
    onChange([], false);
  };

  return (
    <div className="admin-media">
      <div className="admin-media__head">
        <strong>Images & maps</strong>
        <div className="admin-media__head-actions">
          {!useCustomMedia ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={importDerived}>
              Edit existing gallery ({derivedCount})
            </button>
          ) : null}
          <button type="button" className="btn btn--ghost btn--sm" onClick={addItem}>
            + Add media
          </button>
        </div>
      </div>

      {!useCustomMedia ? (
        <p className="admin-muted">
          Showing auto-derived maps/screenshots for this step. Click{" "}
          <strong>Edit existing gallery</strong> to import them here so you can
          reorder, caption, or delete them — or add new URL media.
        </p>
      ) : (
        <div className="admin-media__mode">
          <p className="admin-muted">
            Custom gallery active (derived maps hidden). Empty list = no gallery.
          </p>
          <div className="admin-media__mode-actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={importDerived}>
              Re-import derived
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearAll}>
              Clear all
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={restoreDerived}>
              Use auto-derived again
            </button>
          </div>
        </div>
      )}

      {useCustomMedia && media.length === 0 ? (
        <p className="admin-muted">Gallery is empty — visitors will see no maps on this step.</p>
      ) : null}

      {useCustomMedia ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`media-${stepId}`}>
            {(provided) => (
              <ul
                className="admin-media__list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {media.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(drag, snapshot) => (
                      <li
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        className={`admin-media__card${
                          snapshot.isDragging ? " admin-media__card--dragging" : ""
                        }`}
                      >
                        <div className="admin-media__card-head">
                          <button
                            type="button"
                            className="admin-chapter-tree__handle"
                            aria-label="Drag media"
                            {...drag.dragHandleProps}
                          >
                            ⋮⋮
                          </button>
                          <span className="admin-media__type-badge">{item.type}</span>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            aria-label="Delete media"
                            onClick={() => removeAt(index)}
                          >
                            ×
                          </button>
                        </div>

                        {item.type === "area-map" && item.areaMapId ? (
                          <div className="admin-media__preview admin-media__preview--embed">
                            <AreaMapView
                              areaMapId={item.areaMapId}
                              caption={item.caption}
                              className="screenshots__annotated"
                            />
                          </div>
                        ) : null}
                        {item.type === "hoenn-crop" && item.crop ? (
                          <div className="admin-media__preview admin-media__preview--embed">
                            <HoennCrop
                              crop={item.crop}
                              caption={item.caption}
                              areaId={item.areaId}
                              className="screenshots__annotated"
                            />
                          </div>
                        ) : null}
                        {(item.type === "screenshot" || item.type === "map") &&
                        item.url ? (
                          <div className="admin-media__preview">
                            <img
                              src={resolvePreviewUrl(item.url)}
                              alt={item.caption || "Media preview"}
                            />
                          </div>
                        ) : null}

                        <div className="admin-media__fields">
                          <label className="admin-field">
                            <span className="admin-field__label">Type</span>
                            <select
                              className="admin-field__input"
                              value={item.type}
                              onChange={(e) =>
                                updateAt(index, {
                                  type: e.target.value as GuideMediaItem["type"],
                                })
                              }
                            >
                              <option value="screenshot">Screenshot</option>
                              <option value="map">Map (URL)</option>
                              <option value="area-map">Area map (interactive)</option>
                              <option value="hoenn-crop">Hoenn crop</option>
                            </select>
                          </label>
                          {item.type === "area-map" ? (
                            <label className="admin-field">
                              <span className="admin-field__label">Area map id</span>
                              <input
                                type="text"
                                className="admin-field__input"
                                value={item.areaMapId ?? ""}
                                onChange={(e) =>
                                  updateAt(index, {
                                    areaMapId: e.target.value || undefined,
                                  })
                                }
                                placeholder="e.g. littleroottown-mayshouse-2f"
                              />
                            </label>
                          ) : null}
                          {item.type === "hoenn-crop" ? (
                            <>
                              <label className="admin-field">
                                <span className="admin-field__label">Area id</span>
                                <input
                                  type="text"
                                  className="admin-field__input"
                                  value={item.areaId ?? ""}
                                  onChange={(e) =>
                                    updateAt(index, {
                                      areaId: e.target.value || undefined,
                                    })
                                  }
                                />
                              </label>
                              <div className="admin-media__crop-grid">
                                {(["x", "y", "w", "h"] as const).map((key) => (
                                  <label key={key} className="admin-field">
                                    <span className="admin-field__label">{key}</span>
                                    <input
                                      type="number"
                                      className="admin-field__input"
                                      value={item.crop?.[key] ?? 0}
                                      onChange={(e) =>
                                        updateAt(index, {
                                          crop: {
                                            x: item.crop?.x ?? 0,
                                            y: item.crop?.y ?? 0,
                                            w: item.crop?.w ?? 100,
                                            h: item.crop?.h ?? 100,
                                            [key]: Number(e.target.value),
                                          },
                                        })
                                      }
                                    />
                                  </label>
                                ))}
                              </div>
                            </>
                          ) : null}
                          {item.type === "screenshot" || item.type === "map" ? (
                            <label className="admin-field">
                              <span className="admin-field__label">URL</span>
                              <input
                                type="text"
                                className="admin-field__input"
                                value={item.url}
                                onChange={(e) => updateAt(index, { url: e.target.value })}
                                placeholder="/maps/… or a full https URL"
                              />
                            </label>
                          ) : null}
                          <label className="admin-field">
                            <span className="admin-field__label">Caption</span>
                            <input
                              type="text"
                              className="admin-field__input"
                              value={item.caption}
                              onChange={(e) => updateAt(index, { caption: e.target.value })}
                              placeholder="Caption under the asset"
                            />
                          </label>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : null}
    </div>
  );
}
