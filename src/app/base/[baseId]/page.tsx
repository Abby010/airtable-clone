// src/app/base/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";

type TableRow = Record<string, string | number>;

export default function BaseTablePage() {
  const { id } = useParams();
  const [data, setData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<ColumnDef<TableRow>[]>([]);

  useEffect(() => {
    const fakeData: TableRow[] = Array.from({ length: 20 }).map(() => ({
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 65 }),
    }));

    setData(fakeData);
    setColumns([
      { accessorKey: "name", header: "Name" },
      { accessorKey: "age", header: "Age" },
    ]);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Base: {id}</h1>
      <div className="border rounded">
        <table className="min-w-full table-fixed border-separate border-spacing-y-1">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-4 py-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-t">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
