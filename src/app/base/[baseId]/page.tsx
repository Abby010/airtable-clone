"use client";

import { useState } from "react";
import BaseTable from "../../_components/table/BaseTable";
import BaseSecondaryTopbarWrapper from "../../_components/table/BaseSecondaryTopbarWrapper";
import type { Column, CellValue } from "../../_components/table/BaseTable";
import { generateFakeRows } from "../../../fakeData";

interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, CellValue>[];
}

const defaultTable: Table = {
  id: "1",
  name: "Untitled Table",
  columns: [
    { id: "col-index", name: "", type: "text" },
    { id: "col-1", name: "Task Name", type: "text" },
    { id: "col-2", name: "Description", type: "text" },
    { id: "col-3", name: "Assigned To", type: "text" },
    { id: "col-4", name: "Status", type: "text" },
    { id: "col-5", name: "Priority", type: "text" },
    { id: "col-6", name: "Due Date", type: "text" },
  ],
  rows: generateFakeRows(4),
};

export default function BasePage() {
  const [table, setTable] = useState<Table>(defaultTable);

  const handleAddRows = () => {
    const newRows = generateFakeRows(100000);
    setTable(prev => ({
      ...prev,
      rows: [...prev.rows, ...newRows],
    }));
  };

  return (
    <>
      <BaseSecondaryTopbarWrapper
        columns={table.columns}
        onAddRows={handleAddRows}
      />
      <BaseTable table={table} setTable={setTable} />
    </>
  );
}
