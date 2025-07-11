"use client";

import {
  Home,
  Star,
  Share2,
  Users,
  LayoutGrid,
  AppWindow,
  Upload,
  Plus,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white hidden md:flex flex-col justify-between h-screen text-sm font-inter">
      {/* Top Section */}
      <div>
        <nav className="px-3 pt-4 space-y-1">
          <SidebarItem icon={<Home size={16} />} label="Home" active />
          <SidebarItem
            icon={<Star size={16} />}
            label="Starred"
            chevron
            info="Your starred bases, interfaces, and workspaces will appear here"
          />
          <SidebarItem icon={<Share2 size={16} />} label="Shared" />
          <SidebarItem icon={<Users size={16} />} label="Workspaces" chevron />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1 mt-6">
        <SidebarItem icon={<LayoutGrid size={16} />} label="Templates and apps" />
        <SidebarItem icon={<AppWindow size={16} />} label="Marketplace" />
        <SidebarItem icon={<Upload size={16} />} label="Import" />

        <button className="w-full h-10 mt-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex justify-center items-center gap-1">
          <Plus size={16} />
          Create
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  chevron = false,
  active = false,
  info = "",
}: {
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
  active?: boolean;
  info?: string;
}) {
  return (
    <div
      className={`px-2 py-2.5 rounded cursor-pointer ${
        active
          ? "bg-[#e4e7ec] font-semibold text-black"
          : "hover:bg-[#f1f3f5] text-gray-700"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        {chevron && <ChevronRight size={14} className="text-gray-400" />}
      </div>
      {info && (
        <p className="text-xs text-gray-400 mt-1 ml-6 pr-3 leading-snug">
          {info}
        </p>
      )}
    </div>
  );
}
