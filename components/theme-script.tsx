"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem("theme") || "system"
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (savedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(savedTheme)
  }, [])

  return null
}
