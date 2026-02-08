import React, { useState } from "react";
import { runDiseasePrediction } from "../../api/mlPrediction.api";

const FEATURE_ORDER = [
  "age",
  "sex",
  "cp",
  "trestbps",
  "chol",
  "fbs",
  "restecg",
  "thalach",
  "exang",
  "oldpeak",
  "slope",
  "ca",
  "thal",
];

const labelMap = {
  age: "Age",
  sex: "Sex (0=female,1=male)",
  cp: "Chest pain type (0-3)",
  trestbps: "Resting BP",
  chol: "Cholesterol",
  fbs: "Fasting blood sugar (>120 mg/dl) 1=true else 0",
  restecg: "Resting ECG (0-2)",
  thalach: "Max heart rate achieved",
  exang: "Exercise induced angina (1=yes)",
  oldpeak: "ST depression (oldpeak)",
  slope: "Slope of ST segment (0-2)",
  ca: "Number of major vessels (0-3)",
  thal: "Thalassemia (1-3)",
};

const containerStyle = {
  width: "100%",
  height: "100%",
  background: "#ffffff",
  padding: "32px 48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

// (styling kept inline where needed)

const Heart = () => {
  const [features, setFeatures] = useState({});
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [canSave, setCanSave] = useState(false);

  const requiredFields = FEATURE_ORDER;

  const allFilled = requiredFields.every(
    (f) => features[f] !== undefined && features[f] !== ""
  );

  const handleChange = (key, value) => {
    // allow numeric input only (basic)
    const num = value === "" ? "" : Number(value);
    setFeatures((s) => ({ ...s, [key]: num }));
  };

  const handlePredict = async () => {
    setError(null);
    setResult(null);
    setConfidence(null);

    if (!allFilled) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const numericFeatures = Object.fromEntries(
        requiredFields.map((k) => [k, Number(features[k])])
      );

      const data = await runDiseasePrediction("heart_disease", {
        features: numericFeatures,
        bookingId: bookingId || null,
      });

      setResult(data.result);
      setConfidence(data.confidence);
      setCanSave(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          .mlp-input::placeholder { color: #ffffff; opacity: 1; }
        `}
      </style>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontWeight: 700 }}>Heart Failure</h2>
            <p style={{ color: "#555" }}>Clinical screening based on vitals and ECG data</p>
          </div>

          <input
            type="number"
            placeholder="Booking ID (optional)"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={{ width: "180px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            className="mlp-input"
          />
        </div>

        <div className="row">
          {requiredFields.map((key) => (
            <div className="col-md-6 mb-3" key={key}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ fontWeight: 600 }}>{labelMap[key] || key.toUpperCase()}</label>
                <span style={{ fontSize: "0.8rem", color: "#777" }} />
              </div>

              <input
                type="number"
                value={features[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                onFocus={(e) => (e.target.style.border = "1px solid #7C3AED")}
                onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                className="mlp-input"
              />
            </div>
          ))}
        </div>

        <div style={{ minHeight: "90px", marginTop: "20px", padding: "16px", background: "#f7f7fb", borderRadius: "8px" }}>
          {!result && !loading && <span style={{ color: "#777" }}>Prediction result will appear here</span>}
          {loading && <span>🧠 Running AI screening...</span>}
          {result && (
            <>
              <h5>{result === "High" || result === "High risk" ? "High Risk" : "Low Risk"}</h5>
              <p style={{ marginBottom: 4 }}>Based on provided clinical parameters.</p>
              {confidence !== null && <small>Confidence: {(confidence * 100).toFixed(1)}%</small>}
            </>
          )}
        </div>
        {error && <div style={{ marginTop: 12, color: "#ffb4b4" }}>{error}</div>}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
          <button
            disabled={!allFilled || loading || result}
            onClick={handlePredict}
            className="btn"
            style={{ backgroundColor: allFilled && !result ? "#dc3545" : "#aaa", color: "#fff", width: "140px" }}
          >
            {loading ? "Analyzing..." : "Predict"}
          </button>

          <button
            disabled={!canSave}
            className="btn"
            style={{ backgroundColor: canSave ? "#28a745" : "#aaa", color: "#fff", width: "140px" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Heart;
