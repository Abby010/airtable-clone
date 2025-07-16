"use client";

import { useCallback } from "react";
import BaseSecondaryTopbar from "./BaseSecondaryTopbar";
import type { Column, CellValue } from "./BaseTable";

/* ───── Support order maps ───── */
const priorityOrder = ["high", "medium", "low"];
const statusOrder   = ["todo", "blocked", "completed"];

/* ───── Types ───── */
interface Table { id: string; name: string; columns: Column[]; rows: Record<string, CellValue>[]; }
interface Props  { table: Table; setTable: (t: Table) => void; onAddRows: () => void; }

export default function BaseSecondaryTopbarWrapper({ table, setTable, onAddRows }: Props) {
  const handleSort = useCallback(
    (colId: string, dir: "asc" | "desc") => {
      if (colId === "col-index") return;

      const rowsCopy = [...table.rows];
      /* quick numeric check */
      const isNumeric = rowsCopy.every(r => !isNaN(Number(r[colId])) && r[colId] !== "");

      const sorted = rowsCopy.sort((a, b) => {
        const aVal = a[colId];
        const bVal = b[colId];

        /* numeric */
        if (isNumeric) {
          const res = Number(aVal) - Number(bVal);
          return dir === "asc" ? res : -res;
        }

        /* priority */
        const lower = (v: unknown) => String(v ?? "").toLowerCase();
        if (priorityOrder.includes(lower(aVal)) && priorityOrder.includes(lower(bVal))) {
          const res = priorityOrder.indexOf(lower(aVal)) - priorityOrder.indexOf(lower(bVal));
          return dir === "asc" ? res : -res;
        }

        /* status */
        if (statusOrder.includes(lower(aVal)) && statusOrder.includes(lower(bVal))) {
          const res = statusOrder.indexOf(lower(aVal)) - statusOrder.indexOf(lower(bVal));
          return dir === "asc" ? res : -res;
        }

        /* fallback alphabetical */
        const res = lower(aVal).localeCompare(lower(bVal));
        return dir === "asc" ? res : -res;
      });

      setTable({ ...table, rows: sorted });
    },
    [table, setTable],
  );

  return (
    <BaseSecondaryTopbar
      columns={table.columns}
      onSort={handleSort}
      onAddRows={onAddRows}
    />
  );
}
