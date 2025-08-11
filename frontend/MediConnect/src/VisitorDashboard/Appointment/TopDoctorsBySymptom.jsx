import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TopDoctorsBySymptom = () => {
  const { symptomName } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctors/top-doctors/${encodeURIComponent(symptomName)}`
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching top doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [symptomName]);

  const calculateFee = (experience) => {
    if (experience >= 20) return 1000;
    if (experience >= 15) return 850;
    if (experience >= 10) return 700;
    return 500;
  };

  const handleBook = (hospitalId, doctorId) => {
    navigate(`/appointment/hospital/${hospitalId}/doctor/${doctorId}`);
  };

  // Map doctor index to image file
  const getDoctorImage = (index) => {
    const images = ["A.jpg", "B.jpg", "C.jpg"];
    return `/Hospitals/${images[index % 3]}`;
  };

  return (
    <div style={{ 
      padding: 0, 
      margin: 0, 
      width: "100vw", 
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      maxWidth: "100%",
      overflowX: "hidden",
      position: "relative",
      left: 0,
      right: 0
    }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "#e6f2ff",
          padding: "60px 20px",
          textAlign: "center",
          marginBottom: "50px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem", color: "#2c3e50" }}>
          Top Doctors for "{symptomName}"
        </h2>
        <p className="text-muted" style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
          Explore highly experienced specialists from verified hospitals.
        </p>
      </div>

      {/* Content Container */}
      <div style={{ width: "100%", padding: "0 20px" }}>
        {/* Doctors Grid or Empty State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading top doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-exclamation-circle" style={{ fontSize: "3rem" }}></i>
            <p className="mt-3" style={{ fontSize: "1.2rem" }}>
              No top doctors found for this symptom. Please try other symptoms or check back later.
            </p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center" style={{ margin: 0, width: "100%" }}>
            {doctors.map((doc, index) => (
              <div className="col-md-6 col-lg-4" key={doc._id} style={{ paddingBottom: "20px" }}>
                <div
                  className="card shadow h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    border: "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 123, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Doctor Image */}
                  <div style={{ 
                    height: "200px", 
                    overflow: "hidden", 
                    backgroundColor: "#f0f8ff" 
                  }}>
                    <img 
                      src={getDoctorImage(index)} 
                      alt={`Dr. ${doc.name}`} 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        objectPosition: "center top"
                      }} 
                    />
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>{doc.name}</h4>
                    <div className="d-flex flex-column gap-2">
                      <p className="mb-1" style={{ color: "#495057" }}>
                        <span className="badge bg-light text-primary me-2">🏥</span>
                        <strong>Hospital:</strong> {doc.hospitalId.name}
                      </p>
                      <p className="mb-1" style={{ color: "#495057" }}>
                        <span className="badge bg-light text-primary me-2">🧠</span>
                        <strong>Department:</strong> {doc.department}
                      </p>
                      <p className="mb-1" style={{ color: "#495057" }}>
                        <span className="badge bg-light text-primary me-2">🎓</span>
                        <strong>Experience:</strong> {doc.experience} Years
                      </p>
                      <p className="mb-2" style={{ color: "#495057" }}>
                        <span className="badge bg-light text-primary me-2">💸</span>
                        <strong>Fee:</strong> ₹{calculateFee(doc.experience)}
                      </p>
                      {doc.hospitalId.location && (
                        <p style={{ color: "#495057" }}>
                          <span className="badge bg-light text-primary me-2">📍</span>
                          <strong>Location:</strong> {doc.hospitalId.location}
                        </p>
                      )}
                    </div>
                    <button
                      className="btn btn-primary w-100 mt-4 py-2"
                      style={{ 
                        borderRadius: "10px",
                        fontWeight: "600",
                        boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)"
                      }}
                      onClick={() =>
                        handleBook(doc.hospitalId._id, doc._id)
                      }
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center my-5">
          <button
            className="btn btn-outline-secondary px-4 py-2"
            style={{ 
              borderRadius: "10px",
              fontWeight: "500",
              transition: "all 0.3s"
            }}
            onClick={() => navigate("/visitor/book-appointment")}
          >
            ← Back to Symptoms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopDoctorsBySymptom;
