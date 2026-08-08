import type { ReactNode } from 'react';

interface DashboardChartPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DashboardChartPanel({ title, subtitle, children, footer, className = '' }: DashboardChartPanelProps) {
  return (
    <section className={`rounded border border-slate-800 bg-surface-900 p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="h-72 min-h-72">{children}</div>
      {footer ? <div className="mt-4 border-t border-slate-800 pt-4">{footer}</div> : null}
    </section>
  );
}
