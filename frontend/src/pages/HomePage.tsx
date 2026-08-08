import { ArrowRight, BarChart3, Car, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const previewStats = [
  { label: 'Total', value: '128', tone: 'bg-sky-400' },
  { label: 'Disponíveis', value: '86', tone: 'bg-emerald-400' },
  { label: 'Em uso', value: '31', tone: 'bg-violet-400' },
  { label: 'Manutenção', value: '7', tone: 'bg-amber-400' },
];

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-surface-950 text-slate-100">
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_25%_80%,rgba(34,197,94,0.12),transparent_30%)]" />
        <div className="absolute inset-y-20 right-[-220px] hidden w-[860px] rotate-[-3deg] rounded border border-slate-800 bg-surface-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur lg:block">
          <DashboardPreview />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
          <header className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded bg-accent-500 text-surface-950">
                <Car size={23} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">FleetControl</p>
                <p className="text-xs text-slate-400">Gestão profissional de frotas</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-accent-500 px-4 py-2 text-sm font-medium text-surface-950 transition hover:bg-accent-400"
                >
                  Acessar painel
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link className="hidden rounded px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-surface-900 hover:text-white sm:inline-flex" to="/login">
                    Entrar
                  </Link>
                  <Link
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-accent-500 px-4 py-2 text-sm font-medium text-surface-950 transition hover:bg-accent-400"
                    to="/register"
                  >
                    Criar conta
                    <UserPlus size={16} aria-hidden="true" />
                  </Link>
                </>
              )}
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,0.58fr)]">
            <section className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded border border-sky-900/70 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-200">
                <ShieldCheck size={14} aria-hidden="true" />
                Plataforma administrativa para operação de frota
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">FleetControl</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Controle veículos, acompanhe indicadores reais e mantenha uma base profissional para gestão operacional.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login'}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-accent-500 px-5 py-3 text-sm font-semibold text-surface-950 transition hover:bg-accent-400"
                >
                  {isAuthenticated ? 'Ir para o painel' : 'Entrar no sistema'}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                {!isAuthenticated ? (
                  <Link
                    to="/register"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded border border-slate-700 bg-surface-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-surface-800"
                  >
                    Criar primeira conta
                  </Link>
                ) : null}
              </div>
            </section>

            <section className="rounded border border-slate-800 bg-surface-900/90 p-4 shadow-2xl shadow-black/30 backdrop-blur lg:hidden">
              <DashboardPreview />
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm font-semibold text-white">Dashboard executivo</p>
          <p className="text-xs text-slate-500">Indicadores consolidados</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded bg-sky-500/15 text-sky-300">
          <BarChart3 size={20} aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {previewStats.map((item) => (
          <div key={item.label} className="rounded border border-slate-800 bg-surface-950 p-4">
            <div className={`mb-4 h-1 w-10 rounded ${item.tone}`} />
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded border border-slate-800 bg-surface-950 p-4">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[18px] border-sky-400 border-r-emerald-400 border-t-amber-400">
            <CheckCircle2 className="text-emerald-300" size={26} aria-hidden="true" />
          </div>
        </div>
        <div className="rounded border border-slate-800 bg-surface-950 p-4">
          <div className="flex h-36 items-end gap-3">
            {[58, 86, 42, 72, 96, 64].map((height, index) => (
              <div key={index} className="flex flex-1 items-end rounded bg-slate-800">
                <div className="w-full rounded bg-accent-500" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
