import { auth } from "./server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use Node.js runtime
export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  // Allow access to auth-related paths and static files
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const session = await auth();

  // Redirect to signin if no session
  if (!session?.user) {
    const signInUrl = new URL("/auth/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If at root and authenticated, redirect to home
  if (request.nextUrl.pathname === "/") {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!auth|_next/static|_next/image|favicon.ico|api).*)",
  ],
}; 