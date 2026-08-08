import type { ReactNode } from 'react';

interface DashboardChartPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function DashboardChartPanel({ title, subtitle, children }: DashboardChartPanelProps) {
  return (
    <section className="rounded border border-slate-800 bg-surface-900 p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="h-72 min-h-72">{children}</div>
    </section>
  );
}

