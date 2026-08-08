export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-slate-800 bg-surface-900 p-6">
        <div className="h-5 w-52 animate-pulse rounded bg-slate-800" />
        <div className="mt-4 h-8 w-full max-w-xl animate-pulse rounded bg-slate-800" />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded border border-slate-800 bg-surface-950" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded border border-slate-800 bg-surface-900" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`h-96 animate-pulse rounded border border-slate-800 bg-surface-900 ${index === 2 ? 'xl:col-span-2' : ''}`} />
        ))}
      </div>
    </div>
  );
}
