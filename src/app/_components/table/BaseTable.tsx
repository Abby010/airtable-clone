"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { generateFakeRows } from "../../../fakeData";

type ColumnType = "text" | "number";

type Column = {
  id: string;
  name: string;
  type: ColumnType;
};

type Table = {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, string | number>[];
};

function createDefaultTable(): Table {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Table",
    columns: [
      { id: "col-1", name: "Name", type: "text" },
      { id: "col-2", name: "Due Date", type: "text" },
    ],
    rows: generateFakeRows(5),
  };
}

export default function BaseTable() {
  const [tables, setTables] = useState<Table[]>([createDefaultTable()]);
  const [activeTableId, setActiveTableId] = useState<string>(tables[0]?.id ?? "");
  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [newHeaderName, setNewHeaderName] = useState("");

  const parentRef = useRef<HTMLDivElement>(null);
  const activeTable = tables.find((t) => t.id === activeTableId);

  const rowVirtualizer = useVirtualizer({
    count: activeTable?.rows.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  if (!activeTable) return <div className="p-4 text-gray-500">No table selected.</div>;

  function addTable() {
    const newTable = createDefaultTable();
    setTables((prev) => [...prev, newTable]);
    setActiveTableId(newTable.id);
  }

  function addColumn(type: ColumnType) {
    const newCol: Column = {
      id: `col-${crypto.randomUUID()}`,
      name: type === "text" ? "New Text" : "New Number",
      type,
    };
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTableId
          ? {
              ...t,
              columns: [...t.columns, newCol],
              rows: t.rows.map((r) => ({ ...r, [newCol.id]: "" })),
            }
          : t
      )
    );
  }

  function updateCell(rowIdx: number, colId: string, value: string) {
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTableId
          ? {
              ...t,
              rows: t.rows.map((r, i) => (i === rowIdx ? { ...r, [colId]: value } : r)),
            }
          : t
      )
    );
  }

  function renameColumn(colId: string, newName: string) {
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTableId
          ? {
              ...t,
              columns: t.columns.map((c) => (c.id === colId ? { ...c, name: newName } : c)),
            }
          : t
      )
    );
  }

  function add100kRows() {
    const newRows = generateFakeRows(100_000);
    setTables((prev) =>
      prev.map((t) => (t.id === activeTableId ? { ...t, rows: [...t.rows, ...newRows] } : t))
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-300 p-1 rounded-sm text-sm"
          value={activeTableId}
          onChange={(e) => setActiveTableId(e.target.value)}
        >
          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button onClick={addTable} className="border text-sm rounded-sm px-2 py-1 hover:bg-gray-100">
          + Add Table
        </button>
        <button onClick={add100kRows} className="bg-red-500 text-white text-sm rounded-sm px-3 py-1">
          + 100k Rows
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => addColumn("text")} className="bg-blue-500 text-white text-sm px-3 py-1 rounded-sm">
          + Text Column
        </button>
        <button onClick={() => addColumn("number")} className="bg-green-500 text-white text-sm px-3 py-1 rounded-sm">
          + Number Column
        </button>
      </div>

      <div ref={parentRef} className="h-[500px] overflow-auto border border-gray-300 rounded-sm bg-white relative">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          <table className="min-w-full text-sm absolute top-0 left-0 border-separate border-spacing-0">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                {activeTable.columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200"
                  >
                    {editingHeaderId === col.id ? (
                      <input
                        value={newHeaderName}
                        onChange={(e) => setNewHeaderName(e.target.value)}
                        onBlur={() => {
                          renameColumn(col.id, newHeaderName);
                          setEditingHeaderId(null);
                        }}
                        autoFocus
                        className="border p-1 text-sm w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {col.name}
                        <Pencil
                          className="w-4 h-4 text-gray-400 cursor-pointer"
                          onClick={() => {
                            setEditingHeaderId(col.id);
                            setNewHeaderName(col.name);
                          }}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {virtualRows.map((vRow) => {
                const row = activeTable.rows[vRow.index];
                if (!row) return null;
                return (
                  <tr
                    key={vRow.index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                    style={{
                      position: "absolute",
                      top: 0,
                      transform: `translateY(${vRow.start}px)`,
                      height: `${vRow.size}px`,
                      width: "100%",
                    }}
                  >
                    {activeTable.columns.map((col, colIdx) => (
                      <td
                        key={col.id}
                        className={`px-4 py-2.5 text-left text-sm border-b border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                          colIdx === 0 ? "font-medium text-gray-900" : "text-gray-800"
                        }`}
                      >
                        <input
                          type={col.type === "number" ? "number" : "text"}
                          value={row[col.id] ?? ""}
                          onChange={(e) => updateCell(vRow.index, col.id, e.target.value)}
                          className="w-full bg-transparent outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
