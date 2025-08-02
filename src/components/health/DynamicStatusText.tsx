import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DynamicStatusTextProps {
    targetDate: string | null;
    achievedDate: string | null;
    isCompleted: boolean;
    quitDate: string;
    currentProgress: number; // Backend progress
    hasRegressed?: boolean; // Add hasRegressed prop
    className?: string;
}

const DynamicStatusText: React.FC<DynamicStatusTextProps> = ({
    targetDate,
    achievedDate,
    isCompleted,
    quitDate,
    currentProgress, // Backend progress
    hasRegressed, // Add hasRegressed prop
    className = ''
}) => {
    const [dynamicProgress, setDynamicProgress] = useState(currentProgress);
    const [statusText, setStatusText] = useState('');
    const [statusColor, setStatusColor] = useState('');

    useEffect(() => {
        // Sử dụng backend progress trực tiếp
        if (isCompleted && !hasRegressed) {
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

        // Sử dụng backend progress
        setDynamicProgress(currentProgress);

        // Update status based on backend progress
        if (currentProgress >= 100) {
            setStatusText('Đã hoàn thành');
            setStatusColor('text-green-600');
        } else if (currentProgress > 0) {
            setStatusText('Đang tiến hành');
            setStatusColor('text-orange-600');
        } else {
            setStatusText('Chưa bắt đầu');
            setStatusColor('text-gray-600');
        }
    }, [targetDate, achievedDate, isCompleted, hasRegressed, currentProgress]);

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