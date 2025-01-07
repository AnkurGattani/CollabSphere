import { WebSocket, WebSocketServer } from 'ws';
import { prisma } from "../db/index";

// Function to handle room creation
export const handleCreateRoom = async (ws: WebSocket, userId: number) => {
  try {
    // Create a new room
    const newRoom = await prisma.room.create({
      data: {
        name: `Room_${Date.now()}`, 
      },
    });

    if (!newRoom) {
      ws.send(JSON.stringify({
        type: 'createRoomError',
        message: 'Failed to create room',
      }));
      return;
    }

    // Add the user to the new room
    const response = await prisma.roomUser.create({
      data: {
        roomId: newRoom.id,
        userId: userId,
      },
    });

    if (!response) {
      ws.send(JSON.stringify({
        type: 'createRoomError',
        message: 'Failed to create room',
      }));
      return;
    }

    // Send a success message back to the client
    ws.send(JSON.stringify({
      type: 'createRoomSuccess',
      roomId: newRoom.id,
      roomName: newRoom.name,
    }));
  } catch (error) {
    console.error(error);
    ws.send(JSON.stringify({
      type: 'createRoomError',
      message: 'Failed to create room',
    }));
  }
};

// Function to handle joining a room
export const handleJoinRoom = async (ws: WebSocket, roomId: string, userId: number) => {
  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      ws.send(JSON.stringify({
        type: 'joinRoomError',
        message: 'Room not found',
      }));
      return;
    }

    // Add the user to the room
    const response = await prisma.roomUser.create({
      data: {
        roomId: roomId,
        userId: userId,
      },
    });

    if (!response) {
      ws.send(JSON.stringify({
        type: 'joinRoomError',
        message: 'Failed to join room',
      }));
      return;
    }

    // Send a success message back to the client
    ws.send(JSON.stringify({
      type: 'joinRoomSuccess',
      roomId: room.id,
      roomName: room.name,
    }));
  } catch (error) {
    console.error(error);
    ws.send(JSON.stringify({
      type: 'joinRoomError',
      message: 'Failed to join room',
    }));
  }
};

// Function to handle sending messages in a room
export const handleSendMessage = async (wss: WebSocketServer, roomId: string, userId: number, text: string) => {
  try {
    // Check if the user is in the room
    const roomUser = await prisma.roomUser.findFirst({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });

    if (!roomUser) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'sendMessageError',
            message: 'You are not in the room',
          }));
        }
      });
      return;
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        message: text,
        userId: userId,
        roomId: roomId,
      },
    });

    if (!newMessage) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'sendMessageError',
            message: 'Failed to send message',
          }));
        }
      });
      return;
    }

    // Send the message to all users in the room
    const roomUsers = await prisma.roomUser.findMany({
      where: {
        roomId: roomId,
      },
    });

    roomUsers.forEach((user) => {
      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN // Make sure to send to the right client based on userId
        ) {
          client.send(JSON.stringify({
            type: 'receiveMessage',
            message: {
              id: newMessage.id,
              text: newMessage.message,
              userId: newMessage.userId,
              roomId: newMessage.roomId,
            },
          }));
        }
      });
    });

    // Send a success message back to the client who sent the message
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'sendMessageSuccess',
          messageId: newMessage.id,
        }));
      }
    });
  } catch (error) {
    console.error(error);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'sendMessageError',
          message: 'Failed to send message',
        }));
      }
    });
  }
};
