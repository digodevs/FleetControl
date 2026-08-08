import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-slate-300">{label}</span> : null}
      <input
        id={inputId}
        className={`h-10 w-full rounded border border-slate-700 bg-surface-950 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

