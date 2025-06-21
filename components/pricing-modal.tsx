"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: "$9.99",
    description: "Essential features for small tests",
    features: ["Up to 30 participants", "Basic question types", "24-hour test availability", "Standard reports"],
  },
  {
    name: "Standard",
    price: "$19.99",
    description: "Advanced features for professional use",
    features: [
      "Up to 100 participants",
      "All question types",
      "7-day test availability",
      "Detailed analytics",
      "Export to PDF/Excel",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$39.99",
    description: "Enterprise-grade testing solution",
    features: [
      "Unlimited participants",
      "Custom branding",
      "30-day test availability",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
  },
]

type PricingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [testAccess, setTestAccess] = useState<{
    code: string
    qrCode: string
    link: string
  } | null>(null)
  const { t } = useLanguage()

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName)
    // Generate test access details
    setTestAccess({
      code: `TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      qrCode: "/placeholder.svg?height=200&width=200",
      link: `https://testgenius.ai/test/${Math.random().toString(36).substring(2, 10)}`,
    })
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("pricing.title")}</DialogTitle>
          <DialogDescription>{t("pricing.subtitle")}</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!selectedPlan ? (
            <motion.div
              key="pricing-tiers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4 md:grid-cols-3"
            >
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={cn(
                    "relative overflow-hidden transition-all hover:shadow-lg",
                    tier.highlighted && "border-primary shadow-md",
                  )}
                >
                  {tier.highlighted && (
                    <div className="absolute right-0 top-0 h-16 w-16">
                      <div className="absolute right-0 top-0 h-16 w-16 rotate-45 translate-x-1/2 -translate-y-1/2 bg-primary text-xs text-primary-foreground">
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-medium">
                          {t("pricing.popular")}
                        </span>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{t(`pricing.${tier.name.toLowerCase()}`)}</CardTitle>
                    <CardDescription>{t(`pricing.${tier.name.toLowerCase()}_desc`)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-3xl font-bold">
                      {tier.price}{" "}
                      <span className="text-sm font-normal text-muted-foreground">{t("pricing.per_month")}</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={cn("w-full", tier.highlighted ? "bg-primary" : "bg-primary/90")}
                      onClick={() => handleSelectPlan(tier.name)}
                    >
                      {t("pricing.select_plan")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="test-access"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold">
                  {t(`pricing.${selectedPlan.toLowerCase()}`)} {t("pricing.plan_selected")}
                </h3>
                <p className="text-muted-foreground">{t("pricing.test_ready")}</p>
              </div>

              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="code">{t("monitor.access_code")}</TabsTrigger>
                  <TabsTrigger value="qr">{t("monitor.qr_code")}</TabsTrigger>
                  <TabsTrigger value="link">{t("pricing.invite_link")}</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pricing.unique_code")}</CardTitle>
                      <CardDescription>{t("pricing.share_code")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Input value={testAccess?.code} readOnly className="font-mono text-lg" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyToClipboard(testAccess?.code || "")}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy code</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="qr" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("monitor.qr_code")}</CardTitle>
                      <CardDescription>{t("pricing.scan_qr")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="rounded-lg border bg-background p-2">
                        <img src={testAccess?.qrCode || "/placeholder.svg"} alt="QR Code" className="h-48 w-48" />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button variant="outline">Download QR Code</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="link" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pricing.invite_link")}</CardTitle>
                      <CardDescription>{t("pricing.share_link")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Input value={testAccess?.link} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyToClipboard(testAccess?.link || "")}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy link</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlan(null)
                    setTestAccess(null)
                  }}
                >
                  {t("pricing.back_to_plans")}
                </Button>
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    window.location.href = "/dashboard/monitor"
                  }}
                >
                  {t("pricing.go_to_monitoring")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
