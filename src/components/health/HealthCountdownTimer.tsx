import React, { useState, useEffect, useRef } from 'react';

interface HealthCountdownTimerProps {
  timeRemainingHours: number | null; // Double from backend
  targetDate: string | null;
  isCompleted: boolean;
  hasRegressed?: boolean;
  className?: string;
  // Add metricId for unique localStorage keys
  metricId?: string;
  // Add flag to prevent refresh from overwriting localStorage
  isRefreshing?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function translateTimeUnit(unit: string): string {
  const translations: { [key: string]: string } = {
    'days': 'ngày',
    'hours': 'giờ',
    'minutes': 'phút',
    'seconds': 'giây'
  };

  return translations[unit] || unit;
}

const HealthCountdownTimer: React.FC<HealthCountdownTimerProps> = ({
  timeRemainingHours,
  targetDate,
  isCompleted,
  hasRegressed = false,
  className = '',
  metricId = 'default',
  isRefreshing = false
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Sử dụng useRef để lưu thời điểm bắt đầu và timeRemainingHours ban đầu
  const startTimeRef = useRef<number>(Date.now());
  const initialTimeRemainingHoursRef = useRef<number | null>(timeRemainingHours);

  // FIX: Loại bỏ metricKey để tránh timer bị reset liên tục
  // const metricKey = `${metricId}-${timeRemainingHours}`;

  // Get color based on remaining time
  const getCountdownColor = (hours: number): string => {
    if (hours <= 1) return 'text-red-600';
    if (hours <= 24) return 'text-orange-600';
    if (hours <= 168) return 'text-yellow-600';
    return 'text-blue-600';
  };

  // Get background color for urgency
  const getBackgroundColor = (hours: number): string => {
    if (hours <= 1) return 'bg-red-50 border-red-200';
    if (hours <= 24) return 'bg-orange-50 border-orange-200';
    if (hours <= 168) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  // Logic countdown real-time
  useEffect(() => {
    // FIX: Đơn giản hóa logic - chỉ kiểm tra targetDate và isCompleted
    console.log(`🕐 HealthCountdownTimer [${metricId}]: useEffect triggered`, {
      targetDate,
      timeRemainingHours,
      isCompleted,
      hasRegressed
    });

    // Nếu đã hoàn thành, không cần countdown
    if (isCompleted) {
      console.log(`🕐 HealthCountdownTimer [${metricId}]: Completed, stopping timer`);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Nếu không có targetDate, không cần countdown
    if (!targetDate) {
      console.log(`🕐 HealthCountdownTimer [${metricId}]: No targetDate, stopping timer`);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const calculateTime = () => {
      const now = Date.now();
      const targetTime = new Date(targetDate).getTime();

      // Tính thời gian còn lại trực tiếp từ targetDate
      const totalRemainingSeconds = Math.max(0, (targetTime - now) / 1000);

      const days = Math.floor(totalRemainingSeconds / (3600 * 24));
      const hours = Math.floor((totalRemainingSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
      const seconds = Math.floor(totalRemainingSeconds % 60);

      const newTimeLeft = { days, hours, minutes, seconds };

      // FIX: Thêm debug log cho timer update
      console.log(`🕐 HealthCountdownTimer [${metricId}]: Timer update`, {
        totalRemainingSeconds,
        newTimeLeft,
        targetDate: new Date(targetDate).toISOString(),
        now: new Date(now).toISOString()
      });

      setTimeLeft(newTimeLeft);
    };

    // Tính toán ngay lập tức
    calculateTime();

    // Bắt đầu timer cập nhật mỗi giây
    const timer = setInterval(calculateTime, 1000);

    console.log(`🕐 HealthCountdownTimer [${metricId}]: Timer started, interval: 1000ms`);

    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => {
      clearInterval(timer);
      console.log(`🕐 HealthCountdownTimer [${metricId}]: Timer stopped`);
    };
  }, [targetDate, timeRemainingHours, isCompleted, hasRegressed, metricId]); // FIX: Giữ dependencies cần thiết để timer restart khi data thay đổi

  // Hiển thị "Hoàn thành" khi thực sự hoàn thành
  if (isCompleted) {
    return (
      <span className={`text-green-600 font-medium ${className}`}>
        Hoàn thành
      </span>
    );
  }

  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  const countdownColor = getCountdownColor(totalHours);
  const backgroundColor = getBackgroundColor(totalHours);

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${backgroundColor} ${countdownColor} ${className}`}
    >
      {/* Hiển thị countdown timer với format đẹp */}
      {timeLeft.days > 0 && (
        <span>
          {timeLeft.days.toString().padStart(2, '0')} {translateTimeUnit('days')}
        </span>
      )}
      {timeLeft.hours > 0 && (
        <span>
          {timeLeft.hours.toString().padStart(2, '0')} {translateTimeUnit('hours')}
        </span>
      )}
      {timeLeft.minutes > 0 && (
        <span>
          {timeLeft.minutes.toString().padStart(2, '0')} {translateTimeUnit('minutes')}
        </span>
      )}
      {timeLeft.seconds > 0 && (
        <span>
          {timeLeft.seconds.toString().padStart(2, '0')} {translateTimeUnit('seconds')}
        </span>
      )}
      {/* Hiển thị "Hoàn thành" khi thực sự hoàn thành */}
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <span>Hoàn thành</span>
      )}
    </div>
  );
};

export default HealthCountdownTimer; 