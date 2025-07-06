/**
 * ====================================================================
 * PLAN COMPARISON CHART - Bar chart so sánh performance các gói
 * ====================================================================
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import type { TooltipPayload } from '@/types/chart';

interface PlanComparisonChartProps {
  data: Array<{
    planName: string;
    revenue: number;
    transactions: number;
    successRate: number;
    avgOrderValue: number;
  }>;
  isLoading?: boolean;
}

export const PlanComparisonChart: React.FC<PlanComparisonChartProps> = ({
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>So sánh hiệu suất gói</CardTitle>
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
          <CardTitle>So sánh hiệu suất gói</CardTitle>
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

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.dataKey === 'revenue' ? formatCurrency(entry.value) :
                  entry.dataKey === 'successRate' ? `${entry.value.toFixed(1)}%` :
                    entry.dataKey === 'avgOrderValue' ? formatCurrency(entry.value) :
                      entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>So sánh hiệu suất gói</CardTitle>
        <CardDescription>
          Doanh thu, giao dịch và tỉ lệ giao dịch thành công của các gói subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="planName"
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={12}
            />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Doanh thu"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="transactions"
              name="Giao dịch"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Success Rate Chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Tỉ lệ giao dịch thành công (%)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="planName"
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="successRate"
                name="Tỉ lệ giao dịch thành công"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
