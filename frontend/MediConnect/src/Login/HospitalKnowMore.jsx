import React from "react";
import { useNavigate } from "react-router-dom";

const HospitalKnowMore = () => {
  const navigate = useNavigate();

  const handleHeroCTA = () => {
    navigate("/hospital/login");
  };

  const handleFinalCTA = () => {
    navigate("/hospital/login");
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.heroContainer}>
        <div style={styles.overlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.titleLine}>
              <span style={styles.medi}>Medi</span>
              <span style={styles.connect}>Connect</span>
            </h1>
            <h2 style={styles.heroTagline}>Smart Hospitals Start Here.</h2>
            <p style={styles.heroSubtext}>
              Smarter workflows. Instant sharing. AI support. Everything a modern hospital needs to save time and deliver better care.
            </p>
            <button
              style={styles.button}
              onClick={handleHeroCTA}
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
              Login to Hospital Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div style={styles.recordsSection}>
        <div style={styles.imageContainer}>
          <img src="/Know/A.jpg" alt="Less Waiting" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Less Waiting, More Healing</h1>
          <p style={styles.recordsSubtext}>
            Deliver a smoother consultation experience with better planning, fewer surprises, and no waiting room chaos.
          </p>
          <p style={styles.recordsSubtext}>
            Transform your daily operations with automated scheduling that reduces stress for both doctors and patients.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div style={{ ...styles.recordsSection, flexDirection: "row-reverse" }}>
        <div style={styles.imageContainer}>
          <img src="/Know/B.jpg" alt="Predictive Care" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Predictive Care That Saves Lives</h1>
          <p style={styles.recordsSubtext}>
            AI analyzes lab data—even when non-diagnostic—to predict trends and flag risks early.
          </p>
          <p style={styles.recordsSubtext}>
            Doctors get instant clinical insights, personalized summaries, and alerts before conditions escalate.
          </p>
        </div>
      </div>

      {/* Section 4 */}
      <div style={styles.recordsSection}>
        <div style={styles.imageContainer}>
          <img src="/Know/C.jpg" alt="Video Consult" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Consult Beyond Walls</h1>
          <p style={styles.recordsSubtext}>
            Bring expert care with smart scheduling and instant access to any location.
          </p>
          <p style={styles.recordsSubtext}>
            Enable efficient virtual checkups, handle emergencies faster with every consultation, prescription, and update — managed digitally and securely.
          </p>
        </div>
      </div>

      {/* Section 5 */}
      <div style={{ ...styles.recordsSection, flexDirection: "row-reverse" }}>
        <div style={styles.imageContainer}>
          <img src="/Know/D.jpg" alt="Data Security" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Guardians of Care</h1>
          <p style={styles.recordsSubtext}>
            Deliver reports, prescriptions, and updates securely with built-in follow-up support.
          </p>
          <p style={styles.recordsSubtext}>
            Your hospital’s data is locked tight—yet always accessible to the right people.
          </p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={styles.finalCTAContainer}>
        <div style={styles.finalCTAText}>
          <h2 style={styles.finalCTATitle}>
            Let Us Handle the Hustle, You Handle the Healing.
          </h2>
        </div>
        <div style={styles.finalCTAButtonWrapper}>
          <button
            style={styles.finalCTAButton}
            onClick={handleFinalCTA}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4B0082";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#4B0082";
            }}
          >
            Access Hospital Panel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroContainer: {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url("/Know/bg1.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    overflowX: "hidden",
    marginTop: "0",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    height: "100%",
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "60px 40px 80px 60px",
    boxSizing: "border-box",
  },
  heroContent: {
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  titleLine: {
    fontSize: "5.5rem",
    fontWeight: "900",
    lineHeight: "1",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  medi: {
    color: "#C8102E",
    fontWeight: "900",
  },
  connect: {
    color: "#4B0082",
    fontWeight: "900",
  },
  heroTagline: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#000",
    lineHeight: "1.3",
  },
  heroSubtext: {
    fontSize: "1.3rem",
    fontWeight: "400",
    color: "#222",
    lineHeight: "1.8",
    maxWidth: "92%",
  },
  button: {
    padding: "18px 36px",
    fontSize: "1.3rem",
    fontWeight: "600",
    border: "2px solid #4B0082",
    borderRadius: "14px",
    backgroundColor: "#fff",
    color: "#4B0082",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    alignSelf: "flex-start",
  },
  recordsSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "70vh",
    backgroundColor: "#fff",
    padding: "50px 70px",
    boxSizing: "border-box",
    gap: "50px",
  },
  imageContainer: {
    flex: "0 0 40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
  textContainer: {
    flex: "0 0 60%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  recordsHeading: {
    fontSize: "3.5rem",
    color: "#4B0082",
    fontWeight: "900",
    marginBottom: "30px",
  },
  recordsSubtext: {
    fontSize: "1.65rem",
    color: "#222",
    lineHeight: "1.8",
    marginBottom: "16px",
    maxWidth: "92%",
  },
  finalCTAContainer: {
    height: "25vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 70px",
    boxSizing: "border-box",
    flexWrap: "wrap",
  },
  finalCTAText: {
    flex: "1",
  },
  finalCTATitle: {
    color: "#fff",
    fontSize: "2.4rem",
    fontWeight: "700",
    margin: 0,
  },
  finalCTAButtonWrapper: {
    flex: "0 0 auto",
  },
  finalCTAButton: {
    padding: "16px 32px",
    fontSize: "1.2rem",
    fontWeight: "600",
    border: "2px solid #4B0082",
    borderRadius: "12px",
    backgroundColor: "#fff",
    color: "#4B0082",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
};

export default HospitalKnowMore;
