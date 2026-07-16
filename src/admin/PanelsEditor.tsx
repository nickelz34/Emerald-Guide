const PANEL_OPTIONS: { id: string; label: string }[] = [
  { id: "gym", label: "Gym guide" },
  { id: "rival", label: "Rival battle" },
  { id: "story-trainer", label: "Story trainer" },
  { id: "starter", label: "Starter choice" },
  { id: "ralts", label: "Ralts spotlight" },
  { id: "flower-shop", label: "Flower shop" },
  { id: "encounters", label: "Wild encounters" },
  { id: "battle-basics", label: "Battle basics" },
  { id: "hm-table", label: "HM unlock table" },
  { id: "key-items", label: "Key items table" },
  { id: "poke-balls", label: "Poké Ball table" },
  { id: "type-chart", label: "Type chart" },
  { id: "status-table", label: "Status table" },
  { id: "nature-table", label: "Nature table" },
  { id: "tm-hm-table", label: "TM/HM table" },
  { id: "scott", label: "Scott sightings" },
  { id: "match-call", label: "Match Call" },
  { id: "breeding-lookup", label: "Breeding lookup" },
  { id: "evolution-chart", label: "Evolution chart" },
  { id: "breeding-chart", label: "Breeding chart" },
];

interface PanelsEditorProps {
  hiddenPanels: string[];
  onChange: (hiddenPanels: string[]) => void;
}

export function PanelsEditor({ hiddenPanels, onChange }: PanelsEditorProps) {
  const hidden = new Set(hiddenPanels);

  const toggle = (id: string) => {
    if (hidden.has(id)) {
      onChange(hiddenPanels.filter((p) => p !== id));
    } else {
      onChange([...hiddenPanels, id]);
    }
  };

  return (
    <div className="admin-panels">
      <div className="admin-panels__head">
        <strong>Specialty panels</strong>
      </div>
      <p className="admin-muted">
        Gym parties, encounters, type charts, and similar embeds are still powered by
        game-data modules. Uncheck a panel to hide it on this step. Full in-place editing
        of those datasets is a follow-up.
      </p>
      <ul className="admin-panels__list">
        {PANEL_OPTIONS.map((panel) => (
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
