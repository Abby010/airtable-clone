import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Airtable Clone",
  description: "A modern Airtable clone built with Next.js",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get headers synchronously
  const headersList = headers();
  const host = headersList.get("host") || "";
  const userAgent = headersList.get("user-agent") || "";
  const referer = headersList.get("referer") || "";

  console.log("Root Layout Headers:", { host, userAgent, referer });

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

