"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateFakeRows } from "../../../fakeData";

/* ────────────────────────────────
   Types
   ──────────────────────────────── */
type CellValue =
  | string
  | number
  | boolean
  | { label: string; color: string }
  | { initials: string; name: string };

export type ColumnType = "text" | "number";

interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, CellValue>[];
}

/* ────────────────────────────────
   Helpers
   ──────────────────────────────── */
function createDefaultTable(): Table {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Table",
    columns: [
      { id: "col-checkbox", name: "", type: "text" },
      { id: "col-1", name: "Task Name", type: "text" },
      { id: "col-2", name: "Description", type: "text" },
      { id: "col-3", name: "Assigned To", type: "text" },
      { id: "col-4", name: "Status", type: "text" },
      { id: "col-5", name: "Priority", type: "text" },
      { id: "col-6", name: "Due Date", type: "text" },
    ],
    rows: generateFakeRows(20),
  };
}

/* ────────────────────────────────
   Component
   ──────────────────────────────── */
export default function BaseTable() {
  /** We *always* start with one table, so table[0] is never undefined.
   *  Use the non-null assertion (!) so TypeScript stops warning.
   */
  const [tables, setTables] = useState<Table[]>([createDefaultTable()]);
  const table = tables[0]!;

  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [newHeaderName, setNewHeaderName] = useState("");

  /* Hooks must appear unconditionally → define them before any early return */
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  /* ─────────── Mutators ─────────── */
  const updateCell = (rowIdx: number, colId: string, value: string) => {
    setTables((prev) =>
      prev.map((t, i) =>
        i === 0
          ? {
              ...t,
              rows: t.rows.map((r, j) =>
                j === rowIdx ? { ...r, [colId]: value } : r
              ),
            }
          : t
      )
    );
  };

  const renameColumn = (colId: string, newName: string) => {
    setTables((prev) =>
      prev.map((t, i) =>
        i === 0
          ? {
              ...t,
              columns: t.columns.map((c) =>
                c.id === colId ? { ...c, name: newName } : c
              ),
            }
          : t
      )
    );
  };

  const addRow = () => {
    const emptyRow: Record<string, CellValue> = {};
    for (const col of table.columns) {
      if (col.id !== "col-checkbox") emptyRow[col.id] = "";
    }
    setTables((prev) =>
      prev.map((t, i) => (i === 0 ? { ...t, rows: [...t.rows, emptyRow] } : t))
    );
  };

  /* ─────────── Render ─────────── */
  return (
    <div className="overflow-x-auto border-t border-gray-200">
      <div ref={parentRef} className="h-[500px] overflow-auto relative">
        <table className="min-w-full text-sm border-collapse border border-gray-200">
          {/* ── Header ── */}
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              {table.columns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2 h-10 text-left text-xs font-medium text-gray-600 border border-gray-200 whitespace-nowrap"
                >
                  {col.id === "col-checkbox" ? (
                    <input type="checkbox" disabled className="w-4 h-4" />
                  ) : editingHeaderId === col.id ? (
                    <input
                      value={newHeaderName}
                      onChange={(e) => setNewHeaderName(e.target.value)}
                      onBlur={() => {
                        renameColumn(col.id, newHeaderName);
                        setEditingHeaderId(null);
                      }}
                      autoFocus
                      className="border p-1 text-sm w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      {col.name}
                      <Pencil
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                        onClick={() => {
                          setEditingHeaderId(col.id);
                          setNewHeaderName(col.name);
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
              {/* + column header */}
              <th className="px-2 text-gray-400 font-medium border border-gray-200 text-center">
                +
              </th>
            </tr>
          </thead>

          {/* ── Body ── */}
<tbody>
  {virtualRows.map(({ index, size, start }) => {
    /* ── grab the row ─────────────────── */
    const row = table.rows[index];
    if (!row) return null;           // ← guard fixes “row possibly undefined”

    return (
      <tr
        key={index}
        style={{
          position: "absolute",
          top: 0,
          transform: `translateY(${start}px)`,
          height: `${size}px`,
          width: "100%",
        }}
        className="h-10"
      >
        {table.columns.map((col, colIdx) => {
          const value = row[col.id];
          return (
            <td
              key={col.id}
              className={`px-3 py-2 h-10 text-left border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                colIdx === 0 ? "text-center" : "text-gray-800"
              }`}
            >
              {/* … cell-rendering logic unchanged … */}

                        {col.id === "col-checkbox" ? (
                          <input type="checkbox" className="w-4 h-4" />
                        ) : typeof value === "object" &&
                          value !== null &&
                          "label" in value ? (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${value.color}`}
                          >
                            {value.label}
                          </span>
                        ) : typeof value === "object" &&
                          value !== null &&
                          "initials" in value ? (
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                              {value.initials}
                            </span>
                            {value.name}
                          </span>
                        ) : (
                          <input
                            type={col.type === "number" ? "number" : "text"}
                            value={String(value ?? "")}
                            onChange={(e) =>
                              updateCell(index, col.id, e.target.value)
                            }
                            className="w-full bg-transparent outline-none"
                          />
                        )}
                      </td>
                    );
                  })}

                  {/* + row cell */}
                  <td
                    className="text-gray-400 text-center border border-gray-200 cursor-pointer"
                    onClick={addRow}
                  >
                    +
                  </td>
                </tr>
              );
            })}

            {/* Footer blank + row (non-virtual) */}
            <tr>
              {table.columns.map((col) => (
                <td
                  key={col.id}
                  className="h-10 border border-gray-200 text-center text-gray-400 cursor-pointer"
                  onClick={addRow}
                >
                  +
                </td>
              ))}
              <td
                className="h-10 border border-gray-200 text-center text-gray-400 cursor-pointer"
                onClick={addRow}
              >
                +
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
