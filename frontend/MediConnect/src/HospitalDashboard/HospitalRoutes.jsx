// src/HospitalDashboard/HospitalRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Schedule from "./Schedule/Schedule"; // updated import

const contentWrapperStyle = {
  paddingTop: "70px",
  minHeight: "100vh",
};

const HospitalRoutes = () => {
  return (
    <>
      <Navbar />
      <div style={contentWrapperStyle}>
        <Routes>
          <Route path="dashboard" element={<Home />} />
          <Route path="schedule" element={<Schedule />} /> {/* now full schedule page */}
          {/* future routes like Medical Records, ML, Video will go here */}
        </Routes>
      </div>
    </>
  );
};

export default HospitalRoutes;
