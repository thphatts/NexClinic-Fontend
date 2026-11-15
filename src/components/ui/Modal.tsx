'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'md' }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [isOpen]);
  if (!isOpen) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
  return createPortal(<dialog ref={dialog} aria-labelledby={titleId} aria-describedby={subtitle ? descriptionId : undefined} onCancel={(event) => { event.preventDefault(); onClose(); }} className={`clinic-dialog m-auto w-[calc(100%_-_2rem)] rounded-3xl border border-[#e1e8dd] bg-white p-0 text-slate-900 shadow-2xl ${widths[maxWidth]}`}>
    <div className="flex max-h-[88dvh] flex-col">
      <div className="flex shrink-0 items-start justify-between gap-5 border-b border-slate-100 px-6 py-6"><div><h2 id={titleId} className="text-xl font-medium tracking-tight">{title}</h2>{subtitle && <p id={descriptionId} className="mt-2 text-xs leading-6 text-slate-500">{subtitle}</p>}</div><button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-50">Đóng</button></div>
      <div className="overflow-y-auto p-6">{children}</div>
    </div>
  </dialog>, document.body);
}
