import React from "react";

const SuccessNotice = ({ open, title, message, onClose, type = "success" }) => {
  if (!open) return null;

  const isError = type === "error";

  return (
    <div style={styles.overlay}>
      <div
        style={{
          ...styles.card,
          border: isError ? "1px solid #fecaca" : "1px solid #e5e7eb",
        }}
      >
        <div style={{ ...styles.title, color: isError ? "#b91c1c" : "#111827" }}>
          {title}
        </div>
        {message ? <div style={styles.message}>{message}</div> : null}
        <button
          onClick={onClose}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5b21b6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6f42c1";
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 24, 39, 0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2200,
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.18)",
    padding: "24px 24px 20px",
    minWidth: "320px",
    maxWidth: "430px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: 700,
    marginBottom: "8px",
  },
  message: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "16px",
    lineHeight: 1.5,
  },
  button: {
    backgroundColor: "#6f42c1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default SuccessNotice;
