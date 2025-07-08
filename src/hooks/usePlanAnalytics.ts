
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
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
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

    // Debug log to understand data structure
    console.log('🔍 [usePlanAnalytics] metricsData:', metricsData);

    const data = metricsData as any; // TODO: Fix type definitions

    return {
      // Bar chart data for plan comparison
      performanceChart: (data.planPerformance || []).map((plan: any) => ({
        planName: plan.planDisplayName,
        revenue: plan.totalRevenue || 0,
        transactions: plan.totalTransactions || 0,
        activeSubscriptions: plan.activeSubscriptions || 0,
        avgOrderValue: plan.avgOrderValue || 0,
        revenuePercentage: plan.revenuePercentage || 0
      })),

      // Donut chart data for market share
      marketShareChart: (data.marketShare || []).map((plan: any) => ({
        name: plan.planDisplayName,
        value: plan.marketShare || 0,
        revenue: plan.revenue || 0,
        subscriptions: plan.subscriptions || 0
      })),

      // Funnel chart data
      conversionFunnelChart: (data.conversionFunnel || []).map((plan: any) => ({
        planName: plan.planDisplayName,
        views: plan.views || 0,
        clicks: plan.clicks || 0,
        purchases: plan.purchases || 0,
        activeSubscriptions: plan.activeSubscriptions || 0,
        overallConversionRate: plan.overallConversionRate || 0
      })),

      // Heatmap data
      heatmapData: (data.planPerformance || []).map((plan: any) => ({
        planName: plan.planDisplayName,
        revenue: plan.totalRevenue || 0,
        transactions: plan.totalTransactions || 0,
        activeSubscriptions: plan.activeSubscriptions || 0,
        avgOrderValue: plan.avgOrderValue || 0,
        planPrice: plan.planPrice || 0,
        revenuePercentage: plan.revenuePercentage || 0
      }))
    };
  }, [metricsData]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    if (!metricsData) return null;

    const data = metricsData as any; // Temporary type assertion
    const planPerformance = data.planPerformance || [];

    return {
      totalRevenue: data.totalRevenue || 0,
      totalPlans: data.totalPlans || planPerformance.length,
      bestPerformingPlan: data.bestPerformingPlan || (planPerformance[0] || {}),
      worstPerformingPlan: data.worstPerformingPlan || (planPerformance[planPerformance.length - 1] || {}),
      avgRevenuePerPlan: planPerformance.length > 0 ? (data.totalRevenue || 0) / planPerformance.length : 0,
      topPerformingPlans: planPerformance.slice(0, 3),
      // Remove improvement opportunities since we don't have reliable conversion rate data
      improvementOpportunities: []
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
