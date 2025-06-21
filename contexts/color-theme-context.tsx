"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type ColorTheme = "default" | "purple" | "blue" | "green" | "red" | "orange"

type ColorThemeContextType = {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const themeColors = {
  default: {
    primary: "252 59% 48%",
    primaryDark: "252 59% 54%",
    ring: "252 59% 48%",
    ringDark: "252 59% 54%",
  },
  purple: {
    primary: "270 59% 48%",
    primaryDark: "270 59% 54%",
    ring: "270 59% 48%",
    ringDark: "270 59% 54%",
  },
  blue: {
    primary: "220 59% 48%",
    primaryDark: "220 59% 54%",
    ring: "220 59% 48%",
    ringDark: "220 59% 54%",
  },
  green: {
    primary: "142 59% 40%",
    primaryDark: "142 59% 46%",
    ring: "142 59% 40%",
    ringDark: "142 59% 46%",
  },
  red: {
    primary: "0 59% 48%",
    primaryDark: "0 59% 54%",
    ring: "0 59% 48%",
    ringDark: "0 59% 54%",
  },
  orange: {
    primary: "30 59% 48%",
    primaryDark: "30 59% 54%",
    ring: "30 59% 48%",
    ringDark: "30 59% 54%",
  },
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorTheme: "default",
  setColorTheme: () => {},
})

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("purple")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme
    if (savedColorTheme && Object.keys(themeColors).includes(savedColorTheme)) {
      setColorThemeState(savedColorTheme)
      applyColorTheme(savedColorTheme)
    } else {
      // Apply purple theme by default if no saved theme
      setColorThemeState("purple")
      applyColorTheme("purple")
      if (typeof window !== "undefined") {
        localStorage.setItem("colorTheme", "purple")
      }
    }
  }, [])

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
    applyColorTheme(theme)
    if (typeof window !== "undefined") {
      localStorage.setItem("colorTheme", theme)
    }
  }

  const applyColorTheme = (theme: ColorTheme) => {
    const root = document.documentElement
    const colors = themeColors[theme]

    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--ring", colors.ring)

    // Apply dark mode colors if in dark mode
    if (root.classList.contains("dark")) {
      root.style.setProperty("--primary", colors.primaryDark)
      root.style.setProperty("--ring", colors.ringDark)
    }
  }

  // Listen for theme changes
  useEffect(() => {
    if (!mounted) return

    const handleThemeChange = () => {
      applyColorTheme(colorTheme)
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", handleThemeChange)

    return () => mediaQuery.removeEventListener("change", handleThemeChange)
  }, [colorTheme, mounted])

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>{children}</ColorThemeContext.Provider>
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext)
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return context
}
