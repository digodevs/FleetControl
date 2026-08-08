import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return <table className="min-w-full divide-y divide-slate-800 text-left text-sm">{children}</table>;
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`whitespace-nowrap px-4 py-3 font-medium text-slate-400 ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-4 text-slate-200 ${className}`}>{children}</td>;
}

