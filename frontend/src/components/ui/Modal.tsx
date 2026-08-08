import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, description, children, footer, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded border border-slate-800 bg-surface-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
          </div>
          <Button variant="ghost" className="h-9 w-9 p-0" onClick={onClose} aria-label="Fechar modal" icon={<X size={18} />} />
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-slate-800 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
