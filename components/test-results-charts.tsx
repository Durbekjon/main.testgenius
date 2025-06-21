"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, PieChart, Table2, FileText } from "lucide-react"

// Mock data for charts
const mockPerformanceData = [
  { name: "Excellent (90-100%)", value: 15, color: "#22c55e" },
  { name: "Good (75-89%)", value: 25, color: "#3b82f6" },
  { name: "Average (60-74%)", value: 35, color: "#eab308" },
  { name: "Below Average (40-59%)", value: 18, color: "#f97316" },
  { name: "Poor (0-39%)", value: 7, color: "#ef4444" },
]

const mockParticipantScores = [
  { name: "John Smith", score: 85 },
  { name: "Emily Johnson", score: 92 },
  { name: "Michael Brown", score: 67 },
  { name: "Sarah Davis", score: 45 },
  { name: "David Wilson", score: 78 },
  { name: "Lisa Thompson", score: 88 },
  { name: "Robert Garcia", score: 72 },
  { name: "Jennifer Martinez", score: 63 },
  { name: "William Anderson", score: 91 },
  { name: "Elizabeth Taylor", score: 55 },
]

type TestResultsChartsProps = {
  gradingSystem: "percentage" | "points"
}

export function TestResultsCharts({ gradingSystem }: TestResultsChartsProps) {
  const [chartType, setChartType] = useState<"pie" | "bar" | "table">("pie")

  // Calculate total for pie chart
  const total = mockPerformanceData.reduce((acc, item) => acc + item.value, 0)

  // Convert score to display format based on grading system
  const formatScore = (score: number) => {
    return gradingSystem === "percentage" ? `${score}%` : (score / 10).toFixed(1)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Test Performance</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs
              value={chartType}
              onValueChange={(value) => setChartType(value as "pie" | "bar" | "table")}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pie" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Distribution</span>
                </TabsTrigger>
                <TabsTrigger value="bar" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Scores</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-1">
                  <Table2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          {chartType === "pie" && "Overall performance distribution across all participants"}
          {chartType === "bar" && "Individual scores comparison"}
          {chartType === "table" && "Detailed score breakdown by participant"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          {chartType === "pie" && (
            <motion.div
              key="pie-chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative h-64 w-64">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  {mockPerformanceData.map((item, index) => {
                    // Calculate the pie slice
                    const percentage = (item.value / total) * 100
                    const previousPercentages = mockPerformanceData
                      .slice(0, index)
                      .reduce((acc, curr) => acc + (curr.value / total) * 100, 0)

                    // Calculate the SVG arc path
                    const startAngle = (previousPercentages / 100) * 360
                    const endAngle = ((previousPercentages + percentage) / 100) * 360

                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

                    const largeArcFlag = percentage > 50 ? 1 : 0

                    const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(
                      " ",
                    )

                    // Calculate position for the hover tooltip
                    const midAngle = startAngle + (endAngle - startAngle) / 2
                    const tooltipX = 50 + 30 * Math.cos((midAngle * Math.PI) / 180)
                    const tooltipY = 50 + 30 * Math.sin((midAngle * Math.PI) / 180)

                    return (
                      <g key={item.name} className="group">
                        <motion.path
                          d={pathData}
                          fill={item.color}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="cursor-pointer transition-all hover:opacity-80"
                          onMouseEnter={() => {
                            // You could add state here to track which segment is hovered
                          }}
                        />
                        <g
                          className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ transform: `translate(${tooltipX}px, ${tooltipY}px)` }}
                        >
                          <rect x="-20" y="-10" width="40" height="20" rx="5" fill="black" fillOpacity="0.8" />
                          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="6">
                            {item.name}: {item.value} ({percentage.toFixed(1)}%)
                          </text>
                        </g>
                      </g>
                    )
                  })}
                  <circle cx="50" cy="50" r="25" fill="white" />
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold">
                    {total} Total
                  </text>
                </svg>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {mockPerformanceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {chartType === "bar" && (
            <motion.div
              key="bar-chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-80"
            >
              <div className="flex h-full flex-col">
                <div className="flex flex-1 items-end gap-2">
                  {mockParticipantScores.map((participant, index) => {
                    const barHeight = (participant.score / 100) * 100
                    const barColor = getBarColor(participant.score)

                    return (
                      <div key={participant.name} className="group relative flex flex-1 flex-col items-center">
                        <div className="absolute -top-10 z-10 w-32 scale-0 rounded-md bg-black/80 p-2 text-center text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                          <div className="font-medium">{participant.name}</div>
                          <div className="mt-1 flex justify-between">
                            <span>Score:</span>
                            <span className="font-mono">{formatScore(participant.score)}</span>
                          </div>
                          <div className="mt-0.5 flex justify-between">
                            <span>Correct:</span>
                            <span className="font-mono text-green-400">{Math.floor(participant.score / 10)}/10</span>
                          </div>
                          <div className="mt-0.5 flex justify-between">
                            <span>Time:</span>
                            <span className="font-mono">{20 + Math.floor(Math.random() * 40)}m</span>
                          </div>
                        </div>
                        <motion.div
                          className="relative w-full rounded-t transition-all group-hover:brightness-110"
                          style={{ backgroundColor: barColor, height: `${barHeight}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeight}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-2 flex gap-2">
                  {mockParticipantScores.map((participant) => (
                    <div
                      key={participant.name}
                      className="flex-1 truncate text-center text-xs"
                      title={participant.name}
                    >
                      {participant.name.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {chartType === "table" && (
            <motion.div
              key="table-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-3">Participant</div>
                  <div className="col-span-2 text-center">Score</div>
                  <div className="col-span-2 text-center">Correct</div>
                  <div className="col-span-2 text-center">Time Spent</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1 text-center">Details</div>
                </div>
                <div className="divide-y">
                  {mockParticipantScores.map((participant, index) => {
                    // Generate mock data for each participant
                    const correctAnswers = Math.floor(participant.score / 10)
                    const totalQuestions = 10
                    const timeSpent = 20 + Math.floor(Math.random() * 40)
                    const cheatingAttempts = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0

                    return (
                      <motion.div
                        key={participant.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30"
                      >
                        <div className="col-span-3 font-medium">{participant.name}</div>
                        <div className="col-span-2 text-center font-medium">{formatScore(participant.score)}</div>
                        <div className="col-span-2 text-center">
                          <span className="font-mono text-green-600">{correctAnswers}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="font-mono">{totalQuestions}</span>
                        </div>
                        <div className="col-span-2 text-center font-mono">{timeSpent}m</div>
                        <div className="col-span-2 text-center">
                          {cheatingAttempts > 0 ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              {cheatingAttempts} Suspicious
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Clean
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Helper function to get performance label
function getPerformanceLabel(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 75) return "Good"
  if (score >= 60) return "Average"
  if (score >= 40) return "Below Average"
  return "Poor"
}

// Helper function to get bar color
function getBarColor(score: number): string {
  if (score >= 90) return "#22c55e" // green
  if (score >= 75) return "#3b82f6" // blue
  if (score >= 60) return "#eab308" // yellow
  if (score >= 40) return "#f97316" // orange
  return "#ef4444" // red
}
