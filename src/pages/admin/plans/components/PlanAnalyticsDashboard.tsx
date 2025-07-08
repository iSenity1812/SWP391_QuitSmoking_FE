/**
 * ====================================================================
 * PLAN ANALYTICS DASHBOARD - Main dashboard for plan performance analysis
 * ====================================================================
 *
 * Chức năng chính:
 * - Hiển thị tổng quan                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-medium text-purple-900">Giao dịch nhiều nhất</h4>
                    <p className="text-sm text-purple-700 mt-1 font-semibold">
                      {chartData?.heatmapData && chartData.heatmapData.length > 0 ? 
                        chartData.heatmapData.reduce((max: any, plan: any) => 
                          (plan.transactions || 0) > (max.transactions || 0) ? plan : max
                        ).planName : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-medium text-amber-900">% Đóng góp cao nhất</h4>
                    <p className="text-sm text-amber-700 mt-1 font-semibold">
                      {chartData?.heatmapData && chartData.heatmapData.length > 0 ? 
                        chartData.heatmapData.reduce((max: any, plan: any) => 
                          (plan.revenuePercentage || 0) > (max.revenuePercentage || 0) ? plan : max
                        ).planName : 'N/A'
                      }
                    </p>
                  </div>t các gói subscription
 * - Plan comparison charts và market share analysis
 * - Performance heatmap và conversion funnel
 * - Advanced filtering và real-time updates
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { usePlanAnalytics } from '@/hooks/usePlanAnalytics';
import { PlanComparisonChart } from './PlanComparisonChart';
import { PlanMarketShareChart } from './PlanMarketShareChart';
import { PlanPerformanceHeatmap } from './PlanPerformanceHeatmap';
import { formatCurrency } from '@/utils/formatters';

export const PlanAnalyticsDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const {
    chartData,
    summaryStats,
    filters,
    isLoading,
    error,
    updateFilters,
    refreshData
  } = usePlanAnalytics();

  const handlePeriodChange = (period: string) => {
    updateFilters({ period });
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <div>
                <h3 className="text-lg font-semibold text-red-700">Lỗi khi tải dữ liệu</h3>
                <p className="text-gray-600 mt-2">{error.message}</p>
                <Button onClick={refreshData} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích hiệu suất gói</h1>
          <p className="text-gray-600">Theo dõi và so sánh hiệu suất các gói subscription</p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={filters.period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LAST_7_DAYS">7 ngày qua</SelectItem>
              <SelectItem value="LAST_30_DAYS">30 ngày qua</SelectItem>
              <SelectItem value="LAST_90_DAYS">90 ngày qua</SelectItem>
              <SelectItem value="THIS_MONTH">Tháng này</SelectItem>
              <SelectItem value="LAST_MONTH">Tháng trước</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={refreshData}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summaryStats.totalRevenue)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Số gói đang bán</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryStats.totalPlans}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gói hiệu suất tốt nhất</p>
                  <p className="text-lg font-bold text-gray-900">
                    {summaryStats.bestPerformingPlan.planDisplayName}
                  </p>
                  <p className="text-sm text-green-600">
                    {formatCurrency(summaryStats.bestPerformingPlan.totalRevenue)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doanh thu trung bình/gói</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summaryStats.avgRevenuePerPlan)}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="comparison">So sánh</TabsTrigger>
          <TabsTrigger value="market-share">Thị phần</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlanComparisonChart
              data={chartData?.performanceChart || []}
              isLoading={isLoading}
            />
            <PlanMarketShareChart
              data={chartData?.marketShareChart || []}
              isLoading={isLoading}
            />
          </div>

          {/* Top Performing Plans */}
          {summaryStats?.topPerformingPlans && (
            <Card>
              <CardHeader>
                <CardTitle>Top 3 gói hiệu suất cao</CardTitle>
                <CardDescription>Các gói có doanh thu cao nhất trong kỳ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summaryStats.topPerformingPlans.map((plan, index) => (
                    <div key={plan.planId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{plan.planDisplayName}</p>
                          <p className="text-sm text-gray-600">
                            {plan.totalTransactions} giao dịch • {plan.activeSubscriptions} đang hoạt động
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(plan.totalRevenue)}</p>
                        <Badge variant="secondary">{plan.revenuePercentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <PlanComparisonChart
            data={chartData?.performanceChart || []}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="market-share" className="space-y-6">
          <PlanMarketShareChart
            data={chartData?.marketShareChart || []}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PlanPerformanceHeatmap
            data={chartData?.heatmapData || []}
            isLoading={isLoading}
          />

          {/* Plan Insights */}
          {summaryStats && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Top Performance Stats</CardTitle>
                <CardDescription>
                  Thống kê thực tế từ dữ liệu giao dịch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <h4 className="font-medium text-blue-900">Doanh thu cao nhất</h4>
                    <p className="text-sm text-blue-700 mt-1 font-semibold">
                      {summaryStats.bestPerformingPlan.planDisplayName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatCurrency(summaryStats.bestPerformingPlan.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <h4 className="font-medium text-green-900">AOV cao nhất</h4>
                    <p className="text-sm text-green-700 mt-1 font-semibold">
                      {chartData?.heatmapData && chartData.heatmapData.length > 0 ?
                        chartData.heatmapData.reduce((max: any, plan: any) =>
                          (plan.avgOrderValue || 0) > (max.avgOrderValue || 0) ? plan : max
                        ).planName : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">� Gói đóng góp chính</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Gói chiếm tỷ trọng doanh thu cao nhất
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-900">⚡ Gói giao dịch cao</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Gói có số lượng giao dịch nhiều nhất
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
