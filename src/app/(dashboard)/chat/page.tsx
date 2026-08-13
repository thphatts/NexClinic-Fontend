'use client';

import React, { useState, useEffect } from 'react';
import { ChatRoom } from '@/types/api';
import { chatService } from '@/services/chatService';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageSquare, Search } from 'lucide-react';

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    chatService
      .getMyRooms()
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredRooms(rooms);
    } else {
      const q = search.toLowerCase();
      setFilteredRooms(
        rooms.filter(
          (r) =>
            r.doctorName.toLowerCase().includes(q) ||
            r.patientName.toLowerCase().includes(q) ||
            r.lastMessage?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, rooms]);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    // Reset unread count locally
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r))
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Left sidebar — room list */}
      <div className="w-80 shrink-0 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-slate-900">Tin nhắn</h1>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              id="chat-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto">
          <ChatRoomList
            rooms={filteredRooms}
            selectedRoomId={selectedRoom?.id}
            onSelect={handleSelectRoom}
            loading={loading}
          />
        </div>
      </div>

      {/* Right — chat window */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow room={selectedRoom} />
      </div>
    </div>
  );
}
