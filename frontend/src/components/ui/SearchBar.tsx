import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, placeholder = 'Search', onChange }: SearchBarProps) {
  return (
    <label className="relative block min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded border border-slate-700 bg-surface-950 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400"
      />
    </label>
  );
}

