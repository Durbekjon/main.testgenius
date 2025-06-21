"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { TOKEN_KEYS } from "@/lib/auth"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the tokens from the URL
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")

        if (!accessToken || !refreshToken) {
          throw new Error("Tokens not found")
        }

        // Save tokens using consistent keys
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)

        toast({
          title: "Google sign in successful",
          description: "You have successfully signed in with Google.",
        })

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("Google callback error:", error)
        setError(error instanceof Error ? error.message : "Authentication failed")

        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <AuthLayout
      title="Google Authentication"
      subtitle={
        isLoading ? "Processing your Google sign in..." : error ? "Authentication failed" : "Authentication successful"
      }
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Please wait while we authenticate your Google account...</p>
          </div>
        ) : error ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => router.push("/auth/signin")} className="w-full">
              Back to Sign In
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">You have successfully signed in with Google.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
