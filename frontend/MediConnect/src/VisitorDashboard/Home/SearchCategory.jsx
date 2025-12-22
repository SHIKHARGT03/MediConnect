import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaHeartbeat, FaXRay, FaBone, FaBrain, FaLungs, FaStethoscope, FaUserNurse, FaMicroscope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const categories = [
  { icon: <FaHeartbeat size={30} />, title: "Cardiology", desc: "Heart-related treatment", bg: "#e3f2fd" },
  { icon: <FaXRay size={30} />, title: "Radiology", desc: "X-rays and imaging", bg: "#fce4ec" },
  { icon: <FaBone size={30} />, title: "Orthopedics", desc: "Bones & Joints care", bg: "#e8f5e9" },
  { icon: <FaBrain size={30} />, title: "Neurology", desc: "Brain & Nervous system", bg: "#fff3e0" },
  { icon: <FaLungs size={30} />, title: "Pulmonology", desc: "Lungs & Breathing", bg: "#ede7f6" },
  { icon: <FaStethoscope size={30} />, title: "General", desc: "Primary health checkups", bg: "#f3e5f5" },
  { icon: <FaUserNurse size={30} />, title: "Pediatrics", desc: "Child healthcare", bg: "#e1f5fe" },
  { icon: <FaMicroscope size={30} />, title: "Pathology", desc: "Lab diagnosis", bg: "#f9fbe7" },
];

const SearchCategory = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={{ background: "#f9f9ff", padding: "60px 20px" }}>
      <div className="container text-center">
        <h2 className="mb-2 fw-bold">Medical Specialties</h2>
        <p className="mb-5 text-muted">Find the right specialist for your health needs</p>
        <div className="row g-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-lg-3"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="position-relative rounded p-4 h-100"
                style={{
                  backgroundColor: cat.bg,
                  transition: "transform 0.3s",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="mb-3">{cat.icon}</div>
                <h5 className="fw-bold mb-2">{cat.title}</h5>
                <p className="text-muted mb-0">{cat.desc}</p>

                {hoveredIndex === index && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#6f42c1", // purple
                        borderColor: "#6f42c1",
                      }}
                    >
                      Book Appointment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCategory;