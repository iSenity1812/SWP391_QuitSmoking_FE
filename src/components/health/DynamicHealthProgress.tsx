import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { HealthProgressCircleProps } from '../../types/health';

interface DynamicHealthProgressProps extends Omit<HealthProgressCircleProps, 'progress'> {
    targetDate: string | null;
    achievedDate: string | null;
    isCompleted: boolean;
    quitDate: string;
    currentProgress: number; // Backend progress
    hasRegressed?: boolean; // Add hasRegressed prop
    className?: string;
}

const DynamicHealthProgress: React.FC<DynamicHealthProgressProps> = ({
    targetDate,
    achievedDate,
    isCompleted,
    quitDate,
    currentProgress, // Backend progress
    hasRegressed, // Add hasRegressed prop
    size = 120,
    strokeWidth = 8,
    color = '#22c55e',
    label,
    showPercentage = true,
    className = ''
}) => {
    const [dynamicProgress, setDynamicProgress] = useState(currentProgress);

    useEffect(() => {
        // Nếu đã hoàn thành hoặc có achievedDate, hiển thị 100%
        if (isCompleted || achievedDate) {
            setDynamicProgress(100);
            return;
        }

        if (!targetDate) {
            setDynamicProgress(0);
            return;
        }

        // LOGIC MỚI: Sử dụng backend progress trực tiếp
        // Không tính toán phức tạp, chỉ hiển thị progress từ backend
        setDynamicProgress(currentProgress);
    }, [targetDate, achievedDate, isCompleted, currentProgress]);

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
                {/* Remove regression text display */}
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