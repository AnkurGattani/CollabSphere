import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { handleCreateRoom, handleJoinRoom, handleSendMessage } from './routes/chatRoom.routes';
import messagesRouter from "./routes/message.routes";
import roomRouter from "./routes/room.routes";
import aiTextCompletionRouter from "./routes/huggingface.route";
import paymentRouter from "./routes/payment.route";
import webhookRouter from "./routes/stripe.webhook.route"
import { verifyJWT } from "./middlewares/auth.middleware";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // origin: '*', // Allow all origins
    credentials: true,
  })
);

app.use('/api/v1/webhook', webhookRouter);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    try {
      // Convert RawData to string
      const dataString = data.toString();

      // Parse the string as JSON
      const parsedData: {
        type: string;
        userId: number;
        roomId?: string;
        text?: string;
      } = JSON.parse(dataString);

      // Check for required fields
      if (!parsedData.type || !parsedData.userId) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format: "type" and "userId" are required.',
        }));
        return;
      }

      // Handle message types
      switch (parsedData.type) {
        case 'createRoom':
          handleCreateRoom(ws, parsedData.userId); // Call the create room handler
          break;

        case 'joinRoomById':
          if (parsedData.roomId) {
            await handleJoinRoom(ws, parsedData.roomId, parsedData.userId); // Call the join room handler
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format: "roomId" is required for joinRoom.',
            }));
          }
          break;

        case 'sendMessage':
          if (parsedData.roomId && parsedData.text) {
            await handleSendMessage(wss, parsedData.roomId, parsedData.userId, parsedData.text); // Call the send message handler
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format: "roomId" and "text" are required for sendMessage.',
            }));
          }
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format: "type" is invalid.',
          }));
          break;
      }
    } catch (error) {
      console.error(error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'An error occurred while processing the message.',
      }));
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server Working Fine");
});

// Routes
import userRouter from "./routes/user.routes";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/ai", verifyJWT, aiTextCompletionRouter);
app.use("/api/v1/payment", paymentRouter);




const port = process.env.PORT || 1234;
server.listen(port, function () {
  console.log((new Date()) + `Server is listening on port ${port}`);
});

app.post("/test", express.raw({ type: "application/json" }), (req, res) => {
  console.log("✅ Test webhook hit!");
  res.status(200).send("OK");
});
export default app;