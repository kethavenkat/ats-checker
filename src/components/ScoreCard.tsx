import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  max: number;
  feedback?: string;
  icon?: LucideIcon;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  max,
  feedback,
  icon: Icon
}) => {
  const percentage = Math.min(100, Math.round((score / max) * 100));

  let barColor = 'bg-emerald-500';
  let badgeColor = 'text-emerald-700 bg-emerald-50';

  if (percentage < 60) {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-700 bg-rose-50';
  } else if (percentage < 80) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700 bg-amber-50';
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-200 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
          {score} / {max}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {feedback && (
        <p className="text-xs text-slate-500 leading-relaxed">
          {feedback}
        </p>
      )}
    </div>
  );
};
