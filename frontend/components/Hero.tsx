'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthStore } from '../store/authStore'
import { useSocketStore } from '../store/webSocketStore'
import axios from 'axios'

export default function Hero() {
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [createrooms, setCreateRooms] = useState('Create Room');
  const isLogin = useAuthStore((state) => state.isLogin)
  const userId = useAuthStore((state) => state.user?.id)
  const setSocketUrl = useSocketStore((state) => state.setSocketUrl);
  const socketUrl = useSocketStore((state) => state.socketUrl);
  const router = useRouter()

  const handleJoinRoom = (newRoomId?: string) => {
    const roomToJoin = newRoomId || roomId;
    if (roomToJoin === '') {
      toast.error('Room ID is required');
      return;
    }
    const socketUrl = `ws://collabsphere-backend.ridhikajoshi.me/${roomToJoin}`;
    const socket = new WebSocket(socketUrl);
    
    socket.onopen = () => {
      console.log(socket);
      setSocketUrl(socketUrl); // Store the URL instead of the socket object
      console.log('Connected to room');
      router.push(`/${roomToJoin}`);
      // call socket joinRoomById from the backend
      socket.send(JSON.stringify({ type: 'joinRoomById', roomId:roomToJoin, userId }));

    };
    socket.onerror = () => {
      toast.error('Failed to connect to room');
    };
  }

  // Recreate WebSocket connection on page reload
  useEffect(() => {
    if (socketUrl && roomId) {
      const socket = new WebSocket(socketUrl);
      socket.onopen = () => {
        console.log('Reconnected to room');
        // setWs(socket); // Commented out as setWs is not defined
      };
      socket.onerror = () => {
        toast.error('Failed to reconnect to room');
      };
    }
  }, [socketUrl]);

  const handleCreateRoom = async() => {
    // axios post request to create room
    setCreateRooms('Creating Room...');
    try{
      const response=await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/rooms/create`,{
        userId:userId
      });
      console.log(response.data.roomId);
      setRoomId(response.data.roomId);
      handleJoinRoom(response.data.roomId);
    }catch(error){
      console.log(error);
      toast.error('Failed to create room');
    } 
    setCreateRooms('Create Room');
  }


  return (
    <section className="py-20 text-center bg-gradient-to-r from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-blue-900">Collaborate in Real-Time</h2>
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Experience seamless communication and collaboration with our cutting-edge chat and editor platform.
        </motion.p>
        <motion.div 
          className="space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            onClick={()=>
            {
              if(!isLogin) {
                toast.error('Please login first')
                return
              }
              handleCreateRoom();
            }
            } 
            className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            value={createrooms}
          >
            Create Room
          </Button>
          <Button 
            variant="outline" 
            onClick={() =>{
              if(!isLogin) {
                toast.error('Please login first')
                return
              }
              setIsJoinRoomOpen(true)
            }} 
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Join Room
          </Button>
        </motion.div>
      </motion.div>

      <Drawer open={isJoinRoomOpen} onOpenChange={setIsJoinRoomOpen}>
        <DrawerContent className="bg-white text-gray-900 border-t border-blue-200">
          <DrawerHeader>
            <DrawerTitle>Join an Existing Room</DrawerTitle>
            <DrawerDescription>
              Enter the room ID to join.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Input 
              placeholder="Room ID" 
              className="border-navy-300" 
              value={roomId} 
              onChange={(e) => setRoomId(e.target.value)} 
            />
          </div>
          <DrawerFooter>
            <Button onClick={() => handleJoinRoom()} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Join</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ToastContainer />
    </section>
  )
}

