import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel = 'إنجاز المسار',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 origin-center"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-theme-border"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="text-theme-accent transition-all duration-700 ease-out drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <span className="font-cairo font-bold text-2xl text-theme-text tracking-tight">
          {label !== undefined ? label : `${progress}%`}
        </span>
        {sublabel && (
          <span className="text-[11px] font-medium text-theme-muted mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
