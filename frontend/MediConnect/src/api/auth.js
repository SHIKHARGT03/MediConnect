// frontend/src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // keep cookies/session
});

export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  if (res.data) {
    if (res.data.role === "hospital") {
      localStorage.setItem("hospitalInfo", JSON.stringify(res.data)); // ✅ hospital
    } else {
      localStorage.setItem("userInfo", JSON.stringify(res.data)); // ✅ patient/visitor
    }
  }
  return res;
};

export const loginUser = async (formData) => {
  const res = await API.post("/auth/login", formData);
  if (res.data) {
    if (res.data.role === "hospital") {
      localStorage.setItem("hospitalInfo", JSON.stringify(res.data)); // ✅ hospital
    } else {
      localStorage.setItem("userInfo", JSON.stringify(res.data)); // ✅ patient/visitor
    }
  }
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("hospitalInfo"); // ✅ clear hospital login too
  return API.post("/auth/logout");
};
