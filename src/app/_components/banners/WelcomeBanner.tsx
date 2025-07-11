import { CheckCircle, X } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <div className="flex items-center justify-between bg-[#e9f8ed] px-4 py-3 text-sm text-[#1f513f] border-b border-[#d1e7dd]">
      <div className="flex items-center gap-2">
        <CheckCircle size={18} className="text-green-600" />
        <p>
          <span className="font-semibold">Welcome to the improved Home.</span>{" "}
          Find, navigate to, and manage your apps more easily.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium bg-white shadow-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
          See what's new
        </button>
        <button>
          <X size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
