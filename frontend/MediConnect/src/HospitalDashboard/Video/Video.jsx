import React from "react";
import { Routes, Route } from "react-router-dom";
import VideoHome from "./VideoHome";
import CallRoom from "./CallRoom";

const Video = () => {
  return (
    <Routes>
      {/* Default video dashboard */}
      <Route index element={<VideoHome />} />
      <Route path="call/:bookingId" element={<CallRoom />} />
    </Routes>
  );
};

export default Video;
