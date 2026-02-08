import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = (isActive) => ({
    width: "80%",
    backgroundColor: isActive ? "#7C3AED" : "#fff",
    color: isActive ? "#fff" : "#222",
    fontWeight: 600,
    fontSize: "1.08rem",
    padding: "10px 0",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: isActive ? "0 0 0 2px #7C3AED33" : "none",
    border: "none",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
  });

  return (
    <div
      style={{
        width: "29%",
        minWidth: 0,
        background: "#111118",
        padding: "36px 18px 36px 28px",
        borderRight: "1px solid #1f1f2e",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          marginBottom: "22px",
          letterSpacing: "0.5px",
          fontSize: "2rem",
          color: "#ffffff",
        }}
      >
        AI Screening Models
      </h2>

      <NavLink
        to="/hospital/ml-predict/diabetes"
        style={({ isActive }) => linkStyle(isActive)}
      >
        Diabetes
      </NavLink>

      <NavLink
        to="/hospital/ml-predict/heart"
        style={({ isActive }) => linkStyle(isActive)}
      >
        Heart Failure
      </NavLink>

      <NavLink
        to="/hospital/ml-predict/breast-cancer"
        style={({ isActive }) => linkStyle(isActive)}
      >
        Breast Cancer
      </NavLink>

      <NavLink
        to="/hospital/ml-predict/brain-stroke"
        style={({ isActive }) => linkStyle(isActive)}
      >
        Brain Stroke
      </NavLink>
    </div>
  );
};

export default Sidebar;
