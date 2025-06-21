import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import type { DateRange } from 'react-day-picker'
import { AnalyticsService, type DashboardStats } from '@/lib/services/analytics'

interface UseAnalyticsOptions {
  initialDateRange?: DateRange
  limitLatestTests?: number
}

interface UseAnalyticsReturn {
  stats: DashboardStats | null
  isLoading: boolean
  error: Error | null
  dateRange: DateRange | undefined
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>
  exportToCSV: () => Promise<void>
}

export function useAnalytics({ 
  initialDateRange = {
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date()
  },
  limitLatestTests = 7
}: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange)

  useEffect(() => {
    const fetchStats = async () => {
      if (!dateRange?.from || !dateRange?.to) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await AnalyticsService.getDashboardStats(dateRange, limitLatestTests)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [dateRange, limitLatestTests])

  const exportToCSV = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    try {
      setIsLoading(true)
      setError(null)
      const blob = await AnalyticsService.exportToCSV(dateRange)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'analytics_report.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to export data'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    isLoading,
    error,
    dateRange,
    setDateRange,
    exportToCSV
  }
} 