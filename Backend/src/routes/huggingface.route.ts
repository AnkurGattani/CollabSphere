import { Router } from "express";
import { prisma } from "../db/index";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const router = Router();

router.route("/save").post(async (req, res) => {
  try {
    const { chatId, userId, userMessage, botMessage } = req.body;

    // Fetch the existing chat
    const existingChat = await prisma.aIChat.findUnique({
      where: { chatId },
    });

    let updatedMessages: Array<{ role: string; message: string }> = [];

    if (existingChat) {
      // Ensure existing messages are an array
      const existingMessages = existingChat.messages as Array<{ role: string; message: string }>;
      // Append new messages to existing messages
      updatedMessages = [
        ...existingMessages,
        { role: 'user', message: userMessage },
        { role: 'ai', message: botMessage },
      ];
      const updatedChat = await prisma.aIChat.update({
        where: { chatId },
        data: {
          messages: updatedMessages,
        },
      });
      res.status(200).json(new ApiResponse(200, updatedChat, "Message saved successfully"));
    } else {
      // Create new messages array if chat does not exist
      updatedMessages = [
        { role: 'user', message: userMessage },
        { role: 'ai', message: botMessage },
      ];
      const newChat = await prisma.aIChat.create({
        data: {
          chatId,
          // chat name will be the first user message
          chatName: userMessage,
          userId,
          messages: updatedMessages,
        },
      });
      res.status(200).json(new ApiResponse(200, newChat, "Message saved successfully"));
    }
  } catch (error) {
    const err = error as any;
    console.error('Error saving message to database:', err.response?.data || err.message);
    res.status(500).json(new ApiResponse(500, null, "Error saving message"));
  }
});

router.route("/all").get(async (req, res) => {
  // Fetch all chats by userId
  const userId = req.user.id;
  const chats = await prisma.aIChat.findMany({
    where: { userId },
  });
  if (!chats) {
    res.status(404).json(new ApiError(404, "Chats not found"));
  } else {
    res.status(200).json(new ApiResponse(200, chats, "Chats found"));
  }
});

router.route("/:chatId").get(async (req, res) => {
  // Fetch chat by chatId
  const chatId = req.params.chatId;
  const chat = await prisma.aIChat.findUnique({
    where: { chatId },
  });
  if(!chat) {
    res.status(200).json(new ApiResponse(200,{}, "Chat not found"));
  }
  else
  {
    res.status(200).json(new ApiResponse(200, chat, "Chat found"));
  }
  
});

export default router;
