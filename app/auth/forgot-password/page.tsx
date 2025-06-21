"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingInput } from "@/components/auth/floating-input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import { API_ENDPOINTS } from "@/lib/api-endpoints"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate email
    if (!email) {
      setErrors({ email: "Email is required" })
      return
    } else if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    // Send password reset request
    setIsLoading(true)

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      const data = response.data

      // Show success message
      setIsSubmitted(true)

      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
      })
    } catch (error) {
      console.error("Password reset error:", error)

      // We don't want to reveal if an email exists in the system for security reasons
      // So we show success message even if the email doesn't exist
      setIsSubmitted(true)

      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you'll receive a password reset link.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title={isSubmitted ? "Check Your Email" : "Reset Your Password"}
      subtitle={
        isSubmitted
          ? `We've sent a password reset link to ${email}`
          : "Enter your email to receive a password reset link"
      }
    >
      {isSubmitted ? (
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
            <p>
              If an account exists with this email, you'll receive a password reset link shortly. Please check your
              inbox and spam folder.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full text-base"
              onClick={() => {
                setIsSubmitted(false)
                setEmail("")
              }}
            >
              Send to a different email
            </Button>

            <Link href="/auth/signin">
              <Button variant="outline" className="h-12 w-full text-base">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="h-5 w-5" />}
              autoComplete="email"
              disabled={isLoading}
            />

            <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ArrowLeft className="mr-1 inline-block h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </AuthLayout>
  )
}
