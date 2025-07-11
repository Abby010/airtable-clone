// src/app/_components/basecard/BaseCard.tsx
"use client";

import { Book } from "lucide-react";

export default function BaseCard() {
  return (
    <div className="bg-white border rounded-lg px-4 py-3 flex items-center gap-4 w-80 shadow-sm hover:shadow transition">
      <div className="bg-blue-100 p-2 rounded-md">
        <Book size={24} className="text-blue-600" />
      </div>
      <div>
        <div className="font-semibold text-sm">Spring2024</div>
        <div className="text-xs text-gray-500">Opened 11 months ago</div>
      </div>
    </div>
  );
}
