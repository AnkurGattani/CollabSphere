import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, prisma } from "./db/index";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", async (req, res) => {
  try {
    // await prisma.user.create({
    //   data: {
    //     firstName:  "Ridhika",
    //     lastName :  "Joshi"
    //   },
    // });
    res.send("Server Working Fine");
  } catch (error) {
    res.status(500).send("Error occurred while creating user");
  }
});


export default app;