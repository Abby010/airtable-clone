"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function Topbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm">
      {/* Logo and Menu */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-1">
          <Image src="/logo.svg" alt="Airtable" width={120} height={24} />
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-10 py-2 text-sm border rounded-md bg-[#f8f9fa] focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <kbd className="absolute right-3 top-2.5 text-gray-400 text-xs">⌘K</kbd>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3">
        <Bell size={18} className="text-gray-500" />
      </div>
    </header>
  );
}
