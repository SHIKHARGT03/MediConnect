import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Upcoming from "./Upcoming";
import Past from "./Past";
import CallRoom from "./CallRoom";
import { useLocation } from "react-router-dom";

const Video = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "past" || tab === "upcoming") {
      setActiveTab(tab);
    }
  }, [location.search]);

  return (
    <div>
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Content Area */}
      <div style={{ padding: "40px 16px", minHeight: "60vh" }}>
        {activeTab === "upcoming" && <Upcoming />}
        {activeTab === "past" && <Past />}
        {activeTab === "call" && <CallRoom />}
      </div>
    </div>
  );
};

export default Video;
