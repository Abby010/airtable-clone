"use client";

import clsx from "clsx";
import { useState } from "react";
import { Pencil } from "lucide-react";

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
      { id: "col-1", name: "Task", type: "text" },
      { id: "col-2", name: "Due", type: "text" },
    ],
    rows: Array.from({ length: 4 }, () => ({
      "col-1": "",
      "col-2": "",
    })),
  };
}

export default function BaseTable() {
  const [tables, setTables] = useState<Table[]>([createDefaultTable()]);
  const [activeTableId, setActiveTableId] = useState<string>(tables[0]!.id);
  const [editingHeaderId, setEditingHeaderId] = useState<string | null>(null);
  const [newHeaderName, setNewHeaderName] = useState("");

  const activeTable = tables.find((t) => t.id === activeTableId)!;

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
              rows: t.rows.map((r, i) =>
                i === rowIdx ? { ...r, [colId]: value } : r
              ),
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
              columns: t.columns.map((c) =>
                c.id === colId ? { ...c, name: newName } : c
              ),
            }
          : t
      )
    );
  }

  function addTable() {
    const newTable = createDefaultTable();
    setTables((prev) => [...prev, newTable]);
    setActiveTableId(newTable.id);
  }

  return (
    <div className="p-4 space-y-4">
      {/* Table Switcher */}
      <div className="flex items-center gap-2">
        <select
          className="border p-1 rounded"
          value={activeTableId}
          onChange={(e) => setActiveTableId(e.target.value)}
        >
          {tables.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={addTable}
          className="text-sm bg-gray-200 px-2 py-1 rounded"
        >
          + Add Table
        </button>
      </div>

      {/* Column Add */}
      <div className="flex gap-2">
        <button
          onClick={() => addColumn("text")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Text Column
        </button>
        <button
          onClick={() => addColumn("number")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Number Column
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {activeTable.columns.map((col) => (
                <th key={col.id} className="px-3 py-2 text-left text-gray-700 font-semibold relative">
                  {editingHeaderId === col.id ? (
                    <input
                      className="w-full border p-1 text-sm"
                      value={newHeaderName}
                      onChange={(e) => setNewHeaderName(e.target.value)}
                      onBlur={() => {
                        renameColumn(col.id, newHeaderName);
                        setEditingHeaderId(null);
                      }}
                      autoFocus
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
            {activeTable.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b hover:bg-gray-50">
                {activeTable.columns.map((col) => (
                  <td key={col.id} className="px-3 py-2">
                    <input
                      className="w-full bg-transparent outline-none"
                      type={col.type === "number" ? "number" : "text"}
                      value={row[col.id] ?? ""}
                      onChange={(e) => updateCell(rowIdx, col.id, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
