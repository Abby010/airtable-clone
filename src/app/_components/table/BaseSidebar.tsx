import { LayoutGrid, Plus, Search } from "lucide-react";

export default function BaseSidebar() {
  return (
    <aside className="w-60 h-screen border-r border-gray-200 bg-white flex flex-col text-sm px-2 pt-4">
      {/* Create new... */}
      <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded">
        <Plus className="w-4 h-4" />
        <span>Create new…</span>
      </button>

      {/* Find a view */}
      <div className="flex items-center gap-2 px-2 py-2 text-gray-500">
        <Search className="w-4 h-4" />
        <span>Find a view</span>
      </div>

      {/* Active View */}
      <div className="mt-2">
        <button className="w-full flex items-center gap-2 px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">
          <LayoutGrid className="w-4 h-4" />
          Grid view
        </button>
      </div>
    </aside>
  );
}
