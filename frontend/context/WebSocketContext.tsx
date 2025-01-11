'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';

interface WebSocketContextProps {
  ws: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextProps>({ ws: null });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const router = useRouter()

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:1234'); // Replace YOUR_PORT with the actual port
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'createRoomSuccess') {
       
        toast.success(`Room created: ${data.roomId}`);
        router.push(`/${data.roomId}`)
      } else if (data.type === 'createRoomError') {
        toast.error(data.message);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket error occurred');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // return () => {
    //   socket.close();
    // };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);