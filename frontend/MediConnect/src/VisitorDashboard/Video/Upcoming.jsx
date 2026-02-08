// src/VisitorDashboard/Video/Upcoming.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getBookingsForPatient } from "../../api/booking";
import { useVideoSocket } from "../../socket/useVideoSocket";
import { useNavigate } from "react-router-dom";

const Upcoming = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(
    localStorage.getItem("userInfo") || localStorage.getItem("user")
  );
  const patientId = storedUser?.patientId;

  // 🔹 Fetch accepted video consultations
  useEffect(() => {
    if (!patientId) return;

    const fetchCalls = async () => {
      try {
        const data = await getBookingsForPatient(patientId);

        const filtered = (Array.isArray(data) ? data : []).filter(
          (b) =>
            b.type === "videoConsultation" &&
            (b.status || "").toLowerCase() === "accepted"
        );

        setCalls(filtered);
      } catch (err) {
        console.error("Error fetching video calls:", err);
        setCalls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [patientId]);

  if (loading) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>Loading video calls…</h4>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>No video calls scheduled</h4>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column gap-4">
      {calls.map((call) => (
        <VideoCallCard key={call.bookingId} call={call} />
      ))}
    </div>
  );
};

export default Upcoming;

/* ------------------------------------------------------------------ */
/* ---------------------- CARD WITH SOCKET --------------------------- */
/* ------------------------------------------------------------------ */

const VideoCallCard = ({ call }) => {
  const { callStarted } = useVideoSocket({
    bookingId: call.bookingId,
    role: "patient",
  });

  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      {/* LEFT INFO */}
      <div style={styles.left}>
        <Info label="Hospital:" value={call.hospitalName || "Hospital"} />
        <Info label="Doctor:" value={call.doctorName} />
        <Info label="Department:" value={call.department} />
        <Info label="Date:" value={call.date} />
        <Info label="Time:" value={call.time} />
      </div>

      {/* RIGHT ACTION */}
      <div style={styles.right}>
        {callStarted ? (
          <button
            style={styles.joinBtn}
            onClick={() => navigate(`/visitor/records/call/${call.bookingId}`)}
          >
            Join Call
          </button>
        ) : (
          <div style={styles.waitingText}>
            Waiting for doctor to join
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value || "—"}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/* ----------------------------- STYLES ------------------------------ */
/* ------------------------------------------------------------------ */

const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    flexWrap: "wrap",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  row: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  label: {
    fontWeight: "700",
    color: "#000",
  },

  value: {
    fontWeight: "400",
    color: "#000",
  },

  right: {
    minWidth: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  joinBtn: {
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    padding: "12px 26px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  waitingText: {
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },

  emptyWrapper: {
    height: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontWeight: "600",
    color: "#666",
  },
};
