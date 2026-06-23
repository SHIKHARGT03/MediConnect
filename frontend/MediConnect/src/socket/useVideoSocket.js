// src/hooks/useVideoSocket.js
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { SOCKET_EVENTS } from "../socket/events";
import {
  connectSocket,
  joinVideoRoom,
  leaveVideoRoom,
} from "../socket/video.socket";

export const useVideoSocket = ({ bookingId, role }) => {
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!bookingId || !role) return;
    const isWaitingRole = role.includes("waiting");

    connectSocket();

    if (!isWaitingRole) {
      joinVideoRoom({ bookingId, role });
    }

    // --- Listeners ---
    const handleCallStarted = ({ roomId } = {}) => {
      if (!roomId || roomId === bookingId) {
        setCallStarted(true);
      }
    };

    const handleCallEnded = ({ roomId } = {}) => {
      if (!roomId || roomId === bookingId) {
        setCallEnded(true);
      }
    };

    const handleUserJoined = (data) => {
      if (data?.roomId && data.roomId !== bookingId) return;
      setParticipants((prev) => [...prev, data]);
    };

    const handleUserLeft = (data) => {
      if (data?.roomId && data.roomId !== bookingId) return;
      setParticipants((prev) =>
        prev.filter((p) => p.socketId !== data.socketId)
      );
    };

    socket.on(SOCKET_EVENTS.CALL_STARTED, handleCallStarted);
    socket.on(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
    socket.on(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
    socket.on(SOCKET_EVENTS.USER_LEFT, handleUserLeft);

    // --- Cleanup ---
    return () => {
      if (!isWaitingRole) {
        leaveVideoRoom(bookingId);
      }

      socket.off(SOCKET_EVENTS.CALL_STARTED, handleCallStarted);
      socket.off(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
      socket.off(SOCKET_EVENTS.USER_JOINED, handleUserJoined);
      socket.off(SOCKET_EVENTS.USER_LEFT, handleUserLeft);
    };
  }, [bookingId, role]);

  return {
    callStarted,
    callEnded,
    participants,
  };
};
