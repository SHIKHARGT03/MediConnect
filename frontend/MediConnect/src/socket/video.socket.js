// src/socket/video.socket.js
import { socket } from "./index";
import { SOCKET_EVENTS } from "./events";

/**
 * Connect socket if not connected
 */
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/**
 * Join video consultation room
 * roomId = bookingId
 */
export const joinVideoRoom = ({ bookingId, role }) => {
  connectSocket();
  socket.emit(SOCKET_EVENTS.JOIN_VIDEO_ROOM, {
    roomId: bookingId,
    role, // "patient" | "hospital"
  });
};

/**
 * Leave video consultation room
 */
export const leaveVideoRoom = (bookingId) => {
  socket.emit(SOCKET_EVENTS.LEAVE_VIDEO_ROOM, {
    roomId: bookingId,
  });
};

/**
 * Emit call started (hospital only)
 */
export const emitCallStarted = (bookingId) => {
  socket.emit(SOCKET_EVENTS.CALL_STARTED, {
    roomId: bookingId,
  });
};

/**
 * Emit call ended (hospital only)
 */
export const emitCallEnded = (bookingId) => {
  socket.emit(SOCKET_EVENTS.CALL_ENDED, {
    roomId: bookingId,
  });
};
