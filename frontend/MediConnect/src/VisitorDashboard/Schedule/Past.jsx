import React, { useEffect, useMemo, useState } from "react";
import { getPastBookingsForPatient, createFollowUpBooking } from "../../api/booking";
import axios from "axios";
import SuccessNotice from "../../components/SuccessNotice";

const BRAND = "#6f42c1";
const RED = "#dc3545";
const GRADIENT = "linear-gradient(180deg, #f8f9fa 0%, #ececec 100%)";
const API_BASE = "http://localhost:5000";

const Past = ({ patientId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpLoading, setFollowUpLoading] = useState(null);
  const [hospitalNames, setHospitalNames] = useState({});
  const [typeFilter, setTypeFilter] = useState("all");
  const [hospitalFilter, setHospitalFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchDate, setSearchDate] = useState("");
  const [submittedSearchDate, setSubmittedSearchDate] = useState("");

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    getPastBookingsForPatient(patientId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    const idsToFetch = bookings
      .map((b) => b.hospitalId)
      .filter((id) => id && !hospitalNames[id]);

    if (!idsToFetch.length) return;

    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/api/hospitals/${id}`);
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch {
        setHospitalNames((prev) => ({ ...prev, [id]: "Unknown Hospital" }));
      }
    });
  }, [bookings, hospitalNames]);

  const hospitalOptions = useMemo(() => {
    const uniqueHospitals = [...new Set(bookings.map((b) => b.hospitalId).filter(Boolean))];
    return uniqueHospitals.map((id) => ({ value: id, label: hospitalNames[id] || id }));
  }, [bookings, hospitalNames]);

  const departmentOptions = useMemo(() => {
    return [...new Set(bookings.map((b) => b.department).filter(Boolean))].sort();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const parseBookingDate = (value) => {
      if (!value) return null;
      const normalized = value.includes("-") ? value : value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
      const parsed = new Date(normalized);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const getDateBoundary = (range) => {
      const boundary = new Date(now);
      if (range === "week") boundary.setDate(now.getDate() - 7);
      if (range === "month") boundary.setMonth(now.getMonth() - 1);
      if (range === "3months") boundary.setMonth(now.getMonth() - 3);
      if (range === "6months") boundary.setMonth(now.getMonth() - 6);
      return boundary;
    };

    return bookings.filter((booking) => {
      const bookingDate = parseBookingDate(booking.date);
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "appointment" && booking.type === "appointment") ||
        (typeFilter === "labTest" && booking.type === "labTest");
      const matchesHospital = hospitalFilter === "all" || booking.hospitalId === hospitalFilter;
      const matchesDepartment = departmentFilter === "all" || booking.department === departmentFilter;
      const matchesDateRange =
        dateFilter === "all" ||
        (bookingDate && bookingDate >= getDateBoundary(dateFilter) && bookingDate <= now);
      const matchesSearchDate =
        !submittedSearchDate ||
        (bookingDate && parseBookingDate(submittedSearchDate)?.toDateString() === bookingDate.toDateString());

      return matchesType && matchesHospital && matchesDepartment && matchesDateRange && matchesSearchDate;
    });
  }, [bookings, dateFilter, departmentFilter, hospitalFilter, submittedSearchDate, typeFilter]);

  const handleViewPrescription = async (bookingId) => {
    try {
      setPrescriptionError("");
      const res = await axios.get(`${API_BASE}/api/prescription/${bookingId}`, { withCredentials: true });

      setActivePrescription(res.data);
      setShowPrescriptionModal(true);
      window.open(`${API_BASE}/api/prescription/file/${bookingId}`, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Error fetching prescription:", err);
      setPrescriptionError("Prescription has not been sent by the hospital yet.");
      setShowPrescriptionModal(true);
    }
  };

  const isFollowUpEligible = (bookingDate) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const parsedDate = new Date(`${bookingDate}T00:00:00`);
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 7);
    return parsedDate >= sevenDaysAgo && parsedDate <= startOfToday;
  };

  const handleFollowUp = async (booking) => {
    if (!isFollowUpEligible(booking.date)) {
      setNoticeTitle("Follow-up unavailable");
      setNoticeMessage("Follow-up requests are available only for visits from the last 7 days.");
      setNoticeOpen(true);
      return;
    }

    try {
      setFollowUpLoading(booking.bookingId);
      const res = await createFollowUpBooking(booking.bookingId);
      setNoticeTitle("Follow-up request created");
      setNoticeMessage(`Follow-up scheduled for ${new Date(res?.booking?.date || booking.date).toLocaleDateString()}. Booking ID: ${res?.booking?.bookingId || booking.bookingId}`);
      setNoticeOpen(true);
    } catch {
      setNoticeTitle("Follow-up failed");
      setNoticeMessage("We could not create the follow-up request right now.");
      setNoticeOpen(true);
    } finally {
      setFollowUpLoading(null);
    }
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    setSubmittedSearchDate(searchDate);
  };

  return (
    <div style={{ background: GRADIENT, padding: "60px 0 40px", minHeight: "40vh" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800, color: "#222", marginBottom: "24px" }}>
        Your Past Visits Records
      </h2>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 18px rgba(111,66,193,0.07)",
            padding: "18px 20px",
            marginBottom: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "14px",
          }}
        >
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#555", display: "block", marginBottom: "6px" }}>
              Type
            </label>
            <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="appointment">Doctor Appointment</option>
              <option value="labTest">Lab Test</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#555", display: "block", marginBottom: "6px" }}>
              Hospital
            </label>
            <select className="form-select" value={hospitalFilter} onChange={(e) => setHospitalFilter(e.target.value)}>
              <option value="all">All</option>
              {hospitalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#555", display: "block", marginBottom: "6px" }}>
              Department
            </label>
            <select className="form-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="all">All</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#555", display: "block", marginBottom: "6px" }}>
              Date
            </label>
            <select className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#555", display: "block", marginBottom: "6px" }}>
              Specific Date
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="form-control"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
              <button className="btn btn-outline-primary" onClick={handleSearchClick} type="button">
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" />
          </div>
        ) : !filteredBookings.length ? (
          <div className="text-center my-4">
            <h5>No past visits match the selected filters</h5>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.bookingId}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 4px 18px rgba(111,66,193,0.07), 0 1.5px 6px #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                padding: "28px 32px",
                marginBottom: "28px",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div><b>Type:</b> {booking.type === "appointment" ? "Doctor Appointment" : "Lab Test"}</div>
                <div><b>Hospital:</b> {hospitalNames[booking.hospitalId] || "-"}</div>
                <div><b>Department:</b> {booking.department || "-"}</div>
                <div><b>Date:</b> {new Date(booking.date).toLocaleDateString()}</div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: "220px",
                }}
              >
                <button
                  style={{
                    background: BRAND,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 700,
                  }}
                  onClick={() => handleViewPrescription(booking.bookingId)}
                >
                  {booking.type === "appointment" ? "View Prescription" : "View Lab Report"}
                </button>

                {isFollowUpEligible(booking.date) ? (
                  <button
                    style={{
                      background: RED,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 18px",
                      fontWeight: 700,
                      opacity: followUpLoading === booking.bookingId ? 0.7 : 1,
                    }}
                    onClick={() => handleFollowUp(booking)}
                    disabled={followUpLoading === booking.bookingId}
                  >
                    Follow Up
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <SuccessNotice
        open={noticeOpen}
        title={noticeTitle}
        message={noticeMessage}
        onClose={() => setNoticeOpen(false)}
      />

      {showPrescriptionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowPrescriptionModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: 420,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ marginBottom: 12 }}>🩺 Doctor’s Note</h5>

            {prescriptionError ? (
              <p style={{ color: "#555" }}>{prescriptionError}</p>
            ) : activePrescription?.note ? (
              <p style={{ color: "#333", lineHeight: 1.5 }}>{activePrescription.note}</p>
            ) : (
              <p style={{ color: "#777" }}>No note provided by doctor.</p>
            )}

            <button
              style={{
                marginTop: 16,
                background: BRAND,
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 8,
                float: "right",
              }}
              onClick={() => setShowPrescriptionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Past;
