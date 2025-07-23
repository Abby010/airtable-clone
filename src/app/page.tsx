// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import HomeLayout from "./_components/layout/HomeLayout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const session = await auth();

  console.log("Home Page Auth Check:", {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    environment: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  });

  if (!session?.user) {
    console.log("No session found, redirecting to signin");
    redirect("/signin");
  }

  return <HomeLayout />;
}

