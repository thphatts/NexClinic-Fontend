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
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-100 rounded w-3/4" />
              <div className="h-2.5 bg-slate-50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
          <MessageSquareDot className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-600 font-bold">Chưa có cuộc trò chuyện nào</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Bắt đầu trao đổi từ trang Bác sĩ & Lịch khám</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto p-2 space-y-1">
      {rooms.map((room) => {
        const name = getDisplayName(room);
        const isSelected = room.id === selectedRoomId;

        return (
          <button
            key={room.id}
            id={`chat-room-${room.id}`}
            onClick={() => onSelect(room)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
              isSelected
                ? 'bg-purple-50 border border-purple-100 shadow-xs'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitial(name)}
              </div>
              {room.status === 'ACTIVE' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs font-bold truncate ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                  {name}
                </span>
                <span className="text-[9px] text-slate-400 shrink-0 ml-1">
                  {formatTime(room.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate pr-2">
                  {room.lastMessage ?? 'Bắt đầu cuộc trò chuyện...'}
                </span>
                {room.unreadCount > 0 && (
                  <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center px-1">
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
