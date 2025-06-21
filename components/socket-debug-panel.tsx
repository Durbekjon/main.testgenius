"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useOnlineTestSocket } from "@/hooks/use-socket"
import { ONLINE_TEST_EVENTS } from "@/lib/socket-service"

interface LogEntry {
  id: string
  timestamp: Date
  event: string
  data: any
}

export function SocketDebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [expanded, setExpanded] = useState(false)
  const [enabled, setEnabled] = useState(process.env.NODE_ENV !== "production")
  const { isConnected, on, emit } = useOnlineTestSocket()

  // Add a log entry
  const addLog = (event: string, data: any) => {
    if (!enabled) return

    setLogs((prev) =>
      [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          event,
          data,
        },
        ...prev,
      ].slice(0, 50),
    ) // Keep only the last 50 logs
  }

  // Listen to all socket events
  useEffect(() => {
    if (!isConnected || !enabled) return

    // Create a cleanup array
    const cleanupFunctions: Array<() => void> = []

    // Listen to all socket events we're interested in
    const events = Object.values(ONLINE_TEST_EVENTS)

    events.forEach((event) => {
      const cleanup = on(event, (data: any) => {
        addLog(event, data)
      })
      cleanupFunctions.push(cleanup)
    })

    // Log connection status changes
    addLog("connection_status", { connected: isConnected })

    return () => {
      cleanupFunctions.forEach((fn) => fn())
    }
  }, [isConnected, on, enabled])

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="border-primary/30 shadow-lg">
        <CardHeader className="bg-primary/5 py-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Socket Debug</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="debug-enabled" className="text-xs">
                Enabled
              </Label>
              <Switch id="debug-enabled" checked={enabled} onCheckedChange={setEnabled} size="sm" />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setExpanded(!expanded)}>
                {expanded ? "Collapse" : "Expand"}
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setLogs([])}>
                Clear
              </Button>
            </div>
          </div>
          <Badge variant={isConnected ? "success" : "destructive"} className="mt-1">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardHeader>
        {expanded && (
          <CardContent className="p-2">
            <ScrollArea className="h-60 rounded border p-2">
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No events logged yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="rounded border p-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[0.65rem]">
                          {log.event}
                        </Badge>
                        <span className="text-[0.65rem] text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="mt-1 max-h-24 overflow-auto rounded bg-muted p-1 text-[0.65rem]">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
