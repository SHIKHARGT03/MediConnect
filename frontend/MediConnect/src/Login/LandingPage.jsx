import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (role) => {
    // Lowercase and map "Visitor" to "visitor", "Hospital" to "hospital"
    const backendRole = role === "Hospital" ? "hospital" : "visitor";
    navigate(`/${backendRole}/login`);
  };

  const handleKnowMore = (role) => {
    const backendRole = role === "Hospital" ? "hospital" : "visitor";
    navigate(`/know-more/${backendRole}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>
          <span style={styles.medi}>Medi</span>
          <span style={styles.connect}>Connect</span>
        </h1>

        <p style={styles.tagline}>Care begins with connection. Everything else follows.</p>
        <p style={styles.subTagline}>TRUST | CARE | SIMPLICITY</p>

        <div style={styles.spacer} />

        <div style={styles.boxWrapper}>
          {["Hospital", "Visitor"].map((role) => (
            <div style={styles.roleBox} key={role}>
              <div style={styles.emoji}>{role === "Hospital" ? "🏥" : "🧑‍⚕️"}</div>
              <h3 style={styles.roleTitle}>{role}</h3>
              <button
                onClick={() => handleNavigate(role)}
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#4B0082";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#4B0082";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Continue
              </button>
              <button
                onClick={() => handleKnowMore(role)}
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#4B0082";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#4B0082";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Know More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f5f5f7",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // Center vertically
    padding: "0",
    boxSizing: "border-box",
    overflow: "hidden", // Prevent scroll
  },
  content: {
    textAlign: "center",
    maxWidth: "1100px", // More compact
    margin: "0 auto",
  },
  heading: {
    fontSize: "8rem", // Slightly smaller for balance
    fontWeight: "900",
    marginBottom: "30px",
    letterSpacing: "1px",
  },
  medi: {
    color: "#C8102E",
  },
  connect: {
    color: "#4B0082",
  },
  tagline: {
    fontSize: "1.8rem",
    color: "#222",
    marginBottom: "10px",
    fontWeight: "400",
  },
  subTagline: {
    fontSize: "1.1rem",
    color: "#000",
    letterSpacing: "4px",
    fontWeight: "600",
    marginBottom: "40px",
  },
  spacer: {
    height: "20px",
  },
  boxWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap", // Cards side by side
    gap: "60px", // Consistent gap
  },
  roleBox: {
    backgroundColor: "#ffffff",
    padding: "50px 30px", // More compact
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
    width: "300px",
    transition: "all 0.3s ease",
    textAlign: "center",
  },
  emoji: {
    fontSize: "4rem",
    marginBottom: "20px",
  },
  roleTitle: {
    fontSize: "1.7rem",
    marginBottom: "25px",
    fontWeight: "700",
    color: "#000",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "2px solid #4B0082",
    backgroundColor: "#fff",
    color: "#4B0082",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
};

export default LandingPage;
