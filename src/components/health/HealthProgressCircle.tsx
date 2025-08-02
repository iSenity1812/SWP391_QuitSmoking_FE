import React from 'react';
import type { HealthProgressCircleProps } from '../../types/health';

const HealthProgressCircle: React.FC<HealthProgressCircleProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  label,
  showPercentage = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showPercentage && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(progress)}%
              </div>
              {label && (
                <div className="text-xs text-gray-600 mt-1">
                  {label}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthProgressCircle; 