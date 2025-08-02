import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { HealthMetric } from '../../types/health';
import { getHealthMetricTargetHours } from '../../types/health';
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
    const getProgressColor = (progress: number, hasRegressed?: boolean) => {
        // Remove regression logic - treat all metrics the same
        if (progress >= 100) return '#22c55e'; // Green for completed
        if (progress >= 75) return '#10b981'; // Emerald for near completion
        if (progress >= 50) return '#f59e0b'; // Orange for in progress
        if (progress >= 25) return '#f97316'; // Orange-500 for early progress
        return '#6b7280'; // Gray for not started
    };



    // Tính toán penalty effect - đồng bộ với backend logic
    const calculatePenaltyEffect = () => {
        if (!metric.targetDate) return null;

        const quitDateObj = new Date(quitDate);
        const targetDateObj = new Date(metric.targetDate);
        const targetHours = getHealthMetricTargetHours(metric.metricType);
        const originalTargetDate = new Date(quitDateObj.getTime() + (targetHours * 60 * 60 * 1000));

        // Tính penalty time (thời gian bị thêm vào do hút thuốc)
        const penaltyTime = targetDateObj.getTime() - originalTargetDate.getTime();
        const calculatedPenaltyHours = Math.max(0, penaltyTime / (60 * 60 * 1000));

        // Nếu metric đã regressed (completed và bị reset), penalty được tính từ now()
        if (metric.hasRegressed && metric.isCompleted === false) {
            const now = new Date();
            const regressionPenaltyTime = targetDateObj.getTime() - now.getTime();
            const regressionPenaltyHours = Math.max(0, regressionPenaltyTime / (60 * 60 * 1000));

            // Giới hạn penalty không vượt quá thời gian gốc (như backend)
            const maxPenaltyHours = targetHours;
            const actualPenaltyHours = Math.min(regressionPenaltyHours, maxPenaltyHours);

            return actualPenaltyHours > 0 ? actualPenaltyHours : null;
        }

        return calculatedPenaltyHours > 0 ? calculatedPenaltyHours : null;
    };

    const penaltyHours = calculatePenaltyEffect();

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${penaltyHours ? 'border-red-200 bg-red-50/30' :
            metric.hasRegressed ? 'border-orange-200 bg-orange-50/30' :
                'border-gray-200'
            } ${className}`}>
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
                    hasRegressed={metric.hasRegressed}
                    metricType={metric.metricType}
                    size={80}
                    strokeWidth={6}
                    color={getProgressColor(metric.currentProgress, metric.hasRegressed)}
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
                        hasRegressed={metric.hasRegressed}
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
                        hasRegressed={metric.hasRegressed}
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
                            hasRegressed={metric.hasRegressed}
                            className="font-medium"
                            metricId={metric.metricType} // Add unique metricId
                            isAutoRefreshing={false} // Add auto-refresh flag
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
                        <span className={`font-medium ${metric.hasRegressed === false ? 'text-orange-600' : 'text-green-600'}`}>
                            {new Date(metric.achievedDate).toLocaleDateString('vi-VN')}
                            {metric.hasRegressed === false && ' (Đạt lại)'}
                        </span>
                    </div>
                )}

                {/* Penalty Effect Display */}
                {penaltyHours && (
                    <div className="flex justify-between items-center text-sm p-2 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-red-700 font-medium">Penalty Effect:</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-red-500" />
                            <span className="text-red-700 font-medium">
                                +{penaltyHours.toFixed(1)} giờ
                            </span>
                        </div>
                    </div>
                )}

                {/* Regression Warning */}
                {metric.hasRegressed && (
                    <div className="flex justify-between items-center text-sm p-2 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-700 font-medium">Health Regression:</span>
                        </div>
                        <span className="text-orange-700 text-xs">
                            Đã tụt xuống do hút thuốc
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthMetricCard; 