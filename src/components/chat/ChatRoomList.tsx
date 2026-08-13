'use client';

import React from 'react';
import { ChatRoom } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import { MessageSquareDot } from 'lucide-react';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId?: number | null;
  onSelect: (room: ChatRoom) => void;
  loading?: boolean;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  selectedRoomId,
  onSelect,
  loading,
}) => {
  const { user } = useAuthStore();

  const getDisplayName = (room: ChatRoom) =>
    user?.role === 'ROLE_PATIENT' ? room.doctorName : room.patientName;

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() ?? '?';

  const formatTime = (ts?: string) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-4">
        <MessageSquareDot className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500 font-medium">Chưa có cuộc trò chuyện nào</p>
        <p className="text-xs text-slate-400 mt-1">Bắt đầu chat từ trang thông tin bác sĩ</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {rooms.map((room) => {
        const name = getDisplayName(room);
        const isSelected = room.id === selectedRoomId;

        return (
          <button
            key={room.id}
            id={`chat-room-${room.id}`}
            onClick={() => onSelect(room)}
            className={`flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-blue-50/60 border-b border-slate-100 last:border-0 ${
              isSelected ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {getInitial(name)}
              </div>
              {room.status === 'ACTIVE' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                  {name}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                  {formatTime(room.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 truncate pr-2">
                  {room.lastMessage ?? 'Bắt đầu cuộc trò chuyện...'}
                </span>
                {room.unreadCount > 0 && (
                  <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
