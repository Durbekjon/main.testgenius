// Create a new middleware file at the root of the project

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/callback/google",
];

// Define auth-only paths that should redirect to dashboard if authenticated
const authOnlyPaths = ["/auth/signin", "/auth/signup"];
const dashboardRoot = "/dashboard";

// Token key name for consistency
const ACCESS_TOKEN_KEY = "access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAuthOnlyPath = authOnlyPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isDashboardPath = pathname.startsWith(dashboardRoot);

  // Get the access token from cookies
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  // If accessing dashboard and not authenticated, redirect to signin
  if (isDashboardPath && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // If accessing auth-only page and authenticated, redirect to dashboard
  if (isAuthOnlyPath && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardRoot;
    return NextResponse.redirect(url);
  }

  // Otherwise, allow
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
