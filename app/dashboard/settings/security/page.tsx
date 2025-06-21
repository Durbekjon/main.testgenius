"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Key, Lock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function SecuritySettingsPage() {
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
          <CardTitle>{t("settings.password")}</CardTitle>
          <CardDescription>{t("settings.password.change")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">API Keys</Label>
                <p className="text-sm text-muted-foreground">Manage your API keys for integrations.</p>
              </div>
              <Button variant="outline" size="sm">
                <Key className="mr-2 h-4 w-4" />
                Manage Keys
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sessions</Label>
                <p className="text-sm text-muted-foreground">Manage your active sessions on different devices.</p>
              </div>
              <Button variant="outline" size="sm">
                <Lock className="mr-2 h-4 w-4" />
                Manage Sessions
              </Button>
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
