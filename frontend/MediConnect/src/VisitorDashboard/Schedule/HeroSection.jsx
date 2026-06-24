// src/VisitorDashboard/Schedule/HeroSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBookingsForPatient } from "../../api/booking";
import { API_BASE_URL } from "../../config/api";

const BRAND = "#6f42c1";

const HeroSection = ({ bookings, setBookings }) => {
  const [upcoming, setUpcoming] = useState(null);
  const [hospitalNames, setHospitalNames] = useState({});

  const getPatientId = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("userInfo") || localStorage.getItem("user")
      );
      return stored?.patientId || null;
    } catch {
      return null;
    }
  };

  const startOfTodayISO = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .split("T")[0];
  };

  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [hStr, mStr = "0"] = String(t).split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (h >= 1 && h <= 4 && hStr.length <= 2) h += 12;
    return h * 60 + m;
  };

  const fetchHospitalName = async (hospitalId) => {
    if (!hospitalId || hospitalNames[hospitalId]) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/hospitals/${hospitalId}`);
      const name = res?.data?.name || "";
      setHospitalNames((prev) => ({ ...prev, [hospitalId]: name }));
    } catch {
      setHospitalNames((prev) => ({ ...prev, [hospitalId]: "" }));
    }
  };

  const prettyDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString();
  };

  useEffect(() => {
    const patientId = getPatientId();
    if (!patientId) return;
    getBookingsForPatient(patientId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("❌ Failed to load bookings:", err);
        setBookings([]);
      });
  }, [setBookings]);

  const appointmentCount = useMemo(
    () => bookings.filter((b) => b.type === "appointment" && b.status !== "rejected").length,
    [bookings]
  );
  const labCount = useMemo(
    () => bookings.filter((b) => b.type === "labTest" && b.status !== "rejected").length,
    [bookings]
  );

  useEffect(() => {
    const todayISO = startOfTodayISO();
    const next =
      bookings
        .filter((b) => b?.status !== "rejected" && b?.date && b.date > todayISO)
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return timeToMinutes(a.time) - timeToMinutes(b.time);
        })[0] || null;

    setUpcoming(next);
    if (next?.hospitalId) fetchHospitalName(next.hospitalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "300px",
        background: "linear-gradient(135deg, #fafdff 0%, #eaf3fa 100%)",
        borderBottom: "1px solid #e0e7ef",
        padding: "32px 24px",
        display: "flex",
        gap: "clamp(20px, 3vw, 48px)",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: "1 1 520px",
          maxWidth: "760px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h5
          style={{
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontSize: "1.6rem",
            margin: 0,
            color: BRAND,
          }}
        >
          YOUR VISITS
        </h5>

        <div style={{ display: "flex", gap: "32px", marginTop: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              background: "#fff",
              padding: "28px 0",
              borderRadius: "8px",
              flex: "1",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
              border: "1px solid #e0e7ef",
              minHeight: "120px",
            }}
          >
            <h6
              style={{
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "1rem",
                marginBottom: "8px",
                color: BRAND,
              }}
            >
              Doctor Appointments
            </h6>
            <p style={{ fontSize: "22px", margin: 0 }}>{appointmentCount}</p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "28px 0",
              borderRadius: "8px",
              flex: "1",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
              border: "1px solid #e0e7ef",
              minHeight: "120px",
            }}
          >
            <h6
              style={{
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "1rem",
                marginBottom: "8px",
                color: BRAND,
              }}
            >
              Lab Tests
            </h6>
            <p style={{ fontSize: "22px", margin: 0 }}>{labCount}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: "1 1 300px",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "10px",
          padding: "24px 20px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
          border: "1px solid #e0e7ef",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h5
          style={{
            fontWeight: "700",
            textTransform: "uppercase",
            fontSize: "1.3rem",
            marginBottom: "10px",
            color: BRAND,
          }}
        >
          Upcoming
        </h5>
        {upcoming ? (
          <div style={{ marginTop: "4px" }}>
            <p style={{ margin: "6px 0", fontWeight: 700, color: "#000" }}>
              Date: {prettyDate(upcoming.date)}
            </p>
            <p style={{ margin: "6px 0", fontWeight: 700, color: "#000" }}>
              Time: {upcoming.time || "-"}
            </p>
            <p style={{ margin: "6px 0", fontWeight: 700, color: "#000" }}>
              Hospital: {hospitalNames[upcoming.hospitalId] || "Loading..."}
            </p>
            <p style={{ margin: "6px 0", fontWeight: 700, color: "#000" }}>
              Type: {upcoming.type === "appointment" ? "DOCTOR APPOINTMENT" : "LAB TEST"}
            </p>
          </div>
        ) : (
          <p style={{ marginTop: "10px", color: "#888" }}>No upcoming appointments</p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
