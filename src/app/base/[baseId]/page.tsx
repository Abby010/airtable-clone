"use client";

import { useState } from "react";
import BaseTable from "../../_components/table/BaseTable";
import type { Column, CellValue } from "../../_components/table/BaseTable";

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
  ],
  rows: Array.from({ length: 10 }, () => ({
    "col-1": "",
    "col-2": "",
  })),
};

export default function BasePage() {
  const [table, setTable] = useState<Table>(defaultTable);

  return <BaseTable table={table} setTable={setTable} />;
}
