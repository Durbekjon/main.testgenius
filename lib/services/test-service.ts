import { api } from "@/lib/api"

export interface Test {
  id: string
  title: string
  subject: string
  gradeLevel: string
  description: string
  tags: string[]
  sectionCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
  ownerId: string
}

export interface Pagination {
  page: number
  pages: number
  limit: number
  total: number
}

export interface TestsResponse {
  tests: Test[]
  pagination: Pagination
}

export type TestUpdateFields = Partial<Pick<Test, 'title' | 'subject' | 'gradeLevel' | 'description' | 'tags' | 'isPublic'>>

export interface TestFilters {
  page?: number
  limit?: number
  search?: string
  order?: 'asc' | 'desc'
}

class TestService {
  async getTests(filters: TestFilters = {}): Promise<TestsResponse> {
    const response = await api.get<TestsResponse>("/api/v1/test", {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search,
        order: filters.order || "desc"
      }
    })
    return response.data
  }

  async updateTest(testId: string, updates: TestUpdateFields): Promise<Test> {
    const response = await api.put<Test>(`/api/v1/test/${testId}`, updates)
    return response.data
  }

  async deleteTest(testId: string): Promise<void> {
    await api.delete(`/api/v1/test/${testId}`)
  }

  async downloadTest(testId: string, format: 'pdf' | 'docx'): Promise<Blob> {
    const response = await api.post(
      `/api/v1/test/download?testId=${testId}&type=${format}`,
      {},
      {
        responseType: 'blob',
      }
    )
    return response.data
  }
}

export const testService = new TestService() 