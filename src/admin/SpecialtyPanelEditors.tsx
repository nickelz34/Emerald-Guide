import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useMemo } from "react";
import { reorderList } from "../lib/reorderList";
import type { GuideStep, StepSpecialtyData } from "../types";
import { AdminDragHandle } from "./AdminDragHandle";
import { createAdminId } from "./adminIds";
import { getAvailablePanelsForStep } from "./availablePanels";
import { RichTextField } from "./RichTextField";
import { SortableStringList } from "./SortableStringList";
import { seedSpecialtyForStep } from "./specialtySeed";

interface SpecialtyPanelEditorsProps {
  step: GuideStep;
  onChange: (specialty: StepSpecialtyData) => void;
}

export function SpecialtyPanelEditors({ step, onChange }: SpecialtyPanelEditorsProps) {
  const available = getAvailablePanelsForStep(step);
  // Derive editor defaults without writing into the draft. Persisting seed on
  // navigation was marking every step visit as a pending publish change.
  const specialty = useMemo(() => seedSpecialtyForStep(step), [step]);

  if (available.length === 0) return null;

  const patch = (partial: Partial<StepSpecialtyData>) =>
    onChange({ ...specialty, ...partial });

  return (
    <div className="admin-specialty">
      <div className="admin-specialty__head">
        <strong>Edit specialty panels &amp; tables</strong>
      </div>
      <p className="admin-muted">
        Edit gym/rival guides and reference tables for this step. Drag rows to reorder tables.
        Trainer parties and wild encounter rates still come from game data. Use{" "}
        <strong>Page layout</strong> above to move any panel or table around on the page.
      </p>

      {specialty.gym ? (
        <div className="admin-specialty__card">
          <h4>Gym guide</h4>
          <div className="admin-specialty__grid">
            {(
              [
                ["gymName", "Gym name"],
                ["city", "City"],
                ["leaderName", "Leader"],
                ["specialty", "Specialty"],
                ["badgeName", "Badge"],
                ["leaderTrainerId", "Leader trainer id"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="admin-field">
                <span className="admin-field__label">{label}</span>
                <input
                  className="admin-field__input"
                  value={String(specialty.gym![key] ?? "")}
                  onChange={(e) =>
                    patch({ gym: { ...specialty.gym!, [key]: e.target.value } })
                  }
                />
              </label>
            ))}
          </div>
          <RichTextField
            label="Puzzle note"
            value={specialty.gym.puzzleNote ?? ""}
            onChange={(puzzleNote) =>
              patch({ gym: { ...specialty.gym!, puzzleNote: puzzleNote || undefined } })
            }
          />
          <div className="admin-specialty__subhead">
            <strong>Junior trainers</strong>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                patch({
                  gym: {
                    ...specialty.gym!,
                    juniors: [
                      ...specialty.gym!.juniors,
                      {
                        name: "New trainer",
                        trainerClass: "Youngster",
                        trainerId: createAdminId("TRAINER").toUpperCase(),
                      },
                    ],
                  },
                })
              }
            >
              + Junior
            </button>
          </div>
          {specialty.gym.juniors.map((junior, index) => (
            <div key={`${junior.trainerId}-${index}`} className="admin-specialty__junior">
              <input
                className="admin-field__input"
                value={junior.name}
                placeholder="Name"
                onChange={(e) => {
                  const juniors = specialty.gym!.juniors.slice();
                  juniors[index] = { ...junior, name: e.target.value };
                  patch({ gym: { ...specialty.gym!, juniors } });
                }}
              />
              <input
                className="admin-field__input"
                value={junior.trainerClass}
                placeholder="Class"
                onChange={(e) => {
                  const juniors = specialty.gym!.juniors.slice();
                  juniors[index] = { ...junior, trainerClass: e.target.value };
                  patch({ gym: { ...specialty.gym!, juniors } });
                }}
              />
              <input
                className="admin-field__input"
                value={junior.trainerId}
                placeholder="Trainer id"
                onChange={(e) => {
                  const juniors = specialty.gym!.juniors.slice();
                  juniors[index] = { ...junior, trainerId: e.target.value };
                  patch({ gym: { ...specialty.gym!, juniors } });
                }}
              />
              <RichTextField
                label="Note"
                value={junior.note ?? ""}
                minHeight={56}
                onChange={(note) => {
                  const juniors = specialty.gym!.juniors.slice();
                  juniors[index] = { ...junior, note: note || undefined };
                  patch({ gym: { ...specialty.gym!, juniors } });
                }}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  const juniors = specialty.gym!.juniors.filter((_, i) => i !== index);
                  patch({ gym: { ...specialty.gym!, juniors } });
                }}
              >
                Remove junior
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {specialty.rival ? (
        <div className="admin-specialty__card">
          <h4>Rival battle</h4>
          <label className="admin-field">
            <span className="admin-field__label">Battle number</span>
            <input
              type="number"
              className="admin-field__input"
              value={specialty.rival.battleNumber}
              onChange={(e) =>
                patch({
                  rival: { ...specialty.rival!, battleNumber: Number(e.target.value) || 1 },
                })
              }
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">Location key</span>
            <input
              className="admin-field__input"
              value={specialty.rival.locationKey}
              onChange={(e) =>
                patch({ rival: { ...specialty.rival!, locationKey: e.target.value } })
              }
            />
          </label>
          <RichTextField
            label="Note"
            value={specialty.rival.note ?? ""}
            onChange={(note) =>
              patch({ rival: { ...specialty.rival!, note: note || undefined } })
            }
          />
        </div>
      ) : null}

      {specialty.storyTrainer ? (
        <div className="admin-specialty__card">
          <h4>Story trainer</h4>
          <label className="admin-field">
            <span className="admin-field__label">Title</span>
            <input
              className="admin-field__input"
              value={specialty.storyTrainer.title}
              onChange={(e) =>
                patch({ storyTrainer: { ...specialty.storyTrainer!, title: e.target.value } })
              }
            />
          </label>
          <RichTextField
            label="Intro"
            value={specialty.storyTrainer.intro}
            onChange={(intro) =>
              patch({ storyTrainer: { ...specialty.storyTrainer!, intro } })
            }
          />
          <RichTextField
            label="Note"
            value={specialty.storyTrainer.note ?? ""}
            onChange={(note) =>
              patch({
                storyTrainer: { ...specialty.storyTrainer!, note: note || undefined },
              })
            }
          />
          <div className="admin-specialty__grid">
            {(
              [
                ["trainerName", "Trainer name"],
                ["trainerClass", "Trainer class"],
                ["trainerId", "Trainer id"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="admin-field">
                <span className="admin-field__label">{label}</span>
                <input
                  className="admin-field__input"
                  value={String(specialty.storyTrainer![key] ?? "")}
                  onChange={(e) =>
                    patch({
                      storyTrainer: { ...specialty.storyTrainer!, [key]: e.target.value },
                    })
                  }
                />
              </label>
            ))}
          </div>
          <RichTextField
            label="Trainer note"
            value={specialty.storyTrainer.trainerNote ?? ""}
            onChange={(trainerNote) =>
              patch({
                storyTrainer: {
                  ...specialty.storyTrainer!,
                  trainerNote: trainerNote || undefined,
                },
              })
            }
          />
          <RichTextField
            label="Trainer description"
            value={specialty.storyTrainer.trainerDesc ?? ""}
            onChange={(trainerDesc) =>
              patch({
                storyTrainer: {
                  ...specialty.storyTrainer!,
                  trainerDesc: trainerDesc || undefined,
                },
              })
            }
          />
        </div>
      ) : null}

      {specialty.starter ? (
        <div className="admin-specialty__card">
          <h4>Starter choice</h4>
          <RichTextField
            label="Intro"
            value={specialty.starter.intro}
            onChange={(intro) => patch({ starter: { ...specialty.starter!, intro } })}
          />
          {specialty.starter.entries.map((entry, index) => (
            <div key={entry.slug} className="admin-specialty__nested">
              <strong>{entry.slug}</strong>
              {(
                [
                  ["tagline", "Tagline"],
                  ["difficulty", "Difficulty"],
                  ["accent", "Accent color"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="admin-field">
                  <span className="admin-field__label">{label}</span>
                  <input
                    className="admin-field__input"
                    value={String(entry[key] ?? "")}
                    onChange={(e) => {
                      const entries = specialty.starter!.entries.slice();
                      entries[index] = { ...entry, [key]: e.target.value };
                      patch({ starter: { ...specialty.starter!, entries } });
                    }}
                  />
                </label>
              ))}
              {(
                [
                  ["bestFor", "Best for"],
                  ["earlyGyms", "Early gyms"],
                  ["rivalFaces", "Rival faces"],
                ] as const
              ).map(([key, label]) => (
                <RichTextField
                  key={key}
                  label={label}
                  value={entry[key]}
                  onChange={(value) => {
                    const entries = specialty.starter!.entries.slice();
                    entries[index] = { ...entry, [key]: value };
                    patch({ starter: { ...specialty.starter!, entries } });
                  }}
                />
              ))}
              <SortableStringList
                label="Natures"
                droppableId={`starter-natures-${entry.slug}`}
                items={entry.natures}
                addLabel="+ Nature"
                onChange={(natures) => {
                  const entries = specialty.starter!.entries.slice();
                  entries[index] = { ...entry, natures };
                  patch({ starter: { ...specialty.starter!, entries } });
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {specialty.ralts ? (
        <div className="admin-specialty__card">
          <h4>Ralts spotlight</h4>
          <RichTextField
            label="Intro"
            value={specialty.ralts.intro}
            onChange={(intro) => patch({ ralts: { ...specialty.ralts!, intro } })}
          />
          <SortableStringList
            label="Hunt tips"
            droppableId={`ralts-tips-${step.id}`}
            items={specialty.ralts.huntTips}
            richText
            multiline
            onChange={(huntTips) => patch({ ralts: { ...specialty.ralts!, huntTips } })}
          />
          <SortableStringList
            label="Natures"
            droppableId={`ralts-natures-${step.id}`}
            items={specialty.ralts.natures}
            onChange={(natures) => patch({ ralts: { ...specialty.ralts!, natures } })}
          />
          <RichTextField
            label="Abilities note"
            value={specialty.ralts.abilitiesNote}
            onChange={(abilitiesNote) =>
              patch({ ralts: { ...specialty.ralts!, abilitiesNote } })
            }
          />
          {specialty.ralts.stages.map((stage, index) => (
            <div key={stage.slug} className="admin-specialty__nested">
              <strong>{stage.slug}</strong>
              {(
                [
                  ["tagline", "Tagline"],
                  ["role", "Role"],
                  ["note", "Note"],
                  ["accent", "Accent"],
                ] as const
              ).map(([key, label]) => (
                <RichTextField
                  key={key}
                  label={label}
                  value={stage[key]}
                  minHeight={56}
                  onChange={(value) => {
                    const stages = specialty.ralts!.stages.slice();
                    stages[index] = { ...stage, [key]: value };
                    patch({ ralts: { ...specialty.ralts!, stages } });
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {specialty.flowerShop ? (
        <div className="admin-specialty__card">
          <h4>Flower shop</h4>
          <RichTextField
            label="Wailmer Pail blurb"
            value={specialty.flowerShop.pailBlurb}
            onChange={(pailBlurb) =>
              patch({ flowerShop: { ...specialty.flowerShop!, pailBlurb } })
            }
          />
          <RichTextField
            label="Soft soil note"
            value={specialty.flowerShop.softSoilNote}
            onChange={(softSoilNote) =>
              patch({ flowerShop: { ...specialty.flowerShop!, softSoilNote } })
            }
          />
        </div>
      ) : null}

      {specialty.battleBasics ? (
        <div className="admin-specialty__card">
          <h4>Battle basics</h4>
          <RichTextField
            label="Lead"
            value={specialty.battleBasics.lead}
            onChange={(lead) =>
              patch({ battleBasics: { ...specialty.battleBasics!, lead } })
            }
          />
          {specialty.battleBasics.examples.map((example, index) => (
            <div key={example.id} className="admin-specialty__nested">
              <label className="admin-field">
                <span className="admin-field__label">Example title</span>
                <input
                  className="admin-field__input"
                  value={example.title}
                  onChange={(e) => {
                    const examples = specialty.battleBasics!.examples.slice();
                    examples[index] = { ...example, title: e.target.value };
                    patch({ battleBasics: { ...specialty.battleBasics!, examples } });
                  }}
                />
              </label>
              <RichTextField
                label="Example blurb"
                value={example.blurb}
                onChange={(blurb) => {
                  const examples = specialty.battleBasics!.examples.slice();
                  examples[index] = { ...example, blurb };
                  patch({ battleBasics: { ...specialty.battleBasics!, examples } });
                }}
              />
            </div>
          ))}
          {specialty.battleBasics.commands.map((command, index) => (
            <div key={command.id} className="admin-specialty__nested">
              <label className="admin-field">
                <span className="admin-field__label">Command</span>
                <input
                  className="admin-field__input"
                  value={command.label}
                  onChange={(e) => {
                    const commands = specialty.battleBasics!.commands.slice();
                    commands[index] = { ...command, label: e.target.value };
                    patch({ battleBasics: { ...specialty.battleBasics!, commands } });
                  }}
                />
              </label>
              <RichTextField
                label="Detail"
                value={command.detail}
                onChange={(detail) => {
                  const commands = specialty.battleBasics!.commands.slice();
                  commands[index] = { ...command, detail };
                  patch({ battleBasics: { ...specialty.battleBasics!, commands } });
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {specialty.hmTable ? (
        <ReferenceRowsEditor
          title="HM unlock table"
          droppableId={`hm-table-${step.id}`}
          rows={specialty.hmTable}
          columns={[
            ["hm", "HM"],
            ["move", "Move"],
            ["obtainLocation", "Obtain location"],
            ["fieldBadge", "Field badge"],
            ["fieldBadgeNumber", "Badge #"],
            ["obtainStepId", "Obtain step id"],
          ]}
          onChange={(hmTable) => patch({ hmTable })}
          createRow={() => ({
            hm: "HM00",
            move: "New move",
            obtainStepId: step.id,
            obtainLocation: "",
            fieldBadge: "",
            fieldBadgeNumber: 1,
          })}
        />
      ) : null}

      {specialty.keyItems ? (
        <ReferenceRowsEditor
          title="Key items"
          droppableId={`key-items-${step.id}`}
          rows={specialty.keyItems}
          columns={[
            ["name", "Name"],
            ["obtainLocation", "Obtain location"],
            ["prerequisite", "Prerequisite"],
            ["note", "Note"],
            ["walkthroughStepId", "Step id"],
            ["id", "Id"],
          ]}
          onChange={(keyItems) => patch({ keyItems })}
          createRow={() => ({
            id: createAdminId("key"),
            name: "New item",
            obtainLocation: "",
            walkthroughStepId: step.id,
          })}
        />
      ) : null}

      {specialty.pokeBalls ? (
        <ReferenceRowsEditor
          title="Poké Balls"
          droppableId={`poke-balls-${step.id}`}
          rows={specialty.pokeBalls}
          columns={[
            ["name", "Name"],
            ["multiplier", "Multiplier"],
            ["bestUsed", "Best used"],
            ["obtain", "Obtain"],
            ["id", "Id"],
          ]}
          onChange={(pokeBalls) => patch({ pokeBalls })}
          createRow={() => ({
            id: createAdminId("ball"),
            name: "New Ball",
            multiplier: "×1",
            bestUsed: "",
            obtain: "",
          })}
        />
      ) : null}

      {specialty.statusTable ? (
        <ReferenceRowsEditor
          title="Status conditions"
          droppableId={`status-table-${step.id}`}
          rows={specialty.statusTable}
          columns={[
            ["name", "Name"],
            ["kind", "Kind"],
            ["effect", "Effect"],
            ["cures", "Cures"],
            ["notes", "Notes"],
            ["id", "Id"],
          ]}
          onChange={(statusTable) => patch({ statusTable })}
          createRow={() => ({
            id: createAdminId("status"),
            name: "New status",
            kind: "persistent",
            effect: "",
            cures: "",
          })}
        />
      ) : null}

      {specialty.natures ? (
        <ReferenceRowsEditor
          title="Natures"
          droppableId={`natures-${step.id}`}
          rows={specialty.natures}
          columns={[
            ["name", "Name"],
            ["raised", "Raised"],
            ["lowered", "Lowered"],
            ["contest", "Contest"],
            ["likes", "Likes"],
            ["dislikes", "Dislikes"],
          ]}
          onChange={(natures) => patch({ natures })}
          createRow={() => ({
            name: "New nature",
            raised: null,
            lowered: null,
            contest: null,
            likes: null,
            dislikes: null,
          })}
        />
      ) : null}

      {specialty.typeChart ? (
        <div className="admin-specialty__card">
          <h4>Type chart</h4>
          <p className="admin-muted">
            Damage multipliers stay Gen III game data. Edit the heading and intro shown above the
            interactive picker.
          </p>
          <label className="admin-field">
            <span className="admin-field__label">Title</span>
            <input
              className="admin-field__input"
              value={specialty.typeChart.title ?? "Damage multipliers (Gen III)"}
              onChange={(e) =>
                patch({ typeChart: { ...specialty.typeChart!, title: e.target.value } })
              }
            />
          </label>
          <RichTextField
            label="Intro"
            value={specialty.typeChart.lead ?? ""}
            onChange={(lead) =>
              patch({ typeChart: { ...specialty.typeChart!, lead } })
            }
          />
        </div>
      ) : null}

      {specialty.tmHmTable ? (
        <>
          <div className="admin-specialty__card">
            <h4>TM &amp; HM catalog</h4>
            <label className="admin-field">
              <span className="admin-field__label">Title</span>
              <input
                className="admin-field__input"
                value={specialty.tmHmTable.title ?? "TMs & HMs in Emerald"}
                onChange={(e) =>
                  patch({ tmHmTable: { ...specialty.tmHmTable!, title: e.target.value } })
                }
              />
            </label>
            <RichTextField
              label="Intro"
              value={specialty.tmHmTable.lead ?? ""}
              onChange={(lead) =>
                patch({ tmHmTable: { ...specialty.tmHmTable!, lead } })
              }
            />
          </div>
          <ReferenceRowsEditor
            title="Technical Machines"
            droppableId={`tm-catalog-${step.id}`}
            rows={specialty.tmHmTable.tms.map((row) => ({
              id: row.id,
              move: row.move,
              type: row.type ?? "",
              locationsText: row.locations.join(" · "),
              notes: row.notes ?? "",
            }))}
            columns={[
              ["id", "TM"],
              ["move", "Move"],
              ["type", "Type"],
              ["locationsText", "Locations ( · separated)"],
              ["notes", "Notes"],
            ]}
            onChange={(rows) =>
              patch({
                tmHmTable: {
                  ...specialty.tmHmTable!,
                  tms: rows.map((row) => ({
                    id: String(row.id ?? ""),
                    move: String(row.move ?? ""),
                    type: String(row.type ?? "") || undefined,
                    notes: String(row.notes ?? "") || undefined,
                    locations: String(row.locationsText ?? "")
                      .split(/\s*·\s*/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })),
                },
              })
            }
            createRow={() => ({
              id: "TM00",
              move: "New move",
              type: "Normal",
              locationsText: "",
              notes: "",
            })}
          />
          <ReferenceRowsEditor
            title="Hidden Machines"
            droppableId={`hm-catalog-${step.id}`}
            rows={specialty.tmHmTable.hms.map((row) => ({
              id: row.id,
              move: row.move,
              locationsText: row.locations.join(" · "),
              fieldBadge: row.fieldBadge ?? "",
              fieldBadgeNumber: row.fieldBadgeNumber ?? "",
              notes: row.notes ?? "",
            }))}
            columns={[
              ["id", "HM"],
              ["move", "Move"],
              ["locationsText", "Locations ( · separated)"],
              ["fieldBadge", "Field badge"],
              ["fieldBadgeNumber", "Badge #"],
              ["notes", "Field effect / notes"],
            ]}
            onChange={(rows) =>
              patch({
                tmHmTable: {
                  ...specialty.tmHmTable!,
                  hms: rows.map((row) => {
                    const badgeNum = row.fieldBadgeNumber;
                    const parsed =
                      badgeNum === "" || badgeNum == null ? undefined : Number(badgeNum);
                    return {
                      id: String(row.id ?? ""),
                      move: String(row.move ?? ""),
                      fieldBadge: String(row.fieldBadge ?? "") || undefined,
                      fieldBadgeNumber:
                        parsed != null && !Number.isNaN(parsed) ? parsed : undefined,
                      notes: String(row.notes ?? "") || undefined,
                      locations: String(row.locationsText ?? "")
                        .split(/\s*·\s*/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    };
                  }),
                },
              })
            }
            createRow={() => ({
              id: "HM00",
              move: "New move",
              locationsText: "",
              fieldBadge: "",
              fieldBadgeNumber: 1,
              notes: "",
            })}
          />
        </>
      ) : null}

      {specialty.scott ? (
        <ReferenceRowsEditor
          title="Scott sightings"
          droppableId={`scott-${step.id}`}
          rows={specialty.scott}
          columns={[
            ["id", "Id"],
            ["location", "Location"],
            ["timing", "Timing"],
            ["walkthroughStepId", "Step id"],
          ]}
          onChange={(scott) => patch({ scott })}
          createRow={() => ({
            id: (specialty.scott?.length ?? 0) + 1,
            location: "",
            timing: "",
          })}
        />
      ) : null}

      {specialty.encounters ? (
        <div className="admin-specialty__card">
          <h4>Encounter extras</h4>
          <p className="admin-muted">
            Wild rates still load from encounter tables. Add step-level tips/secrets shown with
            this panel.
          </p>
          <SortableStringList
            label="Encounter tips"
            droppableId={`enc-tips-${step.id}`}
            items={specialty.encounters.tips}
            richText
            multiline
            onChange={(tips) =>
              patch({ encounters: { ...specialty.encounters!, tips } })
            }
          />
          <SortableStringList
            label="Encounter secrets"
            droppableId={`enc-secrets-${step.id}`}
            items={specialty.encounters.secrets}
            richText
            multiline
            onChange={(secrets) =>
              patch({ encounters: { ...specialty.encounters!, secrets } })
            }
          />
        </div>
      ) : null}
    </div>
  );
}

interface ReferenceRowsEditorProps<T extends Record<string, unknown>> {
  title: string;
  droppableId: string;
  rows: T[];
  columns: Array<[string, string]>;
  onChange: (rows: T[]) => void;
  createRow: () => T;
}

function ReferenceRowsEditor<T extends Record<string, unknown>>({
  title,
  droppableId,
  rows,
  columns,
  onChange,
  createRow,
}: ReferenceRowsEditorProps<T>) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    onChange(reorderList(rows, result.source.index, result.destination.index));
  };

  return (
    <div className="admin-specialty__card">
      <div className="admin-specialty__subhead">
        <h4>{title}</h4>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onChange([...rows, createRow()])}
        >
          + Row
        </button>
      </div>
      <p className="admin-muted">Drag the handle to reorder rows.</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              className="admin-specialty__rows"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {rows.map((row, index) => (
                <Draggable
                  key={`${droppableId}-${index}`}
                  draggableId={`${droppableId}-row-${index}`}
                  index={index}
                >
                  {(drag, snapshot) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      className={`admin-specialty__nested${
                        snapshot.isDragging ? " admin-specialty__nested--dragging" : ""
                      }`}
                    >
                      <AdminDragHandle
                        label={`Drag ${title} row ${index + 1}`}
                        dragHandleProps={drag.dragHandleProps}
                      />
                      <div className="admin-specialty__row-fields">
                        {columns.map(([key, label]) => (
                          <label key={key} className="admin-field">
                            <span className="admin-field__label">{label}</span>
                            <input
                              className="admin-field__input"
                              value={row[key] == null ? "" : String(row[key])}
                              onChange={(e) => {
                                const next = rows.slice();
                                const raw = e.target.value;
                                const prev = row[key];
                                const value =
                                  typeof prev === "number"
                                    ? Number(raw) || 0
                                    : raw === "" && (prev === null || prev === undefined)
                                      ? null
                                      : raw;
                                next[index] = { ...row, [key]: value };
                                onChange(next);
                              }}
                            />
                          </label>
                        ))}
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => onChange(rows.filter((_, i) => i !== index))}
                        >
                          Remove row
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
