"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const getActiveTab = () => {
    if (pathname.includes("/settings/security")) return "security"
    if (pathname.includes("/settings/notifications")) return "notifications"
    if (pathname.includes("/settings/billing")) return "billing"
    if (pathname.includes("/settings/appearance")) return "appearance"
    if (pathname.includes("/settings/advanced")) return "advanced"
    return "general"
  }

  return (
    <div className="space-y-6" key={`settings-layout-${t("settings.title")}`}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue={getActiveTab()} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full max-w-4xl">
          <TabsTrigger value="general" asChild>
            <Link href="/dashboard/settings">{t("settings.general")}</Link>
          </TabsTrigger>
          <TabsTrigger value="security" asChild>
            <Link href="/dashboard/settings/security">{t("settings.security")}</Link>
          </TabsTrigger>
          <TabsTrigger value="notifications" asChild>
            <Link href="/dashboard/settings/notifications">{t("settings.notifications")}</Link>
          </TabsTrigger>
          <TabsTrigger value="billing" asChild>
            <Link href="/dashboard/settings/billing">{t("settings.billing")}</Link>
          </TabsTrigger>
          <TabsTrigger value="appearance" asChild>
            <Link href="/dashboard/settings/appearance">{t("settings.appearance")}</Link>
          </TabsTrigger>
          <TabsTrigger value="advanced" asChild>
            <Link href="/dashboard/settings/advanced">{t("settings.advanced")}</Link>
          </TabsTrigger>
        </TabsList>

        {children}
      </Tabs>
    </div>
  )
}
