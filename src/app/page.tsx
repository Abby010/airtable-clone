// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import HomeLayout from "./_components/layout/HomeLayout";

export default async function HomePage() {
  const session = await auth();

  console.log("SESSION", session);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <HomeLayout />;
}

