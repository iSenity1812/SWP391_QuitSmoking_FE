/**
 * ====================================================================
 * PLAN ANALYTICS DASHBOARD - Main dashboard for plan performance analysis
 * ====================================================================
 *
 * Chức năng chính:
 * - Hiển thị tổng quan về hiệu suất các gói subscription
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
                            {plan.totalTransactions} giao dịch • {plan.successRate.toFixed(1)}% thành công
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
          
          {/* Improvement Opportunities */}
          {summaryStats?.improvementOpportunities && summaryStats.improvementOpportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cơ hội cải thiện</CardTitle>
                <CardDescription>Các gói có tỷ lệ chuyển đổi thấp cần được tối ưu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summaryStats.improvementOpportunities.map((plan) => (
                    <div key={plan.planId} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium">{plan.planDisplayName}</p>
                          <p className="text-sm text-gray-600">
                            Tỷ lệ chuyển đổi: {plan.conversionRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(plan.totalRevenue)}</p>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Cần cải thiện
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
