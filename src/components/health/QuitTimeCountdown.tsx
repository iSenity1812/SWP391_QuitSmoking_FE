import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuitTimeCountdownProps {
  quitDate: string; // startDate from quit plan
  className?: string;
}

interface TimeElapsed {
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

const QuitTimeCountdown: React.FC<QuitTimeCountdownProps> = ({
  quitDate,
  className = ''
}) => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const quitTime = new Date(quitDate).getTime();
      const totalElapsedSeconds = (now - quitTime) / 1000;
      
      const days = Math.floor(totalElapsedSeconds / (3600 * 24));
      const hours = Math.floor((totalElapsedSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);
      const seconds = Math.floor(totalElapsedSeconds % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [quitDate]);

  // Get color based on quit time
  const getQuitTimeColor = (days: number): string => {
    if (days >= 365) return 'text-purple-600'; // More than 1 year - purple
    if (days >= 90) return 'text-green-600'; // More than 3 months - green
    if (days >= 30) return 'text-blue-600'; // More than 1 month - blue
    if (days >= 7) return 'text-orange-600'; // More than 1 week - orange
    return 'text-yellow-600'; // Less than 1 week - yellow
  };

  const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg px-2 py-1 min-w-[40px] text-center shadow-md"
        key={value}
      >
        <span className="text-sm font-bold tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-gray-600 mt-1 font-medium">
        {translateTimeUnit(unit)}
      </span>
    </motion.div>
  );

  const textColor = getQuitTimeColor(timeElapsed.days);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TrendingUp className={`h-4 w-4 ${textColor}`} />
      <div className="flex gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
        <TimeUnit value={timeElapsed.days} unit="Days" />
        <TimeUnit value={timeElapsed.hours} unit="Hours" />
        <TimeUnit value={timeElapsed.minutes} unit="Minutes" />
        <TimeUnit value={timeElapsed.seconds} unit="Seconds" />
      </div>
    </div>
  );
};

export default QuitTimeCountdown; 