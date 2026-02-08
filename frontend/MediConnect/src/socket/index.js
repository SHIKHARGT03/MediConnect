// src/socket/index.js
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Singleton socket instance
 * Do NOT connect/disconnect in components
 */
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // ⛔ connect manually
});
