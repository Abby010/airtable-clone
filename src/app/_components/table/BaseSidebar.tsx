import { Home, HelpCircle, Bell, LayoutGrid } from "lucide-react";

export default function BaseSidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col">
      {/* Base Title */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <div className="bg-blue-500 rounded-lg p-2">
          <Home className="text-white w-5 h-5" />
        </div>
        <div className="font-semibold text-base">Spring2024</div>
        <ChevronIcon />
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 border-y text-gray-700">
        <span className="font-medium">Mentee</span>
        <ChevronIcon small />
        <span className="text-gray-300">|</span>
        <button className="text-blue-600 font-medium hover:underline text-xs">
          + Add or import
        </button>
      </div>

      {/* Current View Label */}
      <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
        <LayoutGrid className="w-4 h-4" />
        <span>Grid view</span>
        <ChevronIcon small />
      </div>

      {/* View Options */}
      <div className="px-4 mt-4 space-y-3 text-sm">
        <button className="flex items-center gap-2 text-gray-600 hover:text-black">
          <span className="text-lg">＋</span>
          <span>Create new…</span>
        </button>
        <div className="text-gray-500 text-xs">Find a view</div>
        <div className="flex items-center gap-2 font-medium bg-gray-100 px-2 py-1 rounded-md text-sm">
          <LayoutGrid className="w-4 h-4 text-blue-500" />
          Grid view
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="mt-auto px-4 py-6 flex flex-col items-center gap-6">
        <HelpCircle className="w-5 h-5 text-gray-500 hover:text-black" />
        <Bell className="w-5 h-5 text-gray-500 hover:text-black" />
        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </aside>
  );
}

function ChevronIcon({ small = false }: { small?: boolean }) {
  return (
    <span className={`text-gray-400 ${small ? "text-xs" : "text-sm"}`}>
      ▾
    </span>
  );
}
