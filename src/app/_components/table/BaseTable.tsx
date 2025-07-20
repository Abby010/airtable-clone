"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

/* ─── Shared types ─── */
export type Badge  = { label: string; color: string };
export type Avatar = { initials: string; name: string };
export type CellValue = string | number | boolean | Badge | Avatar;

export interface Column { id: string; name: string; type: "text" | "number" }
export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, CellValue>[];
}

/* ─── Helpers ─── */
const isBadge  = (v: unknown): v is Badge  => typeof v === "object" && !!v && "label"    in v;
const isAvatar = (v: unknown): v is Avatar => typeof v === "object" && !!v && "initials" in v;

/* ─── Editable cell component ─── */
function TextCell({
  value, rowIdx, colId, commit, activateNext,
}: {
  value: CellValue;
  rowIdx: number;
  colId: string;
  commit: (r: number, c: string, v: CellValue) => void;
  activateNext: (nextEl: HTMLElement | null) => void;
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
          const next = (e.currentTarget
            .closest("div[role='cell']")?.nextElementSibling
            ?.querySelector("input") as HTMLInputElement | null);
          (e.target as HTMLInputElement).blur();
          activateNext(next);
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
  search,
}: {
  table: TableData;
  updateCell: (r: number, c: string, v: CellValue) => void;
  addRowSmall: () => void;
  addColSmall: () => void;
  search: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* -------------- active‑cell state -------------- */
  const [active, setActive] = useState<{ row: number; col: string } | null>(null);

  /* helper: commit & keep active until blur finishes */
  const commit = useCallback((r: number, c: string, v: CellValue) => {
    updateCell(r, c, v);
  }, [updateCell]);
  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const insideTable = target.closest("[data-airtable-table]");
    if (!insideTable) {
      setActive(null);
    }
  };

  window.addEventListener("mousedown", handleClickOutside);
  return () => window.removeEventListener("mousedown", handleClickOutside);
}, []);

  /* helper to focus next cell on Tab */
  const focusNext = (el: HTMLElement | null) => {
    el?.focus();
    /* set active state so outline moves immediately */
    const cellDiv = el?.closest("div[role='cell']") as HTMLDivElement | null;
    if (cellDiv?.dataset.row && cellDiv.dataset.col) {
      setActive({ row: +cellDiv.dataset.row, col: cellDiv.dataset.col });
    }
  };

  /* --------- column defs --------- */
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

                const strVal = String(v ?? "").toLowerCase();
        const match = search?.trim().toLowerCase();
        const isMatch = match && strVal.includes(match);
        
        if (id === "col-index") return <span className="text-gray-400">{rIdx + 1}</span>;
        if (isBadge(v))  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${v.color}`}>{v.label}</span>;
          const bgClass = isMatch
    ? row.index === 0 ? "bg-yellow-300" : "bg-yellow-200"
    : "";
        if (isAvatar(v)) return (
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">{v.initials}</span>
                            <span className="truncate">{v.name}</span>
                          </span>);


        const bgColor = isMatch
  ? "bg-yellow-100" // 🌕 Light mustard
  : ""; 
        return (
  <div className={`w-full h-full ${bgColor}`}>
    <TextCell
      value={v}
      rowIdx={rIdx}
      colId={id}
      commit={commit}
      activateNext={focusNext}
    />
  </div>
        );
      },
      size: 150,
    })), [table.columns, commit]);

  /* --------- table instance --------- */
  const rt = useReactTable({
    data: table.rows,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  /* --------- virtualization --------- */
  const virt = useVirtualizer({
    count: table.rows.length,
    getScrollElement: () => scrollRef.current!,
    estimateSize: () => 40,
    overscan: 10,
  });
  const totalH = virt.getTotalSize();

  /* --------------- JSX --------------- */
  return (
    <div className="bg-[#F3F4F6] px-4 py-2 w-full">
<div
  ref={scrollRef}
  data-airtable-table
  className="overflow-auto bg-white border border-gray-200 shadow rounded-lg"
  style={{ height: "80vh" }}
>

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

          {/* data rows (virtual) */}
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
                  {row.getVisibleCells().map((cell, idx) => {
                    const isActive = active?.row === row.index && active?.col === cell.column.id;

                    return (
                      <div
                        key={cell.id}
                        role="cell"
                        data-row={row.index}
                        data-col={cell.column.id}
                        tabIndex={0}
                        onMouseDown={() => setActive({ row: row.index, col: cell.column.id })}
                        className={`
                          px-4 py-1.5 text-sm border-r border-gray-100 flex items-center truncate outline-none
                          ${isActive ? "ring-2 ring-blue-500 ring-offset-0 bg-white z-20" : ""}
                          ${idx===0 ? "sticky left-0 bg-white z-10" : ""}
                          ${idx===1 ? "sticky left-[56px] bg-white z-10" : ""}
                        `}
                        style={{ width: 150 }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                  <div className="w-10 border-r border-gray-100" />
                </div>
              );
            })}
          </div>

          {/* + row strip */}
          <div
            role="row"
            className="h-10 bg-[#F9FAFB] border-t border-gray-200 flex items-center cursor-pointer"
            onClick={addRowSmall}
          >
            <div className="px-4 text-gray-400 select-none">+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
