import BaseSidebar from "../../_components/table/BaseSidebar";
import BaseTopbar from "../../_components/table/BaseTopbar";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <BaseSidebar />
      <div className="flex flex-col flex-1">
        <BaseTopbar />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
