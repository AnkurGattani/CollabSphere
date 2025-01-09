'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

export default function Hero() {
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false)
  const [roomId, setRoomId] = useState('')
  const router = useRouter()

  const handleJoinRoom = () => {
    if (roomId) {
      router.push(`/${roomId}`)
    }
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
          <Button onClick={() => setIsCreateRoomOpen(true)} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Create Room</Button>
          <Button variant="outline" onClick={() => setIsJoinRoomOpen(true)} className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">Join Room</Button>
        </motion.div>
      </motion.div>

      <Drawer open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
        <DrawerContent className="bg-white text-gray-900 border-t border-blue-200">
          <DrawerHeader>
            <DrawerTitle>Create a New Room</DrawerTitle>
            <DrawerDescription>
              Enter a name for your new room.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Input placeholder="Room Name" className="border-navy-300" />
          </div>
          <DrawerFooter>
            <Button onClick={() => setIsCreateRoomOpen(false)} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Create</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
            <Button onClick={handleJoinRoom} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">Join</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

