import axios from "axios";

// Base URL of Flask ML service
const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Call ML service for disease prediction
 * @param {String} disease - diabetes | heart | stroke | etc
 * @param {Object} features - validated numeric input features
 */
export const predictDisease = async (disease, features) => {
  try {
    let payload = features;
    // For brain_stroke, features = { imageUrl }
    if (disease === "brain_stroke" && features.imageUrl) {
      payload = { imageUrl: features.imageUrl };
    }
    const response = await axios.post(
      `${ML_BASE_URL}/predict/${disease}`,
      payload,
      {
        timeout: 5000, // ⏱️ 5 seconds max wait
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // 🛑 Flask service unreachable or ML error
    if (error.response) {
      // Flask responded with error
      throw new Error(
        error.response.data?.message || "ML service error"
      );
    }
    if (error.code === "ECONNABORTED") {
      throw new Error("ML service timeout");
    }
    throw new Error("Unable to connect to ML service");
  }
};
