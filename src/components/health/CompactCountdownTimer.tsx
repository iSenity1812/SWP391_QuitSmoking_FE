import React, { useState, useEffect } from 'react';

interface CompactCountdownTimerProps {
  targetDate: string;
  isCompleted?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function translateTimeUnit(unit: string): string {
  switch (unit) {
    case "Days":
      return "Ngày";
    case "Hours":
      return "Giờ";
    case "Minutes":
      return "Phút";
    case "Seconds":
      return "Giây";
    default:
      return `${unit}`;
  }
}

const CompactCountdownTimer: React.FC<CompactCountdownTimerProps> = ({
  targetDate,
  isCompleted = false,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      if (isCompleted) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const targetTime = new Date(targetDate).getTime();
      const nowTime = now.getTime();
      const difference = targetTime - nowTime;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isCompleted]);

  if (isCompleted) {
    return <span className={`text-green-600 font-medium ${className}`}>Đã hoàn thành</span>;
  }

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {timeLeft.days > 0 && (
        <span className="text-sm font-medium">
          {timeLeft.days.toString().padStart(2, '0')} {translateTimeUnit('Days')}
        </span>
      )}
      {timeLeft.hours > 0 && (
        <span className="text-sm font-medium">
          {timeLeft.hours.toString().padStart(2, '0')} {translateTimeUnit('Hours')}
        </span>
      )}
      {timeLeft.minutes > 0 && (
        <span className="text-sm font-medium">
          {timeLeft.minutes.toString().padStart(2, '0')} {translateTimeUnit('Minutes')}
        </span>
      )}
      {timeLeft.seconds > 0 && (
        <span className="text-sm font-medium">
          {timeLeft.seconds.toString().padStart(2, '0')} {translateTimeUnit('Seconds')}
        </span>
      )}
      {/* Hiển thị "Hoàn thành" khi thực sự hoàn thành */}
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <span className="text-green-600 font-medium">Hoàn thành</span>
      )}
    </div>
  );
};

export default CompactCountdownTimer; 