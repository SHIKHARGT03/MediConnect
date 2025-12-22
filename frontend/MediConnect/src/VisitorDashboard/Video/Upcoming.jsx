import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Upcoming = () => {
  // 🔁 TEMP DATA (will come from API later)
  const upcomingCalls = [
    {
      id: "1",
      hospital: "MediCare Multispeciality",
      doctor: "Dr. Vanessa Hansen",
      department: "General OPD",
      date: "2025-01-10",
      time: "11:30 AM",
      callStarted: false, // doctor not joined yet
    },
  ];

  if (upcomingCalls.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <h4 style={styles.emptyText}>No video calls scheduled</h4>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column gap-4">
      {upcomingCalls.map((call) => (
        <div key={call.id} style={styles.card}>
          {/* LEFT INFO */}
          <div style={styles.left}>
            <div style={styles.row}>
              <span style={styles.label}>Hospital:</span>
              <span style={styles.value}>{call.hospital}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Doctor:</span>
              <span style={styles.value}>{call.doctor}</span>
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

          {/* RIGHT ACTION */}
          <div style={styles.right}>
            {call.callStarted ? (
              <button style={styles.joinBtn}>Join Call</button>
            ) : (
              <div style={styles.waitingText}>
                Waiting for doctor to join
              </div>
            )}
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
    alignItems: "center",
    justifyContent: "center",
  },

  joinBtn: {
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    padding: "12px 26px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  waitingText: {
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
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

export default Upcoming;
