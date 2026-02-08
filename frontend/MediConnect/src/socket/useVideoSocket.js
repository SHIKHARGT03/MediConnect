// src/hooks/useVideoSocket.js
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { SOCKET_EVENTS } from "../socket/events";
import {
  joinVideoRoom,
  leaveVideoRoom,
} from "../socket/video.socket";

export const useVideoSocket = ({ bookingId, role }) => {
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!bookingId || !role) return;

    // Join room
    joinVideoRoom({ bookingId, role });

    // --- Listeners ---
    socket.on(SOCKET_EVENTS.CALL_STARTED, () => {
      setCallStarted(true);
    });

    socket.on(SOCKET_EVENTS.CALL_ENDED, () => {
      setCallEnded(true);
    });

    socket.on(SOCKET_EVENTS.USER_JOINED, (data) => {
      setParticipants((prev) => [...prev, data]);
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (data) => {
      setParticipants((prev) =>
        prev.filter((p) => p.socketId !== data.socketId)
      );
    });

    // --- Cleanup ---
    return () => {
      leaveVideoRoom(bookingId);

      socket.off(SOCKET_EVENTS.CALL_STARTED);
      socket.off(SOCKET_EVENTS.CALL_ENDED);
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.USER_LEFT);
    };
  }, [bookingId, role]);

  return {
    callStarted,
    callEnded,
    participants,
  };
};
