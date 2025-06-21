"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Header with logo and theme toggle - INCREASED SIZE */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 font-bold text-lg sm:text-xl">
          <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span>TestGenius AI</span>
        </div>
        <ThemeToggle size="large" />
      </header>

      {/* Main content - IMPROVED RESPONSIVENESS */}
      <main className="relative z-10 flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-8 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md sm:max-w-lg"
        >
          <div className="overflow-hidden rounded-2xl border bg-background/80 shadow-xl backdrop-blur-md">
            <div className="p-6 sm:p-8 lg:p-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
                {subtitle && <p className="mb-6 text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
              </motion.div>

              {children}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TestGenius AI. All rights reserved.
      </footer>
    </div>
  )
}
