import React, { useEffect, useState } from "react";
import {
  getPastBookingsForPatient,
  createFollowUpBooking,
} from "../../api/booking";
import axios from "axios";

const BRAND = "#6f42c1";
const RED = "#dc3545";
const GRADIENT = "linear-gradient(180deg, #f8f9fa 0%, #ececec 100%)";
const API_BASE = "http://localhost:5000";

const Past = ({ patientId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpLoading, setFollowUpLoading] = useState(null);
  const [hospitalNames, setHospitalNames] = useState({});

  // Prescription modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState("");

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

    if (!idsToFetch.length) return;

    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/api/hospitals/${id}`);
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch {
        setHospitalNames((prev) => ({ ...prev, [id]: "Unknown Hospital" }));
      }
    });
    // eslint-disable-next-line
  }, [bookings]);

  // -------- View Prescription --------
  const handleViewPrescription = async (bookingId) => {
    try {
      setPrescriptionError("");
      const res = await axios.get(
        `${API_BASE}/api/prescription/${bookingId}`,
        { withCredentials: true }
      );

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

  // -------- Follow-Up --------
  const handleFollowUp = async (bookingId) => {
    try {
      setFollowUpLoading(bookingId);
      await createFollowUpBooking(bookingId);
      alert("Follow-up booking created successfully!");
    } catch {
      alert("Failed to create follow-up booking.");
    } finally {
      setFollowUpLoading(null);
    }
  };

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
                padding: "28px 32px",
                marginBottom: "28px",
              }}
            >
              {/* Info */}
              <div>
                <div><b>Type:</b> {booking.type === "appointment" ? "Doctor Appointment" : "Lab Test"}</div>
                <div><b>Hospital:</b> {hospitalNames[booking.hospitalId]}</div>
                <div><b>Department:</b> {booking.department || "-"}</div>
                <div><b>Date:</b> {new Date(booking.date).toLocaleDateString()}</div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  style={{
                    background: BRAND,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 700,
                  }}
                  onClick={() => handleViewPrescription(booking.bookingId)}
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
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 700,
                    opacity: followUpLoading === booking.bookingId ? 0.7 : 1,
                  }}
                  onClick={() => handleFollowUp(booking.bookingId)}
                  disabled={followUpLoading === booking.bookingId}
                >
                  Follow Up
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescription Note Modal */}
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

export default Past;
