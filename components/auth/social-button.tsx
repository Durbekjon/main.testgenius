"use client"

import type React from "react"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  provider: "google" | "meta"
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ icon, provider, className, children, ...props }, ref) => {
    const getProviderStyles = () => {
      switch (provider) {
        case "google":
          return "border-[#4285F4]/30 hover:bg-[#4285F4]/5 active:bg-[#4285F4]/10"
        case "meta":
          return "border-[#1877F2]/30 hover:bg-[#1877F2]/5 active:bg-[#1877F2]/10"
        default:
          return "border-input hover:bg-accent"
      }
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-3 rounded-lg border bg-background px-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          getProviderStyles(),
          className,
        )}
        {...props}
      >
        {icon}
        {children}
      </motion.button>
    )
  },
)

SocialButton.displayName = "SocialButton"
