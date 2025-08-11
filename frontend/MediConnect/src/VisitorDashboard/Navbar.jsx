// src/VisitorDashboard/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Remove tokens / session logic
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      {/* Left - Logo */}
      <div style={styles.left}>
        <Link to="/visitor/dashboard" style={styles.logo}>MediConnect</Link>
      </div>

      {/* Center - Navigation Links */}
      <div style={styles.center}>
        <Link to="/visitor/dashboard" style={{ ...styles.link, ...(location.pathname === "/visitor/dashboard" ? styles.active : {}) }}>
          Home
        </Link>
        <Link to="/visitor/book-appointment" style={{ ...styles.link, ...(location.pathname === "/visitor/book-appointment" ? styles.active : {}) }}>
          Book Appointment
        </Link>
        <Link to="/visitor/schedule" style={{ ...styles.link, ...(location.pathname === "/visitor/schedule" ? styles.active : {}) }}>
          Schedule
        </Link>
        <Link to="/visitor/records" style={{ ...styles.link, ...(location.pathname === "/visitor/records" ? styles.active : {}) }}>
          Medical Records
        </Link>
      </div>

      {/* Right - Logout */}
      <div style={styles.right}>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    width: "100vw",
    height: "70px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    position: "fixed", // changed from sticky to fixed
    top: 0,
    left: 0,
    zIndex: 999,
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#6f42c1",
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
    color: "#000000",
    fontSize: "1rem",
    fontWeight: "400",
    transition: "0.3s",
    padding: "6px 10px",
    borderRadius: "6px",
  },
  active: {
    textDecoration: "underline",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default Navbar;
