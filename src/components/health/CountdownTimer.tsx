import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  timeRemainingHours: number | null; // Backend calculated time (includes penalty)
  isCompleted: boolean;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  timeRemainingHours, // Backend calculated time with penalty
  isCompleted,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isCompleted || !targetDate || timeRemainingHours === null) {
      setTimeLeft(null);
      setStartTime(null);
      return;
    }

    // Lưu thời điểm bắt đầu để tính countdown real-time
    if (startTime === null) {
      setStartTime(Date.now());
    }

    const updateCountdown = () => {
      if (startTime === null) return;

      // Tính thời gian đã trôi qua từ khi bắt đầu
      const elapsedTime = Date.now() - startTime;
      
      // Tính thời gian còn lại = timeRemainingHours - thời gian đã trôi qua
      const remainingTime = (timeRemainingHours * 60 * 60 * 1000) - elapsedTime;

      if (remainingTime <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Cập nhật ngay lập tức
    updateCountdown();

    // Cập nhật mỗi giây để chạy động
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timeRemainingHours, isCompleted, startTime]);

  // Reset startTime khi timeRemainingHours thay đổi
  useEffect(() => {
    if (timeRemainingHours !== null) {
      setStartTime(Date.now());
    }
  }, [timeRemainingHours]);

  if (!timeLeft || isCompleted) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md ${className}`}>
      <Clock className="h-4 w-4 text-blue-500" />
      <span className="text-blue-700 font-medium">Thời gian countdown (bao gồm penalty):</span>
      <span className="text-blue-700 font-mono font-bold">
        {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer; 