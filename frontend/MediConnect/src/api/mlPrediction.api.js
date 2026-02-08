import axios from "./axios";
import { getAuthToken } from "./auth";

export const runDiseasePrediction = async (disease, payload) => {
  const token = getAuthToken();
  const response = await axios.post(`/api/ml/${disease}/predict`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const runDiabetesPrediction = async (payload) => {
  return runDiseasePrediction("diabetes", payload);
};
