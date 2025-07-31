import React from 'react';
import type { HealthMetric } from '../../types/health';
import HealthProgressCircle from './HealthProgressCircle';

interface HealthMetricCardProps {
    metric: HealthMetric;
    showDescription?: boolean;
    className?: string;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
    metric,
    showDescription = true,
    className = ''
}) => {
    const getProgressColor = (progress: number) => {
        if (progress >= 100) return '#22c55e'; // Green for completed
        if (progress >= 50) return '#f59e0b'; // Orange for in progress
        return '#6b7280'; // Gray for not started
    };

    const formatTimeRemaining = (timeRemaining: string) => {
        if (timeRemaining === 'Completed') return 'Đã hoàn thành';
        return timeRemaining;
    };

    const getStatusText = (isCompleted: boolean, progress: number) => {
        if (isCompleted) return 'Đã hoàn thành';
        if (progress > 0) return 'Đang tiến hành';
        return 'Chưa bắt đầu';
    };

    const getStatusColor = (isCompleted: boolean, progress: number) => {
        if (isCompleted) return 'text-green-600';
        if (progress > 0) return 'text-orange-600';
        return 'text-gray-600';
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
                <HealthProgressCircle
                    progress={metric.currentProgress}
                    size={80}
                    strokeWidth={6}
                    color={getProgressColor(metric.currentProgress)}
                    showPercentage={true}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tiến độ:</span>
                    <span className="font-medium text-gray-900">
                        {Math.round(metric.currentProgress)}%
                    </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className={`font-medium ${getStatusColor(metric.isCompleted, metric.currentProgress)}`}>
                        {getStatusText(metric.isCompleted, metric.currentProgress)}
                    </span>
                </div>

                {metric.timeRemainingFormatted && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Thời gian còn lại:</span>
                        <span className="font-medium text-gray-900">
                            {formatTimeRemaining(metric.timeRemainingFormatted)}
                        </span>
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