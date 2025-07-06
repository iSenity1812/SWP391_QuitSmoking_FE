import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { dashboardService } from '@/services/api/dashboardService'
import { transformRevenueData, calculateDateRange } from '@/utils/chartUtils'
import type { PeriodType } from '@/types/dashboard'

// Query keys for caching
export const revenueQueryKeys = {
  all: ['revenue'] as const,
  period: (period: PeriodType) => [...revenueQueryKeys.all, period] as const,
  dateRange: (period: PeriodType, startDate: string, endDate: string) =>
    [...revenueQueryKeys.period(period), startDate, endDate] as const,
}

// Hook for single period revenue data
export function useRevenueData(period: PeriodType, enabled = true) {
  const dateRange = calculateDateRange(period)

  return useQuery({
    queryKey: revenueQueryKeys.dateRange(period, dateRange.startDate, dateRange.endDate),
    queryFn: async () => {
      console.log(`🔄 Fetching revenue data for ${period}:`, dateRange)

      const apiData = await dashboardService.getRevenueByPeriod({
        groupBy: period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })

      const transformedData = transformRevenueData(apiData, period)
      console.log(`✅ Transformed data for ${period}:`, transformedData)

      return transformedData
    },
    enabled,
    staleTime: period === 'DAY' ? 2 * 60 * 1000 : // 2 minutes for daily
      period === 'WEEK' ? 5 * 60 * 1000 : // 5 minutes for weekly  
        period === 'MONTH' ? 10 * 60 * 1000 : // 10 minutes for monthly
          30 * 60 * 1000, // 30 minutes for yearly
    refetchInterval: period === 'DAY' ? 2 * 60 * 1000 : // Auto refetch
      period === 'WEEK' ? 5 * 60 * 1000 :
        period === 'MONTH' ? 10 * 60 * 1000 :
          30 * 60 * 1000,
    refetchIntervalInBackground: true, // Continue refetch when tab not active
  })
}

// Hook for multiple periods (preloading)
export function useMultiPeriodRevenueData(activePeriod: PeriodType) {
  const queryClient = useQueryClient()

  // Main query for active period
  const activeQuery = useRevenueData(activePeriod, true)

  // Prefetch inactive periods after a delay
  useEffect(() => {
    if (activeQuery.isSuccess) {
      const timer = setTimeout(() => {
        const periods: PeriodType[] = ['DAY', 'WEEK', 'MONTH', 'YEAR']
        const otherPeriods = periods.filter(p => p !== activePeriod)

        otherPeriods.forEach(period => {
          const dateRange = calculateDateRange(period)
          queryClient.prefetchQuery({
            queryKey: revenueQueryKeys.dateRange(period, dateRange.startDate, dateRange.endDate),
            queryFn: async () => {
              const apiData = await dashboardService.getRevenueByPeriod({
                groupBy: period,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
              })
              return transformRevenueData(apiData, period)
            },
          })
        })
      }, 1000) // Prefetch after 1 second

      return () => clearTimeout(timer)
    }
  }, [activeQuery.isSuccess, queryClient, activePeriod])

  return {
    activeData: activeQuery.data,
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    lastUpdated: activeQuery.dataUpdatedAt,
    refetch: activeQuery.refetch,
  }
}
