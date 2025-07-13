"use client";

import { ChevronDown, Home, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function BaseTopbar() {
  const [baseName] = useState("Spring2024");

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b bg-white text-sm">
      {/* Logo + Base Name */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-400 p-1.5 rounded-md">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-black text-base">{baseName}</div>
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </div>

      {/* Center Tabs */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-gray-600 font-medium text-sm">
        <Tab active>Data</Tab>
        <Tab>Automations</Tab>
        <Tab>Interfaces</Tab>
        <Tab>Forms</Tab>
      </nav>

      {/* Right-side actions */}
      <div className="flex items-center gap-3 ml-auto">
        <RotateCcw className="w-4 h-4 text-gray-500" />
        <button className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded hover:bg-blue-100">
          See what&apos;s new
        </button>
        <button className="text-sm px-4 py-1.5 bg-blue-500 text-black rounded-md hover:bg-blue-600">
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
          : "hover:text-black hover:border-b-2 hover:border-gray-300"
      }`}
    >
      {children}
    </div>
  );
}
