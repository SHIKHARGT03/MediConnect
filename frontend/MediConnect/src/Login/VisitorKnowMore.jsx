import React from "react";
import { useNavigate } from "react-router-dom";

const VistorKnowMore = () => {
  const navigate = useNavigate();

  const handleHeroCTA = () => {
    navigate("/visitor/login");
  };

  const handleVideoCTA = () => {
    navigate("/visitor/register");
  };

  const handleFinalCTA = () => {
    navigate("/visitor/login");
  };


  return (
    <div>
      {/* Hero Section */}
      <div style={styles.heroContainer}>
        <div style={styles.overlay}>
          <div style={styles.rightContent}>
            <h1 style={styles.introLine}>
              <span>
                <span style={styles.medi}>Medi</span>
                <span style={styles.connect}>Connect</span>
              </span>
            </h1>
            <h2 style={styles.subHeading}>Skip The Q</h2>
            <p style={styles.description}>
              No more long waiting hours. Book your hospital or lab appointments from home in seconds.
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
              Book Your First Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Digital Records Section */}
      <div style={styles.recordsSection}>
        <div style={styles.imageContainer}>
          <img src="/Know/1.jpg" alt="Medical Records" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Say Goodbye to Lost Prescriptions!</h1>
          <p style={styles.recordsSubtext}>
            All your medical history — prescriptions, test reports, discharge summaries — digitally synced from hospitals and labs.
          </p>
          <p style={styles.recordsSubtext}>
            No paper files. No chaos. Just instant, secure access to everything — right at your fingertips.
          </p>
        </div>
      </div>

      {/* AI Understanding Section */}
      <div style={{ ...styles.recordsSection, flexDirection: "row-reverse" }}>
        <div style={styles.imageContainer}>
          <img src="/Know/2.jpg" alt="AI Understanding" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Finally, You Can Read What Your Doctor Writes.</h1>
          <p style={styles.recordsSubtext}>
            Don’t just store your health data. Understand it. Get AI-generated insights, average ranges, and warnings in human-readable form.
          </p>
          <p style={styles.recordsSubtext}>
            From summarizing prescriptions to highlighting unusual values in your test reports, MediConnect’s AI is like having a health translator in your pocket.
          </p>
        </div>
      </div>

      {/* Video Consultation Section */}
      <div style={styles.recordsSection}>
        <div style={styles.imageContainer}>
          <img src="/Know/3.jpg" alt="Video Consultation" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>Bringing Clinics to Your Couch.</h1>
          <p style={{ ...styles.recordsSubtext, paddingBottom: "20px" }}>
            Book instant video consultations with doctors across specializations. No travel, no wait.
          </p>
          <p style={{ ...styles.recordsSubtext, paddingBottom: "30px" }}>
            Secure, convenient, and just a few clicks away — experience healthcare reimagined for your comfort.
          </p>
          <button
            style={styles.button}
            onClick={handleVideoCTA}
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
            Book Your First Video Appointment
          </button>
        </div>
      </div>

      {/* Smart Notification Section */}
      <div style={{ ...styles.recordsSection, flexDirection: "row-reverse" }}>
        <div style={styles.imageContainer}>
          <img src="/Know/4.jpg" alt="Reminders & Calendar" style={styles.image} />
        </div>
        <div style={styles.textContainer}>
          <h1 style={styles.recordsHeading}>We Remember, So You Don’t Have To</h1>
          <p style={styles.recordsSubtext}>
            MediConnect keeps track of your past and upcoming appointments in one organized, digital calendar.
          </p>
          <p style={styles.recordsSubtext}>
            You get reminders, summaries, and peace of mind — no missed checkups or follow-ups.
          </p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={styles.finalCTAContainer}>
        <div style={styles.finalCTAText}>
          <h2 style={styles.finalCTATitle}>No More Lines. No More Guesswork. Just Smart, Seamless Care.</h2>
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
            Your MediConnect Journey Starts Here
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
    backgroundImage: `url("/Know/bg3.jpg")`,
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
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    height: "100%",
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px 80px 60px",
    boxSizing: "border-box",
  },
  rightContent: {
    maxWidth: "600px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  introLine: {
    fontSize: "5.5rem",
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    lineHeight: "1",
  },
  withText: {
    color: "#000",
    fontWeight: "900",
  },
  medi: {
    color: "#C8102E",
    fontWeight: "900",
  },
  connect: {
    color: "#4B0082",
    fontWeight: "900",
  },
  subHeading: {
    fontSize: "2.4rem",
    fontWeight: "700",
    color: "#000",
  },
  description: {
    fontSize: "1.3rem",
    color: "#000",
    fontWeight: "400",
    lineHeight: "1.6",
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

export default VistorKnowMore;


