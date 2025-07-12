"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function BaseTopbar() {
  return (
    <header className="flex items-center justify-between h-12 px-4 border-b bg-white shadow-sm">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <Image src="/airtable-logo.png" alt="Logo" width={28} height={28} />
        <div className="text-sm font-medium flex items-center gap-1 text-gray-800">
          Spring2024 <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-6 ml-4 text-sm font-medium text-gray-600">
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

function Tab({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
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
