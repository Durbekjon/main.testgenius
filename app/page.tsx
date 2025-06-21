"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import HomePage from "./home-page"
import { useAuth } from "@/contexts/auth-context"

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, render the landing page
  return <HomePage />
}
