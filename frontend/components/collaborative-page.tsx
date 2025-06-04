'use client'
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/webSocketStore';
import axios from 'axios';
import { EditorComponent } from './editor';
import { Room } from './room';
import { Toolbar } from './toolbar';
import Footer from './Footer';

const CollaborativePage = ({ roomId }: { roomId: string }) => {
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; firstName?: string; text: string }[]>([]);
  const { socketUrl, setSocketUrl } = useSocketStore();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socketUrl && roomId) {
      const newSocketUrl = `wss://collabsphere-backend.ridhikajoshi.me/${roomId}`;
      setSocketUrl(newSocketUrl);
    }
  }, [roomId, socketUrl, setSocketUrl]);

  useEffect(() => {
    // Fetch initial messages from the database
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/messages?roomId=${roomId}`);
        if (Array.isArray(response.data)) {
          setChatMessages(response.data.map((msg: { id: string; userId: string; message: string }) => ({ id: msg.id, user: msg.userId, text: msg.message })));
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
    if (socketUrl) {
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
  }, [socketUrl, roomId]);

  const handleSendMessage = () => {
    if (socket && message.trim() !== '') {
      const chatMessage = { type: 'sendMessage', roomId, userId: user?.id, text: message };
      socket.send(JSON.stringify(chatMessage));
      //setChatMessages((prevMessages) => [...prevMessages, { id: `${Date.now()}`, user: user?.id?.toString() || 'Anonymous', text: message }]);
      setMessage('');
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000); // Reset after 2 seconds
    }).catch((err) => {
      console.error('Failed to copy room ID: ', err);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  // Add effect to fetch user names for messages
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const userPromises = chatMessages.map(async (msg) => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/getUserName`, {
              params: {
                id: msg.user
              }
            });
            console.log(response);
            return {
              userId: msg.user,
              firstName: response.data.data.name 
            };
          } catch (error) {
            console.error(`Failed to fetch user name for ID ${msg.user}:`, error);
            return { userId: msg.user, firstName: 'Anonymous' };
          }
        });

        const userDetails = await Promise.all(userPromises);

        setChatMessages(prevMessages => 
          prevMessages.map(msg => {
            const userDetail = userDetails.find(u => u.userId === msg.user);
            return {
              ...msg,
              firstName: userDetail?.firstName
            };
          })
        );
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    if (chatMessages.length > 0) {
      fetchUserNames();
    }
  }, [chatMessages.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800">
      <Header />
      {/* Room ID Section */}
      <div className="flex justify-center items-center space-x-2 mb-6 mt-5">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3 max-w-2xl w-full mx-4">
          <label className="text-sm font-semibold text-gray-700">Room ID:</label>
          <input
            type="text"
            value={roomId}
            readOnly
            className="flex-1 p-2 bg-gray-50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
          />
          <button
            className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out text-sm font-medium ${
              copySuccess 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleCopyRoomId}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow p-4 sm:p-6 lg:p-8 space-y-4 md:space-y-0 md:space-x-6 min-h-0">
        {/* Editor Section */}
        <div className="w-full md:w-3/4 flex flex-col min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 flex-grow p-4 overflow-hidden">
            <Toolbar />
            <div className="h-[calc(100%-2rem)] overflow-auto">
              <Room>
                <EditorComponent />
              </Room>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full md:w-1/4 flex flex-col min-h-0">
          <div className="flex-grow bg-white rounded-lg shadow-sm border border-blue-100 mb-4 flex flex-col h-[calc(100vh-20rem)]">
            <h2 className="text-lg bg-blue-600 text-white rounded-t-lg font-semibold text-gray-800 p-4">Chat</h2>
            <div className="p-2 overflow-y-auto flex-grow">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg ${
                    msg.user === user?.id?.toString()
                      ? 'bg-blue-500 text-white ml-4'
                      : 'bg-gray-100 text-gray-800 mr-4'
                  }`}
                >
                  <div className='flex flex-row gap-2'>
                    <div className="font-medium text-sm mb-1">
                      {msg.user === user?.id?.toString() 
                        ? 'You'
                        : msg.firstName || 'Anonymous'}:
                    </div>
                    <div className="text-sm break-words">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 bg-gray-50 border border-blue-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollaborativePage;
