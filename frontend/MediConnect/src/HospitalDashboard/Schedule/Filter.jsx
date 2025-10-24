// src/HospitalDashboard/Schedule/Filter.jsx
import React, { useEffect, useState } from "react";
import { getHospitalScheduleBookings } from "../../api/booking";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios"; // Add this import

const BRAND = "#6f42c1";

const Filter = ({ hospitalId, token }) => {
  const [filters, setFilters] = useState({
    type: "All",
    department: "All",
    dateRange: "Today", // default to Today
    patientId: "",
  });

  const [departments, setDepartments] = useState(["All"]); // Add this state
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [note, setNote] = useState("");

  // Fetch hospital departments dynamically
  useEffect(() => {
    if (!hospitalId) return;
    axios
      .get(`/api/hospitals/${hospitalId}`)
      .then((res) => {
        // Use all departments from hospital data, including unique ones
        if (res.data && Array.isArray(res.data.departments)) {
          // Remove duplicates and sort alphabetically
          const uniqueDepts = Array.from(new Set(res.data.departments)).sort();
          setDepartments(["All", ...uniqueDepts]);
        } else {
          setDepartments(["All"]);
        }
      })
      .catch(() => setDepartments(["All"]));
  }, [hospitalId]);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    if (!hospitalId) return;
    setLoading(true);
    try {
      const data = await getHospitalScheduleBookings(hospitalId, filters, token);
      if (filters.dateRange === "Today" && Array.isArray(data) && data.length === 0) {
        // fallback to last 7 days if today is empty
        const fallbackFilters = { ...filters, dateRange: "Last7Days" };
        const fallbackData = await getHospitalScheduleBookings(hospitalId, fallbackFilters, token);
        setBookings(fallbackData);
      } else {
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching hospital bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [hospitalId, filters]); // refetch when filters change

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchBookings();
  };

  const handleAddNote = (booking) => {
    setSelectedBooking(booking);
    setNote("");
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    console.log("Note saved for booking:", selectedBooking._id, note);
    setShowNoteModal(false);
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundColor: "#f9fbff",
        width: "100%",
        minHeight: "70vh",
      }}
    >
      <div className="container">
        {/* Heading */}
        <h2
          className="fw-bold text-center mb-5"
          style={{ color: "#000", letterSpacing: "0.5px" }}
        >
          Scheduled Appointments
        </h2>

        {/* Filters */}
        <div
          className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-5"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "15px 20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          {/* Type */}
          <Form.Select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            style={{ width: "180px" }}
          >
            <option value="All">All Types</option>
            <option value="appointment">Doctor Appointment</option>
            <option value="labTest">Lab Test</option>
          </Form.Select>

          {/* Department */}
          <Form.Select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            style={{ width: "180px" }}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
            ))}
          </Form.Select>

          {/* Date Range */}
          <Form.Select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            style={{ width: "180px" }}
          >
            <option value="Today">Today</option>
            <option value="Last7Days">Last 7 Days</option>
            <option value="Last30Days">Last 30 Days</option>
            <option value="Last3Months">Last 3 Months</option>
          </Form.Select>

          {/* Patient Search */}
          <Form.Control
            type="text"
            name="patientId"
            value={filters.patientId}
            onChange={handleFilterChange}
            placeholder="Search by Patient ID"
            style={{ width: "240px" }}
          />

          <Button
            variant="primary"
            onClick={handleApplyFilters}
            style={{
              backgroundColor: BRAND,
              border: "none",
              padding: "6px 20px",
            }}
          >
            Apply
          </Button>
        </div>

        {/* Bookings List */}
        <div className="row justify-content-center">
          {loading ? (
            <p className="text-center text-muted mt-5">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-muted mt-5">
              No scheduled appointments found.
            </p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="col-md-10 col-lg-8 mb-4"
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 4px 18px rgba(111,66,193,0.07), 0 1.5px 6px #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    padding: "28px 32px",
                    marginBottom: "28px",
                    gap: "24px",
                    minHeight: "140px",
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
                      <span style={{ fontWeight: 700, color: "#222", fontSize: "1.05rem" }}>Patient: </span>
                      <span style={{ color: "#222", fontSize: "1.05rem" }}>
                        {booking.patientName || booking.patientId}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#222", fontSize: "1.05rem" }}>Type: </span>
                      <span style={{ color: "#222", fontSize: "1.05rem" }}>
                        {booking.type === "appointment" ? "Doctor Appointment" : "Lab Test"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#222", fontSize: "1.05rem" }}>Department: </span>
                      <span style={{ color: "#222", fontSize: "1.05rem" }}>
                        {booking.department || "-"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#222", fontSize: "1.05rem" }}>Date: </span>
                      <span style={{ color: "#222", fontSize: "1.05rem" }}>
                        {booking.date}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: "#222", fontSize: "1.05rem" }}>Time: </span>
                      <span style={{ color: "#222", fontSize: "1.05rem" }}>
                        {booking.time}
                      </span>
                    </div>
                  </div>

                  {/* Right: Buttons */}
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
                    <button
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
                      {booking.type === "appointment"
                        ? "Send Prescription"
                        : "Send Lab Report"}
                    </button>
                    <button
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 22px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        boxShadow: "0 2px 8px rgba(220,53,69,0.09)",
                        cursor: "pointer",
                      }}
                      onClick={() => handleAddNote(booking)}
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal show={showNoteModal} onHide={() => setShowNoteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoteModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: BRAND, border: "none" }}
            onClick={handleSaveNote}
          >
            Save Note
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Filter;
