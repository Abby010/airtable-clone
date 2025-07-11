"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import BaseCard from "./BaseCard";

export default function BaseCardSection({ bases }: { bases: string[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <section className="mt-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Opened anytime</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout("list")}
            className={`rounded-full p-1.5 ${layout === "list" ? "bg-gray-200" : ""}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`rounded-full p-1.5 ${layout === "grid" ? "bg-gray-200" : ""}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        {bases.map((base, i) => (
          <BaseCard key={i} layout={layout} name={base} />
        ))}
      </div>
    </section>
  );
}
