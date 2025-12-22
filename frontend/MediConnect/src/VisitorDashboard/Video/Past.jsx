import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Past = () => {
  // 🚫 No dummy data
  // This will be populated only from backend later:
  // type === "videoConsultation" && status === "completed"
  const pastCalls = [];

  if (pastCalls.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>No past video consultations</h4>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column gap-4">
      {pastCalls.map((call) => (
        <div key={call._id} style={styles.card}>
          {/* LEFT INFO */}
          <div style={styles.left}>
            <div style={styles.row}>
              <span style={styles.label}>Hospital:</span>
              <span style={styles.value}>{call.hospitalName}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Doctor:</span>
              <span style={styles.value}>{call.doctorName}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Department:</span>
              <span style={styles.value}>{call.department}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Date:</span>
              <span style={styles.value}>{call.date}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Time:</span>
              <span style={styles.value}>{call.time}</span>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div style={styles.right}>
            <button style={styles.prescriptionBtn}>
              View Prescription
            </button>
            <button style={styles.followUpBtn}>
              Follow Up
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  row: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  label: {
    fontWeight: "700",
    color: "#000",
  },

  value: {
    fontWeight: "400",
    color: "#000",
  },

  right: {
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
  },

  prescriptionBtn: {
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    width: "100%",
    cursor: "pointer",
  },

  followUpBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    width: "100%",
    cursor: "pointer",
  },

  emptyWrapper: {
    height: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontWeight: "600",
    color: "#666",
  },
};

export default Past;
