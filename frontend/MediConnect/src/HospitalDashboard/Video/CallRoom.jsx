import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { socket } from "../../socket";
import { createPeerConnection } from "../../webrtc/peer";
import { getMediaStream } from "../../webrtc/media";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { joinVideoRoom, leaveVideoRoom } from "../../socket/video.socket";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const CallRoom = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [statusText, setStatusText] = useState("Starting video consultation…");

  // 🔐 token (optional – only needed for end-call API)
  const token = (() => {
    try {
      const raw =
        localStorage.getItem("hospitalInfo") ||
        localStorage.getItem("userInfo") ||
        localStorage.getItem("hospital");
      return raw ? JSON.parse(raw).token : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const startCall = async () => {
      try {
        // Join standardized room
        joinVideoRoom({ bookingId, role: "hospital" });

        // 2️⃣ Get camera & mic
        const stream = await getMediaStream();
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        // Create peer
        peerRef.current = createPeerConnection(
          (candidate) => {
            socket.emit("webrtc-ice-candidate", {
              roomId: bookingId,
              candidate,
            });
          },
          (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setStatusText("Connected with patient"); // mark connected on first track
          }
        );

        // 4️⃣ Attach tracks
        stream.getTracks().forEach((track) =>
          peerRef.current.addTrack(track, stream)
        );

        // 5️⃣ Create offer
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);

        socket.emit("webrtc-offer", {
          roomId: bookingId,
          offer,
        });

        setStatusText("Waiting for patient to join…");
      } catch (err) {
        console.error("Error starting call:", err);
        setStatusText("Failed to start call");
      }
    };

    startCall();

    // Presence: patient joined
    socket.on("user-joined", ({ role }) => {
      if (role === "patient") {
        setStatusText("Patient joined, connecting…");
      }
    });

    // 📡 Answer from patient
    socket.on("webrtc-answer", async ({ answer }) => {
      try {
        await peerRef.current.setRemoteDescription(answer);
        setStatusText("Connected with patient");
      } catch (e) {
        console.error("Set remote description failed:", e);
      }
    });

    // ❄ ICE candidates
    socket.on("webrtc-ice-candidate", ({ candidate }) => {
      if (candidate) {
        peerRef.current.addIceCandidate(candidate).catch(console.error);
      }
    });

    // Hospital receives end event (for consistency if emitted elsewhere)
    socket.on("call-ended", () => {
      setStatusText("Call ended");
    });

    return () => {
      // Leave room and cleanup
      leaveVideoRoom(bookingId);
      socket.off("user-joined");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("call-ended");

      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localVideoRef.current && (localVideoRef.current.srcObject = null);
    };
  }, [bookingId]);

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

  // ❌ End call (doctor only)
  const endCall = async () => {
    try {
      await API.put(
        `/bookings/${bookingId}/end-call`,
        {},
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
    } catch (err) {
      console.error("End call error:", err);
    } finally {
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localVideoRef.current && (localVideoRef.current.srcObject = null);
      setStatusText("Call ended");
      navigate("/hospital/video");
    }
  };

  return (
    <div style={styles.page}>
      {/* STATUS BAR */}
      <div style={styles.statusBar}>
        <span style={styles.statusText}>{statusText}</span>
      </div>

      {/* VIDEO AREA */}
      <div style={styles.videoArea}>
        {/* Remote (Patient) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={styles.mainVideo}
        />

        {/* Local (Doctor) */}
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
        <button style={styles.endBtn} onClick={endCall}>
          End Call
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
    height: "60px",
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  statusText: {
    fontSize: "1.1rem",
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
    borderRadius: "12px",
    objectFit: "cover",
    background: "#222",
  },
  controls: {
    height: "90px",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  controlBtn: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
  },
  endBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "12px 28px",
    borderRadius: "30px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default CallRoom;
