import React from 'react';
import type { HealthOverview } from '../../types/health';
import HealthProgressCircle from './HealthProgressCircle';
import { Clock } from 'lucide-react';

interface HealthOverviewCardProps {
    overview: HealthOverview | null;
    className?: string;
}

const HealthOverviewCard: React.FC<HealthOverviewCardProps> = ({
    overview,
    className = ''
}) => {
    const formatTimeSinceQuit = (days: number, hours: number) => {
        if (days > 0) {
            const remainingHours = hours % 24;
            if (remainingHours > 0) {
                return `${days} ngày và ${remainingHours} giờ`;
            } else {
                return `${days} ngày`;
            }
        }
        return `${hours} giờ`;
    };

    const formatGracePeriodTime = (hours: number) => {
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            if (remainingHours > 0) {
                return `${days} ngày và ${remainingHours} giờ`;
            } else {
                return `${days} ngày`;
            }
        }
        return `${hours} giờ`;
    };

    // Hiển thị loading state nếu overview là null
    if (!overview) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tổng quan Sức khỏe</h2>
                <HealthProgressCircle
                    progress={overview.overallProgress}
                    size={100}
                    strokeWidth={8}
                    color="#22c55e"
                    showPercentage={true}
                />
            </div>

            {/* Grace Period Alert */}
            {overview.isInGracePeriod && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-800 mb-1">
                                Đang trong thời gian chuẩn bị
                            </h3>
                            <p className="text-blue-700 text-sm mb-2">
                                Bạn đang trong 24 giờ đầu tiên của hành trình cai thuốc.
                                Health metrics sẽ bắt đầu được tính toán sau khi hoàn thành thời gian chuẩn bị.
                            </p>
                            <div className="text-blue-800 font-medium">
                                Còn lại: {formatGracePeriodTime(overview.gracePeriodRemainingHours)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{overview.completedMetrics}</div>
                    <div className="text-sm text-green-700">Đã hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{overview.inProgressMetrics}</div>
                    <div className="text-sm text-orange-700">Đang tiến hành</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{overview.totalMetrics}</div>
                    <div className="text-sm text-blue-700">Tổng cộng</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Thời gian bỏ thuốc:</span>
                    <span className="text-gray-900 font-semibold">
                        {formatTimeSinceQuit(overview.daysSinceQuit, overview.hoursSinceQuit)}
                    </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Milestone tiếp theo:</span>
                    <span className="text-gray-900 font-semibold">{overview.nextMilestone}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Tiến độ tổng thể:</span>
                    <span className="text-gray-900 font-semibold">{Math.round(overview.overallProgress)}%</span>
                </div>
            </div>

            {overview.topProgressMetrics.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiến độ cao nhất</h3>
                    <div className="space-y-2">
                        {overview.topProgressMetrics.slice(0, 3).map((metric) => (
                            <div key={metric.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{metric.displayName}</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {Math.round(metric.currentProgress)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthOverviewCard; 