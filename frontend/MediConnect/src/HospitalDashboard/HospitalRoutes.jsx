// src/HospitalDashboard/HospitalRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Schedule from "./Schedule/Schedule";
import Video from "./Video/Video";
import MLPredict from "./MLPredict/MLPredictRoutes";

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
          <Route path="schedule" element={<Schedule />} />
          <Route path="video/*" element={<Video />} />
          <Route path="ml-predict/*" element={<MLPredict />} />
        </Routes>
      </div>
    </>
  );
};

export default HospitalRoutes;
