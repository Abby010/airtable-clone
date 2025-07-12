"use client";

import { HelpCircle, Bell, Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AppSidebar() {
  return (
    <aside className="w-14 h-screen flex flex-col justify-between items-center py-4 border-r bg-white">
      {/* Top Icons */}
      <div className="flex flex-col gap-4 items-center">
        <Link href="/" className="hover:opacity-80">
          <LayoutDashboard className="w-5 h-5 text-gray-800" />
        </Link>
        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-6 items-center">
        <HelpCircle className="w-5 h-5 text-gray-500 hover:text-black" />
        <Bell className="w-5 h-5 text-gray-500 hover:text-black" />
        <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm flex items-center justify-center shadow">
          A
        </div>
      </div>
    </aside>
  );
}
