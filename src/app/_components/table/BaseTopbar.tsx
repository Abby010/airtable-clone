"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BaseTopbar() {
  const [baseName] = useState("Spring2024");

  return (
    <header className="flex items-center justify-between h-10 px-4 border-b bg-white text-sm">
      {/* Tabs */}
      <nav className="flex items-center gap-6 text-gray-600 font-medium">
        <Tab active>Data</Tab>
        <Tab>Automations</Tab>
        <Tab>Interfaces</Tab>
        <Tab>Forms</Tab>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded hover:bg-blue-100">
          See what&apos;s new
        </button>
        <button className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm">
          Share
        </button>
      </div>
    </header>
  );
}

function Tab({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`pb-1 cursor-pointer ${
        active
          ? "text-black border-b-2 border-blue-600"
          : "hover:text-black hover:border-b-2 hover:border-gray-200"
      }`}
    >
      {children}
    </div>
  );
}
