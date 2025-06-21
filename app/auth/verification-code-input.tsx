"use client"

// Update the VerificationCodeInput component to show error message
import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@/components/auth/error-message"

interface VerificationCodeInputProps {
  length?: number
  onChange: (code: string) => void
  error?: boolean
  errorMessage?: string
}

export function VerificationCodeInput({
  length = 6,
  onChange,
  error = false,
  errorMessage,
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length)

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [length])

  useEffect(() => {
    onChange(code.join(""))
  }, [code, onChange])

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.charAt(value.length - 1)
    }

    // Update code state
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input if value is entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!code[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus()
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      e.preventDefault()
      inputRefs.current[index - 1].focus()
    }

    if (e.key === "ArrowRight" && index < length - 1 && inputRefs.current[index + 1]) {
      e.preventDefault()
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only process if pasted data looks like a verification code
    if (pastedData.length === length && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("")
      setCode(newCode)

      // Focus last input
      if (inputRefs.current[length - 1]) {
        inputRefs.current[length - 1].focus()
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "h-14 w-12 rounded-lg border bg-background text-center text-xl font-bold transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-16 sm:w-14",
                error ? "border-destructive animate-shake" : "border-input",
              )}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {error && errorMessage && (
          <div className="flex justify-center">
            <ErrorMessage message={errorMessage} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
