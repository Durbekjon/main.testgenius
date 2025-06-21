"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, FileText, Plus, Users } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentActivity } from "@/components/recent-activity"
import { useLanguage } from "@/contexts/language-context"
import { useModal } from "@/contexts/modal-context"

// Define types for dashboard stats
interface DashboardStats {
  totalTests: number
  activeUsers: number
  completionRate: number
  testsGrowth: string
  usersGrowth: string
  rateGrowth: string
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { setIsPricingModalOpen } = useModal()
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    activeUsers: 0,
    completionRate: 0,
    testsGrowth: "0%",
    usersGrowth: "0%",
    rateGrowth: "0%",
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        // This would be a real API call in production
        // const response = await fetchWithAuth(`${API_ENDPOINTS.DASHBOARD}/stats`)
        // const data = await response.json()

        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            totalTests: 142,
            activeUsers: 2853,
            completionRate: 87,
            testsGrowth: "+22%",
            usersGrowth: "+18%",
            rateGrowth: "+5%",
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => (window.location.href = "/dashboard/create")}>
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.create")}
        </Button>
      </div>

      {/* Stats Cards Grid - Displays key metrics in a responsive 3-column layout 
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.total_tests")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">{stats.testsGrowth} from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.active_users")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.usersGrowth} from last month</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.completion_rate")}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.rateGrowth} from last month</p>
          </CardContent>
        </Card>
      </div>
*/}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("dashboard.overview")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("dashboard.analytics")}</TabsTrigger>
          <TabsTrigger value="reports">{t("dashboard.reports")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{t("dashboard.activity")}</CardTitle>
                <CardDescription>Number of tests generated over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {/* <DashboardChart /> */}
              </CardContent>
            </Card>
            <Card className="col-span-3 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{t("dashboard.recent")}</CardTitle>
                <CardDescription>{t("dashboard.recent_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tab would contain more detailed analytics about test performance, user engagement, and other
                metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
              <CardDescription>Generated reports will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tab would contain downloadable reports and summaries of test results and platform usage.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
