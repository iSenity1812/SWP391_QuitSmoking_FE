import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { HealthProgressCircleProps } from '../../types/health';

interface DynamicHealthProgressProps extends Omit<HealthProgressCircleProps, 'progress'> {
    targetDate: string | null;
    achievedDate: string | null;
    isCompleted: boolean;
    quitDate: string; // startDate from quit plan
    currentProgress: number; // Backend progress
    className?: string;
}

const DynamicHealthProgress: React.FC<DynamicHealthProgressProps> = ({
    targetDate,
    achievedDate,
    isCompleted,
    quitDate,
    currentProgress, // Backend progress
    size = 120,
    strokeWidth = 8,
    color = '#22c55e',
    label,
    showPercentage = true,
    className = ''
}) => {
    const [dynamicProgress, setDynamicProgress] = useState(currentProgress);

    useEffect(() => {
        if (isCompleted || achievedDate) {
            setDynamicProgress(100);
            return;
        }

        if (!targetDate) {
            setDynamicProgress(0);
            return;
        }

        // Lưu thời điểm bắt đầu để tính toán chính xác
        const startTime = Date.now();
        const initialProgress = currentProgress;

        const calculateProgress = () => {
            const now = Date.now();
            const elapsedHours = (now - startTime) / (1000 * 60 * 60); // Giờ đã trôi qua

            // Tăng progress dần dần theo thời gian (giả định tăng 1% mỗi giờ)
            // Điều này chỉ là ước tính, thực tế phụ thuộc vào backend logic
            const progressIncrease = Math.min(100 - initialProgress, elapsedHours * 0.5); // Tăng 0.5% mỗi giờ
            const newProgress = Math.min(100, initialProgress + progressIncrease);

            setDynamicProgress(newProgress);
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000);

        return () => clearInterval(timer);
    }, [targetDate, achievedDate, isCompleted, quitDate, currentProgress]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (dynamicProgress / 100) * circumference;

    // Get dynamic color based on progress
    const getDynamicColor = (progress: number) => {
        if (progress >= 100) return '#22c55e'; // Green for completed
        if (progress >= 75) return '#10b981'; // Emerald for near completion
        if (progress >= 50) return '#f59e0b'; // Orange for in progress
        if (progress >= 25) return '#f97316'; // Orange-500 for early progress
        return '#6b7280'; // Gray for not started
    };

    const dynamicColor = getDynamicColor(dynamicProgress);

    return (
        <motion.div
            className={`flex flex-col items-center ${className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="relative">
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
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={dynamicColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.2
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {showPercentage && (
                        <motion.div
                            className="text-center"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <motion.div
                                className="text-2xl font-bold text-gray-800"
                                key={Math.round(dynamicProgress)}
                                initial={{ scale: 1.2, color: "#f59e0b" }}
                                animate={{ scale: 1, color: "#374151" }}
                                transition={{ duration: 0.3 }}
                            >
                                {Math.round(dynamicProgress)}%
                            </motion.div>
                            {label && (
                                <div className="text-xs text-gray-600 mt-1">
                                    {label}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Progress indicator */}
            <motion.div
                className="mt-2 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {isCompleted ? (
                    <span className="text-green-600 font-medium">Hoàn thành</span>
                ) : dynamicProgress > 0 ? (
                    <span className="text-orange-600 font-medium">Đang tiến hành</span>
                ) : (
                    <span className="text-gray-500">Chưa bắt đầu</span>
                )}
            </motion.div>
        </motion.div>
    );
};

export default DynamicHealthProgress; 