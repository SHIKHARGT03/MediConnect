import React, { useState } from "react";
import { runDiseasePrediction } from "../../api/mlPrediction.api";

const FEATURE_ORDER = [
  "Clump Thickness",
  "Uniformity of Cell Size",
  "Uniformity of Cell Shape",
  "Marginal Adhesion",
  "Single Epithelial Cell Size",
  "Bare Nuclei",
  "Bland Chromatin",
  "Normal Nucleoli",
  "Mitoses",
];

const labelMap = {
  "Clump Thickness": "Clump Thickness",
  "Uniformity of Cell Size": "Uniformity of Cell Size",
  "Uniformity of Cell Shape": "Uniformity of Cell Shape",
  "Marginal Adhesion": "Marginal Adhesion",
  "Single Epithelial Cell Size": "Single Epithelial Cell Size",
  "Bare Nuclei": "Bare Nuclei",
  "Bland Chromatin": "Bland Chromatin",
  "Normal Nucleoli": "Normal Nucleoli",
  "Mitoses": "Mitoses",
};

const avgMap = {
  "Clump Thickness": "1–10",
  "Uniformity of Cell Size": "1–10",
  "Uniformity of Cell Shape": "1–10",
  "Marginal Adhesion": "1–10",
  "Single Epithelial Cell Size": "1–10",
  "Bare Nuclei": "1–10",
  "Bland Chromatin": "1–10",
  "Normal Nucleoli": "1–10",
  "Mitoses": "1–10",
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

const BreastCancer = () => {
  const [features, setFeatures] = useState({});
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [canSave, setCanSave] = useState(false);

  const allFilled = FEATURE_ORDER.every(
    (f) => features[f] !== undefined && features[f] !== ""
  );

  const handleChange = (key, value) => {
    const num = value === "" ? "" : Number(value);
    setFeatures((s) => ({ ...s, [key]: num }));
  };

  const handlePredict = async () => {
    setError(null);
    setResult(null);
    setConfidence(null);

    if (!allFilled) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const numericFeatures = Object.fromEntries(
        FEATURE_ORDER.map((k) => [k, Number(features[k])])
      );

      const data = await runDiseasePrediction("breast_cancer", {
        features: numericFeatures,
        bookingId: bookingId || null,
      });

      setResult(data.result);
      setConfidence(data.confidence);
      setCanSave(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Prediction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 700 }}>Breast Cancer Screening</h2>
            <p style={{ color: "#555" }}>
              AI-assisted cytology-based tumor screening
            </p>
          </div>

          <input
            type="number"
            placeholder="Booking ID (optional)"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={{
              width: "180px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="row">
          {FEATURE_ORDER.map((key) => (
            <div className="col-md-6 mb-3" key={key}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label style={{ fontWeight: 600 }}>
                  {labelMap[key]}
                </label>
                <span style={{ fontSize: "0.8rem", color: "#777" }}>
                  Avg: {avgMap[key]}
                </span>
              </div>

              <input
                type="number"
                min="1"
                max="10"
                value={features[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
                onFocus={(e) =>
                  (e.target.style.border = "1px solid #7C3AED")
                }
                onBlur={(e) =>
                  (e.target.style.border = "1px solid #ccc")
                }
              />
            </div>
          ))}
        </div>

        <div
          style={{
            minHeight: "90px",
            marginTop: "20px",
            padding: "16px",
            background: "#f7f7fb",
            borderRadius: "8px",
          }}
        >
          {!result && !loading && (
            <span style={{ color: "#777" }}>
              Prediction result will appear here
            </span>
          )}

          {loading && <span>🧠 Running AI screening...</span>}

          {result && (
            <>
              <h5>
                {result === "High"
                  ? "High Risk of Malignancy"
                  : "Low Risk (Benign)"}
              </h5>
              {confidence !== null && (
                <small>
                  Confidence: {(confidence * 100).toFixed(1)}%
                </small>
              )}
            </>
          )}
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#ffb4b4" }}>
            {error}
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <button
            disabled={!allFilled || loading || result}
            onClick={handlePredict}
            className="btn"
            style={{
              backgroundColor:
                allFilled && !result ? "#dc3545" : "#aaa",
              color: "#fff",
              width: "140px",
            }}
          >
            {loading ? "Analyzing..." : "Predict"}
          </button>

          <button
            disabled={!canSave}
            className="btn"
            style={{
              backgroundColor: canSave ? "#28a745" : "#aaa",
              color: "#fff",
              width: "140px",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreastCancer;
