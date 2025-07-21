"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";

export default function Topbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm relative">
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

      {/* Icons and User */}
      <div className="flex items-center gap-3">
        <Bell size={18} className="text-gray-500" />
        {session?.user && (
          <div className="relative">
            <div
              ref={avatarRef}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer select-none border-2 border-blue-200 hover:border-blue-400"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {session.user.image ? (
                <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />
              ) : (
                (session.user.name?.[0] || "U").toUpperCase()
              )}
            </div>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-sm text-gray-900 truncate">{session.user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
