"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string): number => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return Math.min(strength, 4)
  }

  const strength = getStrength(password)

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return "Too weak"
    if (strength === 1) return "Weak"
    if (strength === 2) return "Fair"
    if (strength === 3) return "Good"
    return "Strong"
  }

  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return "bg-destructive/50"
    if (strength === 1) return "bg-destructive"
    if (strength === 2) return "bg-yellow-500"
    if (strength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthIcon = (strength: number) => {
    if (strength === 0) return <ShieldX className="h-4 w-4 text-destructive/50" />
    if (strength === 1) return <ShieldAlert className="h-4 w-4 text-destructive" />
    if (strength === 2) return <ShieldQuestion className="h-4 w-4 text-yellow-500" />
    if (strength === 3) return <Shield className="h-4 w-4 text-blue-500" />
    return <ShieldCheck className="h-4 w-4 text-green-500" />
  }

  const getRequirements = () => {
    const requirements = [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
      { text: "At least 1 lowercase letter", met: /[a-z]/.test(password) },
      { text: "At least 1 number", met: /[0-9]/.test(password) },
      { text: "At least 1 special character", met: /[^A-Za-z0-9]/.test(password) },
    ]

    return requirements
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex h-1.5 w-full gap-1.5">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: strength >= index ? 1 : 0,
              opacity: strength >= index ? 1 : 0.3,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "h-full w-1/4 origin-left rounded-full transition-colors",
              strength >= index ? getStrengthColor(strength) : "bg-muted",
            )}
          />
        ))}
      </div>

      {password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-xs">
            {getStrengthIcon(strength)}
            <span className="font-medium">
              Password strength:{" "}
              <span
                className={cn(
                  strength === 0 && "text-destructive/50",
                  strength === 1 && "text-destructive",
                  strength === 2 && "text-yellow-500",
                  strength === 3 && "text-blue-500",
                  strength === 4 && "text-green-500",
                )}
              >
                {getStrengthText(strength)}
              </span>
            </span>
          </div>

          {strength < 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-2 space-y-1 overflow-hidden rounded-md border border-muted bg-muted/20 p-2"
            >
              <p className="text-xs font-medium">Requirements:</p>
              <ul className="space-y-1 text-xs">
                {getRequirements().map((req, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    <div
                      className={cn("h-1.5 w-1.5 rounded-full", req.met ? "bg-green-500" : "bg-muted-foreground/50")}
                    />
                    <span className={req.met ? "text-foreground" : "text-muted-foreground"}>{req.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
