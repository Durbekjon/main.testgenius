"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Sample data for the chart
const data = [
  { date: "Jan 1", tests: 5, users: 120 },
  { date: "Jan 5", tests: 8, users: 150 },
  { date: "Jan 10", tests: 12, users: 180 },
  { date: "Jan 15", tests: 10, users: 220 },
  { date: "Jan 20", tests: 15, users: 250 },
  { date: "Jan 25", tests: 18, users: 280 },
  { date: "Jan 30", tests: 22, users: 300 },
  { date: "Feb 5", tests: 25, users: 320 },
  { date: "Feb 10", tests: 30, users: 350 },
  { date: "Feb 15", tests: 35, users: 380 },
  { date: "Feb 20", tests: 32, users: 400 },
  { date: "Feb 25", tests: 40, users: 450 },
]

export function DashboardChart() {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // Reduced loading time for better UX

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="tests"
                name="Tests Generated"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                yAxisId="right"
                dataKey="users"
                name="Active Users"
                fill="hsl(var(--muted-foreground))"
                radius={[4, 4, 0, 0]}
                barSize={20}
                opacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tests"
                name="Tests Generated"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="tests"
                name="Tests Generated"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Test Generation Activity</CardTitle>
        <Tabs
          value={chartType}
          onValueChange={(value) => setChartType(value as "bar" | "line" | "area")}
          className="w-[180px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Number of tests generated over the past 30 days</p>
        {renderChart()}
      </CardContent>
    </Card>
  )
}
