import type { GuideStep } from "../types";
import { MediaEditor } from "./MediaEditor";
import { PanelsEditor } from "./PanelsEditor";
import { SortableStringList } from "./SortableStringList";
import { TablesEditor } from "./TablesEditor";

interface StepEditorProps {
  step: GuideStep;
  onChange: (patch: Partial<GuideStep>) => void;
}

export function StepEditor({ step, onChange }: StepEditorProps) {
  return (
    <div className="admin-step-editor">
      <label className="admin-field">
        <span className="admin-field__label">Title</span>
        <input
          type="text"
          className="admin-field__input"
          value={step.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Location</span>
        <input
          type="text"
          className="admin-field__input"
          value={step.location ?? ""}
          onChange={(e) => onChange({ location: e.target.value || undefined })}
        />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">Summary</span>
        <textarea
          className="admin-field__textarea"
          rows={3}
          value={step.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
      </label>

      <SortableStringList
        label="Story paragraphs"
        droppableId={`story-${step.id}`}
        items={step.story ?? []}
        multiline
        placeholder="Story paragraph…"
        addLabel="+ Add paragraph"
        emptyText="No story paragraphs yet."
        onChange={(story) => onChange({ story: story.length ? story : undefined })}
      />

      <SortableStringList
        label="Details / objectives"
        droppableId={`details-${step.id}`}
        items={step.details}
        multiline
        placeholder="Objective or detail…"
        addLabel="+ Add detail"
        emptyText="No details yet."
        onChange={(details) => onChange({ details })}
      />

      <SortableStringList
        label="Tips"
        droppableId={`tips-${step.id}`}
        items={step.tips ?? []}
        multiline
        placeholder="Tip…"
        addLabel="+ Add tip"
        emptyText="No tips yet."
        onChange={(tips) => onChange({ tips: tips.length ? tips : undefined })}
      />

      <SortableStringList
        label="Secrets"
        droppableId={`secrets-${step.id}`}
        items={step.secrets ?? []}
        multiline
        placeholder="Secret, hidden item, or extras note…"
        addLabel="+ Add secret"
        emptyText="No step secrets yet."
        onChange={(secrets) => onChange({ secrets: secrets.length ? secrets : undefined })}
      />

      <SortableStringList
        label="Tags"
        droppableId={`tags-${step.id}`}
        items={step.tags ?? []}
        placeholder="e.g. breeding-lookup"
        addLabel="+ Add tag"
        emptyText="No tags yet."
        onChange={(tags) => onChange({ tags: tags.length ? tags : undefined })}
      />

      <label className="admin-field admin-field--row">
        <span className="admin-field__label">Optional step</span>
        <input
          type="checkbox"
          checked={Boolean(step.optional)}
          onChange={(e) => onChange({ optional: e.target.checked || undefined })}
        />
      </label>

      <MediaEditor
        stepId={step.id}
        media={step.media ?? []}
        useCustomMedia={Boolean(step.useCustomMedia)}
        onChange={(media, useCustomMedia) =>
          onChange({
            media: useCustomMedia ? media : media.length ? media : undefined,
            useCustomMedia: useCustomMedia || undefined,
          })
        }
      />

      <TablesEditor
        tables={step.tables ?? []}
        droppableId={`tables-${step.id}`}
        onChange={(tables) => onChange({ tables: tables.length ? tables : undefined })}
      />

      <PanelsEditor
        step={step}
        hiddenPanels={step.hiddenPanels ?? []}
        onChange={(hiddenPanels) =>
          onChange({ hiddenPanels: hiddenPanels.length ? hiddenPanels : undefined })
        }
      />
    </div>
  );
}
