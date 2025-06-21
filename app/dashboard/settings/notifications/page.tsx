"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"

export default function NotificationsSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how and when you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Test Completions</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when students complete tests.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports of test activities.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Product Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about new features and improvements.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and marketing materials.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">In-App Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Test Results</Label>
                <p className="text-sm text-muted-foreground">Show notifications for test results.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Comments</Label>
                <p className="text-sm text-muted-foreground">Show notifications for comments on your tests.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Reminders</Label>
                <p className="text-sm text-muted-foreground">Show reminders for upcoming tests.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">{t("common.cancel")}</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("common.loading") : t("common.save_changes")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
