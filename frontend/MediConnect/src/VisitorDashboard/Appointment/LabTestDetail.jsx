import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaVial,
  FaHeartbeat,
  FaXRay,
  FaLungs,
  FaNotesMedical,
  FaEyeDropper,
  FaSyringe,
  FaCheckCircle,
  FaGift,
  FaAward,
} from "react-icons/fa";
import { createBookingRequest } from "../../api/booking";

const departmentTests = {
  Pathology: ["Blood Test", "Urine Test"],
  Radiology: ["X-Ray", "MRI Scan"],
  Cardiology: ["ECG", "Echo Test"],
  Neurology: ["EEG", "Nerve Test"],
};

const testIcons = {
  "Blood Test": <FaEyeDropper />,
  "Urine Test": <FaVial />,
  "X-Ray": <FaXRay />,
  "MRI Scan": <FaNotesMedical />,
  "ECG": <FaHeartbeat />,
  "Echo Test": <FaHeartbeat />,
  "EEG": <FaSyringe />,
  "Nerve Test": <FaSyringe />,
};

const testPrices = {
  "Blood Test": 902,
  "Urine Test": 1312,
  "X-Ray": 761,
  "MRI Scan": 1302,
  "ECG": 1037,
  "Echo Test": 687,
  "EEG": 1712,
  "Nerve Test": 452,
};

const packages = [
  {
    title: "Essential Care",
    price: 999,
    tests: ["Blood Test", "Urine Test", "BMI Check"],
    benefits: [],
  },
  {
    title: "Complete Wellness",
    price: 1699,
    tests: ["Blood Test", "Urine Test", "Liver Function", "Sugar", "Vitamin D"],
    benefits: [],
    popular: true,
  },
  {
    title: "Total Health+",
    price: 1999,
    tests: [
      "Blood Test",
      "Urine Test",
      "Liver Function",
      "Sugar",
      "Vitamin D",
      "ECG",
      "Thyroid",
    ],
    benefits: ["3 Free Follow-up Consultations"],
  },
];

const LabTestDetail = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Selection states
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null); // for individual test card
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null); // for package card
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // ISO date min (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mock hospital (as in your file)
  useEffect(() => {
    setHospital({
      name: "Generic Hospital Name",
      departments: Object.keys(departmentTests),
    });
  }, [hospitalId]);

  const testData = Object.entries(departmentTests).flatMap(([dept, tests]) =>
    tests.map((test) => ({
      name: test,
      department: dept,
      price: testPrices[test],
    }))
  );

  const handleBookClick = (index) => {
    setSelectedSlotIndex(index);
    setSelectedPackageIndex(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handlePackageClick = (index) => {
    setSelectedPackageIndex(index);
    setSelectedSlotIndex(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  // Always get patientId like this:
  const storedUser = JSON.parse(localStorage.getItem("userInfo") || localStorage.getItem("user"));
  const patientId = storedUser?.patientId || null;

  // Common builder to validate & send booking
  const submitBooking = (bookingData) => {
    // Validate required fields (mirrors Hospital flow)
    const missingFields = Object.entries(bookingData)
      .filter(([key, value]) => {
        // allow doctorName to be null for lab tests
        if (key === "doctorName") return false;
        // allow testName to be null for doctor appointment (not our case here, but safe)
        if (key === "testName") return !value;
        return !value;
      })
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    createBookingRequest(bookingData)
      .then(() => {
        alert("Booking request sent!");
        setSelectedSlotIndex(null);
        setSelectedPackageIndex(null);
        setSelectedDate("");
        setSelectedTime("");
      })
      .catch((err) => {
        console.error(
          "❌ Booking error:",
          err?.response?.data || err.message || err
        );
        alert("Failed to book lab test.");
      });
  };

  // Final booking handler (works for both individual test and package)
  const handleFinalBooking = () => {
    if (!selectedDate || !selectedTime) return;

    let bookingData = null;

    if (selectedSlotIndex !== null) {
      // Individual test booking
      const test = testData[selectedSlotIndex];
      bookingData = {
        patientId, // always the generated one, never _id
        hospitalId,
        type: "labTest", // ✅ matches enum
        doctorName: null,
        testName: test?.name || null, // ✅ use test name
        department: test?.department || "Lab",
        date: selectedDate, // ✅ already YYYY-MM-DD
        time: selectedTime, // ✅ field name is "time"
        status: "pending", // ✅ lowercase like Hospital
      };
    } else if (selectedPackageIndex !== null) {
      // Package booking
      const pkg = packages[selectedPackageIndex];
      bookingData = {
        patientId, // always the generated one, never _id
        hospitalId,
        type: "labTest",
        doctorName: null,
        testName: `Package: ${pkg?.title || "Health Package"}`, // ✅ store package as testName
        department: "Lab Package",
        date: selectedDate,
        time: selectedTime,
        status: "pending",
      };
    }

    if (!bookingData) return;
    submitBooking(bookingData);
  };

  return (
    <div style={{ width: "100vw", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Hero Section */}
      <div style={{ position: "relative", height: "80vh", width: "100%" }}>
        <img
          src={`/Hospitals/BG/${(currentImageIndex % 10) + 1}.jpg`}
          alt="Hospital Lab"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2.5rem" }}>Get your all test at</h2>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold" }}>
            {hospital?.name}
          </h1>
        </div>
      </div>

      {/* Individual Test Cards */}
      <div style={{ width: "100%", padding: "3rem 1rem" }}>
        <div className="container-fluid">
          <div className="row">
            {testData.map((test, index) => (
              <div className="col-md-6 col-lg-3 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title d-flex align-items-center">
                      <span className="me-2 text-purple fs-4">
                        {testIcons[test.name]}
                      </span>
                      <span className="fw-bold fs-5">{test.name}</span>
                    </h5>
                    <p className="mb-1 text-muted">{test.department}</p>
                    <p className="fw-bold fs-5">Rs {test.price}/-</p>
                    <button
                      className="btn btn-sm w-100 text-white"
                      style={{ backgroundColor: "#6f42c1" }}
                      onClick={() => handleBookClick(index)}
                    >
                      Check Availability
                    </button>

                    {selectedSlotIndex === index && (
                      <div className="mt-3">
                        <div className="input-group mb-2">
                          <span className="input-group-text bg-white">
                            <FaCalendarAlt />
                          </span>
                          {/* ✅ Switch to ISO date input to satisfy backend regex */}
                          <input
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            min={today}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                        </div>
                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                          {["9:00", "10:00", "11:00", "12:00"].map((time) => (
                            <button
                              key={time}
                              className={`btn btn-sm ${
                                selectedTime === time
                                  ? "bg-danger text-white"
                                  : "bg-white text-danger"
                              } border border-danger`}
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        <button
                          className="btn w-100 fw-bold"
                          style={{
                            backgroundColor:
                              selectedDate && selectedTime ? "#6f42c1" : "#ccc",
                            color: "white",
                          }}
                          disabled={!selectedDate || !selectedTime}
                          onClick={handleFinalBooking}
                        >
                          Book Slot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Packages Section */}
      <div
        style={{ backgroundColor: "#f8f9fa", padding: "60px 0", width: "100%" }}
      >
        <div className="container">
          <h2
            className="text-center mb-5 fw-bold"
            style={{ fontSize: "2.2rem", color: "#333" }}
          >
            Full Body Health Checkup Packages
          </h2>
          <div className="row justify-content-center">
            {packages.map((pkg, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div
                  className="card h-100 border-0 d-flex flex-column"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s",
                    transform:
                      selectedPackageIndex === index ? "translateY(-10px)" : "none",
                    minHeight: 520,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="card-header border-0 py-4 text-center"
                    style={{
                      backgroundColor: "#6f42c1",
                      color: "white",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <h3
                      className="mb-0 fw-bold"
                      style={{ fontSize: "1.5rem", color: "white" }}
                    >
                      {pkg.title}
                    </h3>
                  </div>
                  {/* Price */}
                  <div className="text-center pt-4 pb-2">
                    <h2 className="display-5 fw-bold mb-0" style={{ color: "#333" }}>
                      Rs {pkg.price}/-
                    </h2>
                    {pkg.popular && (
                      <span
                        className="badge rounded-pill mt-2"
                        style={{
                          backgroundColor: "#6f42c1",
                          color: "white",
                          padding: "5px 15px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="card-body pt-2 d-flex flex-column flex-grow-1">
                    <hr style={{ margin: "0.5rem 0 1.5rem", opacity: 0.1 }} />
                    {/* Test List */}
                    <ul className="list-unstyled mb-4">
                      {pkg.tests.map((test, i) => (
                        <li key={i} className="d-flex align-items-center mb-3">
                          <FaCheckCircle
                            className="text-success me-2"
                            style={{ flexShrink: 0 }}
                          />
                          <span>{test}</span>
                        </li>
                      ))}
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i} className="d-flex align-items-center mb-3">
                          <FaGift
                            className="text-primary me-2"
                            style={{ flexShrink: 0 }}
                          />
                          <span className="text-primary fw-semibold">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto w-100 d-flex flex-column align-items-center">
                      {/* Button */}
                      <button
                        className="btn w-100 py-3 fw-bold text-white mt-auto"
                        style={{
                          backgroundColor: "#6f42c1",
                          borderRadius: "5px",
                          transition: "all 0.3s",
                        }}
                        onClick={() => handlePackageClick(index)}
                      >
                        Check Availability
                      </button>
                      {/* Availability Section */}
                      {selectedPackageIndex === index && (
                        <div className="mt-4 w-100">
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-white">
                              <FaCalendarAlt />
                            </span>
                            {/* ✅ ISO date input */}
                            <input
                              type="date"
                              className="form-control"
                              value={selectedDate}
                              min={today}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                          <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                            {["9:00", "10:00", "11:00", "12:00"].map((time) => (
                              <button
                                key={time}
                                className={`btn ${
                                  selectedTime === time
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                }`}
                                style={{ flex: 1, minWidth: "60px" }}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                          <button
                            className="btn w-100 py-2 fw-bold"
                            style={{
                              backgroundColor:
                                selectedDate && selectedTime ? "#6f42c1" : "#ccc",
                              color: "white",
                            }}
                            disabled={!selectedDate || !selectedTime}
                            onClick={handleFinalBooking}
                          >
                            Book Slot
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestDetail;
