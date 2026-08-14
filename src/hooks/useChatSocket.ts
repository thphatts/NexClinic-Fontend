'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '@/types/api';

const getWsBaseUrl = (): string => {
  if (typeof window === 'undefined') return 'http://localhost:8080';
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    // Xoá /api/v1 ở cuối nếu có
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  }
  if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return 'https://ai-powered-clinic-portal.onrender.com';
  }
  return 'http://localhost:8080';
};

interface UseChatSocketOptions {
  roomId: number | null;
  onMessage?: (msg: ChatMessage) => void;
}

export const useChatSocket = ({ roomId, onMessage }: UseChatSocketOptions) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  // Lưu callback vào ref để tránh useEffect re-run mỗi khi onMessage thay đổi reference
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const sendMessage = useCallback((content: string) => {
    if (!clientRef.current?.connected || !roomId) return;
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ roomId, content }),
    });
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    const wsUrl = getWsBaseUrl();

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsUrl}/ws`) as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe vào topic của phòng chat này
        client.subscribe(`/topic/chat.${roomId}`, (frame: IMessage) => {
          try {
            const msg: ChatMessage = JSON.parse(frame.body);
            // Dùng ref thay vì closure để luôn gọi callback mới nhất
            onMessageRef.current?.(msg);
          } catch {
            console.error('[WS] Không parse được message:', frame.body);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [roomId]); // ← Chỉ reconnect khi đổi roomId, không reconnect khi onMessage đổi reference

  return { connected, sendMessage };
};

