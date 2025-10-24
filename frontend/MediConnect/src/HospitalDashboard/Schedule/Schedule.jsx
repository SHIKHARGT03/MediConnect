import React from "react";
import HeroSection from "./HeroSection";
import Filter from "./Filter";

const Schedule = () => {
  const hospitalId = "68875ebe9a8807b4a94450ba"; // Example: you can get from context/auth
  const token = localStorage.getItem("token"); // Adjust if using auth context

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
