import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const { role } = useParams();
  const backendRole = role === "hospital" ? "hospital" : "visitor";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({ name: fullName, email, password, role: backendRole });
      alert("Registration successful");
      navigate(`/${backendRole}/login`);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleHover = (e) => {
    e.currentTarget.style.backgroundColor = "#4B0082";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleOut = (e) => {
    e.currentTarget.style.backgroundColor = "#fff";
    e.currentTarget.style.color = "#4B0082";
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>
          <span style={styles.medi}>Medi</span>
          <span style={styles.connect}>Connect</span>
        </h1>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Create an Account</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={handleHover}
            onMouseOut={handleOut}
          >
            Register
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? {" "}
          <span
            onClick={() => navigate(`/${role}/login`)}
            style={{ ...styles.link, cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f5f5f7",
    width: "100vw",
    height: "100vh",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "6rem",
    fontWeight: "900",
    letterSpacing: "1px",
    margin: 0,
  },
  medi: {
    color: "#C8102E",
  },
  connect: {
    color: "#4B0082",
  },
  card: {
    maxWidth: "450px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "2rem",
    marginBottom: "30px",
    fontWeight: "700",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    padding: "16px",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "2px solid #4B0082",
    backgroundColor: "#fff",
    color: "#4B0082",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  linkText: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#555",
  },
  link: {
    color: "#4B0082",
    fontWeight: "600",
    textDecoration: "underline",
  },
};

export default Register;