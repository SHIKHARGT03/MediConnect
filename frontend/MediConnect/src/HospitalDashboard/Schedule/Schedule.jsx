import React from "react";
import HeroSection from "./HeroSection";
import Filter from "./Filter";
import { getAuthToken } from "../../api/auth";

const readHospitalAuth = () => {
  const keys = ["hospitalInfo", "authHospital", "hospital", "user"];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const auth = JSON.parse(raw);
      if (auth?.hospitalId) return auth;
    } catch {
      // Ignore malformed auth entries and try the next key.
    }
  }

  return null;
};

const Schedule = () => {
  const auth = readHospitalAuth();
  const hospitalId = auth?.hospitalId || "";
  const token = getAuthToken();

  if (!hospitalId) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-2">Hospital Schedule</h2>
        <p className="text-muted mb-0">
          Please log in as a hospital to view accepted appointments.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero overview */}
      <HeroSection hospitalId={hospitalId} />

      {/* Filter + Past Records section */}
      <Filter hospitalId={hospitalId} token={token} />
    </div>
  );
};

export default Schedule;
