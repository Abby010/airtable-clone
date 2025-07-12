"use client";

import { useState } from "react";
import Sidebar from "../_components/sidebar/Sidebar";
import BaseCardSection from "../_components/basecard/BaseCardSection";

type Base = {
  id: string;
  name: string;
};

export default function HomePage() {
  const [bases, setBases] = useState<Base[]>([
    { id: "1", name: "Spring2024" },
  ]);

  const handleCreateBase = () => {
    const newBase: Base = {
      id: (bases.length + 1).toString(),
      name: `Base ${bases.length + 1}`,
    };
    setBases([...bases, newBase]);
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
