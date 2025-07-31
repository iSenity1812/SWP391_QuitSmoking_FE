"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    RefreshCw,
    AlertTriangle,
    TrendingUp,
    Brain,
    Zap,
    Heart,
    Clock,
    CheckCircle
} from 'lucide-react';
import { useHealth } from '@/hooks/use-health';
import HealthOverviewCard from '@/components/health/HealthOverviewCard';
import HealthMetricCard from '@/components/health/HealthMetricCard';

import { AutoRefreshIndicator } from '@/components/health/AutoRefreshIndicator';
import { MilestoneNotification } from '@/components/health/MilestoneNotification';
import { HealthMetricType } from '@/types/health';
import type { QuitPlanResponseDTO } from '@/types/api';

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
        getCompletedMetrics,
        getInProgressMetrics,
        getUpcomingMetrics
    } = useHealth();

    const [activeTab, setActiveTab] = useState('overview');
    const [isBackendOffline, setIsBackendOffline] = useState(false);

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

    // Kiểm tra xem có phải fallback data không
    React.useEffect(() => {
        if (metrics.length > 0 && metrics[0].id.startsWith('fallback-')) {
            setIsBackendOffline(true);
        } else {
            setIsBackendOffline(false);
        }
    }, [metrics]);



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
                    <Button onClick={updateProgress} variant="outline">
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Theo dõi Sức khỏe</h2>
                        <p className="text-green-100 mt-1">
                            Theo dõi sự cải thiện sức khỏe của bạn sau khi bỏ thuốc
                        </p>
                        {/* Auto-refresh status */}
                        <div className="mt-2">
                            <AutoRefreshIndicator
                                isAutoRefreshing={isAutoRefreshing}
                                lastUpdated={lastUpdated}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-green-100 text-sm">Cập nhật mỗi 5 phút</p>
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
            </div>

            {/* Thông báo milestone mới */}
            {overview?.recentAchievements && (
                <MilestoneNotification
                    recentAchievements={overview.recentAchievements}
                    onDismiss={(milestoneId) => {
                        console.log('Dismiss milestone:', milestoneId);
                        // Có thể implement logic để ẩn milestone
                    }}
                />
            )}

            {/* Thông báo khi backend offline */}
            {isBackendOffline && (
                <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                        <strong>Chế độ Demo:</strong> Backend hiện không khả dụng. Dữ liệu hiển thị là demo để bạn có thể xem giao diện.
                    </AlertDescription>
                </Alert>
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
                    {overview && <HealthOverviewCard overview={overview} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-800">Đã hoàn thành</h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{getCompletedMetrics().length}</p>
                            <p className="text-sm text-blue-600">chỉ số sức khỏe</p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-yellow-600" />
                                <h3 className="font-semibold text-yellow-800">Đang tiến hành</h3>
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">{getInProgressMetrics().length}</p>
                            <p className="text-sm text-yellow-600">chỉ số sức khỏe</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-800">Sắp tới</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-600">{getUpcomingMetrics().length}</p>
                            <p className="text-sm text-gray-600">chỉ số sức khỏe</p>
                        </div>
                    </div>
                </TabsContent>

                {/* Immediate Benefits Tab */}
                <TabsContent value="immediate" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {immediate.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                </TabsContent>

                {/* Short-term Benefits Tab */}
                <TabsContent value="short-term" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shortTerm.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                </TabsContent>

                {/* Long-term Benefits Tab */}
                <TabsContent value="long-term" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {longTerm.map((metric) => (
                            <HealthMetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Health Benefits Timeline */}

        </div>
    );
} 