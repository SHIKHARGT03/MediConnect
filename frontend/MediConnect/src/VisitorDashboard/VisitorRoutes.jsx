import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home/Home";
import Appointment from "./Appointment/Appointment";
import Schedule from "./Schedule/Schedule";
import Video from "./Video/Video";
import CallRoom from "./Video/CallRoom";

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
          {/* New route for patient's call room */}
          <Route path="records/call/:bookingId" element={<CallRoom />} />
        </Routes>
      </div>
    </>
  );
};

export default VisitorRoutes;
