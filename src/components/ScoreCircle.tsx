import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = 'ATS SCORE',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let colorClass = 'text-emerald-500 stroke-emerald-500';
  let badgeText = 'Competitive';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (score < 60) {
    colorClass = 'text-rose-500 stroke-rose-500';
    badgeText = 'Needs Improvement';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score < 80) {
    colorClass = 'text-amber-500 stroke-amber-500';
    badgeText = 'Moderate Match';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    badgeText = 'Strong ATS Match';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {label}
          </span>
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{score}</span>
            <span className="text-lg font-medium text-slate-400">/100</span>
          </div>
          {sublabel && (
            <span className="text-xs text-slate-500 font-medium mt-0.5">{sublabel}</span>
          )}
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
        {badgeText}
      </div>
    </div>
  );
};
