"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

/* ──────── Types ──────── */
type Badge = { label: string; color: string };
type Avatar = { initials: string; name: string };
export type CellValue = string | number | boolean | Badge | Avatar;
export type ColumnType = "text" | "number";
export type { Column };

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

interface AirtableStyledTableProps {
  table: Table;
  setTable: (table: Table) => void;
}

const isBadge = (v: unknown): v is Badge =>
  typeof v === "object" && v !== null && "label" in v && "color" in v;
const isAvatar = (v: unknown): v is Avatar =>
  typeof v === "object" && v !== null && "initials" in v && "name" in v;

export default function AirtableStyledTable({ table, setTable }: AirtableStyledTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => containerRef.current!,
    estimateSize: () => 40,
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  const updateCell = (row: number, col: string, value: CellValue) => {
    const updatedRows = table.rows.map((r, i) =>
      i === row ? { ...r, [col]: value } : r
    );
    setTable({ ...table, rows: updatedRows });
  };

  const addRow = () => {
    const blank: Record<string, CellValue> = {};
    for (const c of table.columns)
      if (c.id !== "col-index") blank[c.id] = "";
    setTable({ ...table, rows: [...table.rows, blank] });
  };

  return (
    <div className="relative bg-[#F3F4F6] min-h-screen w-full py-2 px-4">
      <div ref={containerRef} className="overflow-auto rounded-lg bg-white shadow">
        <table className="min-w-full table-fixed border border-gray-200">
          <thead>
            <tr>
              {table.columns.map(col => (
                <th
                  key={col.id}
                  className="bg-[#F9FAFB] px-4 py-2 text-left text-sm font-semibold text-gray-800 border border-gray-200 select-none"
                >
                  {col.id === "col-index" ? (
                    <input type="checkbox" disabled className="h-4 w-4" />
                  ) : (
                    col.name
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {virtualRows.map(v => {
              const r = table.rows[v.index];
              if (!r) return null;
              return (
                <tr key={v.index} className="h-10 hover:bg-gray-50">
                  {table.columns.map(c => {
                    const val = r[c.id];
                    return (
                      <td
                        key={c.id}
                        className="px-4 py-1.5 text-sm text-gray-900 truncate align-middle border border-gray-200"
                      >
                        {c.id === "col-index" ? (
                          <span className="text-gray-400">{v.index + 1}</span>
                        ) : isBadge(val) ? (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${val.color}`}>
                            {val.label}
                          </span>
                        ) : isAvatar(val) ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">
                              {val.initials}
                            </span>
                            <span className="truncate">{val.name}</span>
                          </span>
                        ) : (
                          <input
                            className="w-full bg-transparent text-sm text-gray-900 truncate outline-none"
                            type="text"
                            value={String(val ?? "")}
                            onChange={e => updateCell(v.index, c.id, e.target.value)}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr onClick={addRow} className="cursor-pointer bg-[#F9FAFB]">
              {table.columns.map((col, idx) => (
                <td
                  key={col.id}
                  className={`h-10 text-center text-gray-400 ${idx === 0 ? "" : "border-none"}`}
                >
                  {idx === 0 ? " + " : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
