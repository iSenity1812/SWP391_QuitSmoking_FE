import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DynamicProgressTextProps {
  targetDate: string | null;
  achievedDate: string | null;
  isCompleted: boolean;
  quitDate: string;
  currentProgress: number; // Backend progress
  hasRegressed?: boolean; // Add hasRegressed prop
  className?: string;
}

const DynamicProgressText: React.FC<DynamicProgressTextProps> = ({
  targetDate,
  achievedDate,
  isCompleted,
  quitDate,
  currentProgress, // Backend progress
  hasRegressed, // Add hasRegressed prop
  className = ''
}) => {
  const [dynamicProgress, setDynamicProgress] = useState(currentProgress);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    // Sử dụng backend progress trực tiếp
    if (isCompleted && !hasRegressed) {
      setDynamicProgress(100);
      setProgressText('100%');
      return;
    }

    if (!targetDate) {
      setDynamicProgress(0);
      setProgressText('0%');
      return;
    }

    // Sử dụng backend progress trực tiếp
    // Nếu bị regressed, backend đã set currentProgress = 0.0
    setDynamicProgress(currentProgress);
    setProgressText(`${currentProgress.toFixed(1)}%`);
  }, [targetDate, achievedDate, isCompleted, hasRegressed, currentProgress]);

  return (
    <motion.span
      className={`font-medium ${className}`}
      key={progressText}
      initial={{ scale: 1.05, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {progressText}
    </motion.span>
  );
};

export default DynamicProgressText; 