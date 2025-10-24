// src/HospitalDashboard/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Create one axios instance pointing to your backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const Home = () => {
  // ======== STATE
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======== UTIL: read login payload robustly
  const readHospitalAuth = () => {
    const keys = [
      "hospitalInfo",
      "userInfo",
      "hospital",
      "authHospital",
      "user",
    ];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const obj = JSON.parse(raw);
        if (obj && obj.hospitalId) return obj; // only use hospitalId
      } catch (_) {}
    }
    return null;
  };

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;

  // ======== MOUNT: pull hospital identity
  useEffect(() => {
    const auth = readHospitalAuth();
    if (auth) {
      setHospitalName(auth.name || "Hospital");
      setHospitalId(auth.hospitalId || "");
      setToken(auth.token || "");
    }
  }, []);

  // ======== FETCH
  const fetchBookings = async (hid) => {
    if (!hid) return;
    setLoading(true);
    try {
      const url = `/bookings/hospital/${hid}`; // absolute via API baseURL
      const { data } = await API.get(url, authHeaders);
      console.log("Fetched bookings:", data);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings for hospital:", hid, err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) fetchBookings(hospitalId);
  }, [hospitalId]);

  // ======== DERIVED COUNTS
  const { pendingCount, acceptedCount, rejectedCount } = useMemo(() => {
    const p = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "pending"
    ).length;
    const a = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "accepted"
    ).length;
    const r = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "rejected"
    ).length;
    return { pendingCount: p, acceptedCount: a, rejectedCount: r };
  }, [bookings]);

  // ======== ACTIONS
  const updateStatus = async (bookingId, newStatus) => {
    try {
      // match backend router: PUT /api/bookings/:id/status
      await API.put(
        `/bookings/${bookingId}/status`,
        { status: newStatus },
        authHeaders
      );
      await fetchBookings(hospitalId);
    } catch (err) {
      console.error(`Error updating booking ${bookingId} -> ${newStatus}`, err);
    }
  };

  // ======== HELPERS
  const niceDate = (d) => {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
  };

  // ======== STYLES
  const css = `
    .hospital-home { width: 100vw; min-height: 100vh; }
    .hero {
      min-height: 42vh; width: 100%;
      background: linear-gradient(135deg, #f5faff 0%, #eef7ff 100%);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 32px 20px;
    }
    .hero-title {
  font-weight: 800;
  text-align: center;
  font-size: 2.7rem;
  letter-spacing: 0.5px;
  margin-bottom: 3rem;   /* ⬅️ was 2.2rem, increased for breathing space */
  transform: scale(1.3); /* ⬅️ slightly reduced from 1.5 so it balances */
}
    .hero-title .hospital-name { color: #6f42c1; }
    .hero-stats {
  gap: 30px;             /* ⬅️ was 20px, more spacing between cards */
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
}
    .stat-card {
  background: #fff;
  border-radius: 16px;   /* ⬅️ was 12px, smoother look */
  padding: 28px 36px;    /* ⬅️ bigger padding */
  box-shadow: 0 8px 20px rgba(0,0,0,0.08); /* more elegant shadow */
  min-width: 220px;      /* ⬅️ was 190px, wider cards */
}
    .stat-label {
  font-weight: 700;
  font-size: 1.1rem;     /* ⬅️ was 0.95rem, more readable */
  margin-bottom: 10px;
  color: #444;
  text-align: center;
}

.stat-value {
  font-weight: 800;
  font-size: 2.2rem;     /* ⬅️ was 1.6rem, much larger numbers */
  color: #111;
  text-align: center;
}
    .pending-area {
      min-height: 65vh; width: 100%;
      background: linear-gradient(180deg, #f8f5f1 0%, #f3ede6 100%);
      padding: 28px 16px 40px;
      display: flex; flex-direction: column; align-items: center;
    }
    .pending-title {
      font-weight: 900;
      margin-bottom: 18px;
      text-align: center;
      font-size: 2.1rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      transform: scale(1.2); /* 1.2x previous size */
    }
    .req-card {
      background: #fff; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.07);
      padding: 18px; width: 100%; display: flex; align-items: stretch; justify-content: space-between; gap: 18px;
    }
    .req-left { flex: 1; }
    .info-row { margin-bottom: 6px; display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
    .info-label { font-weight: 600; color: #111; }
    .info-chip { font-weight: 400; color: #222; background: none; border-radius: 0; padding: 0; display: inline; }
    .req-actions { display: flex; flex-direction: column; gap: 10px; justify-content: center; min-width: 140px; }
    .btn-accept { background: #198754; color: #fff; border: none; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
    .btn-accept:hover { filter: brightness(0.95); }
    .btn-reject { background: #dc3545; color: #fff; border: none; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
    .btn-reject:hover { filter: brightness(0.95); }
    .gap-20 { gap: 20px; }
    @media (max-width: 768px) {
      .stat-card { min-width: 0; flex: 1; }
      .req-card { flex-direction: column; }
      .req-actions { flex-direction: row; min-width: 0; }
      .hero-title { font-size: 2rem; transform: scale(1.1); }
      .pending-title { font-size: 1.3rem; transform: scale(1.05); }
    }
  `;

  // ======== RENDER
  return (
    <div className="hospital-home">
      <style>{css}</style>

      <section className="hero container-fluid">
        <div className="container">
          <h1 className="hero-title mb-4">
            Welcome to{" "}
            <span className="hospital-name">
              {hospitalName || "Hospital Dashboard"}
            </span>
          </h1>

          <div className="hero-stats d-flex flex-wrap">
            <div className="stat-card me-3 mb-3">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{pendingCount}</div>
            </div>
            <div className="stat-card me-3 mb-3">
              <div className="stat-label">Accepted</div>
              <div className="stat-value">{acceptedCount}</div>
            </div>
            <div className="stat-card mb-3">
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{rejectedCount}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pending-area container-fluid">
        <div className="container">
          <h3 className="pending-title">Pending Requests</h3>

          {loading ? (
            <div className="text-muted">Loading requests…</div>
          ) : bookings.filter(
              (b) => (b.status || "").toLowerCase() === "pending"
            ).length === 0 ? (
            <div className="text-muted">No pending requests.</div>
          ) : (
            <div className="d-flex flex-column gap-20">
              {bookings
                .filter((b) => (b.status || "").toLowerCase() === "pending")
                .map((req) => (
                  <div className="req-card" key={req._id}>
                    <div className="req-left">
                      <div className="info-row">
                        <span className="info-label">Patient ID:</span>
                        <span className="info-chip">{req.patientId}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Type:</span>
                        <span className="info-chip">
                          {req.type === "appointment"
                            ? "Appointment"
                            : req.type === "labTest"
                            ? "Lab Test"
                            : String(req.type || "").toUpperCase()}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Department:</span>
                        <span className="info-chip">
                          {req.department || "—"}
                        </span>
                      </div>
                      {req.type === "appointment" && req.doctorName ? (
                        <div className="info-row">
                          <span className="info-label">Doctor:</span>
                          <span className="info-chip">{req.doctorName}</span>
                        </div>
                      ) : null}
                      {req.type === "labTest" && req.testName ? (
                        <div className="info-row">
                          <span className="info-label">Test:</span>
                          <span className="info-chip">{req.testName}</span>
                        </div>
                      ) : null}
                      <div className="info-row">
                        <span className="info-label">Date:</span>
                        <span className="info-chip">
                          {req.date ? niceDate(req.date) : "—"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Time:</span>
                        <span className="info-chip">{req.time || "—"}</span>
                      </div>
                    </div>

                    <div className="req-actions">
                      <button
                        className="btn-accept"
                        onClick={() => updateStatus(req.bookingId, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => updateStatus(req.bookingId, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
