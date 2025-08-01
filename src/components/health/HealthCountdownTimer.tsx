import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthCountdownTimerProps {
    timeRemainingHours: number | null;
    targetDate: string | null; // Thêm prop targetDate
    isCompleted: boolean;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function translateTimeUnit(unit: string): string {
    const translations: { [key: string]: string } = {
        'days': 'Ngày',
        'hours': 'Giờ',
        'minutes': 'Phút',
        'seconds': 'Giây'
    };
    return translations[unit] || unit;
}

const HealthCountdownTimer: React.FC<HealthCountdownTimerProps> = ({
    timeRemainingHours,
    targetDate, // Thêm prop targetDate
    isCompleted,
    className = ''
}) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (isCompleted || !targetDate) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const calculateTime = () => {
            const targetTime = new Date(targetDate).getTime();
            const now = Date.now();
            const remainingTime = Math.max(0, targetTime - now);

            if (remainingTime <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const totalSeconds = Math.floor(remainingTime / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    }, [targetDate, isCompleted]);

    // Get color based on remaining time
    const getCountdownColor = (hours: number): string => {
        if (hours <= 1) return 'text-red-600'; // Less than 1 hour - red
        if (hours <= 24) return 'text-orange-600'; // Less than 1 day - orange
        if (hours <= 168) return 'text-yellow-600'; // Less than 1 week - yellow
        return 'text-blue-600'; // More than 1 week - blue
    };

    // Get background color for urgency
    const getBackgroundColor = (hours: number): string => {
        if (hours <= 1) return 'bg-red-50 border-red-200';
        if (hours <= 24) return 'bg-orange-50 border-orange-200';
        if (hours <= 168) return 'bg-yellow-50 border-yellow-200';
        return 'bg-blue-50 border-blue-200';
    };

    if (isCompleted || !targetDate) {
        return (
            <div className={`flex items-center gap-2 text-green-600 font-medium ${className}`}>
                <Clock className="h-4 w-4" />
                <span>Đã hoàn thành</span>
            </div>
        );
    }

    // Tính tổng giờ còn lại để xác định màu sắc
    const totalRemainingHours = timeLeft.days * 24 + timeLeft.hours;
    const textColor = getCountdownColor(totalRemainingHours);
    const bgColor = getBackgroundColor(totalRemainingHours);

    const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
        <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <motion.div
                className={`text-lg font-bold ${textColor}`}
                key={value}
                initial={{ scale: 1.2, color: "#f59e0b" }}
                animate={{ scale: 1, color: "" }}
                transition={{ duration: 0.3 }}
            >
                {value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs text-gray-500">
                {translateTimeUnit(unit)}
            </div>
        </motion.div>
    );

    return (
        <motion.div
            className={`flex items-center gap-3 p-3 rounded-lg border ${bgColor} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Clock className={`h-5 w-5 ${textColor}`} />
            <div className="flex gap-2">
                {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} unit="days" />}
                <TimeUnit value={timeLeft.hours} unit="hours" />
                <TimeUnit value={timeLeft.minutes} unit="minutes" />
                <TimeUnit value={timeLeft.seconds} unit="seconds" />
            </div>
        </motion.div>
    );
};

export default HealthCountdownTimer; 