'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { aiService } from '@/services/aiService';
import { Modal } from '@/components/ui/Modal';

export function NexAiFloatingWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) end.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' }); }, [messages, open]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || pending) return;
    const text = input.trim();
    setPending(true); setError(''); setInput('');
    setMessages((previous) => [...previous, { sender: 'user', text }]);
    try {
      const response = await aiService.chat(text, sessionId);
      setSessionId(response.sessionId);
      setMessages((previous) => [...previous, { sender: 'ai', text: response.reply || response.response || 'Chưa nhận được phản hồi. Vui lòng thử lại.' }]);
    } catch { setError('NexAI chưa thể kết nối. Bạn có thể gửi lại câu hỏi.'); setInput(text); }
    finally { setPending(false); }
  };
  if (pathname === '/ai' || pathname === '/chat') return null;
  return <div className="assistant-widget fixed bottom-5 right-5 z-20">
    <button onClick={() => setOpen(true)} className="btn-primary !rounded-full !px-5 shadow-lg"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b8d3a1]" />Hỏi NexAI</button>
    <Modal isOpen={open} onClose={() => setOpen(false)} title="Trò chuyện với NexAI" subtitle="Thông tin tham khảo để chuẩn bị tốt hơn cho buổi khám." maxWidth="lg">
      <div className="max-h-[45dvh] min-h-40 space-y-4 overflow-y-auto pb-4" role="log" aria-label="Cuộc trò chuyện với NexAI" aria-live="polite">
        {!messages.length && <div className="rounded-2xl bg-[#f3f6ee] p-6"><p className="text-lg font-medium">Mình có thể hỗ trợ gì cho bạn?</p><p className="mt-3 text-sm leading-7 text-slate-500">Bạn có thể hỏi về lịch khám, hồ sơ hoặc cách chuẩn bị thông tin trước khi gặp bác sĩ.</p></div>}
        {messages.map((message, index) => <div key={index} className={`page-enter max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.sender === 'user' ? 'ml-auto bg-[#285b47] text-white' : 'bg-[#f3f6ee] text-slate-700'}`}><ReactMarkdown>{message.text}</ReactMarkdown></div>)}
        {pending && <p role="status" className="animate-pulse text-xs text-slate-500">NexAI đang trả lời…</p>}
        <div ref={end} />
      </div>
      {error && <p role="alert" className="mb-3 text-xs text-rose-700">{error}</p>}
      <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 pt-4"><input aria-label="Câu hỏi cho NexAI" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.nativeEvent.isComposing && event.key === 'Enter') event.preventDefault(); }} className="field-input min-w-0" placeholder="Viết câu hỏi của bạn…" /><button disabled={pending || !input.trim()} className="btn-primary">Gửi</button></form>
    </Modal>
  </div>;
}
