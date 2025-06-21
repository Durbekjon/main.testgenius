"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useColorTheme } from "@/contexts/color-theme-context"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isMounted, setIsMounted] = useState(false)
  const { colorTheme } = useColorTheme()

  // Load theme from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (!isMounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, isMounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!isMounted) return
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(mediaQuery.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, isMounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
      // Save theme preference to localStorage
      if (isMounted) {
        localStorage.setItem("theme", theme)
      }
    },
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
