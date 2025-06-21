"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useModal } from "@/contexts/modal-context"

export default function BillingSettingsPage() {
  const { t } = useLanguage()
  const { setIsPricingModalOpen } = useModal()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Manage your subscription and billing information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">Free Plan</h3>
              <p className="text-sm text-muted-foreground">Basic features for small tests</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Up to 30 participants
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Basic question types
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  24-hour test availability
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Standard reports
                </li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground">per month</p>
              <Button className="mt-4" variant="outline" disabled>
                Current Plan
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 hover:border-primary hover:shadow-sm transition-all">
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-lg font-medium">Standard Plan</h3>
                <p className="text-sm text-muted-foreground">Advanced features for professional use</p>
                <p className="mt-2 text-2xl font-bold">
                  $19.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Up to 100 participants
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    All question types
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    7-day test availability
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Detailed analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Export to PDF/Excel
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <Button className="w-full" onClick={() => setIsPricingModalOpen(true)}>
                  Upgrade to Standard
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 hover:border-primary hover:shadow-sm transition-all">
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-lg font-medium">Premium Plan</h3>
                <p className="text-sm text-muted-foreground">Enterprise-grade testing solution</p>
                <p className="mt-2 text-2xl font-bold">
                  $39.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Unlimited participants
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    30-day test availability
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Priority support
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <Button className="w-full" onClick={() => setIsPricingModalOpen(true)}>
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          <p className="text-sm text-muted-foreground">Add a payment method to upgrade your plan.</p>

          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing History</h3>
          <p className="text-sm text-muted-foreground">View your billing history and download invoices.</p>

          <div className="rounded-md border">
            <div className="p-4 text-center text-sm text-muted-foreground">No billing history available.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
