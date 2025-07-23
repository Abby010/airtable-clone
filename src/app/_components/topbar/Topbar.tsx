"use client";

import { Bell, Search, Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Topbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Debug session state
  useEffect(() => {
    console.log("Topbar Session State:", {
      status,
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image ? '[exists]' : '[none]'
        }
      } : null
    });
  }, [session, status]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    const currentUrl = window.location.origin;
    console.log("Signing out, redirecting to:", `${currentUrl}/signin`);
    signOut({ callbackUrl: `${currentUrl}/signin` });
  };

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm border-b border-gray-200 relative">
      {/* Logo and Menu */}
      <div className="flex items-center gap-2 min-w-[220px] bg-white pl-2" style={{ height: 56 }}>
        <button onClick={onToggleSidebar} className="p-1 mr-1" aria-label="Open sidebar">
          <Menu size={24} className="text-gray-700" />
        </button>
        <Image src="/airtable-logo.png" alt="Airtable" width={32} height={32} />
        <span className="ml-2 font-extrabold text-2xl tracking-tight text-[#262626]" style={{ fontFamily: 'Montserrat, Futura, Arial Black, Arial, sans-serif', color: '#262626' }}>
          Airtable
        </span>
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
        
        {/* User Menu */}
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : status === "authenticated" && session?.user ? (
          <div className="relative">
            <div
              ref={avatarRef}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer select-none border-2 border-blue-200 hover:border-blue-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {session.user.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User avatar'} 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==';
                  }}
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-sm text-gray-900 truncate">
                    {session.user.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </div>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-1 text-sm text-red-600 hover:bg-gray-50 rounded"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </header>
  );
}
