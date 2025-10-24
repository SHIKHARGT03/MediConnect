// src/HospitalDashboard/Schedule/HeroSection.jsx
import React, { useEffect, useState } from "react";
import { getHospitalScheduleOverview } from "../../api/booking"; // <-- corrected path

const BRAND = "#6f42c1";

const readHospitalAuth = () => {
  const keys = ["hospitalInfo", "userInfo", "hospital", "authHospital", "user"];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (obj && obj.hospitalId) return obj;
    } catch (_) {}
  }
  return null;
};

const HeroSection = ({ hospitalId: propHospitalId }) => {
  const [counts, setCounts] = useState({
    todayCount: 0,
    pastWeekCount: 0,
    totalAccepted: 0,
  });

  useEffect(() => {
    const loadOverview = async () => {
      // determine hospitalId: prop OR localStorage fallback
      let hid = propHospitalId;
      if (!hid) {
        const auth = readHospitalAuth();
        hid = auth?.hospitalId;
      }

      console.log("HeroSection: resolved hospitalId =", hid);

      if (!hid) {
        console.warn("HeroSection: no hospitalId available (pass prop or login as hospital).");
        return;
      }

      try {
        const data = await getHospitalScheduleOverview(hid);
        console.log("HeroSection: overview data =", data);

        setCounts({
          todayCount: data.todayCount || 0,
          pastWeekCount: data.pastWeekCount || 0,
          totalAccepted: data.totalAccepted || 0,
        });
      } catch (err) {
        console.error("HeroSection: fetch error", err);
      }
    };

    loadOverview();
  }, [propHospitalId]);

  const styles = {
    hero: {
      width: "100vw",
      minHeight: "50vh",
      background: "linear-gradient(135deg, #fafdff 0%, #eaf3fa 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "50px 20px",
      textAlign: "center",
      boxSizing: "border-box",
    },
    title: {
      fontWeight: 800,
      fontSize: "2.5rem",
      color: "#000",
      marginBottom: "40px",
      letterSpacing: "0.5px",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      flexWrap: "wrap",
      width: "100%",
      maxWidth: "1100px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "32px 0",
      flex: "1",
      minWidth: "240px",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e7ef",
    },
    label: {
      color: BRAND,
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: "1rem",
      marginBottom: "10px",
    },
    value: {
      fontWeight: 900,
      fontSize: "2.4rem",
      color: "#111",
      margin: 0,
    },
  };

  return (
    <div style={styles.hero}>
      <h2 style={styles.title}>Hospital Schedule Overview</h2>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h6 style={styles.label}>Today</h6>
          <p style={styles.value}>{counts.todayCount}</p>
        </div>

        <div style={styles.card}>
          <h6 style={styles.label}>Last 7 Days</h6>
          <p style={styles.value}>{counts.pastWeekCount}</p>
        </div>

        <div style={styles.card}>
          <h6 style={styles.label}>Total Scheduled</h6>
          <p style={styles.value}>{counts.totalAccepted}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
