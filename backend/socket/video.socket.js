const videoRooms = new Map();

const getRoomState = (roomId) => {
  if (!videoRooms.has(roomId)) {
    videoRooms.set(roomId, {
      hospital: new Set(),
      patient: new Set(),
      waiting: new Set(),
    });
  }

  return videoRooms.get(roomId);
};

const getPublicState = (roomId) => {
  const state = getRoomState(roomId);
  const participants = {
    hospital: state.hospital.size,
    patient: state.patient.size,
    waiting: state.waiting.size,
  };

  return {
    roomId,
    participants,
    ready: participants.hospital > 0 && participants.patient > 0,
  };
};

const removeSocketFromRoomState = (socket, roomId) => {
  if (!roomId || !videoRooms.has(roomId)) return;

  const state = videoRooms.get(roomId);
  state.hospital.delete(socket.id);
  state.patient.delete(socket.id);
  state.waiting.delete(socket.id);

  if (
    state.hospital.size === 0 &&
    state.patient.size === 0 &&
    state.waiting.size === 0
  ) {
    videoRooms.delete(roomId);
  }
};

const emitRoomState = (io, roomId) => {
  if (!roomId) return;

  const publicState = getPublicState(roomId);
  io.to(roomId).emit("video-room-state", publicState);

  if (publicState.ready) {
    io.to(roomId).emit("video-room-ready", publicState);
  }
};

const registerVideoSocket = (io, socket) => {
  socket.on("join-video-room", ({ roomId, bookingId, role }) => {
    const normalizedRoomId = roomId || bookingId;
    if (!normalizedRoomId) return;

    const normalizedRole =
      role === "hospital" || role === "patient" ? role : "waiting";

    if (socket.data.videoRoomId && socket.data.videoRoomId !== normalizedRoomId) {
      const previousRoomId = socket.data.videoRoomId;
      removeSocketFromRoomState(socket, previousRoomId);
      socket.leave(previousRoomId);
      emitRoomState(io, previousRoomId);
    }

    socket.join(normalizedRoomId);
    socket.data.videoRoomId = normalizedRoomId;
    socket.data.videoRole = normalizedRole;

    const state = getRoomState(normalizedRoomId);
    state.hospital.delete(socket.id);
    state.patient.delete(socket.id);
    state.waiting.delete(socket.id);
    state[normalizedRole].add(socket.id);

    console.log(
      `Video ${normalizedRole} joined room ${normalizedRoomId}: ${socket.id}`
    );

    socket.to(normalizedRoomId).emit("user-joined", {
      socketId: socket.id,
      role: normalizedRole,
      roomId: normalizedRoomId,
    });

    emitRoomState(io, normalizedRoomId);
  });

  socket.on("leave-video-room", ({ roomId, bookingId } = {}) => {
    const normalizedRoomId = roomId || bookingId || socket.data.videoRoomId;
    if (!normalizedRoomId) return;

    socket.leave(normalizedRoomId);
    removeSocketFromRoomState(socket, normalizedRoomId);

    console.log(`User left video room ${normalizedRoomId}: ${socket.id}`);

    socket.to(normalizedRoomId).emit("user-left", {
      socketId: socket.id,
      role: socket.data.videoRole || "user",
      roomId: normalizedRoomId,
    });

    socket.data.videoRoomId = null;
    socket.data.videoRole = null;
    emitRoomState(io, normalizedRoomId);
  });

  socket.on("webrtc-offer", ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    socket.to(roomId).emit("webrtc-offer", { offer, roomId });
  });

  socket.on("webrtc-answer", ({ roomId, answer }) => {
    if (!roomId || !answer) return;
    socket.to(roomId).emit("webrtc-answer", { answer, roomId });
  });

  socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(roomId).emit("webrtc-ice-candidate", { candidate, roomId });
  });

  socket.on("call-started", ({ roomId }) => {
    if (!roomId) return;
    io.emit("call-started", { roomId });
  });

  socket.on("call-ended", ({ roomId }) => {
    if (!roomId) return;
    io.to(roomId).emit("call-ended", { roomId });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.videoRoomId;
    if (!roomId) return;

    removeSocketFromRoomState(socket, roomId);
    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
      role: socket.data.videoRole || "user",
      roomId,
    });
    emitRoomState(io, roomId);
  });
};

export default registerVideoSocket;
