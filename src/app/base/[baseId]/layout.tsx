import AppSidebar from "../../_components/layout/AppSideBar";
import BaseSidebar from "../../_components/table/BaseSidebar";
import BaseTopbar from "../../_components/table/BaseTopbar";
import BaseSecondaryTopbar from "../../_components/table/BaseSecondaryTopbar";import BaseSecondaryTopbarWrapper from "../../_components/table/BaseSecondaryTopbarWrapper";
import type { Column } from "../../_components/table/BaseTable";

const dummyColumns: Column[] = [
  { id: "col-1", name: "Task Name", type: "text" },
  { id: "col-2", name: "Description", type: "text" },
];

function handleSort(colId: string, direction: "asc" | "desc") {
  console.log(`Sort ${colId} in ${direction} order`);
}

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <BaseTopbar />

        <BaseSecondaryTopbarWrapper columns={dummyColumns} />

        <div className="flex flex-1 overflow-hidden">
          <BaseSidebar />

          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
