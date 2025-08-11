// frontend/src/api/hospital.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Get all hospitals
export const getAllHospitals = () => API.get("/hospitals");

// Get doctors by hospital ID
export const getDoctorsByHospital = (hospitalId) =>
  API.get(`/hospitals/${hospitalId}/doctors`);
