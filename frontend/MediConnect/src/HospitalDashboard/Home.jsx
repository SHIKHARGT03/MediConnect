// src/HospitalDashboard/Home.jsx
import React, { useEffect, useState } from "react";
import { getBookingsForHospital, updateBookingStatus } from "../api/booking";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const hospitalId = localStorage.getItem("hospitalId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital name
        const hospitalRes = await axios.get(`/api/hospitals/${hospitalId}`);
        setHospitalName(hospitalRes.data.name);

        // Fetch bookings for this hospital
        const requestsRes = await getBookingsForHospital(hospitalId);
        // Only show pending requests
        setPendingRequests(requestsRes.data.filter((req) => req.status === "Pending"));
      } catch (error) {
        console.error("Error fetching hospital data or requests:", error);
      }
    };
    fetchData();
  }, [hospitalId]);

  const handleStatusChange = async (requestId, status) => {
    try {
      await updateBookingStatus(requestId, status);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-light py-4 text-center">
        <h2 className="fw-bold">Welcome to {hospitalName}</h2>
      </div>

      {/* Main Section */}
      <div className="container mt-5">
        <h4 className="mb-4 fw-semibold">Pending Appointment & Lab Test Requests</h4>

        {pendingRequests.length === 0 ? (
          <div className="text-center text-muted py-5">No booking requests at the moment.</div>
        ) : (
          <div className="row g-4">
            {pendingRequests.map((req) => (
              <div className="col-md-6" key={req._id}>
                <div className="card shadow p-3">
                  <div className="card-body">
                    <p><strong>Patient ID:</strong> {req.patientId?.name || req.patientId}</p>
                    <p><strong>Department:</strong> {req.department}</p>
                    <p><strong>Type:</strong> {req.type}</p>
                    {req.type === "LabTest" ? (
                      <p><strong>Test Name:</strong> {req.testName}</p>
                    ) : (
                      <p><strong>Doctor:</strong> {req.doctorId?.name || req.doctorId}</p>
                    )}
                    <p><strong>Date:</strong> {req.date}</p>
                    <p><strong>Time Slot:</strong> {req.slot}</p>
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleStatusChange(req._id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStatusChange(req._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
