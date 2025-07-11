"use client";

import { CheckCircle, X } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="bg-[#ebf9ee] border-b border-[#d1e7dd] h-14 flex items-center justify-center">
      <div className="flex items-center gap-4 px-4 text-sm text-[#1f513f]">
        {/* Icon + Text */}
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          <span className="leading-none">
            <span className="font-semibold">Welcome to the improved Home.</span>{" "}
            Find, navigate to, and manage your apps more easily.
          </span>
        </div>

        {/* Button */}
        <button className="h-9 px-4 text-sm font-medium bg-white shadow-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
          See what's new
        </button>

        {/* Close */}
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
          <X size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
