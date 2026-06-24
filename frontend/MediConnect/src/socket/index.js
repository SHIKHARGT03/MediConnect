// src/socket/index.js
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

/**
 * Singleton socket instance
 * Do NOT connect/disconnect in components
 */
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // ⛔ connect manually
});
