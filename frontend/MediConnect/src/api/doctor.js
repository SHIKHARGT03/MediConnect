// src/api/doctor.js
import axios from 'axios';
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Get all doctors (optional)
export const getAllDoctors = () => API.get("/doctors");

// Get doctors by department and hospital
export const getDoctorsByDepartment = (departmentName, hospitalId) =>
  API.get(`/doctors?department=${departmentName}&hospital=${hospitalId}`);

// 🔥 New: Get doctors by department only (used in TopDoctorsBySymptom.jsx)
export const getDoctorsByDepartmentOnly = (departmentName) =>
  API.get(`/doctors?department=${departmentName}`);
