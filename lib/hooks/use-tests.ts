import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'
import { testService, type Test, type TestFilters, type TestUpdateFields } from '@/lib/services/test-service'

export function useTests() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [downloading, setDownloading] = useState<string | null>(null)

  const fetchTests = useCallback(async (filters: TestFilters = {}) => {
    try {
      setLoading(true)
      const response = await testService.getTests(filters)
      setTests(response.tests)
      setTotalPages(response.pagination.pages)
      setPage(response.pagination.page)
    } catch (error) {
      console.error("Error fetching tests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tests. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTest = useCallback(async (testId: string, updates: TestUpdateFields) => {
    try {
      const updatedTest = await testService.updateTest(testId, updates)
      setTests(prevTests => 
        prevTests.map(test => 
          test.id === testId ? { ...test, ...updatedTest } : test
        )
      )
      toast({
        title: "Test updated",
        description: "The test has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating test:", error)
      toast({
        title: "Update failed",
        description: "Failed to update the test. Please try again.",
        variant: "destructive"
      })
    }
  }, [])

  const deleteTest = useCallback(async (testId: string) => {
    try {
      await testService.deleteTest(testId)
      setTests(prevTests => prevTests.filter(test => test.id !== testId))
      toast({
        title: "Test deleted",
        description: "The test has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting test:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the test. Please try again.",
        variant: "destructive"
      })
    }
  }, [])

  const downloadTest = useCallback(async (testId: string, format: 'pdf' | 'docx') => {
    try {
      setDownloading(testId)
      const blob = await testService.downloadTest(testId, format)
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `test-${testId}.zip`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download complete",
        description: "The test has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading test:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the test. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDownloading(null)
    }
  }, [])

  return {
    tests,
    loading,
    page,
    totalPages,
    downloading,
    fetchTests,
    updateTest,
    deleteTest,
    downloadTest
  }
} 