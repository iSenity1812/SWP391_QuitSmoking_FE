import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthHeaderCountdownProps {
  quitDate: string; // startDate from quit plan
  nextMilestone: string;
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

const HealthHeaderCountdown: React.FC<HealthHeaderCountdownProps> = ({
  quitDate,
  nextMilestone,
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

  const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className="bg-white/20 backdrop-blur-sm text-white rounded-lg px-3 py-2 min-w-[50px] text-center shadow-lg border border-white/30"
        key={value}
      >
        <span className="text-lg font-bold tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-green-100 mt-1 font-medium">
        {translateTimeUnit(unit)}
      </span>
    </motion.div>
  );

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <h2 className="text-2xl font-bold">Theo dõi Sức khỏe</h2>
        <p className="text-green-100 mt-1">
          Theo dõi sự cải thiện sức khỏe của bạn sau khi bỏ thuốc
        </p>
        <div className="mt-3">
          <div className="flex items-center gap-2 text-green-100">
            <Target className="h-4 w-4" />
            <span className="text-sm">Mốc tiếp theo: {nextMilestone}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-100" />
          <span className="text-green-100 font-medium">Thời gian bỏ thuốc</span>
        </div>
        <div className="flex gap-2">
          <TimeUnit value={timeElapsed.days} unit="Days" />
          <TimeUnit value={timeElapsed.hours} unit="Hours" />
          <TimeUnit value={timeElapsed.minutes} unit="Minutes" />
          <TimeUnit value={timeElapsed.seconds} unit="Seconds" />
        </div>
      </div>
    </div>
  );
};

export default HealthHeaderCountdown; 