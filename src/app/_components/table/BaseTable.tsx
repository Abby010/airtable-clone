"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateFakeRows } from "../../../fakeData";

/* ───────────── Types ───────────── */
type Badge = { label: string; color: string };
type Avatar = { initials: string; name: string };

export type CellValue = string | number | boolean | Badge | Avatar;

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

/* ─────────── Helpers ─────────── */
const isBadge = (v: unknown): v is Badge =>
  typeof v === "object" && v !== null && "label" in v;

const isAvatar = (v: unknown): v is Avatar =>
  typeof v === "object" && v !== null && "initials" in v;

const createDefaultTable = (): Table => ({
  id: crypto.randomUUID(),
  name: "Untitled Table",
  columns: [
    { id: "col-index", name: "", type: "text" },
    { id: "col-checkbox", name: "", type: "text" },
    { id: "col-1", name: "Task Name", type: "text" },
    { id: "col-2", name: "Description", type: "text" },
    { id: "col-3", name: "Assigned To", type: "text" },
    { id: "col-4", name: "Status", type: "text" },
    { id: "col-5", name: "Priority", type: "text" },
    { id: "col-6", name: "Due Date", type: "text" },
  ],
  rows: generateFakeRows(20),
});

/* ─────────── Component ────────── */
export default function BaseTable() {
  const [tables, setTables] = useState<Table[]>([createDefaultTable()]);
  const table = tables[0]!;
  const [editingId, setEditId] = useState<string | null>(null);
  const [draftHeader, setDraft] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => containerRef.current!,
    estimateSize: () => 40,
    overscan: 12,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  const updateCell = (row: number, col: string, value: CellValue) =>
    setTables(prev =>
      prev.map((t, i) =>
        i
          ? t
          : {
              ...t,
              rows: t.rows.map((r, j) =>
                j === row ? { ...r, [col]: value } : r),
            },
      ),
    );

  const renameColumn = (col: string, name: string) =>
    setTables(prev =>
      prev.map((t, i) =>
        i
          ? t
          : {
              ...t,
              columns: t.columns.map(c =>
                c.id === col ? { ...c, name } : c),
            },
      ),
    );

  const addRow = () => {
    const blank: Record<string, CellValue> = {};
    for (const c of table.columns)
      if (c.id !== "col-checkbox" && c.id !== "col-index") blank[c.id] = "";
    setTables(prev =>
      prev.map((t, i) => (i ? t : { ...t, rows: [...t.rows, blank] })));
  };

  return (
    <div className="overflow-x-auto border-t border-gray-200">
      <div ref={containerRef} className="relative h-[500px] overflow-auto pr-4">
        <table className="min-w-full text-sm border-collapse border border-gray-200 table-auto">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              {table.columns.map(col => (
                <th
                  key={col.id}
                  className="h-10 whitespace-nowrap border-b border-r border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600"
                >
                  {col.id === "col-index" ? (
                    ""
                  ) : col.id === "col-checkbox" ? (
                    <input disabled type="checkbox" className="h-4 w-4" />
                  ) : editingId === col.id ? (
                    <input
                      autoFocus
                      className="w-full border p-1 text-sm"
                      value={draftHeader}
                      onChange={e => setDraft(e.target.value)}
                      onBlur={() => {
                        renameColumn(col.id, draftHeader);
                        setEditId(null);
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      {col.name}
                      <Pencil
                        className="h-4 w-4 cursor-pointer text-gray-400"
                        onClick={() => {
                          setEditId(col.id);
                          setDraft(col.name);
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
              <th className="border-l border-gray-200 text-center font-medium text-gray-400 w-5 cursor-col-resize">
                +
              </th>
            </tr>
          </thead>

          <tbody>
            {virtualRows.map(v => {
              const r = table.rows[v.index];
              if (!r) return null;

              return (
                <tr
                  key={v.index}
                  className="h-10 hover:bg-[#F9FAFB]"
                  style={{
                    position: "absolute",
                    top: 0,
                    transform: `translateY(${v.start}px)`,
                    height: `${v.size}px`,
                    width: "100%",
                  }}
                >
                  {table.columns.map((c, idx) => {
                    if (c.id === "col-index") {
                      return (
                        <td
                          key={c.id}
                          className="h-10 text-center text-gray-400 border-b border-r border-gray-200 px-2 py-1.5"
                        >
                          {v.index + 1}
                        </td>
                      );
                    }

                    const cellValue = r[c.id];
                    return (
                      <td
                        key={c.id}
                        className={`h-10 overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-gray-200 px-3 py-1.5 ${
                          c.id === "col-checkbox" ? "text-center" : "text-gray-800"
                        }`}
                      >
                        {c.id === "col-checkbox" ? (
                          <input type="checkbox" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : isBadge(cellValue) ? (
                          <span className={`inline-flex items-center rounded-full px-2 text-xs font-medium tracking-tight ${cellValue.color}`}>
                            {cellValue.label}
                          </span>
                        ) : isAvatar(cellValue) ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">
                              {cellValue.initials}
                            </span>
                            <span className="truncate">
                              {cellValue.name}
                            </span>
                          </span>
                        ) : (
                          <input
                            className="w-full truncate bg-transparent outline-none"
                            type={c.type === "number" ? "number" : "text"}
                            value={String(cellValue)}
                            onChange={e =>
                              updateCell(v.index, c.id, e.target.value)
                            }
                          />
                        )}
                      </td>
                    );
                  })}

                  <td
                    className="cursor-pointer select-none border-l border-gray-200 text-center text-gray-400 w-5"
                    onClick={addRow}
                  >
                    +
                  </td>
                </tr>
              );
            })}

            <tr>
              {table.columns.map(col => (
                <td
                  key={col.id}
                  className="h-10 cursor-pointer select-none border-b border-r border-gray-200 text-center text-gray-400"
                  onClick={addRow}
                >
                  {col.id === "col-index" || col.id === "col-checkbox" ? "" : "+"}
                </td>
              ))}
              <td
                className="h-10 cursor-pointer select-none border-l border-gray-200 text-center text-gray-400"
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
