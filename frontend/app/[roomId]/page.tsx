'use client'
import React from 'react'
import CollaborativePage from '../../components/collaborative-page'
import { useParams } from 'next/navigation'

const RoomPage: React.FC = () => {
  const { roomId } = useParams()

  if (!roomId || typeof roomId !== 'string') {
    return <div>Loading...</div>
  }

  return <CollaborativePage roomId={roomId} />
}

export default RoomPage