"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, QrCode, LinkIcon, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type TestAccessInfoProps = {
  testCode: string
  testLink: string
  qrCodeUrl: string
}

export function TestAccessInfo({ testCode, testLink, qrCodeUrl }: TestAccessInfoProps) {
  const [activeTab, setActiveTab] = useState("code")
  const [copied, setCopied] = useState<"code" | "link" | null>(null)
  const [isQrLoading, setIsQrLoading] = useState(false)

  // When the activeTab changes to "qr", set loading state
  const handleTabChange = (value: string) => {
    if (value === "qr") {
      setIsQrLoading(true)
      // Simulate QR code generation delay
      setTimeout(() => {
        setIsQrLoading(false)
      }, 1000)
    }
    setActiveTab(value)
  }

  const handleCopy = (type: "code" | "link", text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)

    toast({
      title: "Copied to clipboard",
      description: type === "code" ? "Access code copied to clipboard" : "Join link copied to clipboard",
    })

    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Test Access Information</CardTitle>
        <CardDescription>Share this information with participants to allow them to join the test</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <span className="font-mono text-xs">ABC</span>
              <span>Access Code</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>Direct Link</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="code" className="mt-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Share this code with participants to join the test:</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={testCode} readOnly className="font-mono text-lg text-center" />
                  <Button variant="outline" size="icon" onClick={() => handleCopy("code", testCode)}>
                    {copied === "code" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy code</span>
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Participants can enter this code on the test platform to join.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-muted-foreground">Participants can scan this QR code to join the test:</p>
                <div className="rounded-lg border bg-background p-2">
                  {isQrLoading ? (
                    <div className="flex h-48 w-48 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-48 w-48" />
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Download QR Code
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Share this link with participants to join the test:</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={testLink} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={() => handleCopy("link", testLink)}>
                    {copied === "link" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Participants can click this link to directly join the test.
                </p>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-4">
        <p className="text-center text-sm text-muted-foreground">
          <strong>Note:</strong> This information will no longer be accessible once the test starts.
        </p>
      </CardFooter>
    </Card>
  )
}
