// src/VisitorDashboard/Appointment/HeroSection.jsx
import React from "react";

const HeroSection = ({ selectedToggle, setSelectedToggle }) => {
  const buttons = [
    { type: "hospital", label: "Hospital" },
    { type: "lab", label: "Lab Tests" },
    { type: "video", label: "Video Consultation" },
  ];

  return (
    <section style={styles.heroWrapper}>
      <div style={styles.buttonGroup}>
        {buttons.map((btn) => (
          <button
            key={btn.type}
            className={`btn px-4 py-2 fw-semibold ${
              selectedToggle === btn.type ? "text-white" : "text-dark"
            }`}
            onClick={() => setSelectedToggle(btn.type)}
            style={{
              ...styles.button,
              ...(selectedToggle === btn.type
                ? styles.active
                : styles.inactive),
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <h1 style={styles.heading}>Book Your Appointment</h1>

      <div style={styles.searchBarWrapper}>
        <input
          type="text"
          placeholder="Search by the name of Hospital, Department, Doctor"
          className="form-control shadow-sm"
          style={styles.searchBar}
        />
      </div>
    </section>
  );
};

const styles = {
  heroWrapper: {
    width: "100vw",
    height: "75vh",
    background: "linear-gradient(to right, #eef5ff, #f4ecfc)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "40px",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#000",
    margin: "180px 0 40px 0",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  button: {
    border: "2px solid black",
    borderRadius: "10px",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    minWidth: "160px",
    padding: "12px 28px",
    fontWeight: "600",
  },
  active: {
    backgroundColor: "#6f42c1",
    borderColor: "#6f42c1",
    color: "#fff",
  },
  inactive: {
    backgroundColor: "#fff",
    borderColor: "#000",
    color: "#000",
  },
  searchBarWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "0px",
  },
  searchBar: {
    width: "100%",
    maxWidth: "700px",
    padding: "20px 32px",
    fontSize: "1.2rem",
    borderRadius: "12px",
    border: "1.5px solid #ccc",
    boxShadow: "0 2px 12px rgba(111,66,193,0.07)",
  },
};

export default HeroSection;
