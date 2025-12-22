import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const VideoHome = () => {
  const [hospitalId, setHospitalId] = useState("");
  const [token, setToken] = useState("");
  const [videoCalls, setVideoCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw =
      localStorage.getItem("hospitalInfo") ||
      localStorage.getItem("userInfo") ||
      localStorage.getItem("hospital");

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setHospitalId(parsed.hospitalId);
      setToken(parsed.token);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!hospitalId) return;

    const fetchVideoCalls = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/bookings/hospital/${hospitalId}`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined
        );

        const filtered = (Array.isArray(data) ? data : []).filter(
          (b) =>
            b.type === "videoConsultation" &&
            (b.status || "").toLowerCase() === "accepted"
        );

        setVideoCalls(filtered);
      } catch (err) {
        console.error("Error fetching video consultations:", err);
        setVideoCalls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoCalls();
  }, [hospitalId, token]);

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroText}>Upcoming Video Calls</h1>
      </section>

      {/* CONTENT */}
      <section style={styles.content}>
        {loading ? (
          <div style={styles.centerText}>Loading video calls…</div>
        ) : videoCalls.length === 0 ? (
          <div style={styles.centerText}>
            No upcoming video consultations
          </div>
        ) : (
          <div style={styles.cardsWrapper}>
            {videoCalls.map((call) => (
              <div key={call._id} style={styles.card}>
                {/* LEFT */}
                <div style={styles.left}>
                  <Info label="Patient ID" value={call.patientId} />
                  <Info label="Doctor" value={call.doctorName} />
                  <Info label="Department" value={call.department} />
                  <Info label="Date" value={call.date} />
                  <Info label="Time" value={call.time} />
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                  <button style={styles.startBtn}>Start Call</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}:</span>
    <span style={styles.value}>{value}</span>
  </div>
);

const styles = {
  

  hero: {
    width: "100vw",
    minHeight: "50vh",
    background: "linear-gradient(135deg, #fafdff 0%, #eaf3fa 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 24px",
    boxSizing: "border-box",
  },

  heroText: {
    fontSize: "3.2rem",
    fontWeight: "800",
    color: "#000",
  },

  content: {
    width: "100%",
    padding: "50px 60px",
    boxSizing: "border-box",
  },

  cardsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    maxWidth: "1400px", // prevents over-stretching
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    display: "flex",
    justifyContent: "space-between",
    gap: "32px",
    boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
    alignItems: "center",
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
    justifyContent: "flex-end",
  },

  startBtn: {
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    padding: "14px 36px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
  },

  centerText: {
    height: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "#555",
    fontSize: "1.1rem",
  },
};

export default VideoHome;
