import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-800 px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <span>{totalElements} registros</span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 0} onClick={() => onPageChange(page - 1)} icon={<ChevronLeft size={16} />}>
          Anterior
        </Button>
        <span className="px-2 text-slate-300">
          {page + 1} / {safeTotalPages}
        </span>
        <Button variant="secondary" disabled={page + 1 >= safeTotalPages} onClick={() => onPageChange(page + 1)} icon={<ChevronRight size={16} />}>
          Proxima
        </Button>
      </div>
    </div>
  );
}
