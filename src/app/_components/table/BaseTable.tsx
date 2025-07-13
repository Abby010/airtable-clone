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
      </div>

      <div ref={parentRef} className="h-[500px] overflow-auto border border-gray-300 rounded-sm bg-white relative">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          <table className="min-w-full text-sm absolute top-0 left-0 border-separate border-spacing-0">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                {activeTable.columns.map((col, index) => (
                  <th
                    key={col.id}
                    className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200"
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
                <th className="w-8 px-2 text-gray-400 text-sm">+</th>
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
                    <td className="text-gray-400 text-center">+</td>
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
