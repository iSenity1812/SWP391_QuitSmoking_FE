import { useState, useEffect, useCallback } from 'react'
import axiosConfig from '@/config/axiosConfig'
import { authService } from '@/services/authService'

export interface BlogData {
  blogId: number
  createdAt: string
  status: string
  authorId: string
  authorUsername: string
  authorEmail: string
  deleted: boolean
}

export interface DailyBlogData {
  day: string
  blogs: number
  newBlogs: number
  cumulativeBlogs: number
}

export interface BlogStatusData {
  published: number
  pending: number
  rejected: number
  total: number
}

const isValidDate = (dateValue: any): boolean => {
  if (!dateValue) return false;
  if (typeof dateValue !== 'string' && !(dateValue instanceof Date)) return false;

  const date = new Date(dateValue);
  return !isNaN(date.getTime()) && date.getTime() > 0; // Ensure date is valid and not a negative timestamp
}

const safeCreateDate = (dateValue: any): Date | null => {
  try {
    if (!isValidDate(dateValue)) return null;
    return new Date(dateValue);
  } catch {
    return null; // Return null if date creation fails
  }
}

export function useDailyBlogsData() {
  const [data, setData] = useState<DailyBlogData[]>([])
  const [statusData, setStatusData] = useState<BlogStatusData>({ published: 0, pending: 0, rejected: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const processBlogsData = useCallback((blogs: BlogData[]): DailyBlogData[] => {
    if (!blogs || blogs.length === 0) {
      // Return 14 days with 0 blogs if no data
      return generateLast14Days()
    }

    // Generate last 14 days
    const last14Days = generateLast14Days()

    // Group blogs by date
    const dailyGroups: { [key: string]: BlogData[] } = {}

    blogs.forEach(blog => {
      if (!blog.createdAt) return

      const date = new Date(blog.createdAt)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format

      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = []
      }
      dailyGroups[dateKey].push(blog)
    })

    // Sort all blogs by date to calculate cumulative counts
    const sortedBlogs = blogs
      .filter(blog => blog.createdAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return last14Days.map(dayData => {
      const dateKey = dayData.day.split(' ')[0] // Extract YYYY-MM-DD part
      const newBlogs = dailyGroups[dateKey]?.length || 0

      // Calculate cumulative blogs up to this day (including this day)
      const cumulativeBlogs = sortedBlogs.filter(blog => {
        const blogDate = new Date(blog.createdAt).toISOString().split('T')[0]
        return blogDate <= dateKey
      }).length

      return {
        day: dayData.day,
        blogs: cumulativeBlogs,
        newBlogs: newBlogs,
        cumulativeBlogs
      }
    })
  }, [])

  // Generate last 14 days array
  const generateLast14Days = (): DailyBlogData[] => {
    const days: DailyBlogData[] = []
    const today = new Date()

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      const dateKey = date.toISOString().split('T')[0]
      const dayName = date.toLocaleDateString('vi-VN', {
        month: '2-digit',
        day: '2-digit'
      })

      days.push({
        day: `${dateKey} (${dayName})`,
        blogs: 0,
        newBlogs: 0,
        cumulativeBlogs: 0
      })
    }

    return days
  }

  // Process blog status statistics
  const processBlogStatusData = useCallback((blogs: BlogData[]): BlogStatusData => {
    if (!blogs || blogs.length === 0) {
      return { published: 0, pending: 0, rejected: 0, total: 0 }
    }

    const published = blogs.filter(blog => blog.status === 'PUBLISHED').length
    const pending = blogs.filter(blog => blog.status === 'PENDING').length
    const rejected = blogs.filter(blog => blog.status === 'REJECTED').length
    const total = blogs.length

    return { published, pending, rejected, total }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('📊 [useDailyBlogsData] Fetching blogs data...')

      const token = authService.getToken()
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu này')
      }

      const response = await axiosConfig.get('/blogs/admin/statistics/all')

      if (response.data && response.data.data) {
        const processedData = processBlogsData(response.data.data as BlogData[])
        const statusStats = processBlogStatusData(response.data.data as BlogData[])
        setData(processedData)
        setStatusData(statusStats)
        setLastUpdated(new Date())

        console.log('✅ [useDailyBlogsData] Data processed successfully:', processedData.length, 'days')
      } else {
        setData(generateLast14Days())
        setStatusData({ published: 0, pending: 0, rejected: 0, total: 0 })
      }
    } catch (err) {
      console.error('❌ [useDailyBlogsData] Error fetching data:', err)
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'))
    } finally {
      setIsLoading(false)
    }
  }, [processBlogsData, processBlogStatusData])

  const refetch = useCallback(() => {
    console.log('🔄 [useDailyBlogsData] Manual refetch triggered')
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    statusData,
    isLoading,
    error,
    lastUpdated,
    refetch
  }
}
