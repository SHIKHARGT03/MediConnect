import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { role } = useParams();
  const backendRole = role === "hospital" ? "hospital" : "visitor";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const { data } = await loginUser({ ...form, role: backendRole });
      console.log("Login success:", data);
      navigate(`/${backendRole}/dashboard`);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        <span style={styles.medi}>Medi</span>
        <span style={styles.connect}>Connect</span>
      </h1>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button style={styles.button} onClick={handleLogin}>Login</button>
        <p>
          Don’t have an account? {" "}
          <Link to={`/${backendRole}/register`} style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw", height: "100vh", backgroundColor: "#f5f5f7",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  heading: {
    fontSize: "6rem", fontWeight: "900", marginBottom: "50px", letterSpacing: "1px",
  },
  medi: { color: "#C8102E" },
  connect: { color: "#4B0082" },
  card: {
    backgroundColor: "#fff", padding: "60px", borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)", width: "400px", textAlign: "center",
  },
  title: {
    fontSize: "2.5rem", marginBottom: "40px", fontWeight: "700", color: "#000",
  },
  input: {
    width: "100%", padding: "16px", marginBottom: "20px",
    borderRadius: "10px", border: "2px solid #ccc",
    backgroundColor: "#fff", color: "#000", fontSize: "1rem",
  },
  button: {
    width: "100%", padding: "14px", fontSize: "1.1rem", fontWeight: "600",
    borderRadius: "12px", border: "2px solid #4B0082", backgroundColor: "#fff", color: "#4B0082",
    cursor: "pointer", transition: "all 0.3s",
  },
  link: {
    color: "#4B0082", textDecoration: "underline", fontWeight: "600",
  },
};

export default Login;
