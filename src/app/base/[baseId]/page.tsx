// src/app/base/[baseId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import BaseTable from "~/app/_components/table/BaseTable";

export default function BaseTablePage() {
  const { baseId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Base: {baseId}</h1>
      <BaseTable />
    </div>
  );
}
