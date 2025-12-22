import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";
import { createBookingRequest } from "../../api/booking";
import { getDoctorsByDepartment } from "../../api/doctor";

const VideoDetail = () => {
  const { hospitalId } = useParams();

  const [hospital, setHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [availabilityShown, setAvailabilityShown] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const storedUser = JSON.parse(
    localStorage.getItem("userInfo") || localStorage.getItem("user")
  );
  const patientId = storedUser?.patientId || null;

  const today = new Date().toISOString().split("T")[0];

  const morningSlots = ["9:00", "10:00", "11:00", "12:00"];
  const afternoonSlots = ["2:00", "3:00", "4:00"];

  // 🔁 Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🏥 Fetch hospital
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hospitals/${hospitalId}`
        );
        setHospital(res.data);
        setSelectedDepartment(res.data.departments[0]);
      } catch (err) {
        console.error("Error fetching hospital:", err);
      }
    };
    fetchHospital();
  }, [hospitalId]);

  // 👨‍⚕️ Fetch ONE doctor per department (most experienced)
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!selectedDepartment) return;

      try {
        const res = await getDoctorsByDepartment(
          selectedDepartment,
          hospitalId
        );

        if (res.data?.length > 0) {
          const mostExperienced = res.data.reduce((prev, curr) =>
            curr.experience > prev.experience ? curr : prev
          );
          setDoctor(mostExperienced);
        } else {
          setDoctor(null);
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };

    fetchDoctor();
  }, [selectedDepartment, hospitalId]);

  const getConsultationFee = (experience) => {
    if (experience < 4) return 600;
    if (experience < 10) return 800;
    return 1200;
  };

  // 📅 Booking handler
  const handleBookVideoConsultation = () => {
    const bookingData = {
      patientId,
      hospitalId: hospital?.hospitalId || hospitalId,
      department: selectedDepartment,
      doctorName: doctor?.name,
      type: "videoConsultation",
      date: selectedDate,
      time: selectedSlot,
      status: "pending",
    };

    const missingFields = Object.entries(bookingData)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    createBookingRequest(bookingData)
      .then((res) => {
        alert(
          "Video consultation request sent!\nBooking ID: " +
            res.booking.bookingId
        );
      })
      .catch(() => {
        alert("Failed to book video consultation.");
      });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div style={styles.heroWrapper}>
        <img
          src={`/Hospitals/BG/${currentImageIndex + 1}.jpg`}
          alt="Hospital"
          style={styles.heroImage}
        />
        <div style={styles.overlay} />
        <div style={styles.heroTextContainer}>
          <h2 style={styles.welcomeText}>Video Consultation at</h2>
          <h1 style={styles.hospitalName}>{hospital?.name}</h1>
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="container my-4 text-center">
        {hospital?.departments?.map((dept) => (
          <button
            key={dept}
            className={`btn mx-2 ${
              selectedDepartment === dept
                ? "btn-primary"
                : "btn-outline-dark"
            }`}
            onClick={() => {
              setSelectedDepartment(dept);
              setAvailabilityShown(false);
              setSelectedDate("");
              setSelectedSlot("");
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* DOCTOR CARD */}
      <div className="container">
        {!doctor ? (
          <p className="text-center text-muted">No doctor available.</p>
        ) : (
          <div className="card mb-4 shadow">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={`/Hospitals/A.jpg`}
                  alt="Doctor"
                  className="img-fluid h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="fw-bold fs-3">{doctor.name}</h5>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Degrees:</strong> {doctor.degrees.join(", ")}</p>
                  <p><strong>Bio:</strong> {doctor.bio}</p>
                  <p><strong>Languages:</strong> {doctor.languages.join(" | ")}</p>

                  <p className="fw-bold fs-4 mt-3">
                    Consultation Fee: ₹{getConsultationFee(doctor.experience)}
                  </p>

                  <div className="text-center mt-3">
                    <button
                      className="btn"
                      style={styles.videoBtn}
                      onClick={() => setAvailabilityShown(!availabilityShown)}
                    >
                      {availabilityShown
                        ? "Hide Availability"
                        : "Book Video Consultation"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            {availabilityShown && (
              <div className="p-4 border-top" style={{ background: "#faf9ff" }}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <FaCalendarAlt />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {[["Morning", morningSlots], ["Afternoon", afternoonSlots]].map(
                  ([label, slots]) => (
                    <div key={label}>
                      <div className="text-center fw-semibold mb-2">
                        {label}
                      </div>
                      <div className="d-flex justify-content-center gap-2 mb-3">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            className="btn"
                            style={{
                              border: "2px solid red",
                              backgroundColor:
                                selectedSlot === slot ? "red" : "white",
                              color:
                                selectedSlot === slot ? "white" : "black",
                            }}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}

                <div className="text-center mt-4">
                  <button
                    className="btn fw-bold px-4 py-2"
                    style={styles.confirmBtn}
                    disabled={!selectedDate || !selectedSlot}
                    onClick={handleBookVideoConsultation}
                  >
                    Book Video Consultation
                  </button>
                </div>
              </div>
            )}
          </div>
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
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroTextContainer: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
  },
  welcomeText: { fontSize: "2.5rem" },
  hospitalName: { fontSize: "3.5rem", fontWeight: "bold" },
  videoBtn: {
    backgroundColor: "white",
    border: "2px solid red",
    color: "red",
  },
  confirmBtn: {
    backgroundColor: "#6f42c1",
    color: "white",
    border: "2px solid #6f42c1",
  },
};

export default VideoDetail;
