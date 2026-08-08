import { Activity, AlertTriangle, Ban, CalendarDays, Car, CheckCircle2, CircleDot, TrendingUp, Wrench } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardChartPanel } from '../components/DashboardChartPanel';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { useDashboard } from '../hooks/useDashboard';
import type { StatusCount, TypeCount } from '../types/dashboard';

const typeLabels: Record<string, string> = {
  CAR: 'Carros',
  MOTORCYCLE: 'Motos',
  VAN: 'Vans',
  TRUCK: 'Caminhoes',
  BUS: 'Onibus',
  OTHER: 'Outros',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponivel',
  IN_USE: 'Em uso',
  MAINTENANCE: 'Em manutencao',
  INACTIVE: 'Inativo',
};

const chartColors = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#14b8a6'];

const statusColors: Record<string, string> = {
  AVAILABLE: '#22c55e',
  IN_USE: '#38bdf8',
  MAINTENANCE: '#f59e0b',
  INACTIVE: '#ef4444',
};

const tooltipStyle = {
  background: '#111827',
  border: '1px solid #334155',
  borderRadius: 4,
  color: '#e5e7eb',
};

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <section className="rounded border border-red-900/70 bg-red-950/30 p-5 text-red-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold">Dashboard indisponivel</h2>
            <p className="mt-1 text-sm text-red-200">Nao foi possivel carregar os indicadores da frota pela API.</p>
          </div>
        </div>
      </section>
    );
  }

  const vehiclesByType = data.vehiclesByType.map((item: TypeCount) => ({
    name: typeLabels[item.type] ?? item.type,
    value: item.count,
  }));
  const vehiclesByStatus = data.vehiclesByStatus.map((item: StatusCount) => ({
    name: statusLabels[item.status] ?? item.status,
    count: item.count,
  }));
  const registrationsByMonth = data.vehicleRegistrationsByMonth.map((item) => ({
    month: item.month,
    count: item.count,
  }));
  const hasVehicles = data.totalVehicles > 0;
  const activeVehicles = data.totalVehicles - data.inactiveVehicles;
  const availabilityRate = data.totalVehicles > 0 ? Math.round((data.availableVehicles / data.totalVehicles) * 100) : 0;
  const monthDelta = data.vehiclesCreatedThisMonth - data.vehiclesCreatedLastMonth;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded border border-slate-800 bg-surface-900 shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded border border-sky-900/70 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-200">
              <Activity size={14} aria-hidden="true" />
              Operacao em tempo real
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Visao executiva da frota</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Acompanhe disponibilidade, utilizacao e crescimento da frota com dados consolidados diretamente do banco de dados.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <ExecutiveMetric label="Frota ativa" value={activeVehicles} helper="Veiculos fora do status inativo" icon={Car} />
            <ExecutiveMetric label="Disponibilidade" value={`${availabilityRate}%`} helper="Percentual pronto para uso" icon={CheckCircle2} />
            <ExecutiveMetric
              label="Mes atual"
              value={monthDelta >= 0 ? `+${monthDelta}` : String(monthDelta)}
              helper="Comparado ao mes anterior"
              icon={TrendingUp}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard label="Total de veiculos" value={data.totalVehicles} icon={Car} tone="bg-sky-500/15 text-sky-300" helper="Base total cadastrada" />
        <DashboardStatCard label="Disponiveis" value={data.availableVehicles} icon={CheckCircle2} tone="bg-emerald-500/15 text-emerald-300" helper="Prontos para operacao" />
        <DashboardStatCard label="Em uso" value={data.inUseVehicles} icon={CircleDot} tone="bg-violet-500/15 text-violet-300" helper="Atualmente alocados" />
        <DashboardStatCard label="Em manutencao" value={data.maintenanceVehicles} icon={Wrench} tone="bg-amber-500/15 text-amber-300" helper="Indisponiveis temporarios" />
        <DashboardStatCard label="Inativos" value={data.inactiveVehicles} icon={Ban} tone="bg-red-500/15 text-red-300" helper="Fora da operacao" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardChartPanel title="Veiculos por tipo" subtitle="Composicao atual da frota" footer={<LegendList items={vehiclesByType} colors={chartColors} valueKey="value" />}>
          {hasVehicles ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehiclesByType} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                  {vehiclesByType.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState />
          )}
        </DashboardChartPanel>

        <DashboardChartPanel title="Veiculos por status" subtitle="Disponibilidade operacional" footer={<StatusLegend items={data.vehiclesByStatus} />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehiclesByStatus}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.vehiclesByStatus.map((item) => (
                  <Cell key={item.status} fill={statusColors[item.status] ?? '#38bdf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardChartPanel>

        <DashboardChartPanel
          title="Cadastros por mes"
          subtitle="Tendencia de crescimento da base"
          className="xl:col-span-2"
          footer={
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <MonthSummary icon={CalendarDays} label="Este mes" value={data.vehiclesCreatedThisMonth} />
              <MonthSummary icon={TrendingUp} label="Mes anterior" value={data.vehiclesCreatedLastMonth} />
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationsByMonth}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#0b0f14', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardChartPanel>
      </div>
    </section>
  );
}

function ExecutiveMetric({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  helper: string;
  icon: typeof Car;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-slate-800 bg-surface-950 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-sky-500/15 text-sky-300">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-white">{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</p>
        <p className="truncate text-xs text-slate-400">{helper}</p>
      </div>
    </div>
  );
}

function LegendList({ items, colors, valueKey }: { items: Array<{ name: string; value: number }>; colors: string[]; valueKey: 'value' }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="truncate">{item.name}</span>
          </span>
          <span className="font-medium text-white">{item[valueKey].toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  );
}

function StatusLegend({ items }: { items: StatusCount[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.status} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: statusColors[item.status] ?? '#38bdf8' }} />
            <span className="truncate">{statusLabels[item.status] ?? item.status}</span>
          </span>
          <span className="font-medium text-white">{item.count.toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  );
}

function MonthSummary({ label, value, icon: Icon }: { label: string; value: number; icon: typeof CalendarDays }) {
  return (
    <div className="flex items-center gap-3 rounded border border-slate-800 bg-surface-950 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-emerald-500/15 text-emerald-300">
        <Icon size={17} aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-base font-semibold text-white">{value.toLocaleString('pt-BR')} veiculos</p>
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-full items-center justify-center rounded border border-dashed border-slate-700 text-sm text-slate-400">
      Nenhum veiculo registrado ainda.
    </div>
  );
}
