import { AuthLayout } from "@/components/auth/auth-layout"

export default function GoogleCallbackLoading() {
  return (
    <AuthLayout title="Google Authentication" subtitle="Processing your Google sign in...">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Please wait while we authenticate your Google account...</p>
        </div>
      </div>
    </AuthLayout>
  )
}
