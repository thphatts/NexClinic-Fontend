'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface Feedback {
  notify: (message: string) => void;
  confirmAction: (message: string) => Promise<boolean>;
}

const FeedbackContext = createContext<Feedback | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState('');
  const [question, setQuestion] = useState('');
  const resolver = useRef<((answer: boolean) => void) | null>(null);
  const notify = useCallback((message: string) => setNotice(message), []);
  const confirmAction = useCallback((message: string) => new Promise<boolean>((resolve) => {
    resolver.current?.(false);
    resolver.current = resolve;
    setQuestion(message);
  }), []);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 8000);
    return () => clearTimeout(timeout);
  }, [notice]);
  useEffect(() => () => { resolver.current?.(false); }, []);
  const answer = (value: boolean) => { resolver.current?.(value); resolver.current = null; setQuestion(''); };
  return <FeedbackContext.Provider value={{ notify, confirmAction }}>
    {children}
    {notice && <div role="status" className="page-enter fixed bottom-5 left-1/2 z-50 flex w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 items-start justify-between gap-5 rounded-2xl border border-[#dce5d8] bg-white p-5 shadow-xl"><p className="text-sm leading-6 text-slate-700">{notice}</p><button onClick={() => setNotice('')} className="text-xs text-slate-500">Đóng</button></div>}
    <Modal isOpen={!!question} onClose={() => answer(false)} title="Xác nhận thao tác" maxWidth="sm"><p className="text-sm leading-7 text-slate-600">{question}</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => answer(false)} className="btn-secondary">Quay lại</button><button onClick={() => answer(true)} className="btn-primary">Xác nhận</button></div></Modal>
  </FeedbackContext.Provider>;
}

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error('FeedbackProvider is required');
  return value;
}
