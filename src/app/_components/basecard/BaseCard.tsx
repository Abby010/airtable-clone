"use client";

import { Book } from "lucide-react";

type BaseCardProps = {
  layout: "grid" | "list";
  name: string;
};

export default function BaseCard({ layout, name }: BaseCardProps) {
  const isGrid = layout === "grid";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition ${
        isGrid ? "w-80 px-5 py-4" : "w-full px-6 py-3"
      } flex items-center gap-4`}
    >
      <div className="p-3 rounded-xl bg-[#4cc3f1] flex items-center justify-center min-w-[52px] min-h-[52px]">
        <Book size={24} className="text-black" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-gray-900">{name}</span>
        <span className="text-xs text-gray-500">Opened just now</span>
      </div>
    </div>
  );
}
