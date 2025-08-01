import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseCountdownOptions {
  initialHours: number | null;
  isCompleted: boolean;
  updateInterval?: number; // milliseconds, default 1000ms
  onComplete?: () => void;
}

interface UseCountdownReturn {
  remainingHours: number | null;
  formattedTime: string;
  isCompleted: boolean;
  reset: () => void;
}

export const useCountdown = ({
  initialHours,
  isCompleted,
  updateInterval = 1000,
  onComplete
}: UseCountdownOptions): UseCountdownReturn => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [startTime] = useState(Date.now());

  // Update current time at specified interval
  useEffect(() => {
    if (isCompleted || initialHours === null || initialHours <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [isCompleted, initialHours, updateInterval]);

  // Calculate remaining time
  const remainingHours = useMemo(() => {
    if (isCompleted || initialHours === null || initialHours <= 0) {
      return null;
    }

    const elapsedHours = (currentTime - startTime) / (1000 * 60 * 60);
    const remaining = Math.max(0, initialHours - elapsedHours);

    return remaining;
  }, [isCompleted, initialHours, currentTime, startTime]);

  // Format time display
  const formatTime = useCallback((hours: number): string => {
    if (hours <= 0) return 'Đã hoàn thành';

    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);
    const seconds = Math.floor(((hours % 1) * 60 % 1) * 60);

    if (days > 0) {
      return `${days}d ${remainingHours}h ${minutes}m ${seconds}s`;
    } else if (remainingHours > 0) {
      return `${remainingHours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  const formattedTime = useMemo(() => {
    if (remainingHours === null) return 'Đã hoàn thành';
    return formatTime(remainingHours);
  }, [remainingHours, formatTime]);

  // Check if countdown is completed
  const countdownCompleted = useMemo(() => {
    return remainingHours !== null && remainingHours <= 0;
  }, [remainingHours]);

  // Call onComplete when countdown finishes
  useEffect(() => {
    if (countdownCompleted && onComplete) {
      onComplete();
    }
  }, [countdownCompleted, onComplete]);

  // Reset function
  const reset = useCallback(() => {
    setCurrentTime(Date.now());
  }, []);

  return {
    remainingHours,
    formattedTime,
    isCompleted: countdownCompleted,
    reset
  };
}; 