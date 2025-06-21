"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingInput } from "@/components/auth/floating-input"
import { PasswordStrength } from "@/components/auth/password-strength"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { api, API_ENDPOINTS } from "@/lib/api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; token?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if token is present
    if (!token) {
      setErrors({ token: "Invalid or missing reset token" })
      toast({
        title: "Error",
        description: "Invalid or missing reset token. Please request a new password reset link.",
        variant: "destructive",
      })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate inputs
    let hasErrors = false
    const newErrors: { password?: string; confirmPassword?: string; token?: string } = {}

    if (!token) {
      newErrors.token = "Invalid or missing reset token"
      hasErrors = true
    }

    if (!password) {
      newErrors.password = "Password is required"
      hasErrors = true
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      hasErrors = true
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      hasErrors = true
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    // Reset password
    setIsLoading(true)

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password,
      })

      // Show success message
      setIsSuccess(true)

      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now sign in with your new password.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      setErrors({
        token: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      })

      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Please try again or request a new reset link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title={isSuccess ? "Password Reset Complete" : "Reset Your Password"}
      subtitle={isSuccess ? "Your password has been successfully reset" : "Create a new password for your account"}
    >
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Your password has been successfully reset. You can now sign in with your new password.</p>
          </div>

          <Link href="/auth/signin">
            <Button className="h-12 w-full text-base">Go to Sign In</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {errors.token ? (
            <div className="space-y-6">
              <div className="text-center text-sm text-destructive">
                <p>{errors.token}</p>
              </div>
              <Link href="/auth/forgot-password">
                <Button variant="outline" className="h-12 w-full text-base">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Forgot Password
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FloatingInput
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                autoComplete="new-password"
                disabled={isLoading}
              />

              {password && <PasswordStrength password={password} />}

              <FloatingInput
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                autoComplete="new-password"
                disabled={isLoading}
              />

              <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <ArrowLeft className="mr-1 inline-block h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </AuthLayout>
  )
}
