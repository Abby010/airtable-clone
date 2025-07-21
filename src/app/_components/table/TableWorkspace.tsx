"use client";

import { api } from "../../../trpc/react";
import { useEffect, useState } from "react";
import Sidebar from "./BaseSidebar";
import Wrapper from "./BaseSecondaryTopbarWrapper";

export default function TableWorkspace({ baseId }: { baseId: string }) {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch tables for this base
  const { data: tables, isLoading: tablesLoading, refetch: refetchTables } = api.table.getByBase.useQuery({ baseId });
  const createTable = api.table.create.useMutation({
    onSuccess: () => refetchTables(),
  });

  // Auto-create a default table if none exist
  useEffect(() => {
    if (!tablesLoading && tables && tables.length === 0) {
      createTable.mutate({ baseId, name: "Grid view" });
    }
  }, [tables, tablesLoading, baseId, createTable]);

  // Set first table as active by default
  useEffect(() => {
    if (tables && tables.length > 0 && !activeTableId) {
      setActiveTableId(tables[0]!.id);
    }
  }, [tables, activeTableId]);

  // Fetch columns and rows for the active table
  const { data: columns, isLoading: columnsLoading } = api.column.getByTable.useQuery(
    { tableId: activeTableId ?? "" },
    { enabled: !!activeTableId }
  );
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
  const rows = rowPages?.pages.flatMap((p: { rows: any[] }) => p.rows) ?? [];

  // Sidebar view list
  const views = tables?.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })) ?? [];

  if (!baseId) {
    return <div className="flex items-center justify-center h-full text-lg text-red-500">Invalid base ID.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          views={views}
          activeId={activeTableId ?? ""}
          onSelect={(id: string) => setActiveTableId(id)}
          onRename={() => {}}
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
              setTable={() => {}}
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
