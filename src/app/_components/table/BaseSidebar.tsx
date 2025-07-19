"use client";

import {
  LayoutGrid, MoreHorizontal, Plus, Search, X
} from "lucide-react";
import { useState } from "react";

export interface ViewMeta { id: string; name: string }

interface Props {
  views:       ViewMeta[];
  activeId:    string;
  onSelect:    (id: string) => void;
  onRename:    (id: string, newName: string) => void;
  onCreate:    () => void;
}

export default function BaseSidebar({
  views, activeId, onSelect, onRename, onCreate,
}: Props) {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft,    setDraft   ] = useState("");

  return (
    <aside className="w-60 h-full border-r border-gray-200 bg-white flex flex-col text-sm">
      {/* NEW VIEW */}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
      >
        <Plus className="w-4 h-4" />
        <span>Create new...</span>
      </button>

      {/* FIND */}
      <div className="flex items-center gap-2 px-3 py-2 text-gray-500">
        <Search className="w-4 h-4" />
        <span>Find a view</span>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto mt-2">
        {views.map(v => (
          <div key={v.id} className="group relative">
            {/* normal line */}
            {renaming !== v.id && (
              <button
                onClick={() => onSelect(v.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded
                 ${v.id === activeId ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100"}`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate text-left">{v.name}</span>
                {/* mini menu */}
                <MoreHorizontal
                  onClick={(e) => { e.stopPropagation(); setRenaming(v.id); setDraft(v.name); }}
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                />
              </button>
            )}

            {/* rename mode */}
            {renaming === v.id && (
              <div className="flex items-center gap-1 px-3 py-1.5">
                <input
                  autoFocus
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") { onRename(v.id, draft); setRenaming(null); }
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  className="flex-1 border-b border-blue-500 outline-none text-sm"
                />
                <X className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setRenaming(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
