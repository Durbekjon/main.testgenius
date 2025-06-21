"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface LanguageSwitcherProps {
  tooltip?: string
}

export function LanguageSwitcher({ tooltip }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()

  const button = (
    <Button variant="outline" size="icon" className="rounded-full">
      <Globe className="h-5 w-5" />
      <span className="sr-only">{t("language.select")}</span>
    </Button>
  )

  if (!tooltip) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {button}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span>{t("language.english")}</span>
            {language === "en" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("ru")} className="flex items-center gap-2">
            <span>🇷🇺</span>
            <span>{t("language.russian")}</span>
            {language === "ru" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("uz")} className="flex items-center gap-2">
            <span>🇺🇿</span>
            <span>{t("language.uzbek")}</span>
            {language === "uz" && (
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
            <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>{t("language.english")}</span>
              {language === "en" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ru")} className="flex items-center gap-2">
              <span>🇷🇺</span>
              <span>{t("language.russian")}</span>
              {language === "ru" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("uz")} className="flex items-center gap-2">
              <span>🇺🇿</span>
              <span>{t("language.uzbek")}</span>
              {language === "uz" && (
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
