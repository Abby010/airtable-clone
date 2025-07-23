import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import HomeLayout from "../_components/layout/HomeLayout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <HomeLayout />;
} 