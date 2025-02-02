"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import axios from "axios";

export function Room({ children }: { children: ReactNode }) {

  const params = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const authEndpoint = async (room?: string) => {
    const response = await axios.post('/api/liveblocks-auth', {
      user,
      room , 
      headers: {
        'Content-Type': 'application/json',
      },
      // data: JSON.stringify({ user, room }), // Include user and room in the request body

  });

    return response.data;
  };

  return (
    <LiveblocksProvider authEndpoint={authEndpoint} throttle={16}>
      <RoomProvider id={params.roomId as string}> {/* The documentId is the unique identifier for the room and should be same as [documentId] folder name*/}
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}