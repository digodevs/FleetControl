import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      {label ? <span className="text-sm font-medium text-slate-300">{label}</span> : null}
      <select
        id={selectId}
        className={`h-10 w-full rounded border border-slate-700 bg-surface-950 px-3 text-sm text-white outline-none transition focus:border-accent-400 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

