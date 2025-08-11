// frontend/src/api/auth.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ Important for cookies/session
});

export const registerUser = (formData) => API.post("/auth/register", formData);
export const loginUser = (formData) => API.post("/auth/login", formData);
export const logoutUser = () => API.post("/auth/logout");
