"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

export default function AdvancedSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleExportData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    // Simulate download
    const dummyData = {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Teacher",
      },
      tests: [
        { id: 1, title: "Algebra Fundamentals", questions: 15 },
        { id: 2, title: "Cell Biology Basics", questions: 20 },
      ],
    }

    const dataStr = JSON.stringify(dummyData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "user-data.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Configure advanced options for your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Data Export</Label>
              <p className="text-sm text-muted-foreground">Export all your data in JSON or CSV format.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} disabled={isLoading}>
              {isLoading ? t("common.loading") : "Export Data"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
