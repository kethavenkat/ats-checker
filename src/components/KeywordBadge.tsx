import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface KeywordBadgeProps {
  keyword: string;
  type: 'matched' | 'missing' | 'partial';
  explanation?: string;
}

export const KeywordBadge: React.FC<KeywordBadgeProps> = ({ keyword, type, explanation }) => {
  if (type === 'matched') {
    return (
      <span
        title="Keyword found in your resume"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs hover:bg-emerald-100 transition-colors"
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
        {keyword}
      </span>
    );
  }

  if (type === 'missing') {
    return (
      <span
        title={explanation || 'Keyword missing from resume. Add only if you genuinely have this experience.'}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 shadow-2xs hover:bg-rose-100 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
        {keyword}
      </span>
    );
  }

  return (
    <span
      title={explanation || 'Partial or related match detected'}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs hover:bg-amber-100 transition-colors"
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
      {keyword}
    </span>
  );
};
