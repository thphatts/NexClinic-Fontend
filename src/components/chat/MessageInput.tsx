"use client";

import React, { useState, useRef } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled,
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ngăn chặn gửi nhầm khi bộ gõ tiếng Việt (Telex/VNI) đang ghép dấu
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto resize
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="flex items-end gap-2 p-3.5 border-t border-slate-100 bg-white">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn tư vấn... (Enter để gửi)"
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition disabled:opacity-50 max-h-[120px] overflow-y-auto"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        id="chat-send-btn"
        className="p-2.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 active:scale-95 disabled:opacity-40 transition-all shadow-md shadow-purple-600/20 shrink-0"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
