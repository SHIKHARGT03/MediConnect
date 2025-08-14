// frontend/src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // keep cookies/session
});

export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  if (res.data) {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res;
};

export const loginUser = async (formData) => {
  const res = await API.post("/auth/login", formData);
  if (res.data) {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  return API.post("/auth/logout");
};
