"use client"

import type React from "react"

import { useState, type InputHTMLAttributes, forwardRef } from "react"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check, AlertCircle } from "lucide-react"
import { ErrorMessage } from "./error-message"

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, success, icon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const isActive = isFocused || (props.value && props.value.toString().trim() !== "")

    return (
      <div className="relative mb-6">
        <div className="relative">
          <div
            className={cn(
              "group flex h-16 w-full rounded-lg border bg-background transition-colors",
              error ? "border-destructive" : success ? "border-green-500" : "border-input",
              isFocused && !error && "border-primary ring-2 ring-primary/20",
              className,
            )}
          >
            {/* The actual input element */}
            <input
              ref={ref}
              className={cn(
                "peer h-full w-full bg-transparent px-4 pt-6 pb-2 text-base outline-none placeholder:text-transparent",
                props.disabled && "cursor-not-allowed opacity-50",
              )}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={label} // For accessibility
              {...props}
            />

            {/* Floating label */}
            <div
              className={cn(
                "pointer-events-none absolute left-4 transition-all duration-200",
                isActive ? "top-2 text-xs" : "top-1/2 -translate-y-1/2 text-base",
                isFocused ? "text-primary" : "text-muted-foreground",
                error && "text-destructive",
                props.disabled && "opacity-50",
              )}
            >
              {label}
            </div>

            {/* Icon or validation indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {success && <Check className="h-5 w-5 text-green-500" />}
              {error && <AlertCircle className="h-5 w-5 text-destructive" />}
              {!success && !error && icon}
            </div>
          </div>
        </div>

        <AnimatePresence>{error && <ErrorMessage message={error} />}</AnimatePresence>
      </div>
    )
  },
)

FloatingInput.displayName = "FloatingInput"
