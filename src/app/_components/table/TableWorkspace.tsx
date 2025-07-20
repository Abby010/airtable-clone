"use client";

import { useState } from "react";
import Topbar   from "./BaseSecondaryTopbar";
import Sidebar  from "./BaseSidebar";
import Table    from "./BaseTable";
import { Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { generateFakeRows } from "../../../fakeData";
import type { TableData, CellValue, Column } from "./BaseTable";
import type { FilterRule } from "./BaseSecondaryTopbar";
import Wrapper from "./BaseSecondaryTopbarWrapper";

/* ───────── helpers ───────── */
const makeColumns = (): Column[] => [
  { id: "col-index", name: "",            type: "text" },
  { id: "col-1",     name: "Task Name",   type: "text" },
  { id: "col-2",     name: "Description", type: "text" },
  { id: "col-3",     name: "Assigned To", type: "text" },
  { id: "col-4",     name: "Status",      type: "text" },
  { id: "col-5",     name: "Priority",    type: "text" },
  { id: "col-6",     name: "Due Date",    type: "text" },
];

const newTable = (name: string): TableData => ({
  id: crypto.randomUUID(),
  name,
  columns: makeColumns(),
  rows: generateFakeRows(4),
});

/* ───────────────── component ───────────────── */
export default function TableWorkspace() {
  /* multiple views (grids) */
  const [tables, setTables] = useState<TableData[]>([newTable("Grid view")]);
  const [active, setActive] = useState(0);

  /* sidebar actions */
  const rename = (id: string, name: string) =>
    setTables(arr => arr.map(t => (t.id === id ? { ...t, name } : t)));

  const create = () =>
    setTables(prev => {
      const next = [...prev, newTable(`Grid ${prev.length + 1}`)];
      setActive(next.length - 1);
      return next;
    });

  /* per‑view UI state */
  const [visible, setVisible] = useState<Set<string>>(
    () => new Set(makeColumns().map(c => c.id)),
  );
  const toggleVis = (id: string) =>
    setVisible(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [search , setSearch ] = useState("");
  const [sort   , setSort   ] = useState<{ col: string; dir: "asc" | "desc" } | null>(null);

  /* helpers bound to the active table */
  const tbl = tables[active]!;   //  ← non‑null assertion silences “possibly undefined”

  const updateActive = (fn: (t: TableData) => TableData) =>
    setTables(arr => arr.map((t, i) => (i === active ? fn(t) : t)));

  const updateCell = (r: number, c: string, v: CellValue) =>
    updateActive(t => ({
      ...t,
      rows: t.rows.map((row, i) => (i === r ? { ...row, [c]: v } : row)),
    }));

  const addRowSmall = () =>
    updateActive(t => {
      const blank: Record<string, CellValue> = {};
      t.columns.forEach(c => c.id !== "col-index" && (blank[c.id] = ""));
      return { ...t, rows: [...t.rows, blank] };
    });

  const addColSmall = () =>
    updateActive(t => {
      const id = `col-${Date.now()}`;
      return {
        ...t,
        columns: [...t.columns, { id, name: "New Field", type: "text" }],
        rows: t.rows.map(r => ({ ...r, [id]: "" })),
      };
    });

  const add100k = () =>
    updateActive(t => {
      const blank: Record<string, CellValue> = {};
      t.columns.forEach(c => c.id !== "col-index" && (blank[c.id] = ""));
      const extra = Array.from({ length: 100_000 }, () => ({ ...blank }));
      return { ...t, rows: [...t.rows, ...extra] };
    });

  /* ───────── render ───────── */
  return (
    <>
      {/* full‑height column layout */}
      <div className="flex flex-col h-screen">
        {/* secondary top‑bar: full width */}
        {/* <Topbar
          columns={tbl.columns}
          visible={visible}
          onToggle={toggleVis}
          onSort={(c, d) => setSort(s => (s && s.col === c && s.dir === d ? null : { col: c, dir: d }))}
          activeSort={sort}
          onFilter={setFilters}
          filters={filters}
          onSearch={setSearch}
          onAddRowsBulk={add100k}
        /> */}

        {/* row underneath: sidebar + grid */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            views={tables.map(t => ({ id: t.id, name: t.name }))}
            activeId={tbl.id}
            onSelect={id => setActive(tables.findIndex(t => t.id === id))}
            onRename={rename}
            onCreate={create}
          />

            <div className="flex-1 overflow-hidden">
  <Wrapper
    table={tbl}
    setTable={t => updateActive(() => t)}
      search={search}
  onSearch={setSearch}
  />
</div>

          {/* <div className="flex-1 overflow-hidden">
            <Table
              table={tbl}
              updateCell={updateCell}
              addRowSmall={addRowSmall}
              addColSmall={addColSmall}
              search={search}
            />
          </div> */}
        </div>
      </div>

      {/* floating “Add” button */}
      <AddGridFAB onCreate={create} />
    </>
  );
}

/* ───── Floating FAB + modal ───── */
function AddGridFAB({ onCreate }: { onCreate: () => void }) {
  const [open, setOpen] = useState(false);

  const modal =
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={e => e.stopPropagation()}
          className="w-[420px] rounded-lg bg-white p-6 space-y-4 shadow-xl"
        >
          <h2 className="text-lg font-semibold">Add new view</h2>
          <button
            onClick={() => {
              onCreate();
              setOpen(false);
            }}
            className="w-full py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Another grid</span>
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-[68px] bottom-6 z-40 w-12 h-12 bg-blue-600 text-white rounded-full
                   flex items-center justify-center shadow-lg hover:bg-blue-700"
        title="Add view"
      >
        <Plus />
      </button>
      {modal}
    </>
  );
}
