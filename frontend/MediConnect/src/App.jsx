// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth & Info Pages
import LandingPage from "./Login/LandingPage";
import Login from "./Login/Login";
import Register from "./Login/Register";
import VisitorKnowMore from "./Login/VisitorKnowMore";
import HospitalKnowMore from "./Login/HospitalKnowMore";

// Dashboard Routes
import VisitorRoutes from "./VisitorDashboard/VisitorRoutes";
import HospitalRoutes from "./HospitalDashboard/HospitalRoutes"; // ✅ NEW import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/:role/login" element={<Login />} />
        <Route path="/:role/register" element={<Register />} />
        <Route path="/know-more/visitor" element={<VisitorKnowMore />} />
        <Route path="/know-more/hospital" element={<HospitalKnowMore />} />

        {/* Dashboard Routes */}
        <Route path="/visitor/*" element={<VisitorRoutes />} />
        <Route path="/hospital/*" element={<HospitalRoutes />} /> {/* ✅ NEW Route added */}
      </Routes>
    </Router>
  );
}

export default App;
