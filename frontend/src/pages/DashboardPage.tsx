import { AlertTriangle, Ban, Car, CheckCircle2, CircleDot, Wrench } from 'lucide-react';
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
  CAR: 'Cars',
  MOTORCYCLE: 'Motorcycles',
  VAN: 'Vans',
  TRUCK: 'Trucks',
  BUS: 'Buses',
  OTHER: 'Other',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Available',
  IN_USE: 'In use',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive',
};

const chartColors = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#14b8a6'];

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
            <h2 className="text-base font-semibold">Dashboard unavailable</h2>
            <p className="mt-1 text-sm text-red-200">Unable to load fleet indicators from the API.</p>
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

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard label="Total vehicles" value={data.totalVehicles} icon={Car} tone="bg-sky-500/15 text-sky-300" />
        <DashboardStatCard label="Available" value={data.availableVehicles} icon={CheckCircle2} tone="bg-emerald-500/15 text-emerald-300" />
        <DashboardStatCard label="In use" value={data.inUseVehicles} icon={CircleDot} tone="bg-violet-500/15 text-violet-300" />
        <DashboardStatCard label="Maintenance" value={data.maintenanceVehicles} icon={Wrench} tone="bg-amber-500/15 text-amber-300" />
        <DashboardStatCard label="Inactive" value={data.inactiveVehicles} icon={Ban} tone="bg-red-500/15 text-red-300" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardChartPanel title="Vehicles by type" subtitle="Current fleet composition">
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

        <DashboardChartPanel title="Vehicles by status" subtitle="Operational availability">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehiclesByStatus}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardChartPanel>

        <DashboardChartPanel title="Registrations by month" subtitle="Vehicle creation trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationsByMonth}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardChartPanel>
      </div>
    </section>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-full items-center justify-center rounded border border-dashed border-slate-700 text-sm text-slate-400">
      No vehicle records yet.
    </div>
  );
}
