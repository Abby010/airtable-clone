"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { api } from "~/trpc/react";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [newBase, setNewBase] = useState("");

  const { data: bases, refetch } = api.base.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const createBase = api.base.create.useMutation({
    onSuccess: () => {
      setNewBase("");
      refetch();
    },
  });

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center flex-col space-y-4">
        <p className="text-gray-600 text-lg">Please sign in to view your bases.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Image
  src="/airtable-logo.png"
  alt="Airtable Logo"
  width={32}
  height={32}
/>
<span className="text-xl font-bold text-gray-800">Airtable</span>
        </div>
        <nav className="space-y-2">
          <button className="block w-full text-left text-black hover:bg-gray-100 px-3 py-2 rounded">
            Home
          </button>
          <button className="block w-full text-left text-black hover:bg-gray-100 px-3 py-2 rounded">
            All Workspaces
          </button>
        </nav>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-500 underline mt-8"
        >
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-lg font-semibold">Home</h1>
        </header>

        {/* Main panel */}
        <section className="flex-1 flex flex-col items-center justify-center">
          {bases && bases.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Nothing has been shared with you</p>
              <p className="text-sm text-gray-400">
                Bases and interfaces shared with you will appear here.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newBase.trim()) {
                    createBase.mutate({ name: newBase });
                  }
                }}
                className="flex items-center gap-2 justify-center"
              >
                <input
                  value={newBase}
                  onChange={(e) => setNewBase(e.target.value)}
                  placeholder="Base name"
                  className="border p-2 rounded-md w-60"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Create a base
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Your Bases</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newBase.trim()) {
                    void createBase.mutate({ name: newBase });
                  }
                }}
                className="flex gap-2 mb-6"
              >
                <input
                  value={newBase}
                  onChange={(e) => setNewBase(e.target.value)}
                  placeholder="Base name"
                  className="border p-2 rounded-md w-60"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Create
                </button>
              </form>
              <div className="grid grid-cols-1 gap-4">
                {bases?.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border p-4 shadow-sm bg-white"
                  >
                    <h3 className="text-lg font-semibold">{b.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
