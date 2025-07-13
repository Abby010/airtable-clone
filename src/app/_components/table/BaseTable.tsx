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
      { id: "col-checkbox", name: "", type: "text" },
      { id: "col-1", name: "Task Name", type: "text" },
      { id: "col-2", name: "Description", type: "text" },
      { id: "col-3", name: "Assigned To", type: "text" },
      { id: "col-4", name: "Status", type: "text" },
      { id: "col-5", name: "Priority", type: "text" },
      { id: "col-6", name: "Due Date", type: "text" },
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

  return (
    <div className="overflow-x-auto border-t border-gray-200">
      <div ref={parentRef} className="h-[500px] overflow-auto">
        <table className="min-w-full text-sm border-collapse border border-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              {activeTable.columns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2 h-10 text-left text-xs font-medium text-gray-600 border border-gray-200 whitespace-nowrap"
                >
                  {col.id === "col-checkbox" ? (
                    <input type="checkbox" disabled className="w-4 h-4" />
                  ) : editingHeaderId === col.id ? (
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
              <th className="px-2 text-gray-400 font-medium border border-gray-200 text-center">+</th>
            </tr>
          </thead>
          <tbody>
            {virtualRows.map((vRow) => {
              const row = activeTable.rows[vRow.index];
              if (!row) return null;
              return (
                <tr key={vRow.index} className="h-10">
                  {activeTable.columns.map((col, colIdx) => (
                    <td
                      key={col.id}
                      className={`px-3 py-2 h-10 text-left border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                        colIdx === 0 ? "text-center" : "text-gray-800"
                      }`}
                    >
                      {col.id === "col-checkbox" ? (
                        <input type="checkbox" className="w-4 h-4" />
                      ) : (
                        <input
                          type={col.type === "number" ? "number" : "text"}
                          value={row[col.id] ?? ""}
                          onChange={(e) => updateCell(vRow.index, col.id, e.target.value)}
                          className="w-full bg-transparent outline-none"
                        />
                      )}
                    </td>
                  ))}
                  <td className="text-gray-400 text-center border border-gray-200">+</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
