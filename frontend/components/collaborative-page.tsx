'use client'
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuthStore } from '../store/authStore';

const CollaborativePage = ({ roomId }: { roomId: string }) => {
  const { ws, initializeWebSocket } = useWebSocket();
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ user: string; text: string }[]>([]);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const socket = initializeWebSocket();
    socket.onopen = () => {
      setIsWsReady(true);
    };
    socket.onclose = () => {
      setIsWsReady(false);
    };
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setChatMessages((prevMessages) => [...prevMessages, { user: data.user, text: data.text }]);
    };

    return () => {
      socket.close();
    };
  }, [initializeWebSocket]);

  const handleSendMessage = async () => {
    const socket = await initializeWebSocket();
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    if (ws && isWsReady) {
      const chatMessage = { type: 'sendMessage', userId: user.id, text: message, roomId };
      ws.send(JSON.stringify(chatMessage));
      setMessage('');
    } else {
      console.error('WebSocket is not ready or not open');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <Header />
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden p-4 sm:p-6 lg:p-8 space-y-4 md:space-y-0 md:space-x-4">
        {/* Editor Section */}
        <div className="w-full md:w-3/4 flex flex-col">
          <div className="bg-gray-100 rounded-lg flex-grow p-4">
            <textarea
              className="w-full h-full p-3 bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              placeholder={`Start collaborating in room ${roomId}...`}
            ></textarea>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full md:w-1/4 flex flex-col">
          <div className="flex-grow bg-gray-100 p-4 rounded-lg mb-4 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-2 text-sm">
                <span className="font-bold">{msg.user}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow p-2 border border-blue-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out text-sm"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativePage;
