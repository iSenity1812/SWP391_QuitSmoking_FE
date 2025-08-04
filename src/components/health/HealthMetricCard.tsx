import React from 'react';
import { Clock } from 'lucide-react';
import type { HealthMetric } from '@/types/health';
import DynamicHealthProgress from './DynamicHealthProgress';
import DynamicProgressText from './DynamicProgressText';
import DynamicStatusText from './DynamicStatusText';
import CountdownTimer from './CountdownTimer';
import { useHealth } from '@/hooks/use-health';

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
  // FIX: Lấy isRefreshing từ useHealth hook
  const { isRefreshing } = useHealth();

  const getProgressColor = (progress: number, hasRegressed?: boolean) => {
    if (hasRegressed) return '#ef4444'; // red-500
    if (progress >= 100) return '#10b981'; // green-500
    if (progress >= 50) return '#f59e0b'; // amber-500
    return '#3b82f6'; // blue-500
  };

  const formatTimeRemaining = (timeRemaining: string) => {
    if (timeRemaining === 'Completed') return 'Đã hoàn thành';
    return timeRemaining;
  };

  const getStatusText = (isCompleted: boolean, progress: number, hasRegressed?: boolean) => {
    if (isCompleted) return 'Đã hoàn thành';
    if (progress > 0) return 'Đang tiến hành';
    return 'Chưa bắt đầu';
  };

  const getStatusColor = (isCompleted: boolean, progress: number, hasRegressed?: boolean) => {
    if (isCompleted) return 'text-green-600';
    if (progress > 0) return 'text-orange-600';
    return 'text-gray-600';
  };



  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow border-gray-200 ${className}`}>
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
        
        {/* Countdown Timer: targetDate - now() */}
        <CountdownTimer
          targetDate={metric.targetDate}
          isCompleted={metric.isCompleted}
          className="text-sm"
        />
        

        
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