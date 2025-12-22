// src/VisitorDashboard/Appointment/Appointment.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HeroSection from "./HeroSection";
import HospitalSection from "./HospitalSection";
import SymptomSection from "./SymptomSection";
import HospitalDetail from "./HospitalDetail";
import LabTestDetail from "./LabTestDetail";
import VideoDetail from "./VideoDetail";
import TopDoctorsBySymptom from "./TopDoctorsBySymptom";

const AppointmentHome = ({ selectedToggle, setSelectedToggle }) => (
  <>
    <HeroSection
      selectedToggle={selectedToggle}
      setSelectedToggle={setSelectedToggle}
    />

    {(selectedToggle === "hospital" || selectedToggle === "lab" || selectedToggle === "video") && (
      <HospitalSection selectedToggle={selectedToggle} />
    )}

    {selectedToggle === "hospital" && <SymptomSection />}
  </>
);

const Appointment = () => {
  const [selectedToggle, setSelectedToggle] = useState("hospital");

  return (
    <Routes>
      {/* Appointment Landing */}
      <Route
        path="/"
        element={
          <AppointmentHome
            selectedToggle={selectedToggle}
            setSelectedToggle={setSelectedToggle}
          />
        }
      />

      {/* Hospital / Lab / Video flows */}
      <Route path="hospital/:hospitalId" element={<HospitalDetail />} />
      <Route path="lab/:hospitalId" element={<LabTestDetail />} />
      <Route path="video/:hospitalId" element={<VideoDetail />} />

      {/* Symptom based doctors */}
      <Route path="symptom/:symptomName" element={<TopDoctorsBySymptom />} />
    </Routes>
  );
};

export default Appointment;
