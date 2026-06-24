// frontend/src/api/hospital.js
import axios from 'axios';
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Get all hospitals
export const getAllHospitals = () => API.get("/hospitals");

// Get doctors by hospital ID
export const getDoctorsByHospital = (hospitalId) =>
  API.get(`/hospitals/${hospitalId}/doctors`);
