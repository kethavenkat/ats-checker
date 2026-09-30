import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const STEPS = [
  'Reading resume document & parsing layout',
  'Extracting contact information & work history',
  'Evaluating ATS format compatibility & structure',
  'Analyzing keyword density & industry relevance',
  'Generating truthful, high-impact recommendations'
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'AI is analyzing your resume...',
  subMessage = 'This typically takes 4–8 seconds to analyze formatting, keywords, and ATS algorithms.'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
        {message}
      </h3>
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        {subMessage}
      </p>

      {/* Step by step checklist */}
      <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                isDone
                  ? 'text-slate-800 font-medium'
                  : isCurrent
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
