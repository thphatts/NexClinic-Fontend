'use client';

import React from 'react';
import { ChatMessage } from '@/types/api';
import { CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '';

  const roleLabel: Record<string, string> = {
    ROLE_DOCTOR: 'Bác sĩ',
    ROLE_PATIENT: 'Bệnh nhân',
    ROLE_ADMIN: 'Admin',
    ROLE_STAFF: 'Nhân viên',
  };

  return (
    <div className={`flex items-end gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
          isOwn
            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
            : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
        }`}
      >
        {(message.senderName || 'U').charAt(0).toUpperCase()}
      </div>

      <div className={`max-w-[72%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        {!isOwn && (
          <span className="text-[10px] text-slate-400 font-semibold mb-1 px-1">
            {message.senderName} · {roleLabel[message.senderRole] ?? message.senderRole}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-3xl text-xs leading-relaxed shadow-xs ${
            isOwn
              ? 'bg-purple-600 text-white rounded-br-sm'
              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-slate-400">{time}</span>
          {isOwn && (
            <CheckCheck
              className={`w-3 h-3 ${message.isRead ? 'text-purple-300' : 'text-slate-300'}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
