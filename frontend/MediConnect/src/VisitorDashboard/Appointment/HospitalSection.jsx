import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const HospitalSection = ({ selectedToggle }) => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/hospitals`);
        let data = res.data;

        if (selectedToggle === "lab") {
          data = data.filter((h) => h.hasLab);
        }

        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [selectedToggle]);

  const handleBook = (id) => {
    if (selectedToggle === "lab") {
  navigate(`/visitor/book-appointment/lab/${id}`);
} else if (selectedToggle === "video") {
  navigate(`/visitor/book-appointment/video/${id}`);
} else {
  navigate(`/visitor/book-appointment/hospital/${id}`);
}

  };

  return (
    <div style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "30px" }}>
      <style>{`
        .hospital-list-card {
          display: flex;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .hospital-list-image {
          width: 30%;
        }

        .hospital-list-body {
          width: 70%;
          padding: 20px 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (max-width: 768px) {
          .hospital-list-card {
            flex-direction: column;
          }

          .hospital-list-image,
          .hospital-list-body {
            width: 100% !important;
          }

          .hospital-list-image {
            height: 220px;
          }

          .hospital-list-body {
            padding: 20px !important;
          }
        }
      `}</style>
      {hospitals.map((hospital, index) => (
        <div
          key={hospital._id}
          className="hospital-list-card"
        >
          {/* Left Image */}
          <div className="hospital-list-image">
            <img
              src={`/Hospitals/${index + 1}.jpg`}
              alt={`Hospital ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right Text */}
          <div
            className="hospital-list-body"
          >
            <div>
              <h2 style={{ fontSize: "33.6px", fontWeight: "bold", color: "#000", marginBottom: "14px" }}>
                {hospital.name}
              </h2>

              {/* Departments */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "14px" }}>
                {hospital.departments.map((dept, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#f2f2f2",
                      padding: "7px 14px",
                      borderRadius: "5px",
                      fontSize: "19.6px",
                    }}
                  >
                    {dept}
                  </span>
                ))}
              </div>

              {/* Location */}
              <div style={{ fontSize: "21px", marginBottom: "14px" }}>
                📍 {hospital.location}
              </div>

              {/* Description */}
              <p style={{ fontSize: "19.6px", marginBottom: "14px" }}>{hospital.description}</p>

              {/* Contact */}
              <div style={{ fontSize: "19.6px", marginBottom: "14px" }}>📞 {hospital.contact}</div>
            </div>

            {/* Book Appointment Button */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={() => handleBook(hospital._id)}
                style={{
                  backgroundColor: "#6a1b9a",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalSection;
