'use client'
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/webSocketStore';
import axios from 'axios';

const CollaborativePage = ({ roomId }: { roomId: string }) => {
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string }[]>([]);
  const { socketUrl, setSocketUrl } = useSocketStore();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!socketUrl && roomId) {
      const newSocketUrl = `ws://localhost:1234/${roomId}`;
      setSocketUrl(newSocketUrl);
    }
  }, [roomId, socketUrl, setSocketUrl]);

  useEffect(() => {
    // Fetch initial messages from the database
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/messages?roomId=${roomId}`);
        if (Array.isArray(response.data)) {
          setChatMessages(response.data.map((msg: any) => ({ id: msg.id, user: msg.userId, text: msg.message })));
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (socketUrl ) {
      const newSocket = new WebSocket(socketUrl);
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log('WebSocket connection established');
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'receiveMessage') {
          setChatMessages((prevMessages) => {
            // Check if the message already exists
            if (!prevMessages.some(msg => msg.id === data.message.id) && data.message.roomId === roomId) {
              return [...prevMessages, { id: data.message.id, user: data.message.userId, text: data.message.text }];
            }
              return prevMessages;
            });
          }
        };
      

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
        newSocket.close();
      };

      // return () => {
      //   newSocket.close();
      // };
    }
  }, [socketUrl]);

  const handleSendMessage = () => {
    if (socket && message.trim() !== '') {
      const chatMessage = { type: 'sendMessage', roomId, userId: user?.id, text: message };
      socket.send(JSON.stringify(chatMessage));
      //setChatMessages((prevMessages) => [...prevMessages, { id: `${Date.now()}`, user: user?.id?.toString() || 'Anonymous', text: message }]);
      setMessage('');
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
