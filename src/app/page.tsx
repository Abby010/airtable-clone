// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // If authenticated, redirect to home
  redirect("/home");
}

