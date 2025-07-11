"use client";

import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import QuickCard from "../cards/QuickCard";
import WelcomeBanner from "../banners/WelcomeBanner";
import BaseCardSection from "../basecard/BaseCardSection";

export default function HomeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bases, setBases] = useState<string[]>(["Spring2024"]);

  const handleCreateBase = () => {
    const newName = `Base ${bases.length + 1}`;
    setBases([...bases, newName]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex flex-1">
        <Sidebar collapsed={isCollapsed} onCreateBase={handleCreateBase} />
        <div className="flex-1 flex flex-col">
          <WelcomeBanner />
          <main className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa]">
            <h1 className="text-2xl font-bold mb-4">Home</h1>
            <QuickCard />
            <h2 className="text-base font-semibold mb-3 mt-6"></h2>
            <BaseCardSection bases={bases} />
          </main>
        </div>
      </div>
    </div>
  );
}
