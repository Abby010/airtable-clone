"use client";

import {
  EyeOff, Filter, LayoutGrid, SlidersHorizontal, Paintbrush, Menu,
  Search as SearchIcon, Share2, X, GripVertical, HelpCircle,
  AlignLeft, User, Circle, Calendar, File,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

/* ───────── Types ───────── */
export type FilterRule = { col: string; op: string; val: string };

interface Props {
  columns: { id: string; name: string }[];
  visible: Set<string>;
  onToggle: (id: string) => void;
  onSort: (c: string, d: "asc" | "desc") => void;
  activeSort?: { col: string; dir: "asc" | "desc" } | null;
  onFilter: (rules: FilterRule[]) => void;
  filters: FilterRule[];
  onSearch: (q: string) => void;
  onAddRowsBulk: () => void;
}

/* ---------- generic btn ---------- */
const Btn = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-1 hover:text-black">
    {icon}{label && <span>{label}</span>}
  </button>
);

/* ---------- icon util ---------- */
const ICON = (name: string): ReactNode => {
  const t = name.toLowerCase();
  if (t.includes("description")) return <AlignLeft className="w-4 h-4" />;
  if (t.includes("assigned")) return <User className="w-4 h-4" />;
  if (t.includes("status")) return <Circle className="w-4 h-4" />;
  if (t.includes("priority")) return <Circle className="w-4 h-4" />;
  if (t.includes("date")) return <Calendar className="w-4 h-4" />;
  if (t.includes("attach")) return <File className="w-4 h-4" />;
  return null;
};

/* ---------- pop wrapper ---------- */
const Pop = ({ anchor, children }: { anchor: React.RefObject<HTMLElement | null>; children: ReactNode }) => {
  const r = anchor.current?.getBoundingClientRect();
  return (
<div
  className="fixed z-40 w-60 bg-white border border-gray-200 shadow-xl rounded-md"
  style={{ top: (r?.bottom ?? 0) + 6, left: r?.right ?? 0, transform: "translateX(-100%)" }}
>

      {children}
    </div>
  );
};

/* ---------- HideFields ---------- */
function HideFields({ anchor, cols, vis, toggle, close }: {
  anchor: React.RefObject<HTMLElement | null>;
  cols: { id: string; name: string }[];
  vis: Set<string>;
  toggle: (id: string) => void;
  close: () => void;
}) {
  const [q, setQ] = useState("");
  const list = cols.filter(c => {
    if (c.id === "col-index") return false;
    if (c.name.toLowerCase() === "task name") return false;
    return c.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <Pop anchor={anchor}>
      <div className="flex items-center px-3 pt-3 pb-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Find a field"
          className="flex-1 text-sm outline-none border-b border-gray-300 pb-[2px]"
        />
        <HelpCircle className="w-4 h-4 text-gray-400 ml-2" />
        <X className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" onClick={close} />
      </div>
      <div className="max-h-52 overflow-y-auto">
        {list.map(c => (
          <div
            key={c.id}
            onClick={() => toggle(c.id)}
            className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
          >
            <span className={`relative inline-block w-3 h-1 rounded-full ${vis.has(c.id) ? "bg-green-600" : "bg-gray-300"}`}>
              <span className={`absolute top-0 h-1 w-1 bg-white rounded-full transition-transform ${vis.has(c.id) ? "translate-x-[6px]" : "translate-x-[1px]"}`} />
            </span>
            <span className="flex items-center gap-2 flex-1 ml-2 text-sm truncate">
              {ICON(c.name)} {c.name}
            </span>
            <GripVertical className="w-4 h-4 text-gray-300" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 border-t">
        <button className="flex-1 bg-gray-100 py-[6px] rounded text-xs" onClick={() => cols.forEach(c => vis.has(c.id) && toggle(c.id))}>Hide all</button>
        <button className="flex-1 bg-gray-100 py-[6px] rounded text-xs" onClick={() => cols.forEach(c => !vis.has(c.id) && toggle(c.id))}>Show all</button>
      </div>
    </Pop>
  );
}

/* ---------- SortModal ---------- */
function SortModal({ columns, active, onSort, onClose }: {
  columns: { id: string; name: string }[];
  active: { col: string; dir: "asc" | "desc" } | null;
  onSort: (c: string, d: "asc" | "desc") => void;
  onClose: () => void;
}) {
  const [col, setCol] = useState(active?.col ?? columns[1]?.id ?? "");
  const [dir, setDir] = useState<"asc" | "desc">(active?.dir ?? "asc");

  return (
    <Pop anchor={{ current: document.body }}>
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <span className="font-semibold text-sm">Sort by</span>
        <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>
      <div className="p-4 space-y-3">
        <select value={col} onChange={e => setCol(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
          {columns.filter(c => c.id !== "col-index").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={dir} onChange={e => setDir(e.target.value as any)} className="w-full border rounded px-2 py-1 text-sm">
          <option value="asc">Ascending</option><option value="desc">Descending</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-1 rounded text-sm" onClick={() => { onSort(col, dir); onClose(); }}>
          Apply
        </button>
      </div>
    </Pop>
  );
}

/* ---------- FilterModal ---------- */
function FilterModal({ columns, rules, onApply, onClose }: {
  columns: { id: string; name: string }[];
  rules: FilterRule[];
  onApply: (r: FilterRule[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterRule[]>(rules.length ? rules : [{ col: columns[1]?.id ?? "", op: "contains", val: "" }]);
  const upd = (i: number, k: keyof FilterRule, v: string) => setLocal(a => a.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  return (
    <Pop anchor={{ current: document.body }}>
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <span className="font-semibold text-sm">Filters</span>
        <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
      </div>
      <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
        {local.map((r, i) => (
          <div key={i} className="flex gap-1">
            <select value={r.col} onChange={e => upd(i, "col", e.target.value)} className="flex-1 border rounded px-1 text-xs">
              {columns.filter(c => c.id !== "col-index").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={r.op} onChange={e => upd(i, "op", e.target.value)} className="w-28 border rounded px-1 text-xs">
              <option value="contains">contains</option><option value="notcontains">not contains</option>
              <option value="eq">=</option><option value="gt">&gt;</option><option value="lt">&lt;</option>
              <option value="empty">is empty</option><option value="notempty">not empty</option>
            </select>
            <input value={r.val} onChange={e => upd(i, "val", e.target.value)} disabled={["empty", "notempty"].includes(r.op)} className="flex-1 border rounded px-1 text-xs" />
            <X className="w-4 h-4 mt-1 cursor-pointer" onClick={() => setLocal(a => a.filter((_, idx) => idx !== i))} />
          </div>
        ))}
        <button className="text-blue-600 text-xs" onClick={() => setLocal(a => [...a, { col: columns[1]?.id ?? "", op: "contains", val: "" }])}>
          + Add condition
        </button>
      </div>
      <div className="flex gap-2 p-4 border-t">
        <button className="flex-1 bg-gray-100 py-1 rounded text-xs" onClick={() => setLocal([])}>Clear</button>
        <button className="flex-1 bg-blue-600 py-1 rounded text-xs text-white" onClick={() => { onApply(local); onClose(); }}>
          Apply
        </button>
      </div>
    </Pop>
  );
}

/* ---------- Topbar ---------- */
export default function Topbar({ columns, visible, onToggle, onSort, activeSort, onFilter, filters, onSearch, onAddRowsBulk }: Props) {
  const [query, setQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const hideBtn = useRef<HTMLButtonElement | null>(null);
  const searchBtn = useRef<HTMLButtonElement | null>(null);
  const [hideOpen, setHideOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between px-4 py-1.5 bg-blue-50 text-sm border-b border-gray-200">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Mentee</span><span className="text-gray-400">▾</span>
          <span className="text-gray-300">|</span>
          <button className="text-blue-600 text-xs hover:underline">+ Add or import</button>
        </div>
        <div className="text-gray-600">Tools ▾</div>
      </div>

      <div className="flex items-center justify-end px-4 py-2.5 bg-white text-sm border-b">

        <div className="flex items-center gap-6 text-gray-600">
          <div className="relative">
            <button ref={hideBtn} onClick={() => setHideOpen(o => !o)} className="flex items-center gap-1 hover:text-black">
              <EyeOff className="w-4 h-4" /><span>Hide fields</span>
            </button>
            {hideOpen && (
              <HideFields anchor={hideBtn} cols={columns} vis={visible} toggle={onToggle} close={() => setHideOpen(false)} />
            )}
          </div>
          <Btn icon={<Filter className="w-4 h-4" />} label="Filter" onClick={() => setShowFilter(!showFilter)} />
          <Btn icon={<LayoutGrid className="w-4 h-4" />} label="Group" />
          <Btn icon={<SlidersHorizontal className="w-4 h-4" />} label="Sort" onClick={() => setShowSort(!showSort)} />
          <Btn icon={<Paintbrush className="w-4 h-4" />} label="Color" />
          <Btn icon={<Menu className="w-4 h-4" />} label="" />
          <Btn icon={<Share2 className="w-4 h-4" />} label="Share" />
          <Btn icon={<span className="font-bold text-lg">+</span>} label="Add 100k Rows" onClick={onAddRowsBulk} />

          <div className="flex items-center gap-1 ml-4">
<button
  ref={searchBtn}
  onClick={() => setShowSearch(s => !s)}
  className="hover:text-black"
>
  <SearchIcon className="w-4 h-4" />
</button>

{showSearch && (
<Pop anchor={searchBtn}>
  <div className="relative p-3 w-64">
    <p className="text-sm font-semibold">Find in view</p>
    
    <button
      onClick={() => setShowSearch(false)}
      className="absolute top-2 right-6 text-gray-400 hover:text-gray-600"
    >
      <X className="w-4 h-4" />
    </button>

    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder="Search..."
      className="w-full mt-2 text-sm outline-none border-b border-gray-300 pb-[2px]"
    />
  </div>
</Pop>

)}


          </div>
        </div>
      </div>

      {showSort && (
        <SortModal columns={columns} active={activeSort ?? null} onSort={onSort} onClose={() => setShowSort(false)} />
      )}
      {showFilter && (
        <FilterModal columns={columns} rules={filters} onApply={onFilter} onClose={() => setShowFilter(false)} />
      )}
    </div>
  );
}
