"use client";

import TableWorkspace from "../../_components/table/TableWorkspace";
import { useParams } from "next/navigation";

export default function BasePage() {
  const params = useParams();
  const baseId = typeof params.baseId === "string" ? params.baseId : Array.isArray(params.baseId) ? params.baseId[0] : "";
  return <TableWorkspace baseId={baseId} />;
}
