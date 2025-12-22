import React, { useState } from "react";
import HeroSection from "./HeroSection";
import Upcoming from "./Upcoming";
import Past from "./Past";

const Video = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div>
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div style={{ padding: "40px 16px", minHeight: "60vh" }}>
        {activeTab === "upcoming" && <Upcoming />}
        {activeTab === "past" && <Past />}
      </div>
    </div>
  );
};

export default Video;
