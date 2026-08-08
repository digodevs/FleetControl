import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'slate' | 'green' | 'blue' | 'amber' | 'red' | 'violet';
}

const tones = {
  slate: 'border-slate-700 bg-slate-800 text-slate-200',
  green: 'border-emerald-800 bg-emerald-950 text-emerald-200',
  blue: 'border-sky-800 bg-sky-950 text-sky-200',
  amber: 'border-amber-800 bg-amber-950 text-amber-200',
  red: 'border-red-800 bg-red-950 text-red-200',
  violet: 'border-violet-800 bg-violet-950 text-violet-200',
};

export function Badge({ tone = 'slate', className = '', ...props }: BadgeProps) {
  return <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`} {...props} />;
}

