import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
    totalSeconds: number;
    elapsedSeconds: number;
    className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    totalSeconds,
    elapsedSeconds,
    className = ""
}) => {
    const [remainingSeconds, setRemainingSeconds] = useState(
        Math.max(0, totalSeconds - elapsedSeconds)
    );

    useEffect(() => {
        const newRemaining = Math.max(0, totalSeconds - elapsedSeconds);
        setRemainingSeconds(newRemaining);
    }, [totalSeconds, elapsedSeconds]);

    useEffect(() => {
        if (remainingSeconds <= 0) return;

        const timer = setInterval(() => {
            setRemainingSeconds(prev => {
                const newValue = prev - 1;
                return newValue >= 0 ? newValue : 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingSeconds]);

    const formatTime = (seconds: number) => {
        if (seconds <= 0) return "00:00:00";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${secs.toString().padStart(2, '0')}s`;
        }
    };

    const formatTimeText = (seconds: number) => {
        if (seconds <= 0) return "Đã hoàn thành";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `Trong ${hours} giờ, ${minutes} phút, ${secs} giây`;
        } else if (minutes > 0) {
            return `Trong ${minutes} phút, ${secs} giây`;
        } else {
            return `Trong ${secs} giây`;
        }
    };

    const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

    return (
        <div className={`text-center ${className}`}>
            <div className="text-sm text-gray-600 mb-1">
                {formatTimeText(remainingSeconds)}
            </div>
            <div className="text-xs text-gray-500">
                {formatTime(remainingSeconds)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div
                    className="bg-emerald-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

export default CountdownTimer; 