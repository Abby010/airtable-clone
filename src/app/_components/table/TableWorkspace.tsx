"use client";

import { useState } from "react";
import Sidebar from "./BaseSidebar";
import { Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { generateFakeRows } from "../../../fakeData";
import type { TableData, Column } from "./BaseTable";
import Wrapper from "./BaseSecondaryTopbarWrapper";

/* ───────── helpers ───────── */
const makeColumns = (): Column[] => [
  { id: "col-index", name: "", type: "text" },
  { id: "col-1", name: "Task Name", type: "text" },
  { id: "col-2", name: "Description", type: "text" },
  { id: "col-3", name: "Assigned To", type: "text" },
  { id: "col-4", name: "Status", type: "text" },
  { id: "col-5", name: "Priority", type: "text" },
  { id: "col-6", name: "Due Date", type: "text" },
];

const newTable = (name: string): TableData => ({
  id: crypto.randomUUID(),
  name,
  columns: makeColumns(),
  rows: generateFakeRows(4),
});

/* ───────────────── component ───────────────── */
export default function TableWorkspace() {
  const [tables, setTables] = useState<TableData[]>([newTable("Grid view")]);
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");

  const rename = (id: string, name: string) =>
    setTables(arr => arr.map(t => (t.id === id ? { ...t, name } : t)));

  const create = () =>
    setTables(prev => {
      const next = [...prev, newTable(`Grid ${prev.length + 1}`)];
      setActive(next.length - 1);
      return next;
    });

  const tbl = tables[active]!;

  const updateActive = (fn: (t: TableData) => TableData) =>
    setTables(arr => arr.map((t, i) => (i === active ? fn(t) : t)));

  return (
    <>
      <div className="flex flex-col h-screen">
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
        </div>
      </div>

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
