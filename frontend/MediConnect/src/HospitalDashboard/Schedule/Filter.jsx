// src/HospitalDashboard/Schedule/Filter.jsx
import React, { useEffect, useState } from "react";
import { getHospitalScheduleBookings } from "../../api/booking";
import { getPrescriptionByBooking } from "../../api/prescription";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SendPrescription from "./SendPrescription";

const BRAND = "#6f42c1";
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Filter = ({ hospitalId, token }) => {
  const [filters, setFilters] = useState({
    type: "All",
    department: "All",
    dateRange: "Today",
    patientId: "",
  });

  const [departments, setDepartments] = useState(["All"]);
  const [bookings, setBookings] = useState([]);
  const [prescriptionMap, setPrescriptionMap] = useState({});
  const [loading, setLoading] = useState(false);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [note, setNote] = useState("");

  const [sendModalBookingId, setSendModalBookingId] = useState(null);
  const [sendModalType, setSendModalType] = useState("appointment");

  // -------------------------
  // Fetch hospital departments
  // -------------------------
  useEffect(() => {
    if (!hospitalId) return;
    axios
      .get(`/api/hospitals/${hospitalId}`)
      .then((res) => {
        if (Array.isArray(res.data?.departments)) {
          const unique = [...new Set(res.data.departments)].sort();
          setDepartments(["All", ...unique]);
        }
      })
      .catch(() => setDepartments(["All"]));
  }, [hospitalId]);

  // -------------------------
  // Fetch bookings
  // -------------------------
  const fetchBookings = async () => {
    if (!hospitalId) return;
    setLoading(true);

    try {
      const data = await getHospitalScheduleBookings(
        hospitalId,
        filters,
        token
      );
      setBookings(data || []);
      await hydratePrescriptions(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setPrescriptionMap({});
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Fetch prescriptions per booking
  // -------------------------
  const hydratePrescriptions = async (bookingsList) => {
    const map = {};

    await Promise.all(
      bookingsList.map(async (b) => {
        try {
          const pres = await getPrescriptionByBooking(b.bookingId);
          map[b.bookingId] = pres;
        } catch {
          // 404 = no prescription → ignore
        }
      })
    );

    setPrescriptionMap(map);
  };

  useEffect(() => {
    fetchBookings();
  }, [hospitalId, filters]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleApplyFilters = () => fetchBookings();

  const openSendModal = (booking) => {
    setSendModalBookingId(booking.bookingId);
    setSendModalType(booking.type || "appointment");
  };

  const closeSendModal = () => setSendModalBookingId(null);

  const handleAfterSendSuccess = (prescription) => {
    if (!prescription?.bookingId) return;

    setPrescriptionMap((prev) => ({
      ...prev,
      [prescription.bookingId]: prescription,
    }));

    closeSendModal();
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="container-fluid py-5" style={{ background: "#f9fbff" }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-5">
          Scheduled Appointments
        </h2>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 justify-content-center mb-5 bg-white p-3 rounded shadow-sm">
          <Form.Select name="type" value={filters.type} onChange={handleFilterChange} style={{ width: 180 }}>
            <option value="All">All Types</option>
            <option value="appointment">Doctor Appointment</option>
            <option value="labTest">Lab Test</option>
          </Form.Select>

          <Form.Select name="department" value={filters.department} onChange={handleFilterChange} style={{ width: 180 }}>
            {departments.map((d) => (
              <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
            ))}
          </Form.Select>

          <Form.Select name="dateRange" value={filters.dateRange} onChange={handleFilterChange} style={{ width: 180 }}>
            <option value="Today">Today</option>
            <option value="Last7Days">Last 7 Days</option>
            <option value="Last30Days">Last 30 Days</option>
            <option value="Last3Months">Last 3 Months</option>
          </Form.Select>

          <Form.Control
            name="patientId"
            placeholder="Search by Patient ID"
            value={filters.patientId}
            onChange={handleFilterChange}
            style={{ width: 240 }}
          />

          <Button style={{ background: BRAND, border: "none" }} onClick={handleApplyFilters}>
            Apply
          </Button>
        </div>

        {/* Booking Cards */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center">No scheduled appointments.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow:
                  "0 4px 18px rgba(111,66,193,0.07), 0 1.5px 6px #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                padding: "28px 32px",
                marginBottom: "28px",
                gap: "24px",
                minHeight: "140px",
                maxWidth: 900,
                margin: "0 auto 28px auto",
              }}
            >
              {/* Left: Info */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Patient: </span>
                  <span style={{ color: "#222" }}>{booking.patientId}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Type: </span>
                  <span style={{ color: "#222" }}>
                    {booking.type === "appointment" ? "Doctor Appointment" : "Lab Test"}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Department: </span>
                  <span style={{ color: "#222" }}>{booking.department || "-"}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Date: </span>
                  <span style={{ color: "#222" }}>{booking.date}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#222" }}>Time: </span>
                  <span style={{ color: "#222" }}>{booking.time}</span>
                </div>
              </div>

              {/* Right: Button */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "14px",
                  minWidth: "170px",
                }}
              >
                {prescriptionMap[booking.bookingId] ? (
                  <button
                    onClick={async () => {
                      const pres = prescriptionMap[booking.bookingId];
                      const url = pres?.fileUrl || pres?.secure_url;
                      const isLab = booking.type === "labTest";
                      if (pres?.fileType === "pdf") {
                        try {
                          const resp = await axios.get(
                            `${API_BASE}/api/prescription/signed/${booking.bookingId}`
                          );
                          const signed = resp?.data?.url || url;
                          if (signed) window.open(signed, "_blank", "noopener,noreferrer");
                          else if (url) window.open(url, "_blank", "noopener,noreferrer");
                          else window.open(`${API_BASE}/api/prescription/file/${booking.bookingId}`, "_blank", "noopener,noreferrer");
                        } catch (err) {
                          if (url) window.open(url, "_blank", "noopener,noreferrer");
                          else window.open(`${API_BASE}/api/prescription/file/${booking.bookingId}`, "_blank", "noopener,noreferrer");
                        }
                      } else {
                        if (url) window.open(url, "_blank", "noopener,noreferrer");
                        else window.open(`${API_BASE}/api/prescription/file/${booking.bookingId}`, "_blank", "noopener,noreferrer");
                      }
                    }}
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 22px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "6px",
                      boxShadow: "0 2px 8px rgba(40,167,69,0.09)",
                      cursor: "pointer",
                    }}
                  >
                    {booking.type === "appointment" ? "View Prescription" : "View Lab Report"}
                  </button>
                ) : (
                  <button
                    onClick={() => openSendModal(booking)}
                    style={{
                      background: BRAND,
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 22px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "6px",
                      boxShadow: "0 2px 8px rgba(111,66,193,0.09)",
                      cursor: "pointer",
                    }}
                  >
                    {booking.type === "appointment" ? "Send Prescription" : "Send Lab Report"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Send Prescription */}
      <SendPrescription
        bookingId={sendModalBookingId}
        open={!!sendModalBookingId}
        onClose={closeSendModal}
        onSuccess={handleAfterSendSuccess}
        token={token}
        type={sendModalType}
      />
    </div>
  );
};

export default Filter;
