"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { useColorTheme, type ColorTheme } from "@/contexts/color-theme-context"
import { useLanguage } from "@/contexts/language-context"
import { Check } from "lucide-react"

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(colorTheme)

  const handleSave = async () => {
    setIsLoading(true)

    // Apply the selected theme
    setColorTheme(selectedTheme)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleReset = () => {
    setTheme("system")
    setColorTheme("default")
    setFontSize("medium")
    setSelectedTheme("default")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.appearance.title")}</h2>
        <p className="text-muted-foreground">{t("settings.appearance.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance.title")}</CardTitle>
          <CardDescription>{t("settings.appearance.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("settings.appearance.dark_mode")}</Label>
                <p className="text-sm text-muted-foreground">{t("settings.appearance.dark_mode.desc")}</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">{t("settings.appearance.theme")}</Label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { id: "default", color: "#7c3aed", label: t("theme.default") },
                  { id: "purple", color: "#8b5cf6", label: t("theme.purple") },
                  { id: "blue", color: "#3b82f6", label: t("theme.blue") },
                  { id: "green", color: "#10b981", label: t("theme.green") },
                  { id: "red", color: "#ef4444", label: t("theme.red") },
                  { id: "orange", color: "#f59e0b", label: t("theme.orange") },
                ].map((theme) => (
                  <div key={theme.id} className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      className="relative h-10 w-10 rounded-full cursor-pointer border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: theme.color,
                        borderColor: selectedTheme === theme.id ? "hsl(var(--foreground))" : "transparent",
                      }}
                      onClick={() => setSelectedTheme(theme.id as ColorTheme)}
                      aria-label={theme.label}
                    >
                      {selectedTheme === theme.id && <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />}
                    </button>
                    <span className="text-xs">{theme.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">{t("settings.appearance.font_size")}</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t("settings.appearance.reset")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("common.loading") : t("common.save_changes")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
