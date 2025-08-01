import React from 'react';
import type { HealthMetric } from '../../types/health';
import DynamicHealthProgress from './DynamicHealthProgress';
import DynamicProgressText from './DynamicProgressText';
import DynamicStatusText from './DynamicStatusText';
import HealthCountdownTimer from './HealthCountdownTimer';

interface HealthMetricCardProps {
    metric: HealthMetric;
    quitDate: string; // startDate from quit plan
    showDescription?: boolean;
    className?: string;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
    metric,
    quitDate,
    showDescription = true,
    className = ''
}) => {
    const getProgressColor = (progress: number) => {
        if (progress >= 100) return '#22c55e'; // Green for completed
        if (progress >= 75) return '#10b981'; // Emerald for near completion
        if (progress >= 50) return '#f59e0b'; // Orange for in progress
        if (progress >= 25) return '#f97316'; // Orange-500 for early progress
        return '#6b7280'; // Gray for not started
    };



    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {metric.displayName}
                    </h3>
                    {showDescription && (
                        <p className="text-sm text-gray-600">
                            {metric.description}
                        </p>
                    )}
                </div>
                <DynamicHealthProgress
                    targetDate={metric.targetDate}
                    achievedDate={metric.achievedDate}
                    isCompleted={metric.isCompleted}
                    quitDate={quitDate}
                    currentProgress={metric.currentProgress}
                    size={80}
                    strokeWidth={6}
                    color={getProgressColor(metric.currentProgress)}
                    showPercentage={true}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tiến độ:</span>
                    <DynamicProgressText
                        targetDate={metric.targetDate}
                        achievedDate={metric.achievedDate}
                        isCompleted={metric.isCompleted}
                        quitDate={quitDate}
                        currentProgress={metric.currentProgress}
                        className="font-medium"
                    />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Trạng thái:</span>
                    <DynamicStatusText
                        targetDate={metric.targetDate}
                        achievedDate={metric.achievedDate}
                        isCompleted={metric.isCompleted}
                        quitDate={quitDate}
                        currentProgress={metric.currentProgress}
                        className="font-medium"
                    />
                </div>

                {metric.timeRemainingHours !== null && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Thời gian còn lại:</span>
                        <HealthCountdownTimer
                            timeRemainingHours={metric.timeRemainingHours}
                            targetDate={metric.targetDate} // Thêm prop targetDate
                            isCompleted={metric.isCompleted}
                            className="font-medium"
                        />
                    </div>
                )}

                {metric.targetDate && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Ngày mục tiêu:</span>
                        <span className="font-medium text-gray-900">
                            {new Date(metric.targetDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                )}

                {metric.achievedDate && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Ngày hoàn thành:</span>
                        <span className="font-medium text-green-600">
                            {new Date(metric.achievedDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthMetricCard; 