// src/VisitorDashboard/Appointment/SymptomSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const symptoms = [
  { name: "Fever", description: "Persistent high temperature", icon: "🌡️", dept: "General OPD" },
  { name: "Chest Pain", description: "Discomfort or pain in chest area", icon: "❤️", dept: "Cardiology" },
  { name: "Joint Pain", description: "Pain in knees, elbows or joints", icon: "🦴", dept: "Orthopedics" },
  { name: "Skin Rash", description: "Itchy, red or bumpy skin", icon: "🧴", dept: "Dermatology" },
  { name: "Toothache", description: "Pain in teeth or gums", icon: "🦷", dept: "Dentistry" },
  { name: "Headache", description: "Sharp or dull pain in head", icon: "🧠", dept: "Neurology" },
];

const SymptomSection = () => {
  const navigate = useNavigate();

  const handleClick = (symptom) => {
    // Use encodeURIComponent to handle spaces and special chars
    navigate(`/visitor/symptom/${encodeURIComponent(symptom.name)}`, {
      state: {
        symptom: symptom.name,
        department: symptom.dept,
      },
    });
  };

  return (
    <div style={{ backgroundColor: "white", padding: "40px 20px" }}>
      <h2 className="text-center fw-bold mb-3">Search by Symptoms</h2>
      <p className="text-center text-muted mb-5">
        Not sure which doctor to consult? Select your symptom and we’ll connect you to the best specialist from top hospitals.
      </p>
      <div className="d-flex overflow-auto gap-4 px-3">
        {symptoms.map((symptom, idx) => (
          <div
            key={idx}
            className="card position-relative text-center p-3"
            style={{
              minWidth: "250px",
              borderRadius: "12px",
              border: "1px solid #eee",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onClick={() => handleClick(symptom)}
            onMouseEnter={(e) => e.currentTarget.classList.add("hovered")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("hovered")}
          >
            <div style={{ fontSize: "36px" }}>{symptom.icon}</div>
            <h5 className="fw-bold mt-2">{symptom.name}</h5>
            <p className="text-muted small">{symptom.description}</p>

            <div
              className="hover-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(128, 0, 128, 0.9)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <span className="fw-bold">Connect with Best Doctor</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .card.hovered {
          transform: translateY(-5px);
        }
        .card.hovered .hover-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SymptomSection;
