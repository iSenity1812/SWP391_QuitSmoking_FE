"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Brain, Activity, Clock, CheckCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { useHealth } from "@/hooks/use-health"
import HealthMetricCard from "@/components/health/HealthMetricCard"

export default function HealthBenefitsPage() {
    const {
        metrics,
        loading,
        error,
        fetchMetrics,
        lastUpdated,
        isRefreshing,
        manualRefresh
    } = useHealth();

    const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    // Format last updated time
    const formatLastUpdated = () => {
        if (!lastUpdated) return 'Chưa cập nhật';
        const now = new Date();
        const diff = now.getTime() - lastUpdated.getTime();
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) return `Vừa cập nhật (${seconds}s trước)`;
        if (seconds < 3600) return `Cập nhật ${Math.floor(seconds / 60)} phút trước`;
        return `Cập nhật ${Math.floor(seconds / 3600)} giờ trước`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600">Đang tải dữ liệu sức khỏe...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">Lỗi khi tải dữ liệu: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (metrics.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Chưa có dữ liệu sức khỏe.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Phân loại metrics theo thời gian
    const immediateMetrics = metrics.filter(m => {
        const hours = m.metricType === 'PULSE_RATE' ? 0.33 :
            m.metricType === 'BLOOD_PRESSURE' ? 0.33 :
                m.metricType === 'OXYGEN_LEVELS' ? 8 :
                    m.metricType === 'CARBON_MONOXIDE' ? 24 : 0;
        return hours <= 24;
    });

    const shortTermMetrics = metrics.filter(m => {
        const hours = m.metricType === 'NICOTINE' ? 72 :
            m.metricType === 'SENSE_OF_TASTE' ? 48 :
                m.metricType === 'SENSE_OF_SMELL' ? 48 :
                    m.metricType === 'BREATHING' ? 72 :
                        m.metricType === 'COUGHING' ? 168 :
                            m.metricType === 'ENERGY_LEVELS' ? 336 :
                                m.metricType === 'STRESS_REDUCTION' ? 336 : 0;
        return hours > 24 && hours <= 336; // 1-14 ngày
    });

    const longTermMetrics = metrics.filter(m => {
        const hours = m.metricType === 'LUNG_FUNCTION' ? 720 :
            m.metricType === 'SKIN_IMPROVEMENT' ? 720 :
                m.metricType === 'CIRCULATION' ? 2160 : 0;
        return hours > 336 && hours <= 8760; // 2 tuần - 1 năm
    });

    const veryLongTermMetrics = metrics.filter(m => {
        const hours = m.metricType === 'HEART_ATTACK_RISK' ? 131400 :
            m.metricType === 'CANCER_RISK' ? 87600 : 0;
        return hours > 8760; // > 1 năm
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Quay lại</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lợi ích sức khỏe</h1>
                            <p className="text-gray-600">Theo dõi tiến độ phục hồi sức khỏe sau khi bỏ thuốc</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                                <Badge variant={isRefreshing ? "default" : "secondary"}>
                                    {isRefreshing ? "Đang cập nhật" : "Tạm dừng"}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    {isRefreshing ? "Mỗi 5 giây" : ""}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatLastUpdated()}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchMetrics}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
                    <Button
                        variant={activeTab === 'overview' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('overview')}
                        className="flex-1"
                    >
                        Tổng quan
                    </Button>
                    <Button
                        variant={activeTab === 'detailed' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('detailed')}
                        className="flex-1"
                    >
                        Chi tiết
                    </Button>
                </div>

                {activeTab === 'overview' && (
                    /* Overview Tab */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Immediate Effects */}
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-green-800">
                                    <Activity className="w-5 h-5" />
                                    <span>Tác động tức thì</span>
                                </CardTitle>
                                <CardDescription>
                                    {immediateMetrics.filter(m => m.isCompleted).length}/{immediateMetrics.length} hoàn thành
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {immediateMetrics.map((metric) => (
                                        <div key={metric.id} className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="text-sm font-medium">{metric.displayName}</span>
                                            {metric.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    {metric.timeRemainingHours ? `${Math.round(metric.timeRemainingHours)}h` : 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Short-term Effects */}
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Clock className="w-5 h-5" />
                                    <span>Tác động ngắn hạn</span>
                                </CardTitle>
                                <CardDescription>
                                    {shortTermMetrics.filter(m => m.isCompleted).length}/{shortTermMetrics.length} hoàn thành
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {shortTermMetrics.map((metric) => (
                                        <div key={metric.id} className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="text-sm font-medium">{metric.displayName}</span>
                                            {metric.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    {metric.timeRemainingHours ? `${Math.round(metric.timeRemainingHours)}h` : 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Long-term Effects */}
                        <Card className="border-purple-200 bg-purple-50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-purple-800">
                                    <Heart className="w-5 h-5" />
                                    <span>Tác động dài hạn</span>
                                </CardTitle>
                                <CardDescription>
                                    {longTermMetrics.filter(m => m.isCompleted).length}/{longTermMetrics.length} hoàn thành
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {longTermMetrics.map((metric) => (
                                        <div key={metric.id} className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="text-sm font-medium">{metric.displayName}</span>
                                            {metric.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    {metric.timeRemainingHours ? `${Math.round(metric.timeRemainingHours)}h` : 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Very Long-term Effects */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-red-800">
                                    <Heart className="w-5 h-5" />
                                    <span>Tác động rất dài hạn</span>
                                </CardTitle>
                                <CardDescription>
                                    {veryLongTermMetrics.filter(m => m.isCompleted).length}/{veryLongTermMetrics.length} hoàn thành
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {veryLongTermMetrics.map((metric) => (
                                        <div key={metric.id} className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="text-sm font-medium">{metric.displayName}</span>
                                            {metric.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    {metric.timeRemainingHours ? `${Math.round(metric.timeRemainingHours)}h` : 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'detailed' && (
                    /* Detailed Tab */
                    <div className="space-y-6">
                        {/* Immediate Effects */}
                        <div>
                            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                                <Activity className="w-6 h-6 mr-2" />
                                Tác động tức thì (0-24 giờ)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {immediateMetrics.map((metric) => (
                                    <HealthMetricCard key={metric.id} metric={metric} quitDate={new Date().toISOString()} />
                                ))}
                            </div>
                        </div>

                        {/* Short-term Effects */}
                        <div>
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <Clock className="w-6 h-6 mr-2" />
                                Tác động ngắn hạn (1-14 ngày)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {shortTermMetrics.map((metric) => (
                                    <HealthMetricCard key={metric.id} metric={metric} quitDate={new Date().toISOString()} />
                                ))}
                            </div>
                        </div>

                        {/* Long-term Effects */}
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                                <Heart className="w-6 h-6 mr-2" />
                                Tác động dài hạn (2 tuần - 1 năm)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {longTermMetrics.map((metric) => (
                                    <HealthMetricCard key={metric.id} metric={metric} quitDate={new Date().toISOString()} />
                                ))}
                            </div>
                        </div>

                        {/* Very Long-term Effects */}
                        <div>
                            <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                                <Heart className="w-6 h-6 mr-2" />
                                Tác động rất dài hạn (1+ năm)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {veryLongTermMetrics.map((metric) => (
                                    <HealthMetricCard key={metric.id} metric={metric} quitDate={new Date().toISOString()} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}