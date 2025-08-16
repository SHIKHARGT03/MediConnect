// src/HospitalDashboard/HospitalRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";

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

        </Routes>
      </div>
    </>
  );
};

export default HospitalRoutes;
