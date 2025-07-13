"use client";

import {
  EyeOff,
  Filter,
  LayoutGrid,
  SlidersHorizontal,
  Paintbrush,
  Menu,
  Search,
  Share2,
} from "lucide-react";

export default function BaseSecondaryTopbar() {
  return (
    <div className="border-b">
      {/* Upper Half (light blue background) */}
      <div className="flex items-center justify-between px-4 py-1 bg-blue-50 text-sm">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Mentee</span>
          <span className="text-gray-400">▾</span>
          <span className="text-gray-300">|</span>
          <button className="text-blue-600 text-xs hover:underline">
            + Add or import
          </button>
        </div>
        <div className="text-gray-600 text-sm">Tools ▾</div>
      </div>

      {/* Lower Half (options bar) */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <Option icon={<EyeOff className="w-4 h-4" />} label="Hide fields" />
          <Option icon={<Filter className="w-4 h-4" />} label="Filter" />
          <Option icon={<LayoutGrid className="w-4 h-4" />} label="Group" />
          <Option icon={<SlidersHorizontal className="w-4 h-4" />} label="Sort" />
          <Option icon={<Paintbrush className="w-4 h-4" />} label="Color" />
          <Option icon={<Menu className="w-4 h-4" />} label="" />
        </div>
        <div className="flex items-center gap-4">
          <Option icon={<Share2 className="w-4 h-4" />} label="Share and sync" />
          <Search className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

function Option({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 text-gray-600 hover:text-black transition">
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
