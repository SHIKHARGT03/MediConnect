import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { socket } from "../../socket";
import { createPeerConnection } from "../../webrtc/peer";
import { getMediaStream } from "../../webrtc/media";
import { useParams, useNavigate } from "react-router-dom";
import { joinVideoRoom, leaveVideoRoom } from "../../socket/video.socket";

function CallRoom() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  // Removed unused variable to satisfy ESLint:
  // const pendingOfferRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [statusText, setStatusText] = useState("Waiting for doctor to start…");

  useEffect(() => {
    joinVideoRoom({ bookingId, role: "patient" });

    socket.on("user-joined", ({ role }) => {
      if (role === "hospital") setStatusText("Doctor joined, preparing…");
    });

    // Doctor starts → we receive offer
    socket.on("webrtc-offer", async ({ offer }) => {
      try {
        if (!localStreamRef.current) {
          const stream = await getMediaStream();
          localStreamRef.current = stream;
          localVideoRef.current.srcObject = stream;
        }

        if (!peerRef.current) {
          peerRef.current = createPeerConnection(
            (candidate) => {
              socket.emit("webrtc-ice-candidate", {
                roomId: bookingId,
                candidate,
              });
            },
            (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              setStatusText("Connected with doctor");
            }
          );

          localStreamRef.current.getTracks().forEach((track) =>
            peerRef.current.addTrack(track, localStreamRef.current)
          );
        }

        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          roomId: bookingId,
          answer,
        });

        setStatusText("Connecting…");
      } catch (err) {
        console.error("Error handling offer:", err);
        setStatusText("Connection failed");
      }
    });

    socket.on("webrtc-ice-candidate", ({ candidate }) => {
      if (candidate) {
        peerRef.current
          ?.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(console.error);
      }
    });

    // Only the backend controller emits this, so it won’t fire prematurely now
    socket.on("call-ended", () => {
      cleanup();
      navigate("/visitor/records?tab=past");
    });

    return () => cleanup();
    // eslint-disable-next-line
  }, [bookingId]);

  const cleanup = () => {
    socket.off("user-joined");
    socket.off("webrtc-offer");
    socket.off("webrtc-ice-candidate");
    socket.off("call-ended");

    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    leaveVideoRoom(bookingId);
    setStatusText("Call ended");
  };

  // 🎤 Toggle mic
  const toggleMic = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };

  // 🎥 Toggle camera
  const toggleCamera = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !cameraOn));
    setCameraOn((v) => !v);
  };

  return (
    <div style={styles.page}>
      {/* STATUS BAR */}
      <div style={styles.statusBar}>
        <span style={styles.statusText}>{statusText}</span>
      </div>

      {/* VIDEO AREA */}
      <div style={styles.videoArea}>
        {/* Doctor Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={styles.mainVideo}
        />

        {/* Patient Preview (only visible once camera starts) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={styles.selfVideo}
        />
      </div>

      {/* CONTROLS */}
      <div style={styles.controls}>
        <button style={styles.iconBtn} onClick={toggleMic} aria-label="Toggle microphone">
          {/* Mic SVG */}
          {micOn ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2v-3z"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M19 11a7 7 0 0 1-12.5 4.5l1.5-1.5A5 5 0 0 0 17 11h2zM12 14a3 3 0 0 0 3-3V8.41l-6.29 6.3A2.99 2.99 0 0 0 12 14zM9 5a3 3 0 0 1 5.12-2.12L9 8.99V5zM11 19h2v3h-2v-3z"/></svg>
          )}
        </button>
        <button style={styles.iconBtn} onClick={toggleCamera} aria-label="Toggle camera">
          {/* Camera SVG */}
          {cameraOn ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5l4-3v9l-4-3V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5z"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M2 4.27L3.27 3 21 20.73 19.73 22l-3.29-3.29A2 2 0 0 1 16 19H5a2 2 0 0 1-2-2V8c0-.53.21-1.04.59-1.41L2 4.27zM17 10.5l4-3v9l-3.11-2.33L17 13.5V10.5z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "#000",
    display: "flex",
    flexDirection: "column",
  },

  statusBar: {
    height: "56px",
    background: "#0f0f10",
    color: "#e9eaee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    borderBottom: "1px solid #1c1d20",
  },

  statusText: {
    fontSize: "1.05rem",
    letterSpacing: "0.2px",
  },

  videoArea: {
    flex: 1,
    position: "relative",
    background: "#000",
  },

  mainVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  selfVideo: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    width: "240px",
    height: "160px",
    borderRadius: "14px",
    objectFit: "cover",
    background: "#1c1d20",
    border: "1px solid #2a2b30",
    boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
  },

  controls: {
    height: "84px",
    background: "#0f0f10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    borderTop: "1px solid #1c1d20",
  },

  iconBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "1px solid #2a2b30",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
};

export default CallRoom;
