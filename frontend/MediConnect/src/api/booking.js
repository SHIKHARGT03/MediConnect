import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const createBookingRequest = (data) => API.post("/bookings", data);
export const getBookingsForHospital = (hospitalId) => API.get(`/bookings/hospital/${hospitalId}`);
export const updateBookingStatus = (bookingId, status) => API.put(`/bookings/${bookingId}/status`, { status });