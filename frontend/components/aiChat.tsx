"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from "../store/authStore"
import { Send, Bot, User, PlusCircle, Menu, X } from "lucide-react"
import Header from "./Header"
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { Button } from "./ui/button"
import { useRouter } from 'next/navigation'
import { GoogleGenAI } from "@google/genai";


interface ChatPageProps {
  chatId: string;
  createdAt: string;
}

export default function ChatPage({ chatId }: ChatPageProps) {
  const [messages, setMessages] = useState<{ role: string; message: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const token = localStorage.getItem('token');
  const userId = useAuthStore((state) => state.user?.id);
  const [loading,setLoading]=useState(true);
  const router=useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  interface Chat {
    chatId: string;
    chatName: string;
    createdAt: string;
  }

  const [userAIChats, setUserAIChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // fecth all the AIchats of the userId
  useEffect(() => {
    const fetchChats = async () => {
      try {
        //console.log("token"+ " " + token);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ai/all`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );
        //console.log( response.data.data);
        setUserAIChats(response.data.data);
        // Sort chats by creation time in descending order
        const sortedChats = response.data.data.sort((a: Chat, b: Chat) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setUserAIChats(sortedChats);
        
      } catch (error) {
        console.error('Error fetching AI chats:', error);
      }
    };
    fetchChats();
  } ,[]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ai/${chatId}`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );
        //console.log("fetching messga eof specific chat")
       //console.log(response.data.data.messages);
        setMessages(response.data.data.messages);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching AI messages:', error);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    
    const userMessage = { role: "user", message: input };
    setMessages(prevMessages => Array.isArray(prevMessages) ? [...prevMessages, userMessage] : [userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: currentInput,
      });
      
      const aiResponse = response?.text;
      const botMessage = { role: "bot", message: aiResponse ?? "" };
      setMessages(prevMessages => Array.isArray(prevMessages) ? [...prevMessages, botMessage] : [botMessage]);
      setIsTyping(false);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ai/save`,
        {
          chatId: chatId,
          userId: userId,
          userMessage: currentInput,
          botMessage: aiResponse
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!res) {
        console.log("Error saving message");
      }

      // Add chat to sidebar if it doesn't exist
      const chatExists = userAIChats.some(chat => chat.chatId === chatId);
      if (!chatExists) {
        const newChat = {
          chatId: chatId,
          chatName: currentInput,
          createdAt: new Date(Date.now()).toISOString(),
        };
        setUserAIChats(prev => {
          const updatedChats = [...prev, newChat];
          // Sort chats by creation time in descending order
          return updatedChats.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching AI completion:', error.response?.data || error.message);
      } else {
        console.error('Error fetching AI completion:', error);
      }
      setIsTyping(false);
    }
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // Simulate loading time
  
      return () => clearTimeout(timer);
    }, []);

  const handleNewChat = async () => {
    const newChatId = uuidv4();
    // Reset messages for new chat
    setMessages([]);
    // Keep sidebar open on desktop, close only on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    router.push(`/ai/chatroom/${newChatId}`);
  };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="loader"></div>
        </div>
      );
    }

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-white font-serif">
      <Header />
      <div className="flex flex-row flex-1 overflow-hidden relative md:pt-5">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-md hover:bg-gray-100 bg-white"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transform lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative lg:w-64 w-72 h-[calc(100vh-4rem)] border-r border-border bg-muted z-40`}
        >
          <div className="p-4 flex justify-between items-center sticky top-0 bg-muted z-10 border-b">
            <h2 className="text-lg font-semibold">Chats</h2>
            <Button className="bg-blue-600" size="icon" aria-label="New Chat" onClick={handleNewChat}>
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            <div className="p-2 space-y-2">
              {userAIChats?.map((chat, index) => (
                <Link href={`/ai/chatroom/${chat.chatId}`} key={index}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left hover:bg-gray-100 truncate px-3 py-2" 
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="truncate">{chat.chatName.length > 25 ? `${chat.chatName.substring(0, 25)}...` : chat.chatName}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 w-full h-[calc(100vh-4rem)]"> {/* Added min-w-0 */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-4">
              <div className="space-y-4">
                {messages && messages.map((message, index) => (
                  <ChatMessage key={index} role={message.role} content={message.message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black p-2 rounded-lg flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI is typing...
                  </div>
                </div>
              )}
            </div>
          </main>
          <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ role, content }: { role:string; content: string }) {
  return (
    <div className={`flex items-start space-x-2 ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role == "ai" && (
        <Bot/>
      )}
      <div
        className={`rounded-lg p-3 max-w-[70%] ${role === "user" ? "bg-blue-600 text-primary-foreground" : "bg-muted"}`}
      >
        <ReactMarkdown className="prose prose-sm">{content}</ReactMarkdown>
      </div>
      {role == "user" && (
       <User/>
      )}
    </div>
  )
}
