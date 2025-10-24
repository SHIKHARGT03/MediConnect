// src/VisitorDashboard/Schedule/HeroSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBookingsForPatient } from "../../api/booking";

const BRAND = "#6f42c1"; // MediConnect brand purple

const HeroSection = ({ bookings }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("3"); // months
  const [upcoming, setUpcoming] = useState(null);
  const [hospitalNames, setHospitalNames] = useState({}); // { [hospitalId]: name }

  // -------- helpers --------
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
    // force local midnight ISO (YYYY-MM-DD)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .split("T")[0];
  };

  const pastISOFromMonths = (months) => {
    const d = new Date();
    const m = parseInt(months, 10);
    const past = new Date(d.getFullYear(), d.getMonth() - m, d.getDate());
    return past.toISOString().split("T")[0];
  };

  // robust time sorter for "9", "09:30", "14:00", "2", "2:30"
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [hStr, mStr = "0"] = String(t).split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    // treat 1–4 as PM when given without 24h format
    if (h >= 1 && h <= 4 && hStr.length <= 2) h += 12;
    return h * 60 + m;
  };

  const fetchHospitalName = async (hospitalId) => {
    if (!hospitalId || hospitalNames[hospitalId]) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/hospitals/${hospitalId}`
      );
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

  // -------- load bookings once --------
  useEffect(() => {
    const patientId = getPatientId();
    if (!patientId) return;
    getBookingsForPatient(patientId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("❌ Failed to load bookings:", err);
        setBookings([]);
      });
  }, []);

  // -------- compute filtered bookings (accepted + within selected window) --------
  const filteredBookings = useMemo(() => {
    const todayISO = startOfTodayISO();
    const pastISO = pastISOFromMonths(selectedPeriod);

    // include both past and future within the window
    return bookings.filter(
      (b) =>
        b?.status === "accepted" &&
        b?.date &&
        b.date >= pastISO // just ensure inside selected window
    );
  }, [bookings, selectedPeriod]);

  // Use bookings prop for summary counts
  const appointmentCount = bookings.filter(
    (b) => b.type === "appointment" && b.status === "accepted"
  ).length;
  const labCount = bookings.filter(
    (b) => b.type === "labTest" && b.status === "accepted"
  ).length;

  // -------- compute nearest upcoming (accepted + date strictly after today) --------
  useEffect(() => {
    const todayISO = startOfTodayISO();
    const next =
      bookings
        .filter((b) => b?.status === "accepted" && b?.date && b.date > todayISO)
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return timeToMinutes(a.time) - timeToMinutes(b.time);
        })[0] || null;

    setUpcoming(next);
    if (next?.hospitalId) fetchHospitalName(next.hospitalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  // -------- UI --------
  return (
    <div
      style={{
        width: "100vw",
        minWidth: "100vw",
        height: "30vh",
        background: "linear-gradient(135deg, #fafdff 0%, #eaf3fa 100%)",
        borderBottom: "1px solid #e0e7ef",
        padding: "32px 0 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "3vw",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            Your Last Visits
          </h5>
          <select
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "32px", marginTop: "10px" }}>
          {/* Doctor Appointments */}
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

          {/* Lab Tests */}
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

      {/* Right Side - Upcoming */}
      <div
        style={{
          width: "28%",
          background: "#fff",
          borderRadius: "10px",
          padding: "24px 20px",
          marginLeft: "3vw",
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
          Upcoming Appointment
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
              Type:{" "}
              {upcoming.type === "appointment"
                ? "DOCTOR APPOINTMENT"
                : "LAB TEST"}
            </p>
          </div>
        ) : (
          <p style={{ marginTop: "10px", color: "#888" }}>
            No upcoming appointments
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
