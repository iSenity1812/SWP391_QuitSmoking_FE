import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Brain, TrendingUp, Zap } from 'lucide-react';
import type { HealthMetric } from '../../types/health';

interface HealthBenefitsTimelineProps {
    healthMetrics: HealthMetric[];
    quitDate: string;
    className?: string;
}

const HealthBenefitsTimeline: React.FC<HealthBenefitsTimelineProps> = ({
    healthMetrics,
    quitDate,
    className = ''
}) => {
    // Map health metrics to timeline items
    const getTimelineItems = () => {
        return healthMetrics.map((metric) => {
            let icon = 'activity';
            let status = 'in-progress';

            // Determine status based on completion and regression
            if (metric.isCompleted && !metric.hasRegressed) {
                status = 'completed';
            } else if (metric.hasRegressed === true) {
                status = 'regressed';
            } else if (metric.currentProgress > 0) {
                status = 'in-progress';
            } else {
                status = 'not-started';
            }

            // Determine icon based on metric type
            switch (metric.metricType) {
                case 'PULSE_RATE':
                case 'BLOOD_PRESSURE':
                case 'CIRCULATION':
                case 'HEART_ATTACK_RISK':
                case 'CANCER_RISK':
                    icon = 'heart';
                    break;
                case 'BREATHING':
                case 'LUNG_FUNCTION':
                    icon = 'activity';
                    break;
                case 'ENERGY_LEVELS':
                    icon = 'zap';
                    break;
                default:
                    icon = 'activity';
            }

            return {
                id: metric.id,
                timeframe: metric.timeRemainingFormatted || 'Đang tính toán...',
                title: metric.displayName,
                description: metric.description,
                icon,
                status,
                progress: metric.currentProgress,
                hasRegressed: metric.hasRegressed,
                targetDate: metric.targetDate,
                achievedDate: metric.achievedDate
            };
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'regressed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'not-started':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getIconComponent = (icon: string) => {
        const iconClass = "w-5 h-5";

        switch (icon) {
            case 'heart':
                return <Heart className={`${iconClass} text-red-500`} />;
            case 'activity':
                return <Activity className={`${iconClass} text-blue-500`} />;
            case 'brain':
                return <Brain className={`${iconClass} text-purple-500`} />;
            case 'zap':
                return <Zap className={`${iconClass} text-yellow-500`} />;
            case 'trending':
                return <TrendingUp className={`${iconClass} text-green-500`} />;
            default:
                return <Activity className={`${iconClass} text-blue-500`} />;
        }
    };

    const getProgressIndicator = (item: any) => {
        if (item.status === 'completed') {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Hoàn thành</span>
                </div>
            );
        }

        if (item.status === 'regressed') {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600">Đang tiến hành</span>
                </div>
            );
        }

        if (item.status === 'in-progress') {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600">{item.progress.toFixed(1)}%</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-500">Chưa bắt đầu</span>
            </div>
        );
    };

    const timelineItems = getTimelineItems();

    return (
        <div className={`space-y-6 ${className}`}>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Lợi ích sức khỏe theo thời gian
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Theo dõi sự cải thiện sức khỏe của bạn kể từ khi bỏ thuốc
                </p>
            </div>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-slate-200">
                        Lợi ích sức khỏe theo thời gian
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                        Các cải thiện sức khỏe bạn đã đạt được và sẽ đạt được
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {timelineItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${item.status === 'regressed'
                                        ? 'border-red-200 bg-red-50/50'
                                        : item.status === 'completed'
                                            ? 'border-green-200 bg-green-50/50'
                                            : 'border-slate-200 bg-slate-50/50'
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {getIconComponent(item.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {item.timeframe}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {item.description}
                                    </p>

                                    {/* Progress bar for in-progress items */}
                                    {item.status === 'in-progress' && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    )}

                                    {/* Recovery message */}
                                    {item.hasRegressed === false && item.status === 'completed' && (
                                        <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded-md">
                                            <p className="text-xs text-orange-700">
                                                🎉 Chúc mừng! Bạn đã đạt lại mục tiêu sau khi tụt xuống!
                                            </p>
                                        </div>
                                    )}

                                    {/* Penalty effect message */}
                                    {item.status === 'regressed' && (
                                        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-md">
                                            <p className="text-xs text-red-700">
                                                ⚠️ Health đã bị tụt xuống do hút thuốc. Cần thêm thời gian để phục hồi.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HealthBenefitsTimeline; 