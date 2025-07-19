"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

/* ─── Shared types (exported) ─── */
export type Badge  = { label: string; color: string };
export type Avatar = { initials: string; name: string };
export type CellValue = string | number | boolean | Badge | Avatar;
export type ColumnType = "text" | "number";

export interface Column { id: string; name: string; type: ColumnType }
export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, CellValue>[];
}

/* ─── Helpers ─── */
const isBadge  = (v: unknown): v is Badge  => typeof v === "object" && !!v && "label" in v;
const isAvatar = (v: unknown): v is Avatar => typeof v === "object" && !!v && "initials" in v;

/* ─── Editable cell ─── */
function TextCell({
  value, rowIdx, colId, commit,
}: {
  value: CellValue;
  rowIdx: number;
  colId: string;
  commit: (r: number, c: string, v: CellValue) => void;
}) {
  const [local, setLocal] = useState(String(value ?? ""));

  return (
    <input
      className="w-full bg-transparent text-sm outline-none truncate"
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => commit(rowIdx, colId, local)}
      onKeyDown={e => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Tab") {
          e.preventDefault();
          (e.currentTarget
            .closest("div[role='cell']")?.nextElementSibling
            ?.querySelector("input") as HTMLInputElement | null)?.focus();
        }
      }}
    />
  );
}

/* ─── Main table ─── */
export default function AirtableTable({
  table,
  updateCell,
  addRowSmall,
  addColSmall,
}: {
  table: TableData;
  updateCell: (r: number, c: string, v: CellValue) => void;
  addRowSmall: () => void;
  addColSmall: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* column defs depend only on structure */
  const colDefs = useMemo<ColumnDef<Record<string, CellValue>>[]>(() =>
    table.columns.map(({ id, name }) => ({
      id,
      accessorFn: row => row[id],
      header: () =>
        id === "col-index"
          ? <input type="checkbox" disabled className="h-4 w-4" />
          : name,
      cell: ({ getValue, row }) => {
        const v    = getValue<CellValue>();
        const rIdx = row.index;
        if (id === "col-index") return <span className="text-gray-400">{rIdx + 1}</span>;
        if (isBadge(v))  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${v.color}`}>{v.label}</span>;
        if (isAvatar(v)) return (
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">{v.initials}</span>
                            <span className="truncate">{v.name}</span>
                          </span>);
        return <TextCell value={v} rowIdx={rIdx} colId={id} commit={updateCell} />;
      },
      size: 150,
    })), [table.columns, updateCell]);

  const rt = useReactTable({
    data: table.rows,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  /* virtualization */
  const virt = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => scrollRef.current!,
    estimateSize: () => 40,
    overscan: 10,
  });
  const totalH = virt.getTotalSize();

  /* UI */
  return (
    <div className="bg-[#F3F4F6] px-4 py-2 w-full">
      <div ref={scrollRef} className="overflow-auto bg-white border border-gray-200 shadow rounded-lg" style={{ height: "80vh" }}>
        <div role="table" className="min-w-max w-full">

          {/* header */}
          {(() => {
            const hg = rt.getHeaderGroups()[0];
            if (!hg) return null;
            return (
              <div role="row" className="flex bg-[#F9FAFB] border-b border-gray-200 sticky top-0 z-20">
                {hg.headers.map((h, idx) => (
                  <div
                    key={h.id}
                    role="columnheader"
                    className={`
                      px-4 py-2 text-sm font-semibold border-r border-gray-200 flex items-center whitespace-nowrap
                      ${idx===0 ? "sticky left-0 bg-[#F9FAFB] z-20" : ""}
                      ${idx===1 ? "sticky left-[56px] bg-[#F9FAFB] z-20" : ""}
                    `}
                    style={{ width: 150 }}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </div>
                ))}
                <div
                  role="columnheader"
                  onClick={addColSmall}
                  className="w-10 text-lg font-bold text-gray-400 hover:text-black flex items-center justify-center cursor-pointer border-r border-gray-200 bg-[#F9FAFB]"
                >+</div>
              </div>
            );
          })()}

          {/* data rows */}
          <div style={{ position: "relative", height: totalH }}>
            {virt.getVirtualItems().map(vr => {
              const row = rt.getRowModel().rows[vr.index];
              if (!row) return null;
              return (
                <div
                  key={row.id}
                  role="row"
                  className="absolute left-0 right-0 flex border-b border-gray-100 hover:bg-gray-50"
                  style={{ transform: `translateY(${vr.start}px)`, height: vr.size }}
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <div
                      role="cell"
                      key={cell.id}
                      className={`
                        px-4 py-1.5 text-sm border-r border-gray-100 flex items-center truncate
                        focus-within:ring-2 focus-within:ring-blue-500
                        ${idx===0 ? "sticky left-0 bg-white z-10" : ""}
                        ${idx===1 ? "sticky left-[56px] bg-white z-10" : ""}
                      `}
                      style={{ width: 150 }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                  <div className="w-10 border-r border-gray-100" />
                </div>
              );
            })}
          </div>

          {/* + row strip */}
          <div role="row" className="h-10 bg-[#F9FAFB] border-t border-gray-200 flex items-center cursor-pointer" onClick={addRowSmall}>
            <div className="px-4 text-gray-400 select-none">+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
