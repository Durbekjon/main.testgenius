"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Languages, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Update your basic profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" defaultValue="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Teacher" />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us about yourself"
            defaultValue="I'm a high school teacher specializing in mathematics and computer science."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select
              id="language"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="en-US"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="America/New_York"
            >
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
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
  )
}

// Remove the duplicate settings UI since it's now properly handled by the layout
export default function SettingsPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Update your basic profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" defaultValue="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Teacher" />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us about yourself"
            defaultValue="I'm a high school teacher specializing in mathematics and computer science."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select
              id="language"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="en-US"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="America/New_York"
            >
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
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
  )
}
