"use client";

import { useState } from "react";
import { faker } from "@faker-js/faker";

type Column = { id: string; label: string };
type Row = { id: string; [key: string]: string };

export default function BaseTable() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "task", label: "Task Name" },
    { id: "description", label: "Description" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "dueDate", label: "Due Date" },
  ]);

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 5 }).map(() => ({
      id: faker.string.uuid(),
      task: faker.word.words(3),
      description: faker.lorem.sentence(),
      assignedTo: faker.person.fullName(),
      status: faker.helpers.arrayElement(["To Do", "In Progress", "Completed", "Blocked"]),
      priority: faker.helpers.arrayElement(["High", "Medium", "Low", "Critical"]),
      dueDate: faker.date.future().toLocaleDateString(),
    }))
  );

  return (
    <div className="overflow-auto border rounded-md bg-white">
      <table className="min-w-full text-sm border-collapse table-fixed">
        <thead className="bg-[#f8f9fa] border-b">
          <tr>
            <th className="w-12 px-2 py-3 text-left text-gray-500">#</th>
            {columns.map((col) => (
              <th key={col.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
              {columns.map((col) => (
                <td key={col.id} className="px-4 py-2 text-gray-800 truncate">
                  {row[col.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
