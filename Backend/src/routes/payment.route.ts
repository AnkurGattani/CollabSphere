// import { Router, raw, Request, Response } from "express";
import express, { Request, Response } from "express";
import { prisma } from "../db/index";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/checkSubscription", asyncHandler(async (req: Request, res: Response) => {
  try{
  const email = req.params.email as string;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { isSubscribed: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({ isSubscribed: user.isSubscribed });
}
  catch(error) {
    console.error("Error checking subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}));


export default router;