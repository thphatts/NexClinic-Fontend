'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage, ChatRoom } from '@/types/api';
import { chatService } from '@/services/chatService';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuthStore } from '@/store/useAuthStore';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Wifi, WifiOff, Loader2, MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  room: ChatRoom | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ room }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Khi có tin nhắn mới từ WebSocket
  const handleNewMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      // Tránh duplicate nếu cả REST và WS đều nhận
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    setTimeout(scrollToBottom, 50);
  }, []);

  const { connected, sendMessage: sendViaSocket } = useChatSocket({
    roomId: room?.id ?? null,
    onMessage: handleNewMessage,
  });

  // Tải lịch sử tin nhắn khi đổi phòng
  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }
    setLoading(true);
    chatService
      .getMessages(room.id, 0, 100)
      .then((res) => {
        setMessages(res.items ?? res.content ?? []);
        setTimeout(scrollToBottom, 100);
        // Đánh dấu đã đọc
        chatService.markAsRead(room.id).catch(() => {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [room?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = async (content: string) => {
    if (!room) return;
    if (connected) {
      sendViaSocket(content);
    } else {
      // Fallback REST nếu WS chưa kết nối
      try {
        const msg = await chatService.sendMessage(room.id, content);
        setMessages((prev) => [...prev, msg]);
      } catch (e) {
        console.error('Gửi tin nhắn thất bại:', e);
      }
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-slate-700 font-semibold text-lg mb-1">Chọn một cuộc trò chuyện</h3>
        <p className="text-slate-400 text-sm">Chọn phòng chat từ danh sách bên trái để bắt đầu nhắn tin.</p>
      </div>
    );
  }

  const otherName =
    user?.role === 'ROLE_PATIENT' ? room.doctorName : room.patientName;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold flex items-center justify-center text-sm">
            {otherName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{otherName}</p>
            <p className="text-xs text-slate-400">
              {room.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã đóng'}
            </p>
          </div>
        </div>
        {/* Connection indicator */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${connected ? 'text-emerald-600' : 'text-amber-500'}`}>
          {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{connected ? 'Real-time' : 'Kết nối lại...'}</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/30 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {room.status === 'ACTIVE' && (
        <MessageInput onSend={handleSend} disabled={false} />
      )}
      {room.status === 'CLOSED' && (
        <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 text-center text-xs text-amber-700 font-medium">
          Phòng chat đã đóng — không thể gửi tin nhắn mới
        </div>
      )}
    </div>
  );
};
