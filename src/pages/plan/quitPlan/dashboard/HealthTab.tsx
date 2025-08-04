"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    RefreshCw,
    TrendingUp,
    Brain,
    Zap,
    Heart,
    Clock,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { useHealth } from '@/hooks/use-health';
import HealthOverviewCard from '@/components/health/HealthOverviewCard';
import HealthMetricCard from '@/components/health/HealthMetricCard';
import { AutoRefreshIndicator } from '@/components/health/AutoRefreshIndicator';
import { MilestoneNotification } from '@/components/health/MilestoneNotification';
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
        isRefreshing,
        updateProgress,
        manualRefresh, // FIX: Thêm manual refresh
        getCompletedMetrics,
        getInProgressMetrics,
        getUpcomingMetrics
    } = useHealth();

    const [activeTab, setActiveTab] = useState('overview');

    const getCategoryMetrics = () => {
        // IMMEDIATE: 22 giờ - 1 ngày 21 giờ
        const immediateMetrics = metrics.filter(m =>
            ['PULSE_RATE', 'OXYGEN_LEVELS', 'CARBON_MONOXIDE'].includes(m.metricType)
        );

        // SHORT TERM: 2 ngày 21 giờ - 7 ngày 21 giờ
        const shortTermMetrics = metrics.filter(m =>
            ['NICOTINE_EXPELLED', 'TASTE_SMELL', 'BREATHING', 'ENERGY_LEVELS', 'BAD_BREATH_GONE'].includes(m.metricType)
        );

        // MEDIUM TERM: 14 ngày 21 giờ - 4 tháng 18 ngày
        const mediumTermMetrics = metrics.filter(m =>
            ['GUMS_TEETH', 'TEETH_BRIGHTNESS', 'CIRCULATION', 'GUM_TEXTURE', 'IMMUNITY_LUNG_FUNCTION'].includes(m.metricType)
        );

        // LONG TERM: 1 năm - 15 năm
        const longTermMetrics = metrics.filter(m =>
            ['HEART_DISEASE_RISK', 'LUNG_CANCER_RISK', 'HEART_ATTACK_RISK'].includes(m.metricType)
        );

        return {
            immediate: immediateMetrics,
            shortTerm: shortTermMetrics,
            mediumTerm: mediumTermMetrics,
            longTerm: longTermMetrics
        };
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

    const { immediate, shortTerm, mediumTerm, longTerm } = getCategoryMetrics();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Theo dõi Sức khỏe</h2>
                        <p className="text-green-100 mt-1">
                            Theo dõi sự cải thiện sức khỏe của bạn sau khi bỏ thuốc
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-green-100 text-sm">Cập nhật mỗi 5 phút</p>
                        <Button
                            onClick={() => manualRefresh()}
                            variant="ghost"
                            size="sm"
                            disabled={isRefreshing}
                            className="mt-2 bg-white/20 text-white hover:bg-white/30 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Cập nhật ngay
                        </Button>
                    </div>
                </div>



                {/* Auto-refresh status */}
                <div className="mt-2">
                    <AutoRefreshIndicator
                        isRefreshing={isRefreshing}
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
                <TabsList className="grid w-full grid-cols-5">
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
                    <TabsTrigger value="medium-term" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Trung hạn
                    </TabsTrigger>
                    <TabsTrigger value="long-term" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Dài hạn
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {overview && <HealthOverviewCard overview={overview} quitDate={quitPlan.startDate} />}


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

                {/* Medium-term Metrics Tab */}
                <TabsContent value="medium-term" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mediumTerm.map((metric) => (
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