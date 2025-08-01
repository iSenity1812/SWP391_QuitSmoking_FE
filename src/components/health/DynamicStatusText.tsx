import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DynamicStatusTextProps {
    targetDate: string | null;
    achievedDate: string | null;
    isCompleted: boolean;
    quitDate: string;
    currentProgress: number; // Backend progress
    className?: string;
}

const DynamicStatusText: React.FC<DynamicStatusTextProps> = ({
    targetDate,
    achievedDate,
    isCompleted,
    quitDate,
    currentProgress, // Backend progress
    className = ''
}) => {
    const [dynamicProgress, setDynamicProgress] = useState(currentProgress);
    const [statusText, setStatusText] = useState('');
    const [statusColor, setStatusColor] = useState('');

    useEffect(() => {
        if (isCompleted || achievedDate) {
            setDynamicProgress(100);
            setStatusText('Đã hoàn thành');
            setStatusColor('text-green-600');
            return;
        }

        if (!targetDate) {
            setDynamicProgress(0);
            setStatusText('Chưa bắt đầu');
            setStatusColor('text-gray-600');
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

            // Update status based on progress
            if (newProgress >= 100) {
                setStatusText('Đã hoàn thành');
                setStatusColor('text-green-600');
            } else if (newProgress > 0) {
                setStatusText('Đang tiến hành');
                setStatusColor('text-orange-600');
            } else {
                setStatusText('Chưa bắt đầu');
                setStatusColor('text-gray-600');
            }
        };

        calculateProgress();
        const timer = setInterval(calculateProgress, 1000);

        return () => clearInterval(timer);
    }, [targetDate, achievedDate, isCompleted, quitDate, currentProgress]);

    return (
        <motion.span
            className={`font-medium ${statusColor} ${className}`}
            key={statusText}
            initial={{ scale: 1.05, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {statusText}
        </motion.span>
    );
};

export default DynamicStatusText; 