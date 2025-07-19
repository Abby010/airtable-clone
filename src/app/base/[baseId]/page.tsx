"use client";

import TableWorkspace from "../../_components/table/TableWorkspace";   // relative path

export default function BasePage() {
  /* Layout already includes BaseTopbar, so we can just show the workspace
     here (or return null if you prefer). */
  return <TableWorkspace />;
}
