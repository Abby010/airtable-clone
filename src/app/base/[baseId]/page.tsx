"use client";

import TableWorkspace from "../../_components/table/TableWorkspace";
import { useParams } from "next/navigation";

export default function BasePage() {
  const params = useParams<{ baseId: string }>();
  return <TableWorkspace baseId={params.baseId} />;
}
