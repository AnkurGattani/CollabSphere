import { Router } from "express";
import { prisma } from "../db/index";
const router = Router();

router.route("/").get(async (req, res) => {
    try {
        const { roomId } = req.query;
        if (!roomId) {
             res.status(400).json({ error: "roomId query parameter is required" });
        }
        const messages = await prisma.message.findMany({ where: { roomId: String(roomId) } });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching messages" });
    }
});

export default router;