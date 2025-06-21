"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-1.5 text-xs text-destructive mt-1.5"
    >
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{message}</span>
    </motion.div>
  )
}
