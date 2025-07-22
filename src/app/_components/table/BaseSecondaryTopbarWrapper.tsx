"use client";

import { useState, useMemo } from "react";
import Topbar, { type FilterRule } from "./BaseSecondaryTopbar";
import AirtableTable, { type TableData, type CellValue, type Column } from "./BaseTable";
import { api } from "../../../trpc/react";

/* helpers */
// Fix lower to avoid any and unsafe member access
const lower = (v: unknown): string => {
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v).toLowerCase();
  if (typeof v === "object" && v !== null) {
    if ('label' in v && typeof (v as { label: unknown }).label === 'string') {
      return ((v as { label: string }).label).toLowerCase();
    }
    if ('name' in v && typeof (v as { name: unknown }).name === 'string') {
      return ((v as { name: string }).name).toLowerCase();
    }
  }
  return "";
};

function isStorable(v: unknown): v is string | number | boolean {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

interface Props {
  table: TableData;
  setTable: (t: TableData) => void;
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function Wrapper({ table, setTable: _setTable, search, onSearch, fetchNextPage, hasNextPage, isFetching }: Props & { fetchNextPage?: () => void; hasNextPage?: boolean; isFetching?: boolean }) {
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

  // Mutations
  const addRow = api.row.create.useMutation();
  const addCol = api.column.create.useMutation();
  const updateCell = api.cell.update.useMutation();
  // Remove unused: setTable, rows, addRowsBulk, toCellValue

  // Add row handler
  const handleAddRow = () => {
    addRow.mutate({ tableId: table.id });
  };
  

  // Add column handler
  const handleAddCol = () => {
    addCol.mutate({
      tableId: table.id,
      name: "New Field",
      type: "text",
      order: table.columns.length,
    });
  };

  // Edit cell handler
  const handleUpdateCell = (rowIdx: number, colId: string, val: CellValue) => {
    const row = table.rows[rowIdx];
    const cellId = row?.[`${colId}_cellId`];
    if (typeof cellId === "string" && isStorable(val)) {
      const payload: { id: string; value: string } = {
        id: cellId,
        value: String(val),
      };
      updateCell.mutate(payload);
    } else {
      console.warn("Invalid value type for updateCell:", val);
    }
  };
  
  const handleAddRowsBulk = () => {
    // TODO: Implement a bulk row creation endpoint for performance
    // For now, just call addRow 100k times (not recommended for prod)
    // addRowsBulk.mutate({ tableId: table.id, count: 100000 });
  };

  /* display table */
  const sanitizedRows = rows.map((row) => {
    const newRow: Record<string, CellValue> = {};
  
    for (const key in row) {
      const raw = row[key];
  
      if (key.endsWith("_cellId")) {
        newRow[key] = typeof raw === "string" ? raw : "";
      } else {
        newRow[key] = isStorable(raw) ? raw : "";
      }
    }
  
    return newRow;
  });
  
  const display: TableData = { ...table, columns: visCols, rows: sanitizedRows };
  

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
        onAddRowsBulk={handleAddRowsBulk}
      />
      <AirtableTable
        table={display}
        updateCell={handleUpdateCell}
        addRowSmall={handleAddRow}
        addColSmall={handleAddCol}
        search={search}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
      />
      {(addRow.isPending || addCol.isPending || updateCell.isPending) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-lg">Saving...</div>
        </div>
      )}
    </>
  );
}
