import React from 'react'
import CollaborativePage from '../../components/collaborative-page'

const RoomPage =  ({ params }: { params: { roomId: string } }) => {
  return <CollaborativePage roomId={params.roomId} />
}

export default RoomPage