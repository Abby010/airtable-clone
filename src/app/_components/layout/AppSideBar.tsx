"use client";

import { HelpCircle, Bell} from "lucide-react"
import Link from "next/link";
import Image from "next/image";

export default function AppSidebar() {
  return (
    <aside className="w-14 h-screen flex flex-col justify-between items-center py-4 border-r bg-white">
      {/* Top: Airtable Logo */}
      <div className="flex flex-col gap-4 items-center">
        <Link href="/" className="hover:opacity-80">
          <Image
            src="/airtable-logo.png"
            alt="Airtable"
            width={24}
            height={24}
            className="rounded"
          />
        </Link>
      </div>

      {/* Bottom: Help, Notification, Avatar */}
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
