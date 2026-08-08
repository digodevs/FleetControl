import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded border border-slate-800 bg-surface-900 shadow-sm ${className}`} {...props} />;
}

