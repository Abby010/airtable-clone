"use client";

import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-4 h-12 bg-white border-b font-inter">
      {/* Logo and Hamburger */}
      <div className="flex items-center gap-3 min-w-[120px]">
        <button className="md:hidden">
          <Menu size={20} className="text-gray-600" />
        </button>
        <Image src="/airtable-logo.png" alt="Airtable" width={40} height={40} />
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-9 pl-10 pr-12 text-sm rounded-full bg-[#f8f9fa] focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <kbd className="absolute right-3 top-2 text-[11px] text-gray-400">⌘ K</kbd>
      </div>

      {/* Notification + Avatar */}
      <div className="flex items-center gap-4 min-w-[72px] justify-end">
        <Bell className="text-gray-500" size={20} />
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
          A
        </div>
      </div>
    </header>
  );
}
