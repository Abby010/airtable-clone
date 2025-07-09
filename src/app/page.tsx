"use client";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { BaseCard } from "./_components/BaseCard";
import { signIn, signOut } from "next-auth/react";
export default function HomePage() {
const { data: session, status } = useSession();

const { data: bases, refetch } = api.base.getAll.useQuery(undefined, {
  enabled: status === "authenticated",
});

  const createBase = api.base.create.useMutation({
    onSuccess: () => {
      setNewBase("");
      refetch();
    },
  });

  const [newBase, setNewBase] = useState("");

if (!session) {
  return (
    <div className="text-center mt-10 space-y-4">
      <p className="text-gray-600">Please sign in to view your bases.</p>
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
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Your Bases</h1>
      <button onClick={() => signOut()}
      className = "text-sm text-red-500 underline"
      >
        Sign out
      </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newBase.trim()) {
            createBase.mutate({ name: newBase });
          }
        }}
        className="flex gap-2"
      >
        <input
          value={newBase}
          onChange={(e) => setNewBase(e.target.value)}
          placeholder="New base name"
          className="border p-2 rounded-md w-full"
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
          <BaseCard key={b.id} name={b.name} createdAt={b.createdAt} />
        ))}
      </div>
    </main>
  );
}
