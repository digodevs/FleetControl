import type { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  helper: string;
}

export function DashboardStatCard({ label, value, icon: Icon, tone, helper }: DashboardStatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded border border-slate-800 bg-surface-900 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 ${tone}`} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value.toLocaleString('pt-BR')}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded bg-opacity-15 ${tone}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{helper}</p>
    </article>
  );
}
