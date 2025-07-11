"use client";

import { useState } from "react";
import Sidebar from "../_components/sidebar/Sidebar";
import BaseCardSection from "../_components/basecard/BaseCardSection";

export default function HomePage() {
  const [bases, setBases] = useState<string[]>(["Spring2024"]);

  const handleCreateBase = () => {
    const newName = `Base ${bases.length + 1}`;
    setBases([...bases, newName]);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={false} onCreateBase={handleCreateBase} />
      <main className="flex-1 p-6 bg-[#f8f9fa] overflow-y-auto">
        <BaseCardSection bases={bases} />
      </main>
    </div>
  );
}
