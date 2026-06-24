// src/api/prescription.js
import axios from "axios";
import { getAuthToken } from "./auth"; // adapt to your auth helper
import { API_BASE_URL } from "../config/api";

const API_BASE = API_BASE_URL;

export const uploadPrescriptionForBooking = async (bookingId, file, note) => {
  const url = `${API_BASE}/api/prescription/upload/${bookingId}`;
  const token = getAuthToken(); // assume you have this
  const form = new FormData();
  form.append("file", file);
  if (note) form.append("note", note);

  const response = await axios.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  });

  return response.data; // { message, prescription }
};

export const getPrescriptionByBooking = async (bookingId) => {
  const url = `${API_BASE}/api/prescription/${bookingId}`;
  const token = getAuthToken();
  const response = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
  return response.data;
};
