import type { GuideStep } from "../types";
import { getAvailablePanelsForStep } from "./availablePanels";

interface PanelsEditorProps {
  step: GuideStep;
  hiddenPanels: string[];
  onChange: (hiddenPanels: string[]) => void;
}

export function PanelsEditor({ step, hiddenPanels, onChange }: PanelsEditorProps) {
  const available = getAvailablePanelsForStep(step);
  const hidden = new Set(hiddenPanels);

  const toggle = (id: string) => {
    if (hidden.has(id)) {
      onChange(hiddenPanels.filter((p) => p !== id));
    } else {
      onChange([...hiddenPanels, id]);
    }
  };

  if (available.length === 0) {
    return (
      <div className="admin-panels">
        <div className="admin-panels__head">
          <strong>Specialty panels</strong>
        </div>
        <p className="admin-muted">
          This step has no specialty panels (gym, encounters, charts, etc.).
        </p>
      </div>
    );
  }

  return (
    <div className="admin-panels">
      <div className="admin-panels__head">
        <strong>Specialty panels on this step</strong>
      </div>
      <p className="admin-muted">
        Only panels that belong to this step are listed. Checked = shown; uncheck to hide.
      </p>
      <ul className="admin-panels__list">
        {available.map((panel) => (
          <li key={panel.id}>
            <label className="admin-panels__item">
              <input
                type="checkbox"
                checked={!hidden.has(panel.id)}
                onChange={() => toggle(panel.id)}
              />
              <span>{panel.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
