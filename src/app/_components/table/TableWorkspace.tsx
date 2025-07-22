"use client";

import { api } from "../../../trpc/react";
import { useEffect, useState } from "react";
import Sidebar from "./BaseSidebar";
import Wrapper from "./BaseSecondaryTopbarWrapper";
import { skipToken } from '@tanstack/react-query';
import type { CellValue, Column } from "./BaseTable";

export default function TableWorkspace({ baseId }: { baseId: string }) {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Check if base exists
  const { data: base, isLoading: baseLoading, error: baseError } = api.base.getById.useQuery(
    baseId ? { id: baseId } : skipToken
  );

  // Debug output
  console.log("baseId:", baseId);
  console.log("base loading:", baseLoading);
  console.log("base error:", baseError);
  console.log("base result:", base);
  // Fetch tables for this base (only if base exists)
  const { data: tables, isLoading: tablesLoading, error: tablesError, refetch: refetchTables } = api.table.getByBase.useQuery({ baseId }, { enabled: !!base });
  const createTable = api.table.create.useMutation({
    onSuccess: () => refetchTables(),
  });

  // Auto-create a default table if none exist
  useEffect(() => {
    if (!tablesLoading && tables && tables.length === 0 && base) {
      createTable.mutate({ baseId, name: "Grid view" });
    }
  }, [tables, tablesLoading, baseId, createTable, base]);

  // Set first table as active by default
  useEffect(() => {
    if (tables && tables.length > 0 && !activeTableId) {
      setActiveTableId(tables[0]!.id);
    }
  }, [tables, activeTableId]);

  // Fetch columns and rows for the active table
  const { data: rawColumns, isLoading: columnsLoading } = api.column.getByTable.useQuery(
    { tableId: activeTableId ?? "" },
    { enabled: !!activeTableId }
  );
  // Map columns to the correct type and ensure id is a string
  const columns: Column[] = (rawColumns ?? []).map((col: { id: string; name: string; type: string }) => {
    let type: "text" | "number" = "text";
    if (col.type === "number") type = "number";
    return { ...col, id: String(col.id), type };
  });
  // For rows, use cursor-based infinite query for virtualization
  const {
    data: rowPages,
    fetchNextPage,
    hasNextPage,
    isFetching: rowsLoading,
  } = api.row.getByTable.useInfiniteQuery(
    { tableId: activeTableId ?? "", limit: 100 },
    {
      enabled: !!activeTableId,
      getNextPageParam: (lastPage: { nextCursor: string | null }) => lastPage?.nextCursor,
    }
  );
  // Ensure all row ids are strings and flatten cells into Record<string, CellValue>
  const rows: Record<string, CellValue>[] = rowPages?.pages.flatMap((p: { rows: { id: string; cells: { id: string; value: CellValue; columnId: string }[] }[] }) =>
    p.rows.map(row => {
      const flatRow: Record<string, CellValue> = { id: String(row.id) };
      if (Array.isArray(row.cells)) {
        for (const cell of row.cells) {
          flatRow[cell.columnId] = cell.value;
          flatRow[`${cell.columnId}_cellId`] = cell.id;
        }
      }
      return flatRow;
    })
  ) ?? [];

  // Sidebar view list
  const views = tables?.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })) ?? [];

  // Add a no-op function to avoid empty arrow function lint errors
  const noop = () => undefined;

  if (baseLoading) return <div>Loading base...</div>;
  if (baseError) return <div className="flex items-center justify-center h-full text-lg text-red-500">Error loading base.</div>;
  if (!base) return <div className="flex items-center justify-center h-full text-lg text-red-500">Invalid base ID.</div>;
  if (tablesError) return <div className="flex items-center justify-center h-full text-lg text-red-500">Error loading tables.</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          views={views}
          activeId={activeTableId ?? ""}
          onSelect={(id: string) => setActiveTableId(id)}
          onRename={noop}
          onCreate={() => {
            createTable.mutate({ baseId, name: `Table ${(tables?.length ?? 0) + 1}` });
          }}
        />
        <div className="flex-1 overflow-hidden">
          {tablesLoading || columnsLoading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : tables && tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-lg text-gray-500">No tables found for this base.</div>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                onClick={() => createTable.mutate({ baseId, name: "Grid view" })}
              >
                Create Default Table
              </button>
            </div>
          ) : columns && rows ? (
            <Wrapper
              table={{
                id: activeTableId ?? "",
                name: views.find((v: { id: string }) => v.id === activeTableId)?.name ?? "",
                columns: columns ?? [],
                rows,
              }}
              setTable={noop}
              search={search}
              onSearch={setSearch}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetching={rowsLoading}
            />
          ) : (
            <div className="flex items-center justify-center h-full">No data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
