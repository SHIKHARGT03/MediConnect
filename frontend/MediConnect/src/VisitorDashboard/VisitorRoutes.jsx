import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home/Home";
import Appointment from "./Appointment/Appointment";
import HospitalDetail from "./Appointment/HospitalDetail";
import TopDoctorsBySymptom from "../VisitorDashboard/Appointment/TopDoctorsBySymptom";
import LabTestDetail from "./Appointment/LabTestDetail";
import Schedule from "./Schedule/Schedule"; // <-- Added

const contentWrapperStyle = {
  paddingTop: "70px",
  minHeight: "100vh",
};

const VisitorRoutes = () => {
  return (
    <>
      <Navbar />
      <div style={contentWrapperStyle}>
        <Routes>
          <Route path="dashboard" element={<Home />} />
          <Route path="book-appointment" element={<Appointment />} />
          <Route path="schedule" element={<Schedule />} /> {/* <-- Added */}
          <Route path="appointment/hospital/:hospitalId" element={<HospitalDetail />} />
          <Route path="appointment/lab/:hospitalId" element={<LabTestDetail />} />
          <Route path="symptom/:symptomName" element={<TopDoctorsBySymptom />} />
          <Route path="appointment/hospital/:hospitalId/doctor/:doctorId" element={<HospitalDetail />} />
        </Routes>
      </div>
    </>
  );
};

export default VisitorRoutes;
