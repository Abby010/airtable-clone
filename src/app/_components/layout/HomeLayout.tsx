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
      const typedBase = base as (typeof base & { tables?: { id: string }[] });
      if (typedBase?.id && typedBase.tables && typedBase.tables.length > 0) {
        router.push(`/base/${typedBase.id}`);
      } else {
        alert("Base created but no tables. Please try again.");
      }
    },
    onError: (err) => {
      console.error("Base creation failed:", err);
      alert("Failed to create base: " + err.message);
    }
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
          isLoading={createBase.isPending}
        />
        <div className="flex-1 flex flex-col">
          <WelcomeBanner />
          <main className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa]">
            <h1 className="text-2xl font-bold mb-4">Home</h1>
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
