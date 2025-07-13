"use client";

import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateFakeRows } from "../../../fakeData";

/* ──────── Types ──────── */
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

const isBadge = (v: unknown): v is Badge =>
  typeof v === "object" && v !== null && "label" in v;
const isAvatar = (v: unknown): v is Avatar =>
  typeof v === "object" && v !== null && "initials" in v;

const createDefaultTable = (): Table => ({
  id: crypto.randomUUID(),
  name: "Untitled Table",
  columns: [
    { id: "col-index", name: "", type: "text" },
    { id: "col-1", name: "Task Name", type: "text" },
    { id: "col-2", name: "Description", type: "text" },
    { id: "col-3", name: "Assigned To", type: "text" },
    { id: "col-4", name: "Status", type: "text" },
    { id: "col-5", name: "Priority", type: "text" },
    { id: "col-6", name: "Due Date", type: "text" },
  ],
  rows: generateFakeRows(10),
});

export default function AirtableStyledTable() {
  const [tables, setTables] = useState<Table[]>([createDefaultTable()]);
  const table = tables[0]!;
  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => containerRef.current!,
    estimateSize: () => 40,
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  const updateCell = (row: number, col: string, value: CellValue) =>
    setTables(prev =>
      prev.map((t, i) =>
        i ? t : { ...t, rows: t.rows.map((r, j) => (j === row ? { ...r, [col]: value } : r)) }
      )
    );

  return (
    <div className="overflow-x-auto">
      <div ref={containerRef} className="relative h-[450px] overflow-auto">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              {table.columns.map(col => (
                <th
                  key={col.id}
                  className="bg-[#F9FAFB] px-4 py-2 text-left text-sm font-semibold text-gray-800 border-b border-gray-200"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {virtualRows.map(v => {
              const r = table.rows[v.index];
              if (!r) return null;
              return (
                <tr key={v.index} className="h-10 border-b border-gray-200 hover:bg-gray-50">
                  {table.columns.map(c => {
                    const cellValue = r[c.id];
                    return (
                      <td
                        key={c.id}
                        className="px-4 py-1.5 text-sm text-gray-900 truncate align-middle"
                      >
                        {isBadge(cellValue) ? (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cellValue.color}`}>
                            {cellValue.label}
                          </span>
                        ) : isAvatar(cellValue) ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">
                              {cellValue.initials}
                            </span>
                            <span className="truncate">{cellValue.name}</span>
                          </span>
                        ) : (
                          <input
                            className="w-full bg-transparent text-sm text-gray-900 truncate outline-none"
                            type="text"
                            value={String(cellValue)}
                            onChange={e => updateCell(v.index, c.id, e.target.value)}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr>
              {table.columns.map(col => (
                <td
                  key={col.id}
                  className="h-10 text-center text-gray-400 cursor-pointer border-t border-gray-200"
                >
                  +
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
