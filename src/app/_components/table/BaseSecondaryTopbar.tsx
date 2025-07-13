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
import { useState } from "react";

interface Props {
  columns: { id: string; name: string }[];
  onSort: (colId: string, direction: "asc" | "desc") => void;
}

export default function BaseSecondaryTopbar({ columns, onSort }: Props) {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-1.5 bg-blue-50 text-sm border-b border-gray-200">
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

      <div className="flex justify-end px-4 py-2.5 text-sm bg-white border-b border-gray-200">
        <div className="flex items-center gap-6 text-gray-600">
          <Option icon={<EyeOff className="w-4 h-4" />} label="Hide fields" />
          <Option icon={<Filter className="w-4 h-4" />} label="Filter" />
          <Option icon={<LayoutGrid className="w-4 h-4" />} label="Group" />
          <Option
            icon={<SlidersHorizontal className="w-4 h-4" />}
            label="Sort"
            onClick={() => setShowSort(prev => !prev)}
          />
          <Option icon={<Paintbrush className="w-4 h-4" />} label="Color" />
          <Option icon={<Menu className="w-4 h-4" />} label="" />
          <Option icon={<Share2 className="w-4 h-4" />} label="Share and sync" />
          <Search className="w-4 h-4" />
        </div>
      </div>

      {showSort && (
        <SortModal
          columns={columns}
          onClose={() => setShowSort(false)}
          onSort={onSort}
        />
      )}
    </div>
  );
}

function Option({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-gray-600 hover:text-black transition"
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

function SortModal({
  columns,
  onSort,
  onClose,
}: {
  columns: { id: string; name: string }[];
  onSort: (colId: string, direction: "asc" | "desc") => void;
  onClose: () => void;
}) {
  const [selectedCol, setSelectedCol] = useState(columns[1]?.id ?? "");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  return (
    <div className="absolute right-4 top-[100%] mt-2 z-10 w-64 rounded-md bg-white border border-gray-200 shadow-lg p-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Sort by</h3>

      <label className="block text-xs text-gray-500 mb-1">Column</label>
      <select
        value={selectedCol}
        onChange={e => setSelectedCol(e.target.value)}
        className="w-full mb-3 border rounded px-2 py-1 text-sm"
      >
        {columns
          .filter(c => c.id !== "col-index")
          .map(col => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
      </select>

      <label className="block text-xs text-gray-500 mb-1">Direction</label>
      <select
        value={direction}
        onChange={e => setDirection(e.target.value as "asc" | "desc")}
        className="w-full mb-4 border rounded px-2 py-1 text-sm"
      >
        <option value="asc">Ascending (A → Z)</option>
        <option value="desc">Descending (Z → A)</option>
      </select>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSort(selectedCol, direction);
            onClose();
          }}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
