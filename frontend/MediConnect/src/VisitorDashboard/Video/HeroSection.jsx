import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HeroSection = ({ activeTab, setActiveTab }) => {
  const images = [1, 2, 3, 4, 5, 6];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={styles.heroWrapper}>
      {/* Background Image */}
      <img
        src={`/Video/${images[currentIndex]}.jpg`}
        alt="Video Consultation"
        style={styles.heroImage}
      />

      {/* Overlay */}
      <div style={styles.overlay} />

      {/* Center Text */}
      <div style={styles.textContainer}>
        <h1 style={styles.heading}>Your Doctor, One Call Away</h1>
      </div>

      {/* Toggle Buttons */}
      <div style={styles.buttonWrapper}>
        <button
          className="btn"
          onClick={() => setActiveTab("upcoming")}
          style={{
            ...styles.toggleBtn,
            ...(activeTab === "upcoming"
              ? styles.activeBtn
              : styles.inactiveBtn),
          }}
        >
          Upcoming Calls
        </button>

        <button
          className="btn"
          onClick={() => setActiveTab("past")}
          style={{
            ...styles.toggleBtn,
            ...(activeTab === "past"
              ? styles.activeBtn
              : styles.inactiveBtn),
          }}
        >
          Past Calls
        </button>
      </div>
    </section>
  );
};

const styles = {
  heroWrapper: {
    position: "relative",
    height: "70vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 1s ease-in-out",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 1,
  },

  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 16px",
  },

  heading: {
    color: "#fff",
    fontSize: "2.4rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
    textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
  },

  buttonWrapper: {
    zIndex: 2,
    display: "flex",
    gap: "18px",
    marginBottom: "22px",
  },

  toggleBtn: {
    padding: "10px 26px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.25s ease",
  },

  activeBtn: {
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "2px solid #6f42c1",
  },

  inactiveBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid #6f42c1",
  },
};

export default HeroSection;
