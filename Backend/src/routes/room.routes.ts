import { Router } from "express";
import { prisma } from "../db/index";
const router = Router()


router.route("/create").post(async (req, res) => {
    // Create a new room
    const userId = req.body.userId;
    const newRoom = await prisma.room.create({
        data: {
          name: `Room_${Date.now()}`, 
        },
      });
       // Add the user to the new room
    const response = await prisma.roomUser.create({
        data: {
          roomId: newRoom.id,
          userId: userId,
        },
      });
    if(!newRoom || !response){
        res.status(400).json({ error: "Failed to create room" });
    }
    res.status(200).json({ roomId: newRoom.id, roomName: newRoom.name });
});

export default router;