// frontend/src/Schedule/Past.jsx
import React, { useEffect, useState } from "react";
import {
  getPastBookingsForPatient,
  createFollowUpBooking,
} from "../../api/booking";
import axios from "axios";

const BRAND = "#6f42c1";
const RED = "#dc3545";
const GRADIENT = "linear-gradient(180deg, #f8f9fa 0%, #ececec 100%)";

const Past = ({ patientId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpLoading, setFollowUpLoading] = useState(null);
  const [hospitalNames, setHospitalNames] = useState({});

  // -------- Load past bookings --------
  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    getPastBookingsForPatient(patientId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  // -------- Fetch hospital names --------
  useEffect(() => {
    const idsToFetch = bookings
      .map((b) => b.hospitalId)
      .filter((id) => id && !hospitalNames[id]);

    if (idsToFetch.length === 0) return;

    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hospitals/${id}`
        );
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch {
        setHospitalNames((prev) => ({ ...prev, [id]: "Unknown Hospital" }));
      }
    });
    // eslint-disable-next-line
  }, [bookings]);

  // -------- Handle Follow-Up --------
  const handleFollowUp = async (bookingId) => {
    try {
      setFollowUpLoading(bookingId);
      await createFollowUpBooking(bookingId);
      alert("Follow-up booking created successfully!");
    } catch (error) {
      alert("Failed to create follow-up booking.");
    } finally {
      setFollowUpLoading(null);
    }
  };

  // -------- UI --------
  return (
    <div
      style={{
        background: GRADIENT,
        padding: "60px 0 40px 0",
        minHeight: "40vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 800,
          color: "#222",
          marginBottom: "40px",
          letterSpacing: "1px",
        }}
      >
        Your Past Visits Records
      </h2>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" />
          </div>
        ) : !bookings.length ? (
          <div className="text-center my-4">
            <h5>No past visits found</h5>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.bookingId}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow:
                  "0 4px 18px rgba(111,66,193,0.07), 0 1.5px 6px #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                padding: "28px 32px",
                marginBottom: "28px",
                gap: "24px",
                minHeight: "140px",
              }}
            >
              {/* Left: Info */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Type: </span>
                  <span style={{ color: "#222" }}>
                    {booking.type === "appointment"
                      ? "Doctor Appointment"
                      : "Lab Test"}
                  </span>
                </div>

                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>
                    Hospital:{" "}
                  </span>
                  <span style={{ color: "#222" }}>
                    {hospitalNames[booking.hospitalId] ||
                      booking.hospitalId ||
                      "-"}
                  </span>
                </div>

                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>
                    Department:{" "}
                  </span>
                  <span style={{ color: "#222" }}>
                    {booking.department || "-"}
                  </span>
                </div>

                {booking.type === "appointment" ? (
                  <div>
                    <span style={{ fontWeight: 700, color: "#222" }}>
                      Doctor:{" "}
                    </span>
                    <span style={{ color: "#222" }}>
                      {booking.doctorName || "-"}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontWeight: 700, color: "#222" }}>
                      Test:{" "}
                    </span>
                    <span style={{ color: "#222" }}>
                      {booking.testName || "-"}
                    </span>
                  </div>
                )}

                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Date: </span>
                  <span style={{ color: "#222" }}>
                    {new Date(booking.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right: Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "14px",
                  minWidth: "170px",
                }}
              >
                <button
                  style={{
                    background: BRAND,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 22px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "6px",
                    boxShadow: "0 2px 8px rgba(111,66,193,0.09)",
                    cursor: "pointer",
                  }}
                  disabled={followUpLoading === booking.bookingId}
                >
                  {booking.type === "appointment"
                    ? "View Prescription"
                    : "View Lab Report"}
                </button>

                <button
                  style={{
                    background: RED,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: "0 2px 8px rgba(220,53,69,0.09)",
                    cursor: "pointer",
                    opacity: followUpLoading === booking.bookingId ? 0.7 : 1,
                  }}
                  onClick={() => handleFollowUp(booking.bookingId)}
                  disabled={followUpLoading === booking.bookingId}
                >
                  {followUpLoading === booking.bookingId ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    "Follow Up"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Past;
