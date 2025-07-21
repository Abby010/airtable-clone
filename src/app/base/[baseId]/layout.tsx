"use client";

import AppSidebar     from "../../_components/layout/AppSideBar";   // ← correct file
import BaseTopbar     from "../../_components/table/BaseTopbar";
import TableWorkspace from "../../_components/table/TableWorkspace";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AppSidebar />                          {/* tiny logo/help/bell column */}

      <div className="flex flex-col flex-1 overflow-hidden">
        <BaseTopbar />                        {/* blue top bar */}

        <div className="flex-1 overflow-hidden bg-[#F3F4F6]">
          {/* TableWorkspace removed from layout; rendered in page.tsx with correct baseId */}
          {children}
        </div>
      </div>
    </div>
  );
}
