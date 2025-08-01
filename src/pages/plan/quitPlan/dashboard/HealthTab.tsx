"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
    RefreshCw,
    TrendingUp,
    Brain,
    Zap,
    Heart

} from 'lucide-react';
import { useHealth } from '@/hooks/use-health';
import HealthOverviewCard from '@/components/health/HealthOverviewCard';
import HealthMetricCard from '@/components/health/HealthMetricCard';

import { AutoRefreshIndicator } from '@/components/health/AutoRefreshIndicator';
import { MilestoneNotification } from '@/components/health/MilestoneNotification';
import HealthHeaderCountdown from '@/components/health/HealthHeaderCountdown';
import { HealthMetricType } from '@/types/health';
import type { QuitPlanResponseDTO } from '@/services/quitPlanService';

interface HealthTabProps {
    quitPlan: QuitPlanResponseDTO;
}

export function HealthTab({ quitPlan }: HealthTabProps) {
    const {
        overview,
        metrics,
        loading,
        error,
        lastUpdated,
        isAutoRefreshing,
        updateProgress,
    } = useHealth();

    const [activeTab, setActiveTab] = useState('overview');

    const getCategoryMetrics = () => {
        const immediate = metrics.filter(m =>
            [HealthMetricType.PULSE_RATE, HealthMetricType.OXYGEN_LEVELS, HealthMetricType.CARBON_MONOXIDE,
            HealthMetricType.NICOTINE_EXPELLED, HealthMetricType.TASTE_SMELL, HealthMetricType.BREATHING,
            HealthMetricType.ENERGY_LEVELS, HealthMetricType.BAD_BREATH_GONE].includes(m.metricType as any)
        );

        const shortTerm = metrics.filter(m =>
            [HealthMetricType.GUMS_TEETH, HealthMetricType.TEETH_BRIGHTNESS, HealthMetricType.CIRCULATION,
            HealthMetricType.GUM_TEXTURE, HealthMetricType.IMMUNITY_LUNG_FUNCTION].includes(m.metricType as any)
        );

        const longTerm = metrics.filter(m =>
            [HealthMetricType.HEART_DISEASE_RISK, HealthMetricType.LUNG_CANCER_RISK,
            HealthMetricType.HEART_ATTACK_RISK].includes(m.metricType as any)
        );

        return { immediate, shortTerm, longTerm };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <RefreshCw className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu sức khỏe...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => updateProgress()} variant="outline">
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    const { immediate, shortTerm, longTerm } = getCategoryMetrics();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                        <p className="text-green-100 text-sm">Cập nhật mỗi 15 giây</p>
                        <p className="text-green-200 text-xs">Dữ liệu luôn được đồng bộ</p>
                        <Button
                            onClick={() => updateProgress(true)}
                            variant="ghost"
                            size="sm"
                            disabled={isAutoRefreshing}
                            className="mt-2 bg-white/20 text-white hover:bg-white/30 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3 w-3 mr-1 ${isAutoRefreshing ? 'animate-spin' : ''}`} />
                            Cập nhật ngay
                        </Button>
                    </div>
                </div>

                {/* Real-time countdown header */}
                {overview && (
                    <HealthHeaderCountdown
                        quitDate={quitPlan.startDate}
                        nextMilestone={overview.nextMilestone}
                        className="mb-4"
                    />
                )}

                {/* Auto-refresh status */}
                <div className="mt-2">
                    <AutoRefreshIndicator
                        isAutoRefreshing={isAutoRefreshing}
                        lastUpdated={lastUpdated}
                    />
                </div>
            </div>

            {/* Thông báo milestone mới */}
            {overview?.recentAchievements && (
                <MilestoneNotification
                    recentAchievements={overview.recentAchievements
                        .filter(achievement => achievement.achievedDate !== null)
                        .map(achievement => ({
                            ...achievement,
                            achievedDate: achievement.achievedDate || new Date().toISOString()
                        }))}
                    onDismiss={(milestoneId) => {
                        // Có thể implement logic để ẩn milestone
                    }}
                />
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Tổng quan
                    </TabsTrigger>
                    <TabsTrigger value="immediate" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Ngay lập tức
                    </TabsTrigger>
                    <TabsTrigger value="short-term" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Ngắn hạn
                    </TabsTrigger>
                    <TabsTrigger value="long-term" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Dài hạn
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {overview && <HealthOverviewCard overview={overview} quitDate={quitPlan.startDate} />}

                    {/* Progress Summary */}
                    \

                    {/* Health Benefits Timeline */}

                </TabsContent>

                {/* Immediate Metrics Tab */}
                <TabsContent value="immediate" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {immediate.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} quitDate={quitPlan.startDate} />
                        ))}
                    </div>
                </TabsContent>

                {/* Short-term Metrics Tab */}
                <TabsContent value="short-term" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shortTerm.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} quitDate={quitPlan.startDate} />
                        ))}
                    </div>
                </TabsContent>

                {/* Long-term Metrics Tab */}
                <TabsContent value="long-term" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {longTerm.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} quitDate={quitPlan.startDate} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 