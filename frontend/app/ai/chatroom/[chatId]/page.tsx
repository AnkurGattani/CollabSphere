'use client'
import ChatPage from "@/components/aiChat";
import { useParams } from 'next/navigation';

export default function Chatroom() {
    const { chatId } = useParams();
    
    if (typeof chatId !== 'string') {
        return null; // or handle the error appropriately
    }
    
    const createdAt = new Date().toISOString(); // or fetch the actual createdAt value

    return (
        <ChatPage chatId={chatId} createdAt={createdAt}/>
    );
}