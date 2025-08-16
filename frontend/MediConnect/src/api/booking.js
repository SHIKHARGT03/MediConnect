// frontend/MediConnect/api/booking.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const createBookingRequest = async (bookingData, token) => {
  const { data } = await API.post(`/bookings`, bookingData, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return data;
};

export const getAllBookingRequests = async (token) => {
  const { data } = await API.get(`/bookings`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return data;
};

export const getBookingsForHospital = async (hospitalId, token) => {
  const { data } = await API.get(`/bookings/hospital/${hospitalId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return data;
};

export const getBookingsForPatient = async (patientId, token) => {
  const { data } = await API.get(`/bookings/patient/${patientId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return data;
};

// ✅ FIXED: match router.put("/:id/status", ...)
export const updateBookingStatus = async (bookingId, status, token) => {
  const { data } = await API.put(`/bookings/${bookingId}/status`, { status }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  return data;
};
