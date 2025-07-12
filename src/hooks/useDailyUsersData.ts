import { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/api/adminService'

export interface UserData {
  userId: string
  username: string
  email: string
  role: string
  createdAt: string
  active?: boolean
}

export interface DailyUserData {
  day: string
  users: number
  newUsers: number
  cumulativeUsers: number
}

export function useDailyUsersData() {
  const [data, setData] = useState<DailyUserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const processUsersData = useCallback((users: UserData[]): DailyUserData[] => {
    if (!users || users.length === 0) {
      // Return 14 days with 0 users if no data
      return generateLast14Days()
    }

    // Generate last 14 days
    const last14Days = generateLast14Days()

    // Group users by date
    const dailyGroups: { [key: string]: UserData[] } = {}

    users.forEach(user => {
      if (!user.createdAt) return

      const date = new Date(user.createdAt)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format

      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = []
      }
      dailyGroups[dateKey].push(user)
    })

    // Sort all users by date to calculate cumulative counts
    const sortedUsers = users
      .filter(user => user.createdAt)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return last14Days.map(dayData => {
      const dateKey = dayData.day.split(' ')[0] // Extract YYYY-MM-DD part
      const newUsers = dailyGroups[dateKey]?.length || 0

      // Calculate cumulative users up to this day (including this day)
      const cumulativeUsers = sortedUsers.filter(user => {
        const userDate = new Date(user.createdAt).toISOString().split('T')[0]
        return userDate <= dateKey
      }).length

      return {
        day: dayData.day,
        users: cumulativeUsers,
        newUsers: newUsers,
        cumulativeUsers
      }
    })
  }, [])

  // Generate last 14 days array
  const generateLast14Days = (): DailyUserData[] => {
    const days: DailyUserData[] = []
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
        users: 0,
        newUsers: 0,
        cumulativeUsers: 0
      })
    }

    return days
  }

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('📊 [useDailyUsersData] Fetching users data...')

      const users = await adminService.getAllUsers()
      const processedData = processUsersData(users as UserData[])

      setData(processedData)
      setLastUpdated(new Date())

      console.log('✅ [useDailyUsersData] Data processed successfully:', processedData.length, 'days')
    } catch (err) {
      console.error('❌ [useDailyUsersData] Error fetching data:', err)
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'))
    } finally {
      setIsLoading(false)
    }
  }, [processUsersData])

  const refetch = useCallback(() => {
    console.log('🔄 [useDailyUsersData] Manual refetch triggered')
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch
  }
}
