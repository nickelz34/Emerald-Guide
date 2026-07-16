import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { reorderList } from "../lib/reorderList";
import type { GuideCustomTable, GuideTableRow } from "../types";
import { createAdminId } from "./adminIds";

interface TablesEditorProps {
  tables: GuideCustomTable[];
  onChange: (tables: GuideCustomTable[]) => void;
  droppableId: string;
}

function emptyRow(columnCount: number): GuideTableRow {
  return {
    id: createAdminId("row"),
    cells: Array.from({ length: Math.max(1, columnCount) }, () => ""),
  };
}

export function TablesEditor({ tables, onChange, droppableId }: TablesEditorProps) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type, draggableId } = result;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === "TABLE") {
      onChange(reorderList(tables, source.index, destination.index));
      return;
    }

    if (type === "TABLE_ROW") {
      const tableId = source.droppableId.replace(/^table-rows-/, "");
      if (destination.droppableId !== source.droppableId) return;
      onChange(
        tables.map((table) => {
          if (table.id !== tableId) return table;
          return {
            ...table,
            rows: reorderList(table.rows, source.index, destination.index),
          };
        }),
      );
      void draggableId;
    }
  };

  const addTable = () => {
    onChange([
      ...tables,
      {
        id: createAdminId("table"),
        title: "New table",
        headers: ["Column 1", "Column 2"],
        rows: [emptyRow(2)],
      },
    ]);
  };

  const updateTable = (tableId: string, patch: Partial<GuideCustomTable>) => {
    onChange(tables.map((t) => (t.id === tableId ? { ...t, ...patch } : t)));
  };

  const removeTable = (tableId: string) => {
    if (!window.confirm("Delete this table?")) return;
    onChange(tables.filter((t) => t.id !== tableId));
  };

  const setHeader = (tableId: string, index: number, value: string) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        const headers = t.headers.slice();
        headers[index] = value;
        return { ...t, headers };
      }),
    );
  };

  const addColumn = (tableId: string) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          headers: [...t.headers, `Column ${t.headers.length + 1}`],
          rows: t.rows.map((row) => ({ ...row, cells: [...row.cells, ""] })),
        };
      }),
    );
  };

  const removeColumn = (tableId: string, colIndex: number) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        if (t.headers.length <= 1) return t;
        return {
          ...t,
          headers: t.headers.filter((_, i) => i !== colIndex),
          rows: t.rows.map((row) => ({
            ...row,
            cells: row.cells.filter((_, i) => i !== colIndex),
          })),
        };
      }),
    );
  };

  const setCell = (tableId: string, rowIndex: number, colIndex: number, value: string) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          rows: t.rows.map((row, ri) => {
            if (ri !== rowIndex) return row;
            const cells = row.cells.slice();
            cells[colIndex] = value;
            return { ...row, cells };
          }),
        };
      }),
    );
  };

  const addRow = (tableId: string) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, rows: [...t.rows, emptyRow(t.headers.length)] };
      }),
    );
  };

  const removeRow = (tableId: string, rowIndex: number) => {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, rows: t.rows.filter((_, i) => i !== rowIndex) };
      }),
    );
  };

  return (
    <div className="admin-tables">
      <div className="admin-tables__head">
        <strong>Tables</strong>
        <button type="button" className="btn btn--ghost btn--sm" onClick={addTable}>
          + Add table
        </button>
      </div>
      {tables.length === 0 ? (
        <p className="admin-muted">
          No custom tables on this step. Add one for checklists, comparisons, or reference grids.
        </p>
      ) : null}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={droppableId} type="TABLE">
          {(provided) => (
            <div
              className="admin-tables__list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tables.map((table, tableIndex) => (
                <Draggable key={table.id} draggableId={table.id} index={tableIndex}>
                  {(drag, snapshot) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      className={`admin-tables__card${
                        snapshot.isDragging ? " admin-tables__card--dragging" : ""
                      }`}
                    >
                      <div className="admin-tables__card-head">
                        <button
                          type="button"
                          className="admin-chapter-tree__handle"
                          aria-label="Drag table"
                          {...drag.dragHandleProps}
                        >
                          ⋮⋮
                        </button>
                        <input
                          type="text"
                          className="admin-field__input"
                          value={table.title}
                          onChange={(e) => updateTable(table.id, { title: e.target.value })}
                          placeholder="Table title"
                        />
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => addColumn(table.id)}
                        >
                          + Col
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => addRow(table.id)}
                        >
                          + Row
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => removeTable(table.id)}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="admin-tables__headers">
                        {table.headers.map((header, colIndex) => (
                          <div key={colIndex} className="admin-tables__header-cell">
                            <input
                              type="text"
                              className="admin-field__input"
                              value={header}
                              onChange={(e) => setHeader(table.id, colIndex, e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn--ghost btn--sm"
                              aria-label="Remove column"
                              disabled={table.headers.length <= 1}
                              onClick={() => removeColumn(table.id, colIndex)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <Droppable droppableId={`table-rows-${table.id}`} type="TABLE_ROW">
                        {(rowProvided) => (
                          <div
                            className="admin-tables__rows"
                            ref={rowProvided.innerRef}
                            {...rowProvided.droppableProps}
                          >
                            {table.rows.map((row, rowIndex) => (
                              <Draggable key={row.id} draggableId={row.id} index={rowIndex}>
                                {(rowDrag, rowSnap) => (
                                  <div
                                    ref={rowDrag.innerRef}
                                    {...rowDrag.draggableProps}
                                    className={`admin-tables__row${
                                      rowSnap.isDragging ? " admin-tables__row--dragging" : ""
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className="admin-chapter-tree__handle"
                                      aria-label="Drag row"
                                      {...rowDrag.dragHandleProps}
                                    >
                                      ⋮⋮
                                    </button>
                                    {table.headers.map((_, colIndex) => (
                                      <input
                                        key={colIndex}
                                        type="text"
                                        className="admin-field__input"
                                        value={row.cells[colIndex] ?? ""}
                                        onChange={(e) =>
                                          setCell(table.id, rowIndex, colIndex, e.target.value)
                                        }
                                      />
                                    ))}
                                    <button
                                      type="button"
                                      className="btn btn--ghost btn--sm"
                                      aria-label="Delete row"
                                      onClick={() => removeRow(table.id, rowIndex)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {rowProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
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
