import { useState } from "react";
const HomePage = () => {
  const [selectedDisease] = useState(null);
  return (
    <div
      style={{
        width: "100%",
        minHeight: "0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#181824",
        padding: "0 0 0 0",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {" "}
      <div style={{ width: "100%", padding: "48px 56px 0 56px" }}>
        {" "}
        <h1
          style={{
            fontWeight: 800,
            marginBottom: "12px",
            fontSize: "2.5rem",
            letterSpacing: "-1px",
            color: "#ffffff",
          }}
        >
          {" "}
          <span style={{ color: "#7C3AED" }}>AI-Powered</span> Clinical
          Screenings{" "}
        </h1>{" "}
        <p
          style={{
            fontSize: "1.08rem",
            color: "#cfcfe6",
            maxWidth: "600px",
            marginBottom: "22px",
            lineHeight: 1.6,
          }}
        >
          {" "}
          Early risk screening using trained machine-learning models to assist
          doctors in clinical decision-making within hospitals.{" "}
        </p>{" "}
      </div>{" "}
      {/* Video Illustration - full width, no black sides */}{" "}
      <div
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          background: "#181824",
        }}
      >
        {" "}
        <video
          src="/videos/ai-medical.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            background: "#181824",
            display: "block",
          }}
        />{" "}
      </div>{" "}
    </div>
  );
};
export default HomePage;
