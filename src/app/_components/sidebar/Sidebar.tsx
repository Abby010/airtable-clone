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

export default function Sidebar({
  collapsed,
  onCreateBase,
}: {
  collapsed: boolean;
  onCreateBase: () => void;
}) {
  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-white flex flex-col justify-between h-screen text-sm border-r border-[#e4e6ea] transition-all duration-200`}
    >
      {/* Top Section */}
      <div>
        <nav className="px-3 pt-4 space-y-1">
          <SidebarItem
            icon={<Home size={16} />}
            label="Home"
            active
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Star size={16} />}
            label="Starred"
            chevron
            info="Your starred bases, interfaces, and workspaces will appear here"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Share2 size={16} />}
            label="Shared"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Users size={16} />}
            label="Workspaces"
            chevron
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1 mt-6">
        <SidebarItem
          icon={<LayoutGrid size={16} />}
          label="Templates and apps"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<AppWindow size={16} />}
          label="Marketplace"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Upload size={16} />}
          label="Import"
          collapsed={collapsed}
        />

        {!collapsed && (
          <button
            onClick={onCreateBase}
            className="w-full h-10 mt-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex justify-center items-center gap-1"
          >
            <Plus size={16} />
            Create
          </button>
        )}
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
  collapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
  active?: boolean;
  info?: string;
  collapsed?: boolean;
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
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && chevron && (
          <ChevronRight size={14} className="text-gray-400" />
        )}
      </div>
      {!collapsed && info && (
        <p className="text-xs text-gray-400 mt-1 ml-6 pr-3 leading-snug">
          {info}
        </p>
      )}
    </div>
  );
}
