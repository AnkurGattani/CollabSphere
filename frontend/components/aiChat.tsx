"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from "../store/authStore"
import { Send, Bot, User, PlusCircle, Menu, X } from "lucide-react"
import Header from "./Header"
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ScrollArea } from "@radix-ui/react-scroll-area"
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
    setMessages((prev) => 
          Array.isArray(prev) && prev.length === 0 
          ? [{ role: "user", message: input }] 
          : [...(Array.isArray(prev) ? prev : []), { role: "user", message: input }]
        );
    setInput("");
    setIsTyping(true);
   try
   {
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY });
     const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
  });
  console.log(response.text);
  const aiResponse = response?.text;
  setMessages((prev) => 
            Array.isArray(prev) && prev.length === 0 
              ? [{ role: "bot", message: aiResponse ?? "" }] 
              : [...(Array.isArray(prev) ? prev : []), { role: "bot", message: aiResponse ?? "" }]
          );
        setIsTyping(false);
        const res= await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ai/save`,
          {
            chatId:chatId,
            userId:userId,
            userMessage:input,
            botMessage:aiResponse
          },
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
        
          if(!res)
          {
            console.log("Error saving message");
          }
        const chatExists = userAIChats.some(chat => chat.chatId === chatId);
        if (!chatExists) {
            const newChat = {
            chatId: chatId,
            chatName: input,
            createdAt: new Date(Date.now()).toISOString(),
            };
            const updatedChats = [...userAIChats, newChat];
            // Sort chats by creation time in descending order
            const sortedChats = updatedChats.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setUserAIChats(sortedChats);
        }
    
   }
    catch(error){
      if (axios.isAxiosError(error)) {
        console.error('Error fetching AI completion:', error.response?.data || error.message);
      } else {
        console.error('Error fetching AI completion:', error);
      }
    }
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // Simulate loading time
  
      return () => clearTimeout(timer);
    }, []);

  const handleNewChat = async () => {
    const chatId = uuidv4();
    router.push(`/ai/chatroom/${chatId}`);
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
      <div className="flex flex-row flex-1 overflow-hidden relative">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transform lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static lg:w-64 w-64 h-full border-r border-border bg-muted z-40`}
        >
          <div className="p-4 flex justify-end gap-20 items-center">
            <h2 className="text-lg  font-semibold">Chats</h2>
            <Button className="bg-blue-600" size="icon" aria-label="New Chat" onClick={handleNewChat}>
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-2 space-y-2">
              {userAIChats?.map((chat, index) => (
                <Link href={`/ai/chatroom/${chat.chatId}`} key={index}>
                  <Button variant="ghost" className="w-full justify-start text-left hover:border-2 border-black" onClick={() => setIsSidebarOpen(false)}>
                    <span className="truncate">{chat.chatName.length > 25 ? `${chat.chatName.substring(0, 25)}...` : chat.chatName}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto w-full">
          <main className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages && messages.map((message, index) => {
                    return <ChatMessage key={index} role={message.role} content={message.message} />;
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
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
          <footer className="bg-white border-t border-gray-200 p-4">
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