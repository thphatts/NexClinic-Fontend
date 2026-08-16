'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatRoom, Doctor } from '@/types/api';
import { chatService } from '@/services/chatService';
import { doctorService } from '@/services/doctorService';
import { patientService } from '@/services/patientService';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageSquare, Search, Plus, X, UserCheck, Stethoscope, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal tạo chat mới
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
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
  };

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

  const handleOpenNewChat = async () => {
    setIsNewChatModalOpen(true);
    setCreateError(null);
    setLoadingDoctors(true);
    try {
      const res = await doctorService.getAllDoctors({ page: 1, size: 50 });
      setDoctors(res.items || []);
    } catch (e) {
      console.error(e);
      setCreateError('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleStartChatWithDoctor = async (doctor: Doctor) => {
    setCreatingRoom(true);
    setCreateError(null);
    try {
      let patientId: number | null = null;
      try {
        const patientProfile = await patientService.getMyPatientProfile();
        patientId = patientProfile.id;
      } catch {
        // Fallback: nếu admin/staff hoặc chưa có patient record, lấy patient đầu tiên
        const allPatients = await patientService.getAllPatients({ page: 1, size: 1 });
        if (allPatients.items && allPatients.items.length > 0) {
          patientId = allPatients.items[0].id;
        }
      }

      if (!patientId) {
        throw new Error('Chưa tìm thấy hồ sơ bệnh nhân để khởi tạo hội thoại');
      }

      const room = await chatService.getOrCreateRoom({
        doctorId: doctor.id,
        patientId: patientId,
      });

      // Cập nhật danh sách phòng
      setRooms((prev) => {
        const exists = prev.some((r) => r.id === room.id);
        return exists ? prev : [room, ...prev];
      });
      setSelectedRoom(room);
      setIsNewChatModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setCreateError(err.response?.data?.message || err.message || 'Không thể tạo cuộc trò chuyện');
    } finally {
      setCreatingRoom(false);
    }
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h1 className="text-sm font-black text-slate-900">Hội Thoại</h1>
              </div>

              {/* Button Bắt đầu trò chuyện mới */}
              <button
                id="btn-new-chat"
                onClick={handleOpenNewChat}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                title="Bắt đầu cuộc trò chuyện mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nhắn Tin</span>
              </button>
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

      {/* Modal Chọn Bác Sĩ Để Nhắn Tin Mới */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Bắt Đầu Hội Thoại Mới</h3>
                  <p className="text-xs text-slate-400">Chọn bác sĩ chuyên khoa để nhận tư vấn trực tuyến</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                {createError}
              </div>
            )}

            {/* List doctors */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {loadingDoctors ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="text-xs">Đang tải danh sách bác sĩ...</span>
                </div>
              ) : doctors.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Không tìm thấy bác sĩ nào.
                </div>
              ) : (
                doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {doc.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{doc.fullName}</p>
                        <p className="text-[11px] text-purple-600 font-semibold">{doc.specialization || 'Bác sĩ chuyên khoa'}</p>
                        <p className="text-[10px] text-slate-400">{doc.degree} • {doc.experienceYears} năm kinh nghiệm</p>
                      </div>
                    </div>

                    <button
                      disabled={creatingRoom}
                      onClick={() => handleStartChatWithDoctor(doc)}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {creatingRoom ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5" />
                      )}
                      <span>Nhắn Tin</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

