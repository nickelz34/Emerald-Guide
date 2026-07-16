import type { GuideMediaItem } from "../types";
import { createAdminId } from "./adminIds";

interface MediaEditorProps {
  media: GuideMediaItem[];
  onChange: (media: GuideMediaItem[]) => void;
}

export function MediaEditor({ media, onChange }: MediaEditorProps) {
  const updateAt = (index: number, patch: Partial<GuideMediaItem>) => {
    const next = media.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(media.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([
      ...media,
      {
        id: createAdminId("media"),
        type: "screenshot",
        url: "",
        caption: "",
      },
    ]);
  };

  return (
    <div className="admin-media">
      <div className="admin-media__head">
        <strong>Media</strong>
        <button type="button" className="btn btn--ghost btn--sm" onClick={addItem}>
          + Add media
        </button>
      </div>
      {media.length === 0 ? (
        <p className="admin-muted">
          No CMS media on this step. Derived maps still show when media is empty.
        </p>
      ) : null}
      <ul className="admin-media__list">
        {media.map((item, index) => (
          <li key={item.id} className="admin-media__card">
            {item.url ? (
              <div className="admin-media__preview">
                <img src={item.url} alt={item.caption || "Media preview"} />
                <button
                  type="button"
                  className="admin-media__preview-x"
                  aria-label="Remove media"
                  onClick={() => removeAt(index)}
                >
                  ×
                </button>
              </div>
            ) : null}
            <div className="admin-media__fields">
              <label className="admin-field">
                <span className="admin-field__label">Type</span>
                <select
                  className="admin-field__input"
                  value={item.type}
                  onChange={(e) =>
                    updateAt(index, { type: e.target.value as GuideMediaItem["type"] })
                  }
                >
                  <option value="screenshot">Screenshot</option>
                  <option value="map">Map</option>
                </select>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">URL</span>
                <input
                  type="url"
                  className="admin-field__input"
                  value={item.url}
                  onChange={(e) => updateAt(index, { url: e.target.value })}
                  placeholder="/images/maps/example.png or https://…"
                />
              </label>
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
              {!item.url ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeAt(index)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
