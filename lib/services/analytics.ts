import { API_ENDPOINTS } from "@/lib/api"
import type { DateRange } from "react-day-picker"

// Types for API response
export interface DashboardStats {
  dateRange: {
    startDate: string
    endDate: string
  }
  overviewStats: {
    createdTests: {
      currentPeriodCount: number
      percentageChange: number
      changePeriodDescription: string
    }
    participants: {
      currentPeriodCount: number
      percentageChange: number
      changePeriodDescription: string
    }
    completionRate: {
      currentPercentage: number
      percentageChange: number
      changePeriodDescription: string
    }
    averageScore: {
      currentPercentage: number
      percentageChange: number
      changePeriodDescription: string
    }
  }
  testActivity: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
  latestTests: {
    id: string
    name: string
    subject: string
    participantCount: number
    averageScore: number
    creationDate: string
  }[]
  nextLatestTestsCursor: string | null
}

export class AnalyticsService {
  private static getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('access_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  static async getDashboardStats(dateRange: DateRange, limitLatestTests: number = 7): Promise<DashboardStats> {
    if (!dateRange?.from || !dateRange?.to) {
      throw new Error('Date range is required')
    }

    const headers = this.getAuthHeader()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.ANALYTICS.DASHBOARD}?startDate=${dateRange.from.toISOString().split('T')[0]}&endDate=${dateRange.to.toISOString().split('T')[0]}&limitLatestTests=${limitLatestTests}`,
      {
        headers: Object.keys(headers).length > 0 ? headers : undefined
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats')
    }

    return response.json()
  }

  static async exportToCSV(dateRange: DateRange): Promise<Blob> {
    if (!dateRange?.from || !dateRange?.to) {
      throw new Error('Date range is required')
    }

    const headers = {
      ...this.getAuthHeader(),
      'Accept': 'text/csv'
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.ANALYTICS.DASHBOARD}/export?startDate=${dateRange.from.toISOString().split('T')[0]}&endDate=${dateRange.to.toISOString().split('T')[0]}`,
      {
        headers: Object.keys(headers).length > 0 ? headers : undefined
      }
    )

    if (!response.ok) {
      throw new Error('Failed to export data')
    }

    return response.blob()
  }
} 