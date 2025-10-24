// src/api/booking.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

// helper for auth header (returns config object)
const getAuthHeader = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

// ---------------- Booking APIs ----------------

export const createBookingRequest = async (bookingData, token) => {
  const { data } = await API.post("/bookings", bookingData, getAuthHeader(token));
  return data;
};

export const getAllBookingRequests = async (token) => {
  const { data } = await API.get("/bookings", getAuthHeader(token));
  return data;
};

export const getBookingsForHospital = async (hospitalId, token) => {
  const { data } = await API.get(`/bookings/hospital/${hospitalId}`, getAuthHeader(token));
  return data;
};

// Visitor / patient endpoints
export const getBookingsForPatient = async (patientId, token) => {
  const { data } = await API.get(`/bookings/patient/${patientId}`, getAuthHeader(token));
  return data;
};

export const getUpcomingBookingsForPatient = async (patientId, token) => {
  const { data } = await API.get(`/bookings/patient/${patientId}/upcoming`, getAuthHeader(token));
  return data;
};

export const getPastBookingsForPatient = async (patientId, token) => {
  const { data } = await API.get(`/bookings/patient/${patientId}/past`, getAuthHeader(token));
  return data;
};

export const getBookingById = async (bookingId, token) => {
  const { data } = await API.get(`/bookings/${bookingId}`, getAuthHeader(token));
  return data;
};

export const createFollowUpBooking = async (bookingId, token) => {
  const { data } = await API.post(`/bookings/${bookingId}/followup`, {}, getAuthHeader(token));
  return data;
};

export const updateBookingStatus = async (bookingId, status, token) => {
  const { data } = await API.put(`/bookings/${bookingId}/status`, { status }, getAuthHeader(token));
  return data;
};

// ---------------- Hospital schedule APIs ----------------

// Hospital Hero overview (matches router: GET /api/bookings/:hospitalId/overview)
export const getHospitalScheduleOverview = async (hospitalId, token) => {
  try {
    const { data } = await API.get(`/bookings/${hospitalId}/overview`, getAuthHeader(token));
    return data; // expected: { todayCount, pastWeekCount, totalAccepted }
  } catch (err) {
    console.error("Error fetching hospital schedule overview:", err);
    return { todayCount: 0, pastWeekCount: 0, totalAccepted: 0 };
  }
};

// Hospital filtered bookings for Schedule page (matches router: GET /api/bookings/:hospitalId/bookings)
export const getHospitalScheduleBookings = async (hospitalId, params = {}, token) => {
  const { data } = await API.get(`/bookings/${hospitalId}/bookings`, {
    ...getAuthHeader(token),
    params,
  });
  return data;
};