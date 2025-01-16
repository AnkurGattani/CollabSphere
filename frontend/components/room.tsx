"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {

    const params = useParams();

  return (
    <LiveblocksProvider publicApiKey={"pk_dev_l61Ynaf3nSewQoHlLLKuTs_ARBskKnE8W8IKgqWfIfn9bQpuNdFT9Eni7oH9t2tI"}>
      <RoomProvider id={params.roomId as string}> {/* The documentId is the unique identifier for the room and should be same as [documentId] folder name*/}
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}