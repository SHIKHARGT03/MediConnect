import { Server } from "socket.io";
import registerVideoSocket from "./video.socket.js";

let io = null;

const allowedOrigins = [
  "http://localhost:5173",
  "https://mediconnect-bolton1.vercel.app",
];

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // register video-related events
    registerVideoSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
