"use client";

import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import QuickCard from "../cards/QuickCard";
import WelcomeBanner from "../banners/WelcomeBanner";
import BaseCardSection from "../basecard/BaseCardSection";

type Base = {
  id: string;
  name: string;
};

export default function HomeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bases, setBases] = useState<Base[]>([
    { id: "1", name: "Spring2024" },
  ]);

  const handleCreateBase = () => {
    const newBase = {
      id: String(Date.now()),
      name: `Base ${bases.length + 1}`,
    };
    setBases([...bases, newBase]);
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
            <BaseCardSection bases={bases} />
          </main>
        </div>
      </div>
    </div>
  );
}
