import React from "react";
import { Routes, Route } from "react-router-dom";
import VideoHome from "./VideoHome";

const Video = () => {
  return (
    <Routes>
      {/* Default video dashboard */}
      <Route index element={<VideoHome />} />

      {/* Future routes */}
      {/* 
        <Route path="call/:bookingId" element={<VideoCall />} />
        <Route path="logs" element={<VideoLogs />} />
      */}
    </Routes>
  );
};

export default Video;
