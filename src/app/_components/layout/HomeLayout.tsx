"use client";

import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import QuickCard from "../cards/QuickCard";
import BaseCard from "../basecard/BaseCard";
import WelcomeBanner from "../banners/WelcomeBanner";

export default function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <WelcomeBanner />
          <main className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa]">
            <h1 className="text-2xl font-bold mb-4">Home</h1>
            <QuickCard />
            <h2 className="text-base font-semibold mb-3 mt-6">Opened anytime</h2>
            <BaseCard />
          </main>
        </div>
      </div>
    </div>
  );
}
