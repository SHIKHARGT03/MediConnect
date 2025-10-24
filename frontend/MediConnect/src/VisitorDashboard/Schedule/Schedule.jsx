// frontend/src/Schedule/Schedule.jsx
import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import Timeline from "./Timeline";
import Past from "./Past";
import { getBookingsForPatient } from "../../api/booking";

const getPatientId = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("userInfo") || localStorage.getItem("user"));
    return stored?.patientId || null;
  } catch {
    return null;
  }
};

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const patientId = getPatientId();

  useEffect(() => {
    if (!patientId) return;
    getBookingsForPatient(patientId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, [patientId]);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <HeroSection bookings={bookings} patientId={patientId} />
      <Timeline bookings={bookings} patientId={patientId} />
      <Past patientId={patientId} />
    </div>
  );
};

export default Schedule;
