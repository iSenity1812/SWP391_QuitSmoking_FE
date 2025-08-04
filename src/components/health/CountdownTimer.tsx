import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  isCompleted: boolean;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  isCompleted,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (isCompleted || !targetDate) {
      setTimeLeft(null);
      return;
    }

    const updateCountdown = () => {
      const targetDateObj = new Date(targetDate);
      const now = new Date();
      const timeDiff = targetDateObj.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Cập nhật ngay lập tức
    updateCountdown();

    // Cập nhật mỗi giây
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isCompleted]);

  if (!timeLeft || isCompleted) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md ${className}`}>
      <Clock className="h-4 w-4 text-blue-500" />
      <span className="text-blue-700 font-medium">Thời gian countdown:</span>
      <span className="text-blue-700 font-mono font-bold">
        {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer; 