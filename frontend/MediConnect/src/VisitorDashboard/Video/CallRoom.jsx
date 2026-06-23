import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../socket";
import { joinVideoRoom, leaveVideoRoom } from "../../socket/video.socket";
import { getMediaStream } from "../../webrtc/media";
import { createPeerConnection } from "../../webrtc/peer";

const getPermissionMessage = (err) => {
  if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
    return "Camera or microphone is blocked. Allow access in the browser address bar, then retry.";
  }

  if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
    return "No camera or microphone was found on this device.";
  }

  return "Could not start camera and microphone.";
};

const CallRoom = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingIceRef = useRef([]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [statusText, setStatusText] = useState("Preparing camera and microphone...");
  const [mediaError, setMediaError] = useState("");
  const [remoteConnected, setRemoteConnected] = useState(false);

  const flushPendingIce = useCallback(async () => {
    if (!peerRef.current?.remoteDescription) return;

    const queued = pendingIceRef.current.splice(0);
    for (const candidate of queued) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Failed to add queued ICE candidate:", err);
      }
    }
  }, []);

  const addRemoteIceCandidate = useCallback(async (candidate) => {
    if (!candidate) return;

    if (!peerRef.current?.remoteDescription) {
      pendingIceRef.current.push(candidate);
      return;
    }

    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Failed to add ICE candidate:", err);
    }
  }, []);

  const attachLocalStream = useCallback(async () => {
    const stream = await getMediaStream();
    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peer = createPeerConnection(
      (candidate) => {
        socket.emit("webrtc-ice-candidate", {
          roomId: bookingId,
          candidate,
        });
      },
      (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setRemoteConnected(true);
        setStatusText("Connected with doctor");
      }
    );

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") {
        setRemoteConnected(true);
        setStatusText("Connected with doctor");
      }

      if (["failed", "disconnected"].includes(peer.connectionState)) {
        setStatusText("Connection interrupted. Waiting for reconnection...");
      }
    };

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    peerRef.current = peer;
  }, [bookingId]);

  const startRoom = useCallback(async () => {
    try {
      setMediaError("");
      setStatusText("Preparing camera and microphone...");

      peerRef.current?.close();
      peerRef.current = null;
      pendingIceRef.current = [];

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      await attachLocalStream();

      joinVideoRoom({ bookingId, role: "patient" });
      setStatusText("Waiting for doctor to connect...");
    } catch (err) {
      console.error("Error starting patient video room:", err);
      setMediaError(getPermissionMessage(err));
      setStatusText("Camera and microphone are not available");
    }
  }, [attachLocalStream, bookingId]);

  useEffect(() => {
    const handleOffer = async ({ offer }) => {
      if (!offer || !peerRef.current) return;

      try {
        setStatusText("Doctor joined. Connecting...");
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        await flushPendingIce();

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          roomId: bookingId,
          answer,
        });
      } catch (err) {
        console.error("Error handling WebRTC offer:", err);
        setStatusText("Failed to complete connection.");
      }
    };

    const handleIceCandidate = ({ candidate }) => {
      addRemoteIceCandidate(candidate);
    };

    const handleUserLeft = ({ role }) => {
      if (role === "hospital") {
        setRemoteConnected(false);
        setStatusText("Doctor left the call.");
      }
    };

    const handleCallEnded = () => {
      cleanup();
      navigate("/visitor/records?tab=past");
    };

    const cleanup = () => {
      leaveVideoRoom(bookingId);
      peerRef.current?.close();
      peerRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    socket.on("webrtc-offer", handleOffer);
    socket.on("webrtc-ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);
    socket.on("call-ended", handleCallEnded);

    startRoom();

    return () => {
      socket.off("webrtc-offer", handleOffer);
      socket.off("webrtc-ice-candidate", handleIceCandidate);
      socket.off("user-left", handleUserLeft);
      socket.off("call-ended", handleCallEnded);
      cleanup();
    };
  }, [
    addRemoteIceCandidate,
    bookingId,
    flushPendingIce,
    navigate,
    startRoom,
  ]);

  const toggleMic = () => {
    const next = !micOn;
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((track) => {
        track.enabled = next;
      });
    setMicOn(next);
  };

  const toggleCamera = () => {
    const next = !cameraOn;
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((track) => {
        track.enabled = next;
      });
    setCameraOn(next);
  };

  const leaveCall = () => {
    leaveVideoRoom(bookingId);
    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    navigate("/visitor/records");
  };

  return (
    <div style={styles.page}>
      <div style={styles.statusBar}>
        <span style={styles.statusText}>{statusText}</span>
      </div>

      <div style={styles.videoArea}>
        <video ref={remoteVideoRef} autoPlay playsInline style={styles.mainVideo} />

        {!remoteConnected && (
          <div style={styles.remotePlaceholder}>
            <div style={styles.placeholderTitle}>Waiting for doctor video</div>
            <div style={styles.placeholderText}>The call will connect once both sides are ready.</div>
          </div>
        )}

        {mediaError && (
          <div style={styles.errorPanel}>
            <strong>{mediaError}</strong>
            <button style={styles.retryBtn} onClick={startRoom}>
              Retry
            </button>
          </div>
        )}

        <video ref={localVideoRef} autoPlay muted playsInline style={styles.selfVideo} />
      </div>

      <div style={styles.controls}>
        <button style={styles.iconBtn} onClick={toggleMic} aria-label="Toggle microphone">
          {micOn ? "Mic On" : "Mic Off"}
        </button>
        <button style={styles.iconBtn} onClick={toggleCamera} aria-label="Toggle camera">
          {cameraOn ? "Cam On" : "Cam Off"}
        </button>
        <button style={styles.leaveBtn} onClick={leaveCall}>
          Leave Call
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    height: "calc(100vh - 70px)",
    minHeight: 560,
    background: "#000",
    display: "flex",
    flexDirection: "column",
  },
  statusBar: {
    minHeight: 56,
    background: "#101113",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 18px",
    fontWeight: 700,
    textAlign: "center",
  },
  statusText: {
    fontSize: "1rem",
  },
  videoArea: {
    flex: 1,
    position: "relative",
    background: "#000",
    overflow: "hidden",
  },
  mainVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "#000",
  },
  remotePlaceholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    background: "linear-gradient(180deg, #050505 0%, #111 100%)",
    textAlign: "center",
    padding: 24,
  },
  placeholderTitle: {
    fontSize: "1.5rem",
    fontWeight: 800,
    marginBottom: 8,
  },
  placeholderText: {
    color: "#c9c9c9",
    fontWeight: 500,
  },
  errorPanel: {
    position: "absolute",
    top: 24,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(560px, calc(100% - 32px))",
    background: "#fff",
    color: "#111",
    borderRadius: 10,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
    zIndex: 3,
  },
  retryBtn: {
    border: "none",
    background: "#6f42c1",
    color: "#fff",
    borderRadius: 8,
    padding: "9px 14px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  selfVideo: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: "min(260px, 34vw)",
    aspectRatio: "4 / 3",
    borderRadius: 12,
    objectFit: "cover",
    background: "#222",
    border: "1px solid #333",
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
    zIndex: 2,
  },
  controls: {
    minHeight: 92,
    background: "#101113",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "16px 12px",
    flexWrap: "wrap",
  },
  iconBtn: {
    minWidth: 92,
    height: 44,
    borderRadius: 22,
    border: "1px solid #2c2d31",
    background: "#222327",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  leaveBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    minWidth: 124,
    height: 48,
    borderRadius: 24,
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default CallRoom;
