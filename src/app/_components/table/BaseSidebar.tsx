import { Home, HelpCircle, Bell, LayoutGrid } from "lucide-react";

export default function BaseSidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <div className="bg-blue-500 rounded-lg p-2">
          <Home className="text-white w-5 h-5" />
        </div>
        <div className="font-semibold text-lg">Spring2024</div>
        <span className="text-gray-500 text-sm">▾</span>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-blue-50">
        <span className="font-medium">Mentee</span>
        <span className="text-xs text-gray-400">▾</span>
        <span className="text-gray-300">|</span>
        <button className="text-blue-600 text-xs font-medium">+ Add or import</button>
      </div>

      <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-600">
        <LayoutGrid className="w-4 h-4" />
        <span>Grid view</span>
        <span className="text-xs text-gray-400">▾</span>
      </div>

      <div className="px-4 mt-4 space-y-2 text-sm">
        <div className="text-gray-600 flex items-center gap-2 cursor-pointer">
          <span className="text-xl">＋</span> <span>Create new…</span>
        </div>
        <div className="text-gray-500">Find a view</div>
        <div className="flex items-center gap-2 font-medium bg-gray-100 px-2 py-1 rounded-md">
          <LayoutGrid className="w-4 h-4 text-blue-500" />
          Grid view
        </div>
      </div>

      <div className="mt-auto px-4 py-4 flex flex-col items-center gap-6">
        <HelpCircle className="w-5 h-5 text-gray-500" />
        <Bell className="w-5 h-5 text-gray-500" />
        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </aside>
  );
}
