"use client";

import { api } from "../../../trpc/react";
import { useEffect, useState } from "react";
import Sidebar from "./BaseSidebar";
import Wrapper from "./BaseSecondaryTopbarWrapper";

export default function TableWorkspace() {
  // Assume baseId is available from route or context (for now, hardcode or get from props)
  const baseId = "1"; // TODO: Replace with actual baseId from router
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch tables for this base
  const { data: tables, isLoading: tablesLoading } = api.table.getByBase.useQuery({ baseId });

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

  // Mutations for creating tables, etc.
  const createTable = api.table.create.useMutation({
    onSuccess: () => {
      // refetch tables
    },
  });

  // Sidebar view list
  const views = tables?.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })) ?? [];

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
          {columns && rows ? (
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
            <div className="flex items-center justify-center h-full">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
