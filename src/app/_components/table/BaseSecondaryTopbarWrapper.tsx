"use client";

import { useCallback, useState, useMemo } from "react";
import Topbar, { type FilterRule } from "./BaseSecondaryTopbar";
import AirtableTable, { type TableData, type CellValue, type Column } from "./BaseTable";

/* helpers */
const lower = (v: unknown): string => String(v ?? "").toLowerCase();

interface Props {
  table: TableData;
  setTable: (t: TableData) => void;
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function Wrapper({ table, setTable, search, onSearch }: Props) {
  /* visibility */
  const [visible, setVisible] = useState<Set<string>>(new Set(table.columns.map(c => c.id)));
  const toggle = (id: string) => {
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /* filter & search & sort */
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(null);

  /* rows after filters and sort */
  const rows = useMemo(() => {
    let r = [...table.rows];

    /* filters */
    filters.forEach(f => {
      r = r.filter(row => {
        const val = row[f.col];
        const txt = lower(val);
        const cmp = lower(f.val);
        switch (f.op) {
          case "contains":
            return txt.includes(cmp);
          case "notcontains":
            return !txt.includes(cmp);
          case "eq":
            return txt === cmp;
          case "gt":
            return Number(val) > Number(f.val);
          case "lt":
            return Number(val) < Number(f.val);
          case "empty":
            return txt === "";
          case "notempty":
            return txt !== "";
          default:
            return true;
        }
      });
    });

    /* sort */
    if (sort) {
      r.sort((a, b) => {
        const res = lower(a[sort.col]).localeCompare(lower(b[sort.col]));
        return sort.dir === "asc" ? res : -res;
      });
    }

    return r;
  }, [table.rows, filters, sort]);

  /* visible columns */
  const visCols = useMemo<Column[]>(
    () => table.columns.filter(c => visible.has(c.id)),
    [table.columns, visible]
  );

  /* commit cell */
  const commit = useCallback((row: number, col: string, val: CellValue) => {
    setTable({
      ...table,
      rows: table.rows.map((r, i) => (i === row ? { ...r, [col]: val } : r)),
    });
  }, [table, setTable]);

  /* small add row/col */
  const addRowSmall = useCallback(() => {
    const blank: Record<string, CellValue> = {};
    table.columns.forEach(c => {
      if (c.id !== "col-index") blank[c.id] = "";
    });
    setTable({ ...table, rows: [...table.rows, blank] });
  }, [table, setTable]);

  const addColSmall = useCallback(() => {
    const id = `col-${Date.now()}`;
    setTable({
      ...table,
      columns: [...table.columns, { id, name: "New Field", type: "text" }],
      rows: table.rows.map(r => ({ ...r, [id]: "" })),
    });
  }, [table, setTable]);

  /* bulk 100k rows */
  const addRowsBulk = useCallback(() => {
    const blank: Record<string, CellValue> = {};
    table.columns.forEach(c => {
      if (c.id !== "col-index") blank[c.id] = "";
    });
    const extra = Array.from({ length: 100000 }, () => ({ ...blank }));
    setTable({ ...table, rows: [...table.rows, ...extra] });
  }, [table, setTable]);

  /* display table */
  const display: TableData = { ...table, columns: visCols, rows };

  /* sort handler toggle */
  const sortHandler = (c: string, d: "asc" | "desc") => {
    if (sort && sort.col === c && sort.dir === d) {
      setSort(null); // undo
    } else {
      setSort({ col: c, dir: d });
    }
  };

  return (
    <>
      <Topbar
        columns={table.columns}
        visible={visible}
        onToggle={toggle}
        onSort={sortHandler}
        activeSort={sort}
        onFilter={setFilters}
        filters={filters}
        onSearch={onSearch}
        onAddRowsBulk={addRowsBulk}
      />
      <AirtableTable
        table={display}
        updateCell={commit}
        addRowSmall={addRowSmall}
        addColSmall={addColSmall}
        search={search}
      />
    </>
  );
}
