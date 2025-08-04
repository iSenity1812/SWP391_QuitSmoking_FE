import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { HealthProgressCircleProps } from '../../types/health';
import { getHealthMetricTargetHours } from '../../types/health';

interface DynamicHealthProgressProps extends Omit<HealthProgressCircleProps, 'progress'> {
  targetDate: string | null;
  achievedDate: string | null;
  isCompleted: boolean;
  quitDate: string;
  currentProgress: number; // Backend progress
  hasRegressed?: boolean; // Add hasRegressed prop
  metricType?: string; // Add metricType for targetHours calculation
  className?: string;
}

const DynamicHealthProgress: React.FC<DynamicHealthProgressProps> = ({
  targetDate,
  achievedDate,
  isCompleted,
  quitDate,
  currentProgress, // Backend progress
  hasRegressed, // Add hasRegressed prop
  metricType, // Add metricType for targetHours calculation
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  label,
  showPercentage = true,
  className = ''
}) => {
  const [dynamicProgress, setDynamicProgress] = useState(currentProgress);

  useEffect(() => {
    // Nếu đã hoàn thành và KHÔNG bị regressed, hiển thị 100%
    if (isCompleted && !hasRegressed) {
      setDynamicProgress(100);
      return;
    }

    if (!targetDate) {
      setDynamicProgress(0);
      return;
    }

    // Sử dụng backend progress trực tiếp
    // Nếu bị regressed, backend đã set currentProgress = 0.0
    setDynamicProgress(currentProgress);
  }, [targetDate, achievedDate, isCompleted, hasRegressed, currentProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (dynamicProgress / 100) * circumference;

  // Get dynamic color based on progress and regression status
  const getDynamicColor = (progress: number, hasRegressed?: boolean) => {
    if (hasRegressed === true) return '#ef4444'; // Red for regressed
    if (progress >= 100) return '#22c55e'; // Green for completed
    if (progress >= 75) return '#10b981'; // Emerald for near completion
    if (progress >= 50) return '#f59e0b'; // Orange for in progress
    if (progress >= 25) return '#f97316'; // Orange-500 for early progress
    return '#6b7280'; // Gray for not started
  };

  // Calculate penalty effect for color indication - đồng bộ với backend logic
  const calculatePenaltyEffect = () => {
    if (!targetDate || !metricType) return false;

    // FIX: Không hiển thị penalty cho metrics đã completed
    if (isCompleted) {
      return false;
    }

    const quitDateObj = new Date(quitDate);
    const targetDateObj = new Date(targetDate);
    const targetHours = getHealthMetricTargetHours(metricType as any);
    const originalTargetDate = new Date(quitDateObj.getTime() + (targetHours * 60 * 60 * 1000));

    // Check if target date is extended due to penalty
    const penaltyTime = targetDateObj.getTime() - originalTargetDate.getTime();

    // Nếu metric đã regressed, penalty được tính từ now()
    if (hasRegressed && !isCompleted) {
      const now = new Date();
      const regressionPenaltyTime = targetDateObj.getTime() - now.getTime();
      return regressionPenaltyTime > 0;
    }

    return penaltyTime > 0;
  };

  const hasPenalty = calculatePenaltyEffect();

  const finalColor = getDynamicColor(dynamicProgress, hasRegressed);

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={finalColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-lg font-bold text-gray-900">
            {Math.round(dynamicProgress)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-600 mt-1">
            {label}
          </span>
        )}
        {/* Penalty indicator */}
        {hasPenalty && !isCompleted && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        )}

        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicHealthProgress; 