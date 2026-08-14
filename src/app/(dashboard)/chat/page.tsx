'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
        if (data.length > 0 && !selectedRoom) {
          setSelectedRoom(data[0]);
        }
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
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r))
    );
  };

  return (
    <AppLayout title="Tin Nhắn Trực Tuyến">
      <div className="flex h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Left sidebar — room list */}
        <div className="w-80 shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/40">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h1 className="text-sm font-black text-slate-900">Hội Thoại</h1>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="chat-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm hội thoại..."
                className="w-full pl-8 pr-3 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
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
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <ChatWindow room={selectedRoom} />
        </div>
      </div>
    </AppLayout>
  );
}
