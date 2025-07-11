// src/app/_components/cards/QuickCard.tsx
"use client";

import { FileUp, Rocket, LayoutTemplate, Wand2 } from "lucide-react";
import { cloneElement } from "react";

const cards = [
  {
    title: "Start with Omni",
    description: "Use AI to build a custom app tailored to your workflow",
    icon: <Wand2 />,
  },
  {
    title: "Start with templates",
    description: "Select a template to get started and customize as you go.",
    icon: <LayoutTemplate />,
  },
  {
    title: "Quickly upload",
    description: "Easily migrate your existing projects in just a few minutes.",
    icon: <FileUp />,
  },
  {
    title: "Build an app on your own",
    description: "Start with a blank app and build your ideal workflow.",
    icon: <Rocket />,
  },
];

export default function QuickCardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 my-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-lg border border-[#e4e6ea] p-4 bg-white hover:shadow-sm transition-shadow min-h-[90px] flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 font-medium mb-1 text-sm text-gray-900">
            {cloneElement(card.icon, { size: 18, className: "text-blue-600" })}
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
