import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorsByDepartment } from "../../api/doctor";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";
import { createBookingRequest } from "../../api/booking";

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availabilityShown, setAvailabilityShown] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({});

  // Always get patientId like this:
  const storedUser = JSON.parse(localStorage.getItem("userInfo") || localStorage.getItem("user"));
  const patientId = storedUser?.patientId || null;

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hospitals/${hospitalId}`
        );
        setHospital(res.data);
        setSelectedDepartment(res.data.departments[0]);
      } catch (err) {
        console.error("❌ Error fetching hospital:", err);
      }
    };
    fetchHospital();
  }, [hospitalId]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDepartment) return;
      try {
        const res = await getDoctorsByDepartment(selectedDepartment, hospitalId);
        setDoctors(res.data);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, [selectedDepartment, hospitalId]);

  const toggleAvailability = (index) => {
    setAvailabilityShown((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    setSelectedDate((prev) => ({
      ...prev,
      [index]: "",
    }));
    setSelectedSlot((prev) => ({
      ...prev,
      [index]: "",
    }));
  };

  const handleSlotSelect = (index, slot) => {
    setSelectedSlot((prev) => ({
      ...prev,
      [index]: slot,
    }));
  };

  const getConsultationFee = (experience) => {
    if (experience < 4) return 600;
    if (experience < 10) return 800;
    return 1200;
  };

  const morningSlots = ["9:00", "10:00", "11:00", "12:00"];
  const afternoonSlots = ["2:00", "3:00", "4:00"];

  // ✅ Updated booking function as per your prompt
  const handleBookSlot = (doctor, index) => {
    const bookingData = {
      patientId, // always the generated one, never _id
      hospitalId: hospital?.hospitalId || hospitalId, // use the correct hospitalId
      department: doctor?.department || selectedDepartment,
      doctorName: doctor?.name || "Dr. Rakesh Sharma",
      type: "appointment",
      date: selectedDate[index], // already in YYYY-MM-DD
      time: selectedSlot[index],
      status: "pending",
    };

    console.log("📌 Booking data to send:", bookingData);

    const missingFields = Object.entries(bookingData)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    createBookingRequest(bookingData)
      .then((res) => {
        alert("Booking request sent!");
      })
      .catch((err) => {
        alert("Failed to book slot.");
      });
  };

  return (
    <div>
      {/* ⬇ KEEPING ALL EXISTING UI & LOGIC SAME */}
      {/* HERO SECTION */}
      <div style={styles.heroWrapper}>
        <img
          src={`/Hospitals/BG/${currentImageIndex + 1}.jpg`}
          alt="Hospital Slide"
          style={styles.heroImage}
        />
        <div style={styles.overlay} />
        <div style={styles.heroTextContainer}>
          <h2 style={styles.welcomeText}>Welcome to</h2>
          <h1 style={styles.hospitalName}>
            {hospital?.name || "Loading..."}
          </h1>
        </div>
      </div>

      {/* DEPARTMENT BUTTONS */}
      <div className="container my-4 text-center">
        {hospital?.departments?.map((dept) => (
          <button
            key={dept}
            className={`btn mx-2 ${
              selectedDepartment === dept ? "btn-primary" : "btn-outline-dark"
            }`}
            onClick={() => setSelectedDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* DOCTOR CARDS */}
      <div className="container">
        {doctors.length === 0 ? (
          <p className="text-center text-muted">No doctors found.</p>
        ) : (
          doctors.map((doctor, index) => (
            <div className="card mb-4 shadow" key={index}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={`/Hospitals/${String.fromCharCode(65 + (index % 3))}.jpg`}
                    alt="Doctor"
                    className="img-fluid h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title fw-bold fs-3">{doctor.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Experience:</strong> {doctor.experience} years
                    </p>
                    <p className="card-text mb-1">
                      <strong>Degrees:</strong> {doctor.degrees.join(", ")}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Bio:</strong> {doctor.bio}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Languages:</strong>{" "}
                      {doctor.languages.join(" | ")}
                    </p>
                    <p className="fw-bold fs-4 text-dark mt-3">
                      Consultation Fee: Rs {getConsultationFee(doctor.experience)}
                    </p>
                    <div className="text-center mt-3">
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "white",
                          color: "red",
                          border: "2px solid red",
                        }}
                        onClick={() => toggleAvailability(index)}
                      >
                        {availabilityShown[index]
                          ? "Hide Availability"
                          : "Check Availability"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AVAILABILITY & BOOKING UI */}
              {availabilityShown[index] && (
                <div
                  className="p-4 border-top"
                  style={{ background: "#faf9ff" }}
                >
                  {/* Date input section (updated) */}
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-white">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate[index] || ""}
                      min={today}
                      onChange={(e) =>
                        setSelectedDate((prev) => ({
                          ...prev,
                          [index]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* MORNING SLOTS */}
                  <div className="mb-2 text-dark text-center" style={{ fontWeight: 500 }}>
                    Morning
                  </div>
                  <div className="d-flex flex-row flex-wrap gap-2 justify-content-center mb-3">
                    {morningSlots.map((slot) => (
                      <button
                        key={slot}
                        className="btn"
                        style={{
                          border: "2px solid red",
                          backgroundColor:
                            selectedSlot[index] === slot ? "red" : "white",
                          color: selectedSlot[index] === slot ? "white" : "black",
                          fontWeight: 500,
                        }}
                        onClick={() => handleSlotSelect(index, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* AFTERNOON SLOTS */}
                  <div className="mb-2 text-dark text-center" style={{ fontWeight: 500 }}>
                    Afternoon
                  </div>
                  <div className="d-flex flex-row flex-wrap gap-2 justify-content-center mb-3">
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot}
                        className="btn"
                        style={{
                          border: "2px solid red",
                          backgroundColor:
                            selectedSlot[index] === slot ? "red" : "white",
                          color: selectedSlot[index] === slot ? "white" : "black",
                          fontWeight: 500,
                        }}
                        onClick={() => handleSlotSelect(index, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* BOOK BUTTON */}
                  <div className="text-center mt-4">
                    <button
                      className="btn px-4 py-2 fw-bold"
                      style={{
                        backgroundColor:
                          selectedDate[index] && selectedSlot[index]
                            ? "#6f42c1"
                            : "white",
                        color:
                          selectedDate[index] && selectedSlot[index]
                            ? "white"
                            : "black",
                        border: "2px solid #6f42c1",
                        transition: "all 0.2s",
                      }}
                      disabled={!selectedDate[index] || !selectedSlot[index]}
                      onClick={() => handleBookSlot(doctor, index)}
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  heroWrapper: {
    position: "relative",
    height: "75vh",
    width: "100vw",
    overflow: "hidden",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 1s ease-in-out",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  heroTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
  },
  welcomeText: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  hospitalName: {
    fontSize: "3.5rem",
    fontWeight: "bold",
  },
};

export default HospitalDetail;
