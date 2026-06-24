import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const HeroSection = () => {
  const [selected, setSelected] = useState("hospital");
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (type) => setSelected(type);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/hospitals`);
        setHospitals(res.data || []);
      } catch (error) {
        console.error("Error fetching hospitals for home search:", error);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) => {
    if (selected === "lab") {
      return hospital?.hasLab;
    }
    return true;
  });

  const suggestions = searchQuery.trim()
    ? filteredHospitals.filter((hospital) => {
        const name = hospital?.name || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      })
    : [];

  const handleSelectHospital = (hospital) => {
    const hospitalId = hospital?._id || hospital?.id || hospital?.hospitalId;

    if (!hospitalId) return;

    if (selected === "lab") {
      navigate(`/visitor/book-appointment/lab/${hospitalId}`);
    } else {
      navigate(`/visitor/book-appointment/hospital/${hospitalId}`);
    }
  };

  return (
    <section style={styles.heroWrapper}>
      <div style={styles.topSection}>
        <h1 style={styles.heading}>Book Your Appointment</h1>
        <p style={styles.subheading}>at any Hospital or Lab test in just a few seconds</p>
        <div style={styles.buttonGroup}>
          <button
            className={`btn px-4 py-2 fw-semibold ${
              selected === "hospital" ? "text-white" : "text-dark"
            }`}
            onClick={() => handleSelect("hospital")}
            style={{
              ...styles.button,
              ...(selected === "hospital" ? styles.active : styles.inactive),
            }}
          >
            Hospital
          </button>
          <button
            className={`btn px-4 py-2 fw-semibold ${
              selected === "lab" ? "text-white" : "text-dark"
            }`}
            onClick={() => handleSelect("lab")}
            style={{
              ...styles.button,
              ...(selected === "lab" ? styles.active : styles.inactive),
            }}
          >
            Lab Tests
          </button>
        </div>
      </div>

      <div style={styles.searchBarWrapper}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selected === "hospital" ? "Hospital" : "Lab Tests"}...`}
            className="form-control shadow-sm"
            style={styles.searchBar}
          />

          {searchQuery.trim() && suggestions.length === 0 && (
            <div style={styles.emptyState}>No such result</div>
          )}

          {suggestions.length > 0 && (
            <div style={styles.suggestionBox}>
              {suggestions.map((hospital) => (
                <button
                  key={hospital._id || hospital.id || hospital.hospitalId}
                  type="button"
                  style={styles.suggestionItem}
                  onClick={() => handleSelectHospital(hospital)}
                >
                  {hospital.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const styles = {
  heroWrapper: {
    width: "100%",
    minHeight: "520px",
    background: "linear-gradient(to right, #eef5ff, #f4ecfc)", // Light blue to soft violet
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "unset",
    marginTop: "0",
  },
  heading: {
    fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
    color: "#000",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#000",
    marginBottom: "40px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "0",
  },
  button: {
    border: "2px solid black",
    borderRadius: "10px",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    minWidth: "120px",
    padding: "12px 28px",
    fontWeight: "600",
  },
  active: {
    backgroundColor: "#6f42c1",
    borderColor: "#6f42c1",
    color: "#fff",
  },
  inactive: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    color: "#000",
  },
  searchBarWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "clamp(48px, 10vh, 100px)",
  },
  searchContainer: {
    width: "100%",
    maxWidth: "700px",
    position: "relative",
  },
  searchBar: {
    width: "100%",
    padding: "20px 32px",
    fontSize: "1.2rem",
    borderRadius: "12px",
    border: "1.5px solid #ccc",
    boxShadow: "0 2px 12px rgba(111,66,193,0.07)",
  },
  suggestionBox: {
    marginTop: "8px",
    borderRadius: "12px",
    border: "1px solid #e1d9f4",
    backgroundColor: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  suggestionItem: {
    width: "100%",
    textAlign: "left",
    padding: "14px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#333",
  },
  emptyState: {
    marginTop: "8px",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    color: "#b42318",
    fontSize: "0.95rem",
    border: "1px solid #f5c2c7",
  },
};

export default HeroSection;
