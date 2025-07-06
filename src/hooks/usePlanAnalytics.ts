/**
 * ===========================================================      console.error('Plan analytics fetch error:', error);
      toast.error('Lỗi khi tải dữ liệu phân tích gói');
    },====
 * PLAN ANALYTICS HOOK - React Query Hook cho Plan Analytics
 * ====================================================================
 * 
 * Chức năng chính:
 * - Quản lý state cho plan analytics data
 * - Integrated với React Query cho caching
 * - Hỗ trợ filtering và real-time updates
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { planAnalyticsService, type PlanAnalyticsRequest } from '@/services/planAnalyticService';
import { toast } from '@/utils/toast';

interface UsePlanAnalyticsOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface PlanAnalyticsFilters {
  period: string;
  startDate?: string;
  endDate?: string;
  planIds?: number[];
}

/**
 * ====================================================================
 * MAIN HOOK
 * ====================================================================
 */
export const usePlanAnalytics = (options: UsePlanAnalyticsOptions = {}) => {
  const queryClient = useQueryClient();
  
  // State management
  const [filters, setFilters] = useState<PlanAnalyticsFilters>({
    period: 'LAST_30_DAYS',
    planIds: []
  });

  // Convert filters to API params
  const apiParams = useMemo((): PlanAnalyticsRequest => ({
    period: filters.period,
    startDate: filters.startDate,
    endDate: filters.endDate,
    planIds: filters.planIds?.length ? filters.planIds : undefined
  }), [filters]);

  // Main query for plan comparison metrics
  const {
    data: metricsData,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['planAnalytics', 'comparison', apiParams],
    queryFn: () => planAnalyticsService.getPlanComparisonMetrics(apiParams),
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.refetchInterval || 30 * 1000, // 30 seconds
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: Error) => {
      console.error('Plan analytics fetch error:', error);
      toast.error('Lỗi khi tải dữ liệu phân tích gói', {
        description: error.message
      });
    }
  });

  // Separate queries for individual components
  const planPerformanceQuery = useQuery({
    queryKey: ['planAnalytics', 'performance', apiParams],
    queryFn: () => planAnalyticsService.getPlanPerformance(apiParams),
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 5 * 60 * 1000
  });

  const marketShareQuery = useQuery({
    queryKey: ['planAnalytics', 'marketShare', apiParams],
    queryFn: () => planAnalyticsService.getMarketShare(apiParams),
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 5 * 60 * 1000
  });

  const conversionFunnelQuery = useQuery({
    queryKey: ['planAnalytics', 'conversionFunnel', apiParams],
    queryFn: () => planAnalyticsService.getConversionFunnel(apiParams),
    enabled: options.enabled !== false,
    staleTime: options.staleTime || 5 * 60 * 1000
  });

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<PlanAnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      period: 'LAST_30_DAYS',
      planIds: []
    });
  }, []);

  // Refresh handlers
  const refreshData = useCallback(() => {
    refetch();
    planPerformanceQuery.refetch();
    marketShareQuery.refetch();
    conversionFunnelQuery.refetch();
  }, [refetch, planPerformanceQuery, marketShareQuery, conversionFunnelQuery]);

  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['planAnalytics'] });
  }, [queryClient]);

  // Data transformation for charts
  const chartData = useMemo(() => {
    if (!metricsData) return null;

    return {
      // Bar chart data for plan comparison
      performanceChart: metricsData.planPerformance.map(plan => ({
        planName: plan.planDisplayName,
        revenue: plan.totalRevenue,
        transactions: plan.totalTransactions,
        successRate: plan.successRate,
        avgOrderValue: plan.avgOrderValue
      })),

      // Donut chart data for market share
      marketShareChart: metricsData.marketShare.map(plan => ({
        name: plan.planDisplayName,
        value: plan.marketShare,
        revenue: plan.revenue,
        subscriptions: plan.subscriptions
      })),

      // Funnel chart data
      conversionFunnelChart: metricsData.conversionFunnel.map(plan => ({
        planName: plan.planDisplayName,
        views: plan.views,
        clicks: plan.clicks,
        purchases: plan.purchases,
        activeSubscriptions: plan.activeSubscriptions,
        overallConversionRate: plan.overallConversionRate
      })),

      // Heatmap data
      heatmapData: metricsData.planPerformance.map(plan => ({
        planName: plan.planDisplayName,
        revenue: plan.totalRevenue,
        transactions: plan.totalTransactions,
        successRate: plan.successRate,
        conversionRate: plan.conversionRate
      }))
    };
  }, [metricsData]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    if (!metricsData) return null;

    return {
      totalRevenue: metricsData.totalRevenue,
      totalPlans: metricsData.totalPlans,
      bestPerformingPlan: metricsData.bestPerformingPlan,
      worstPerformingPlan: metricsData.worstPerformingPlan,
      avgRevenuePerPlan: metricsData.totalPlans > 0 ? metricsData.totalRevenue / metricsData.totalPlans : 0,
      topPerformingPlans: metricsData.planPerformance.slice(0, 3),
      improvementOpportunities: metricsData.planPerformance
        .filter(plan => plan.conversionRate < 10)
        .sort((a, b) => a.conversionRate - b.conversionRate)
    };
  }, [metricsData]);

  return {
    // Data
    metricsData,
    planPerformance: planPerformanceQuery.data,
    marketShare: marketShareQuery.data,
    conversionFunnel: conversionFunnelQuery.data,
    chartData,
    summaryStats,

    // State
    filters,
    isLoading: isLoading || planPerformanceQuery.isLoading || marketShareQuery.isLoading || conversionFunnelQuery.isLoading,
    isRefetching: isRefetching || planPerformanceQuery.isRefetching || marketShareQuery.isRefetching || conversionFunnelQuery.isRefetching,
    error: error || planPerformanceQuery.error || marketShareQuery.error || conversionFunnelQuery.error,

    // Actions
    updateFilters,
    resetFilters,
    refreshData,
    invalidateCache,
    refetch
  };
};

/**
 * ====================================================================
 * SPECIALIZED HOOKS FOR INDIVIDUAL COMPONENTS
 * ====================================================================
 */

export const usePlanPerformance = (params: PlanAnalyticsRequest = {}) => {
  return useQuery({
    queryKey: ['planAnalytics', 'performance', params],
    queryFn: () => planAnalyticsService.getPlanPerformance(params),
    staleTime: 5 * 60 * 1000
  });
};

export const useMarketShare = (params: PlanAnalyticsRequest = {}) => {
  return useQuery({
    queryKey: ['planAnalytics', 'marketShare', params],
    queryFn: () => planAnalyticsService.getMarketShare(params),
    staleTime: 5 * 60 * 1000
  });
};

export const useConversionFunnel = (params: PlanAnalyticsRequest = {}) => {
  return useQuery({
    queryKey: ['planAnalytics', 'conversionFunnel', params],
    queryFn: () => planAnalyticsService.getConversionFunnel(params),
    staleTime: 5 * 60 * 1000
  });
};
