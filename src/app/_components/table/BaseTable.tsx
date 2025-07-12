"use client";

import React, { useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import clsx from "clsx";
import { faker } from "@faker-js/faker";

const statusColorMap = {
  "To Do": "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-orange-100 text-orange-800",
  Completed: "bg-green-100 text-green-800",
  Blocked: "bg-red-100 text-red-800",
} as const;

const priorityColorMap = {
  Low: "bg-yellow-100 text-yellow-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-pink-100 text-pink-700",
  Critical: "bg-red-600 text-white",
} as const;

type Row = {
  id: string;
  task: string;
  description: string;
  assignedTo: string;
  status: keyof typeof statusColorMap;
  priority: keyof typeof priorityColorMap;
  dueDate: string;
};

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "task",
    header: "Task Name",
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const value = info.getValue() as keyof typeof statusColorMap;
      return (
        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", statusColorMap[value])}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: (info) => {
      const value = info.getValue() as keyof typeof priorityColorMap;
      return (
        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", priorityColorMap[value])}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: (info) => info.getValue() as string,
  },
];

export default function BaseTable() {
  const [data, setData] = useState<Row[]>(() =>
    Array.from({ length: 1000 }).map(() => ({
      id: faker.string.uuid(),
      task: faker.word.words(3),
      description: faker.lorem.sentence(),
      assignedTo: faker.person.fullName(),
      status: faker.helpers.arrayElement(Object.keys(statusColorMap)) as keyof typeof statusColorMap,
      priority: faker.helpers.arrayElement(Object.keys(priorityColorMap)) as keyof typeof priorityColorMap,
      dueDate: faker.date.future().toLocaleDateString(),
    }))
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="p-4">
      <div className="mb-2">
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => {
            const moreRows = Array.from({ length: 100_000 }).map(() => ({
              id: faker.string.uuid(),
              task: faker.word.words(3),
              description: faker.lorem.sentence(),
              assignedTo: faker.person.fullName(),
              status: faker.helpers.arrayElement(Object.keys(statusColorMap)) as keyof typeof statusColorMap,
              priority: faker.helpers.arrayElement(Object.keys(priorityColorMap)) as keyof typeof priorityColorMap,
              dueDate: faker.date.future().toLocaleDateString(),
            }));
            setData((prev) => [...prev, ...moreRows]);
          }}
        >
          Add 100k rows
        </button>
      </div>

      <div
        ref={parentRef}
        className="h-[500px] overflow-y-auto border rounded-md bg-white"
      >
        <table className="min-w-full text-sm border-collapse table-fixed">
          <thead className="bg-[#f8f9fa] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <td colSpan={columns.length} className="relative p-0">
                {virtualItems.map((virtualRow) => {
                  const row = table.getRowModel().rows[virtualRow.index];
                  if (!row) return null;
                  return (
                    <div
                      key={row.id}
                      className="absolute top-0 left-0 w-full"
                      style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                      <tr className="border-b hover:bg-gray-50 flex w-full">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2 text-gray-800 truncate flex-1">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    </div>
                  );
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
