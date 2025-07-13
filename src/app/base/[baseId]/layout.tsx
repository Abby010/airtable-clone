import AppSidebar from "../../_components/layout/AppSideBar";
import BaseSidebar from "../../_components/table/BaseSidebar";
import BaseTopbar from "../../_components/table/BaseTopbar";
import BaseSecondaryTopbar from "../../_components/table/BaseSecondaryTopbar";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* 1. App Sidebar */}
      <AppSidebar />

      {/* Main right section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. Topbar */}
        <BaseTopbar />

        {/* 2.5. Secondary Topbar */}
        <BaseSecondaryTopbar />

        {/* 3. Content below Topbars */}
        <div className="flex flex-1 overflow-hidden">
          {/* 3. View Sidebar */}
          <BaseSidebar />

          {/* 4. Table Content */}
          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
