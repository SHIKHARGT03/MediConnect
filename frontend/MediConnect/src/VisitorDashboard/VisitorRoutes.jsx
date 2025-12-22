import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home/Home";
import Appointment from "./Appointment/Appointment";
import Schedule from "./Schedule/Schedule";
import Video from "./Video/Video";

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
          <Route path="book-appointment/*" element={<Appointment />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="records" element={<Video />} />
        </Routes>
      </div>
    </>
  );
};

export default VisitorRoutes;
