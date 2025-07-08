/**
 * ====================================================================
 * USER STATS OVERVIEW - Component hiển thị thống kê tổng quan người dùng
 * ====================================================================
 */

"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Crown,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  DollarSign
} from "lucide-react";
import type { UserStatsResponse } from "@/types/userManagement";

interface UserStatsOverviewProps {
  stats: UserStatsResponse | null;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  badge
}) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
      icon: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/50',
      border: 'border-green-200 dark:border-green-800'
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800'
    },
    orange: {
      icon: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/50',
      border: 'border-orange-200 dark:border-orange-800'
    },
    red: {
      icon: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800'
    }
  };

  const styles = colorClasses[color];

  return (
    <Card className={`${styles.bg} ${styles.border} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {badge && (
            <Badge variant={badge.variant} className="text-xs">
              {badge.text}
            </Badge>
          )}
          <div className={`p-2 rounded-lg ${styles.bg}`}>
            <Icon className={`w-4 h-4 ${styles.icon}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {change && (
            <div className="flex items-center text-xs">
              {change.type === 'increase' ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-gray-500 ml-1">{change.period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const UserStatsOverview: React.FC<UserStatsOverviewProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Không thể tải dữ liệu thống kê</p>
      </div>
    );
  }

  // Calculate growth rates (mock data for now, should come from API)
  const userGrowthRate = stats.newUsersLast30d > 0 ?
    Math.round(((stats.newUsersLast30d - stats.newUsersLast7d) / stats.newUsersLast7d) * 100) : 0;

  const memberGrowthRate = Math.round(Math.random() * 20 - 10); // Mock data
  const revenueGrowthRate = Math.round(Math.random() * 30 - 15); // Mock data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <StatCard
        title="Tổng Người Dùng"
        value={stats.totalUsers}
        change={{
          value: userGrowthRate,
          type: userGrowthRate >= 0 ? 'increase' : 'decrease',
          period: 'so với tuần trước'
        }}
        icon={Users}
        color="blue"
      />

      {/* Total Members */}
      <StatCard
        title="Thành Viên"
        value={stats.totalMembers}
        change={{
          value: memberGrowthRate,
          type: memberGrowthRate >= 0 ? 'increase' : 'decrease',
          period: 'trong 30 ngày'
        }}
        icon={UserCheck}
        color="green"
        badge={{
          text: `${stats.totalPremiumMembers} Premium`,
          variant: 'default'
        }}
      />

      {/* Premium Members */}
      <StatCard
        title="Thành Viên Premium"
        value={stats.totalPremiumMembers}
        change={{
          value: Math.round(stats.subscriptionRate),
          type: 'increase',
          period: 'tỷ lệ đăng ký'
        }}
        icon={Crown}
        color="purple"
        badge={{
          text: `${stats.subscriptionRate.toFixed(1)}%`,
          variant: 'secondary'
        }}
      />

      {/* Coaches */}
      <StatCard
        title="Huấn Luyện Viên"
        value={stats.totalCoaches}
        icon={Target}
        color="orange"
      />

      {/* Active Users */}
      <StatCard
        title="Người Dùng Hoạt Động"
        value={stats.activeUsers}
        change={{
          value: Math.round((stats.activeUsers / stats.totalUsers) * 100),
          type: 'increase',
          period: 'tỷ lệ hoạt động'
        }}
        icon={TrendingUp}
        color="green"
        badge={{
          text: `${stats.inactiveUsers} không hoạt động`,
          variant: 'outline'
        }}
      />

      {/* New Users (24h) */}
      <StatCard
        title="Người Dùng Mới (24h)"
        value={stats.newUsersLast24h}
        change={{
          value: stats.newUsersLast7d,
          type: 'increase',
          period: 'trong 7 ngày'
        }}
        icon={Clock}
        color="blue"
      />

      {/* Quit Plan Completion */}
      <StatCard
        title="Hoàn Thành Kế Hoạch"
        value={`${stats.quitPlanCompletionRate.toFixed(1)}%`}
        change={{
          value: Math.round(stats.quitPlanCompletionRate - 65), // Mock baseline
          type: stats.quitPlanCompletionRate > 65 ? 'increase' : 'decrease',
          period: 'so với mục tiêu'
        }}
        icon={Target}
        color="green"
      />

      {/* Revenue */}
      <StatCard
        title="Doanh Thu Tháng"
        value={`${(stats.totalRevenue / 1000000).toFixed(1)}M VND`}
        change={{
          value: revenueGrowthRate,
          type: revenueGrowthRate >= 0 ? 'increase' : 'decrease',
          period: 'so với tháng trước'
        }}
        icon={DollarSign}
        color="purple"
      />
    </div>
  );
};
