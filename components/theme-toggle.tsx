"use client"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ThemeToggleProps {
  size?: "default" | "large"
  tooltip?: string
}

export function ThemeToggle({ size = "default", tooltip }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const iconSize = size === "large" ? "h-6 w-6" : "h-5 w-5"
  const buttonSize = size === "large" ? "h-10 w-10" : "h-9 w-9"

  const button = (
    <Button variant="outline" size="icon" className={`relative rounded-full ${buttonSize}`}>
      {/* Light mode icon */}
      {theme === "light" && (
        <motion.div
          initial={{ opacity: 0, rotate: 180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sun className={`${iconSize} text-foreground`} />
        </motion.div>
      )}

      {/* Dark mode icon */}
      {theme === "dark" && (
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Moon className={`${iconSize} text-foreground`} />
        </motion.div>
      )}

      {/* System mode icon - shows both sun and moon */}
      {theme === "system" && (
        <div className="relative flex items-center justify-center">
          <Sun className={`${iconSize} absolute text-foreground opacity-100 dark:opacity-0 transition-opacity`} />
          <Moon className={`${iconSize} absolute text-foreground opacity-0 dark:opacity-100 transition-opacity`} />
        </div>
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  )

  if (!tooltip) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {button}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === "light" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <Sun className="h-3 w-3 absolute dark:opacity-0 opacity-100 transition-opacity" />
              <Moon className="h-3 w-3 absolute opacity-0 dark:opacity-100 transition-opacity" />
            </div>
            <span>System</span>
            {theme === "system" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {button}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
              {theme === "light" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
              {theme === "dark" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
              <div className="relative flex h-4 w-4 items-center justify-center">
                <Sun className="h-3 w-3 absolute dark:opacity-0 opacity-100 transition-opacity" />
                <Moon className="h-3 w-3 absolute opacity-0 dark:opacity-100 transition-opacity" />
              </div>
              <span>System</span>
              {theme === "system" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
