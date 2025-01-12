'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

interface WebSocketContextProps {
  ws: WebSocket | null;
  initializeWebSocket: () => WebSocket;
  closeWebSocket: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  ws: null,
  initializeWebSocket: () => new WebSocket(''),
  closeWebSocket: () => {},
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(0);
  const router = useRouter();
  const isLogin = useAuthStore((state) => state.isLogin);

  const initializeWebSocket = useCallback(() => {
    let socket = ws;
    if (!socket) {
      const newSocketUrl = 'ws://localhost:1234';
      socket = new WebSocket(newSocketUrl);

      setReadyState(socket.readyState);
      socket.onopen = () => {
        console.log('WebSocket connected from webSocketContext', socket);
      };
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'createRoomSuccess') {
          toast.success(`Room created: ${data.roomId}`);
          router.push(`/${data.roomId}`);
        } else if (data.type === 'createRoomError') {
          toast.error(data.message);
        }
      };
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('WebSocket error occurred');
      };
      socket.onclose = () => {
        console.log('WebSocket closed');
        setWs(null);
        localStorage.removeItem('webSocketUrl');
      };
    }
    setWs(socket);
    console.log('WebSocketxt before setting:', ws);
    console.log('WebSocketxt after setting:', socket);
    return socket;
  }, [ws, router]);

  const closeWebSocket = () => {
    if (ws) {
      ws.close();
      setWs(null);
      localStorage.removeItem('webSocketUrl');
    }
  };

  useEffect(() => {
    if (isLogin) {
      initializeWebSocket();
    } else {
      closeWebSocket();
    }
  }, [isLogin, initializeWebSocket]);

  return (
    <WebSocketContext.Provider value={{ ws, initializeWebSocket, closeWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
