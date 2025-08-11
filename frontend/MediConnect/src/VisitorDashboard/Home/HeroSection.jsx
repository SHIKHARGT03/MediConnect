import React, { useState } from "react";

const HeroSection = () => {
  const [selected, setSelected] = useState("hospital");

  const handleSelect = (type) => setSelected(type);

  return (
    <section style={styles.heroWrapper}>
      <div style={styles.topSection}>
        <h1 style={styles.heading}>Book Your Appointment</h1>
        <p style={styles.subheading}>at any Hospital or Lab test in just a few seconds</p>
        <div style={styles.buttonGroup}>
          <button
            className={`btn px-4 py-2 fw-semibold ${
              selected === "hospital" ? "text-white" : "text-dark"
            }`}
            onClick={() => handleSelect("hospital")}
            style={{
              ...styles.button,
              ...(selected === "hospital" ? styles.active : styles.inactive),
            }}
          >
            Hospital
          </button>
          <button
            className={`btn px-4 py-2 fw-semibold ${
              selected === "lab" ? "text-white" : "text-dark"
            }`}
            onClick={() => handleSelect("lab")}
            style={{
              ...styles.button,
              ...(selected === "lab" ? styles.active : styles.inactive),
            }}
          >
            Lab Tests
          </button>
        </div>
      </div>

      <div style={styles.searchBarWrapper}>
        <input
          type="text"
          placeholder={`Search ${
            selected === "hospital" ? "Hospital" : "Lab Tests"
          }...`}
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
    height: "65vh",
    background: "linear-gradient(to right, #eef5ff, #f4ecfc)", // Light blue to soft violet
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "unset",
    marginTop: "0",
  },
  heading: {
    fontSize: "3.2rem",
    color: "#000",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#000",
    marginBottom: "40px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "24px",
    marginBottom: "0",
  },
  button: {
    border: "2px solid black",
    borderRadius: "10px",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    minWidth: "120px",
    padding: "12px 28px",
    fontWeight: "600",
  },
  active: {
    backgroundColor: "#6f42c1",
    borderColor: "#6f42c1",
    color: "#fff",
  },
  inactive: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    color: "#000",
  },
  searchBarWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "100px", // reduced from 225px
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
