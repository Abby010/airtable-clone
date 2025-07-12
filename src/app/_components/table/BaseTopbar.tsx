"use client";

import { ChevronDown } from "lucide-react"; // removed Clock
import Image from "next/image";

export default function BaseTopbar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm">
      {/* Left: Logo + Base Title */}
      <div className="flex items-center gap-3">
        <Image src="/airtable-icon.svg" alt="Logo" width={28} height={28} />
        <div className="text-sm font-medium flex items-center gap-1">
          Spring2024 <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>

      {/* Middle Tabs */}
      <div className="flex items-center gap-6 ml-4 text-sm font-medium text-gray-600">
        <div className="text-black border-b-2 border-blue-600 pb-1">Data</div>
        <div>Automations</div>
        <div>Interfaces</div>
        <div>Forms</div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded">
          See what&apos;s new
        </button>
        <button className="text-sm px-4 py-1.5 bg-blue-500 text-white rounded shadow-sm">
          Share
        </button>
      </div>
    </div>
  );
}
