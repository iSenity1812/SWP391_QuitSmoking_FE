/**
 * ====================================================================
 * PLAN PERFORMANCE HEATMAP - Heatmap hiển thị performance matrix
 * ====================================================================
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface PlanPerformanceHeatmapProps {
  data: Array<{
    planName: string;
    revenue: number;
    transactions: number;
    successRate: number;
    conversionRate: number;
  }>;
  isLoading?: boolean;
}

export const PlanPerformanceHeatmap: React.FC<PlanPerformanceHeatmapProps> = ({
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Heatmap</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Heatmap</CardTitle>
          <CardDescription>Không có dữ liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            Không có dữ liệu để hiển thị
          </div>
        </CardContent>
      </Card>
    );
  }

  // Normalize data for heatmap colors
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxTransactions = Math.max(...data.map(d => d.transactions));
  const maxSuccessRate = Math.max(...data.map(d => d.successRate));
  const maxConversionRate = Math.max(...data.map(d => d.conversionRate));

  const getIntensity = (value: number, max: number) => {
    return Math.min(Math.max(value / max, 0.1), 1);
  };

  const getColorClass = (intensity: number) => {
    if (intensity >= 0.8) return 'bg-green-500';
    if (intensity >= 0.6) return 'bg-green-400';
    if (intensity >= 0.4) return 'bg-yellow-400';
    if (intensity >= 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const metrics = [
    { key: 'revenue', label: 'Doanh thu', max: maxRevenue, format: formatCurrency },
    { key: 'transactions', label: 'Giao dịch', max: maxTransactions, format: (v: number) => v.toLocaleString() },
    { key: 'successRate', label: 'Tỉ lệ giao dịch thành công', max: maxSuccessRate, format: (v: number) => `${v.toFixed(1)}%` },
    { key: 'conversionRate', label: 'Tỷ lệ chuyển đổi', max: maxConversionRate, format: (v: number) => `${v.toFixed(1)}%` }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Heatmap</CardTitle>
        <CardDescription>
          Ma trận hiệu suất các gói theo các chỉ số quan trọng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 font-medium text-gray-700 border-b">Gói</th>
                {metrics.map(metric => (
                  <th key={metric.key} className="text-center p-3 font-medium text-gray-700 border-b">
                    {metric.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((plan, planIndex) => (
                <tr key={planIndex} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900 border-b">
                    {plan.planName}
                  </td>
                  {metrics.map(metric => {
                    const value = plan[metric.key as keyof typeof plan] as number;
                    const intensity = getIntensity(value, metric.max);
                    const colorClass = getColorClass(intensity);

                    return (
                      <td key={metric.key} className="p-3 text-center border-b">
                        <div
                          className={`inline-flex items-center justify-center w-20 h-8 rounded text-white text-sm font-medium ${colorClass}`}
                          style={{ opacity: intensity }}
                          title={`${metric.label}: ${metric.format(value)}`}
                        >
                          {metric.format(value)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Hiệu suất:</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-xs">Thấp</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-xs">Trung bình</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-xs">Khá</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-xs">Tốt</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs">Xuất sắc</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
