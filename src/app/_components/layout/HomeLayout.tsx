"use client";

import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import QuickCard from "../cards/QuickCard";
import WelcomeBanner from "../banners/WelcomeBanner";
import BaseCardSection from "../basecard/BaseCardSection";
import { api } from "../../../trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  // Fetch bases from TRPC
  const { data: bases, isLoading, refetch } = api.base.getAll.useQuery();
  const createBase = api.base.create.useMutation({
    onSuccess: (base) => {
      refetch();
      if (base?.id) {
        router.push(`/base/${base.id}`);
      }
    },
  });

  const handleCreateBase = () => {
    if (!createBase.isPending) {
      createBase.mutate({ name: `Base ${(bases?.length ?? 0) + 1}` });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex flex-1">
        <Sidebar
          collapsed={isCollapsed}
          onCreateBase={handleCreateBase}
        />
        <div className="flex-1 flex flex-col">
          <WelcomeBanner />
          <main className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa]">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
              Home
              <button
                onClick={handleCreateBase}
                disabled={createBase.isPending}
                className={`ml-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {createBase.isPending && (
                  <span className="w-4 h-4 border-2 border-white border-t-blue-400 rounded-full animate-spin inline-block"></span>
                )}
                Create Base
              </button>
            </h1>
            <QuickCard />
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-lg text-gray-500">Loading bases...</div>
            ) : (
              <BaseCardSection bases={bases ?? []} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
