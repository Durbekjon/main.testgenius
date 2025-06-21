// Create a new middleware file at the root of the project

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/callback/google",
]

// Define auth-only paths that should redirect to dashboard if authenticated
const authOnlyPaths = ["/auth/signin", "/auth/signup"]

// Token key name for consistency
const ACCESS_TOKEN_KEY = "access_token"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  const isAuthOnlyPath = authOnlyPaths.some((path) => pathname.startsWith(path))

  // Note: Since we use localStorage for tokens, middleware can't access them
  // This middleware will only handle basic route protection
  // Client-side authentication checks are handled by the AuthProvider

  // For now, allow all requests and let client-side handle auth
  // In a production environment, you might want to implement server-side session validation
  
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
