// src/VisitorDashboard/Appointment/Appointment.jsx
import React, { useState } from "react";
import HeroSection from "./HeroSection";
import HospitalSection from "./HospitalSection";
import SymptomSection from "./SymptomSection";

const Appointment = () => {
  const [selectedToggle, setSelectedToggle] = useState("hospital");

  return (
    <div>
      <HeroSection
        selectedToggle={selectedToggle}
        setSelectedToggle={setSelectedToggle}
      />
      {selectedToggle === "hospital" && (
        <HospitalSection selectedToggle={selectedToggle} />
      )}
      {selectedToggle === "lab" && (
        <HospitalSection selectedToggle={selectedToggle} />
      )}
      {selectedToggle === "hospital" && <SymptomSection />}
    </div>
  );
};

export default Appointment;
