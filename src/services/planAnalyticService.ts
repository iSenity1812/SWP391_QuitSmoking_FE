import axiosConfig from '@/config/axiosConfig';
import { authService } from '@/services/authService';
import { isAxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';

/**
 * ====================================================================
 * PLAN ANALYTICS INTERFACES
 * ====================================================================
 */
export interface PlanAnalyticsRequest {
  period?: string;
  startDate?: string;
  endDate?: string;
  planIds?: number[];
}


export interface PlanPerformanceDTO {
  planId: number;
  planName: string;
  planDisplayName: string;
  planPrice: number;
  totalRevenue: number;
  totalTransactions: number;
  successTransactions: number;
  activeSubscriptions: number;
  successRate: number; // Tỉ lệ giao dịch thành công (% SUCCESS transactions)
  revenuePercentage: number;
  avgOrderValue: number;
  conversionRate: number;
}


export interface PlanMarketShareDTO {
  planId: number;
  planName: string;
  planDisplayName: string;
  marketShare: number;
  revenue: number;
  subscriptions: number;
  growth: number;
}

export interface PlanConversionFunnelDTO {
  planId: number;
  planName: string;
  planDisplayName: string;
  views: number;
  clicks: number;
  purchases: number;
  activeSubscriptions: number;
  viewToClickRate: number;
  clickToPurchaseRate: number;
  purchaseToActiveRate: number;
  overallConversionRate: number;
}

export interface PlanComparisonMetrics {
  planPerformance: PlanPerformanceDTO[];
  marketShare: PlanMarketShareDTO[];
  conversionFunnel: PlanConversionFunnelDTO[];
  totalRevenue: number;
  totalPlans: number;
  bestPerformingPlan: PlanPerformanceDTO;
  worstPerformingPlan: PlanPerformanceDTO;
}

/**
 * ====================================================================
 * PLAN ANALYTICS SERVICE CLASS
 * ====================================================================
 */

class PlanAnalyticsService {
  private static instance: PlanAnalyticsService;

  public static getInstance(): PlanAnalyticsService {
    if (!PlanAnalyticsService.instance) {
      PlanAnalyticsService.instance = new PlanAnalyticsService();
    }
    return PlanAnalyticsService.instance;
  }

  /**
   * Lấy dữ liệu plan performance từ transactions
   * 
   * @param params - Parameters for filtering
   * @returns Promise<PlanPerformanceDTO[]>
   */
  async getPlanPerformance(params: PlanAnalyticsRequest = {}): Promise<PlanPerformanceDTO[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập dữ liệu phân tích gói');
      }

      console.log('📊 [PlanAnalyticsService] Fetching plan performance data:', params);

      // Sử dụng API transactions có sẵn với includeAllStatuses=false (chỉ SUCCESS)
      const response = await axiosConfig.get<ApiResponse<{ content: unknown[] }>>('/dashboard/transactions', {
        params: {
          period: params.period || 'LAST_30_DAYS',
          startDate: params.startDate,
          endDate: params.endDate,
          planIds: params.planIds,
          page: 0,
          size: 1000, // Lấy nhiều để phân tích
          includeAllStatuses: false, // Chỉ SUCCESS
          sortBy: 'transactionDate',
          sortDirection: 'DESC'
        }
      });

      if (response.data.status === 200 && response.data.data) {
        const transactions = response.data.data.content;
        return this.processPlanPerformanceData(transactions);
      }

      throw new Error(response.data.message || 'Không thể lấy dữ liệu plan performance');

    } catch (error) {
      console.error('❌ [PlanAnalyticsService] Error fetching plan performance:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu market share
   */
  async getMarketShare(params: PlanAnalyticsRequest = {}): Promise<PlanMarketShareDTO[]> {
    try {
      const planPerformance = await this.getPlanPerformance(params);
      return this.calculateMarketShare(planPerformance);
    } catch (error) {
      console.error('❌ [PlanAnalyticsService] Error fetching market share:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu conversion funnel
   */
  async getConversionFunnel(params: PlanAnalyticsRequest = {}): Promise<PlanConversionFunnelDTO[]> {
    try {
      const planPerformance = await this.getPlanPerformance(params);
      return this.calculateConversionFunnel(planPerformance);
    } catch (error) {
      console.error('❌ [PlanAnalyticsService] Error fetching conversion funnel:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả metrics comparison
   */
  async getPlanComparisonMetrics(params: PlanAnalyticsRequest = {}): Promise<PlanComparisonMetrics> {
    try {
      const [planPerformance, marketShare, conversionFunnel] = await Promise.all([
        this.getPlanPerformance(params),
        this.getMarketShare(params),
        this.getConversionFunnel(params)
      ]);

      const totalRevenue = planPerformance.reduce((sum, plan) => sum + plan.totalRevenue, 0);
      const bestPerformingPlan = planPerformance.reduce((best, current) =>
        current.totalRevenue > best.totalRevenue ? current : best
      );
      const worstPerformingPlan = planPerformance.reduce((worst, current) =>
        current.totalRevenue < worst.totalRevenue ? current : worst
      );

      return {
        planPerformance,
        marketShare,
        conversionFunnel,
        totalRevenue,
        totalPlans: planPerformance.length,
        bestPerformingPlan,
        worstPerformingPlan
      };

    } catch (error) {
      console.error('❌ [PlanAnalyticsService] Error fetching comparison metrics:', error);
      throw error;
    }
  }

  /**
   * ====================================================================
   * PRIVATE DATA PROCESSING METHODS
   * ====================================================================
   */

  private processPlanPerformanceData(transactions: unknown[]): PlanPerformanceDTO[] {
    const planMap = new Map<number, PlanPerformanceDTO>();

    transactions.forEach(transaction => {
      // Type assertion for external API data - we know the structure from API docs
      const transactionData = transaction as {
        planId: number;
        planName: string;
        planDisplayName: string;
        planPrice: number;
        amount: number;
        status: string;
        isSubscriptionActive: boolean;
      };
      const planId = transactionData.planId;

      if (!planMap.has(planId)) {
        planMap.set(planId, {
          planId,
          planName: transactionData.planName,
          planDisplayName: transactionData.planDisplayName,
          planPrice: transactionData.planPrice,
          totalRevenue: 0,
          totalTransactions: 0,
          successTransactions: 0,
          activeSubscriptions: 0,
          successRate: 0,
          revenuePercentage: 0,
          avgOrderValue: 0,
          conversionRate: 0
        });
      }

      const planData = planMap.get(planId)!;
      planData.totalRevenue += transactionData.amount;
      planData.totalTransactions += 1;

      if (transactionData.status === 'SUCCESS') {
        planData.successTransactions += 1;
      }

      if (transactionData.isSubscriptionActive) {
        planData.activeSubscriptions += 1;
      }
    });

    // Calculate derived metrics
    const planPerformance = Array.from(planMap.values());
    const totalRevenue = planPerformance.reduce((sum, plan) => sum + plan.totalRevenue, 0);

    planPerformance.forEach(plan => {
      // Tỉ lệ giao dịch thành công = (Số giao dịch SUCCESS / Tổng giao dịch) * 100%
      plan.successRate = plan.totalTransactions > 0 ?
        (plan.successTransactions / plan.totalTransactions) * 100 : 0;

      plan.revenuePercentage = totalRevenue > 0 ?
        (plan.totalRevenue / totalRevenue) * 100 : 0;

      plan.avgOrderValue = plan.successTransactions > 0 ?
        plan.totalRevenue / plan.successTransactions : 0;

      // Mock conversion rate (in real app, this would come from analytics)
      plan.conversionRate = Math.random() * 15 + 5; // 5-20%
    });

    return planPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private calculateMarketShare(planPerformance: PlanPerformanceDTO[]): PlanMarketShareDTO[] {
    const totalRevenue = planPerformance.reduce((sum, plan) => sum + plan.totalRevenue, 0);

    return planPerformance.map(plan => ({
      planId: plan.planId,
      planName: plan.planName,
      planDisplayName: plan.planDisplayName,
      marketShare: totalRevenue > 0 ? (plan.totalRevenue / totalRevenue) * 100 : 0,
      revenue: plan.totalRevenue,
      subscriptions: plan.activeSubscriptions,
      growth: Math.random() * 40 - 20 // Mock growth rate -20% to +20%
    }));
  }

  private calculateConversionFunnel(planPerformance: PlanPerformanceDTO[]): PlanConversionFunnelDTO[] {
    return planPerformance.map(plan => {
      // Mock funnel data (in real app, this would come from analytics)
      const views = Math.floor(plan.totalTransactions * (Math.random() * 10 + 5)); // 5-15x transactions
      const clicks = Math.floor(views * (Math.random() * 0.3 + 0.1)); // 10-40% of views
      const purchases = plan.totalTransactions;
      const activeSubscriptions = plan.activeSubscriptions;

      return {
        planId: plan.planId,
        planName: plan.planName,
        planDisplayName: plan.planDisplayName,
        views,
        clicks,
        purchases,
        activeSubscriptions,
        viewToClickRate: views > 0 ? (clicks / views) * 100 : 0,
        clickToPurchaseRate: clicks > 0 ? (purchases / clicks) * 100 : 0,
        purchaseToActiveRate: purchases > 0 ? (activeSubscriptions / purchases) * 100 : 0,
        overallConversionRate: views > 0 ? (activeSubscriptions / views) * 100 : 0
      };
    });
  }

  private handleError(error: unknown): void {
    if (isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        case 403:
          throw new Error('Bạn không có quyền truy cập dữ liệu phân tích gói');
        case 400:
          throw new Error('Tham số không hợp lệ. Vui lòng kiểm tra lại bộ lọc');
        case 500:
          throw new Error('Lỗi hệ thống. Vui lòng thử lại sau');
        default:
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
          throw new Error('Không thể kết nối đến server');
      }
    }
  }
}


/**
 * ====================================================================
 * EXPORTED SINGLETON INSTANCE
 * ====================================================================
 */
export const planAnalyticsService = PlanAnalyticsService.getInstance();