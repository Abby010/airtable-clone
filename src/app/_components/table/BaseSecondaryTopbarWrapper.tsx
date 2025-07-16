"use client";

import { useCallback } from "react";
import BaseSecondaryTopbar from "./BaseSecondaryTopbar";
import type { Column } from "./BaseTable";

interface Props {
  columns: Column[];
}

export default function BaseSecondaryTopbarWrapper({ columns }: Props) {
  const handleSort = useCallback((colId: string, direction: "asc" | "desc") => {
    console.log(`Sort ${colId} in ${direction} order`);
  }, []);

  return (
    <BaseSecondaryTopbar columns={columns} onSort={handleSort} />
  );
}
