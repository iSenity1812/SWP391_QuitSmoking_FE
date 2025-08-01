import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DynamicProgressTextProps {
    targetDate: string | null;
    achievedDate: string | null;
    isCompleted: boolean;
    quitDate: string;
    currentProgress: number;
    className?: string;
}

const DynamicProgressText: React.FC<DynamicProgressTextProps> = ({
    targetDate,
    achievedDate,
    isCompleted,
    quitDate,
    currentProgress,
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

            // Tăng progress dần dần theo thời gian (giả định tăng 0.5% mỗi giờ)
            const progressIncrease = Math.min(100 - initialProgress, elapsedHours * 0.5);
            const newProgress = Math.min(100, initialProgress + progressIncrease);

            setDynamicProgress(newProgress);
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000);

        return () => clearInterval(timer);
    }, [targetDate, achievedDate, isCompleted, quitDate, currentProgress]);

    return (
        <motion.span
            className={`font-medium text-gray-900 ${className}`}
            key={Math.round(dynamicProgress)}
            initial={{ scale: 1.1, color: "#f59e0b" }}
            animate={{ scale: 1, color: "#374151" }}
            transition={{ duration: 0.3 }}
        >
            {Math.round(dynamicProgress)}%
        </motion.span>
    );
};

export default DynamicProgressText; 