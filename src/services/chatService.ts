import { apiClient, getResponseData } from '@/lib/axios';
import { ChatRoom, ChatMessage, CreateChatRoomRequest, PagedResponse } from '@/types/api';

const BASE = '/chat';

export const chatService = {
  /** Lấy danh sách phòng chat của user hiện tại */
  getMyRooms: async (): Promise<ChatRoom[]> => {
    const res = await apiClient.get(`${BASE}/rooms`);
    return getResponseData<ChatRoom[]>(res);
  },

  /** Tạo hoặc lấy phòng chat (idempotent) */
  getOrCreateRoom: async (request: CreateChatRoomRequest): Promise<ChatRoom> => {
    const res = await apiClient.post(`${BASE}/rooms`, request);
    return getResponseData<ChatRoom>(res);
  },

  /** Lấy lịch sử tin nhắn (phân trang) */
  getMessages: async (
    roomId: number,
    page = 0,
    size = 50
  ): Promise<PagedResponse<ChatMessage>> => {
    const res = await apiClient.get(`${BASE}/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return getResponseData<PagedResponse<ChatMessage>>(res);
  },

  /** Gửi tin nhắn qua REST (fallback) */
  sendMessage: async (roomId: number, content: string): Promise<ChatMessage> => {
    const res = await apiClient.post(`${BASE}/rooms/${roomId}/messages`, { roomId, content });
    return getResponseData<ChatMessage>(res);
  },

  /** Đánh dấu đã đọc */
  markAsRead: async (roomId: number): Promise<void> => {
    await apiClient.post(`${BASE}/rooms/${roomId}/read`);
  },
};
