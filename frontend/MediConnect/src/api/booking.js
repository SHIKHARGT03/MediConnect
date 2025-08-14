// frontend/MediConnect/api/booking.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings"; // Change to your backend URL when deployed

// 1️⃣ Create a new booking
export const createBookingRequest = async (bookingData) => {
  try {
    const { data } = await axios.post(`${API_URL}`, bookingData);
    return data;
  } catch (error) {
    console.error("❌ createBookingRequest Error:", error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ Get all bookings (admin use or for testing)
export const getAllBookingRequests = async () => {
  try {
    const { data } = await axios.get(`${API_URL}`);
    return data;
  } catch (error) {
    console.error("❌ getAllBookingRequests Error:", error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ Get bookings for a hospital by hospitalId
export const getBookingsForHospital = async (hospitalId) => {
  try {
    const { data } = await axios.get(`${API_URL}/hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error("❌ getBookingsForHospital Error:", error.response?.data || error.message);
    throw error;
  }
};

// 4️⃣ Get bookings for a patient by patientId
export const getBookingsForPatient = async (patientId) => {
  try {
    const { data } = await axios.get(`${API_URL}/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error("❌ getBookingsForPatient Error:", error.response?.data || error.message);
    throw error;
  }
};

// 5️⃣ Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data } = await axios.put(`${API_URL}/${bookingId}`, { status });
    return data;
  } catch (error) {
    console.error("❌ updateBookingStatus Error:", error.response?.data || error.message);
    throw error;
  }
};
