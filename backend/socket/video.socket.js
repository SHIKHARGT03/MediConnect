const registerVideoSocket = (io, socket) => {

  // Patient or hospital joins a room using bookingId
  socket.on("join-video-room", ({ bookingId, role }) => {
    if (!bookingId) return;

    socket.join(bookingId);

    console.log(
      `🎥 ${role || "user"} joined video room: ${bookingId}`
    );
  });

  // Join video room with standardized payload key: roomId
  socket.on("join-video-room", ({ roomId, role }) => {
    if (!roomId) return;

    socket.join(roomId);
    console.log(`🎥 ${role || "user"} joined video room: ${roomId}`);

    io.to(roomId).emit("user-joined", {
      socketId: socket.id,
      role: role || "user",
    });
  });

  socket.on("leave-video-room", ({ roomId }) => {
    if (!roomId) return;
    socket.leave(roomId);
    console.log(`👋 User left video room: ${roomId}`);

    io.to(roomId).emit("user-left", { socketId: socket.id });
  });

  // WebRTC signaling forwarding only
  socket.on("webrtc-offer", ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    socket.to(roomId).emit("webrtc-offer", { offer });
  });

  socket.on("webrtc-answer", ({ roomId, answer }) => {
    if (!roomId || !answer) return;
    socket.to(roomId).emit("webrtc-answer", { answer });
  });

  socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(roomId).emit("webrtc-ice-candidate", { candidate });
  });

  // Removed: client-triggered 'call-started' and 'call-ended' to prevent accidental broadcast
  socket.on("call-started", ({ roomId }) => {
    if (!roomId) return;
    io.to(roomId).emit("call-started", { roomId });
  });

  socket.on("call-ended", ({ roomId }) => {
    if (!roomId) return;
    io.to(roomId).emit("call-ended", { roomId });
  });
};

export default registerVideoSocket;
