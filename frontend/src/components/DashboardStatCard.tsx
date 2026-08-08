import type { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}

export function DashboardStatCard({ label, value, icon: Icon, tone }: DashboardStatCardProps) {
  return (
    <article className="rounded border border-slate-800 bg-surface-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded ${tone}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

