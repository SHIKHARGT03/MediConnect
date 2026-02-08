import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  getBookingsForPatient,
  createFollowUpBooking,
} from "../../api/booking";

const BRAND = "#6f42c1";
const RED = "#dc3545";
const GRADIENT = "linear-gradient(180deg, #f8f9fa 0%, #ececec 100%)";
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

const Past = () => {
  const storedUser = JSON.parse(
    localStorage.getItem("userInfo") || localStorage.getItem("user")
  );
  const patientId = storedUser?.patientId;

  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalNames, setHospitalNames] = useState({});
  const [followUpLoading, setFollowUpLoading] = useState(null);

  // Prescription modal (same UX as Schedule/Past.jsx)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState("");

  // Fetch completed video consultations
  useEffect(() => {
    if (!patientId) return;
    const fetchCalls = async () => {
      try {
        const data = await getBookingsForPatient(patientId);
        const filtered = (Array.isArray(data) ? data : [])
          .filter(
            (b) =>
              b.type === "videoConsultation" &&
              (b.status || "").toLowerCase() === "completed"
          )
          .sort((a, b) => {
            // optional: sort by date desc then time desc
            const d = (x) => new Date(`${x.date} ${x.time || "00:00"}`).getTime();
            return d(b) - d(a);
          });

        setCalls(filtered);
      } catch (err) {
        console.error("Error fetching past video calls:", err);
        setCalls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, [patientId]);

  // Fetch hospital names for display
  useEffect(() => {
    const idsToFetch = calls
      .map((b) => b.hospitalId)
      .filter((id) => id && !hospitalNames[id]);

    if (!idsToFetch.length) return;

    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/api/hospitals/${id}`);
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch (err) {
        console.error("Error fetching hospital name:", err);
        setHospitalNames((prev) => ({ ...prev, [id]: "Hospital" }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls]);

  // View Prescription (same logic as Schedule/Past.jsx)
  const handleViewPrescription = async (bookingId) => {
    try {
      setPrescriptionError("");
      const res = await axios.get(`${API_BASE}/api/prescription/${bookingId}`, {
        withCredentials: true,
      });

      setActivePrescription(res.data);
      setShowPrescriptionModal(true);

      // open file in new tab (view-only)
      window.open(
        `${API_BASE}/api/prescription/file/${bookingId}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Error fetching prescription:", err);
      setPrescriptionError("Prescription has not been sent by the hospital yet.");
      setShowPrescriptionModal(true);
    }
  };

  // Follow Up
  const handleFollowUp = async (bookingId) => {
    try {
      setFollowUpLoading(bookingId);
      await createFollowUpBooking(bookingId);
      alert("Follow-up booking created successfully!");
    } catch (err) {
      console.error("Error creating follow-up booking:", err);
      alert("Failed to create follow-up booking.");
    } finally {
      setFollowUpLoading(null);
    }
  };

  // Loading / Empty states
  if (loading) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>Loading past video consultations…</h4>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>No past video consultations</h4>
      </div>
    );
  }

  // Cards (same layout and CSS as Upcoming.jsx)
  return (
    <div
      style={{
        background: GRADIENT,
        padding: "40px 0 40px 0",
        minHeight: "40vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 800,
          color: "#222",
          marginBottom: "24px",
        }}
      >
        Past Video Consultations
      </h2>

      <div className="container d-flex flex-column gap-4">
        {calls.map((call) => (
          <div key={call.bookingId} style={styles.card}>
            {/* LEFT INFO */}
            <div style={styles.left}>
              <Info label="Hospital:" value={hospitalNames[call.hospitalId] || "Hospital"} />
              <Info label="Doctor:" value={call.doctorName} />
              <Info label="Department:" value={call.department} />
              <Info label="Date:" value={call.date} />
              <Info label="Time:" value={call.time} />
            </div>

            {/* RIGHT ACTIONS */}
            <div style={styles.right}>
              <button
                style={styles.primaryBtn}
                onClick={() => handleViewPrescription(call.bookingId)}
              >
                View Prescription
              </button>
              <button
                style={{
                  ...styles.dangerBtn,
                  opacity: followUpLoading === call.bookingId ? 0.7 : 1,
                }}
                onClick={() => handleFollowUp(call.bookingId)}
                disabled={followUpLoading === call.bookingId}
              >
                Follow Up
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Note Modal (same as Schedule/Past.jsx) */}
      {showPrescriptionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowPrescriptionModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: 420,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ marginBottom: 12 }}>🩺 Doctor’s Note</h5>

            {prescriptionError ? (
              <p style={{ color: "#555" }}>{prescriptionError}</p>
            ) : activePrescription?.note ? (
              <p style={{ color: "#333", lineHeight: 1.5 }}>
                {activePrescription.note}
              </p>
            ) : (
              <p style={{ color: "#777" }}>No note provided by doctor.</p>
            )}

            <button
              style={{
                marginTop: 16,
                background: BRAND,
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 8,
                float: "right",
              }}
              onClick={() => setShowPrescriptionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value || "—"}</span>
  </div>
);

const styles = {
  // copied from Upcoming.jsx for uniformity
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
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: BRAND,
    color: "#fff",
    border: "none",
    padding: "12px 26px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
  },
  dangerBtn: {
    backgroundColor: RED,
    color: "#fff",
    border: "none",
    padding: "12px 26px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
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

export default Past;
