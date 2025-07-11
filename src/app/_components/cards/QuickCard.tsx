// src/app/_components/cards/QuickCard.tsx
"use client";

import { FileUp, Rocket, LayoutTemplate, Wand2 } from "lucide-react";

const cards = [
  {
    title: "Start with Omni",
    description: "Use AI to build a custom app tailored to your workflow",
    icon: <Wand2 size={20} className="text-blue-600" />,
  },
  {
    title: "Start with templates",
    description: "Select a template to get started and customize as you go.",
    icon: <LayoutTemplate size={20} className="text-blue-600" />,
  },
  {
    title: "Quickly upload",
    description: "Easily migrate your existing projects in just a few minutes.",
    icon: <FileUp size={20} className="text-blue-600" />,
  },
  {
    title: "Build an app on your own",
    description: "Start with a blank app and build your ideal workflow.",
    icon: <Rocket size={20} className="text-blue-600" />,
  },
];

export default function QuickCardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 my-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-lg border p-4 bg-white hover:shadow-md transition-shadow min-h-[90px] flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 font-semibold mb-1 text-sm">
            {card.icon}
            {card.title}
          </div>
          <p className="text-sm text-gray-600 leading-snug">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
