import { useState } from "react";
import { runDiabetesPrediction } from "../../api/mlPrediction.api";

const AVG_VALUES = {
  chol: "≤ 200 mg/dL",
  "stab.glu": "70–99 mg/dL",
  hdl: "≥ 40 mg/dL",
  ratio: "< 5",
  glyhb: "< 5.7%",
  "bp.1s": "≤ 120 mmHg",
  "bp.1d": "≤ 80 mmHg",
  waist: "< 35 in",
  hip: "—",
};

const Diabetes = () => {
  const [features, setFeatures] = useState({});
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [canSave, setCanSave] = useState(false);

  const requiredFields = [
    "chol",
    "stab.glu",
    "hdl",
    "ratio",
    "glyhb",
    "age",
    "bp.1s",
    "bp.1d",
    "waist",
    "hip",
  ];

  const allFilled = requiredFields.every(
    (f) => features[f] !== undefined && features[f] !== ""
  );

  const handleChange = (key, value) => {
    setFeatures({ ...features, [key]: value });
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    setConfidence(null);

    try {
      const numericFeatures = Object.fromEntries(
        requiredFields.map((k) => [k, Number(features[k])])
      );
      const data = await runDiabetesPrediction({
        features: numericFeatures,
        bookingId: bookingId || null,
      });

      setTimeout(() => {
        setResult(data.result);
        setConfidence(data.confidence);
        setCanSave(true);
        setLoading(false);
      }, 3000); // intentional AI delay
    } catch (err) {
      setLoading(false);
      alert("Prediction failed");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        padding: "32px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <style>
        {`
          .mlp-input::placeholder { color: #ffffff; opacity: 1; }
        `}
      </style>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 700 }}>Diabetes Risk Screening</h2>
            <p style={{ color: "#555" }}>
              AI-assisted screening based on metabolic and vitals data
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
            className="mlp-input"
          />
        </div>

        <div className="row">
          {requiredFields.map((key) => (
            <div className="col-md-6 mb-3" key={key}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ fontWeight: 600 }}>
                  {key.replace(".", " ").toUpperCase()}
                </label>
                {AVG_VALUES[key] && (
                  <span style={{ fontSize: "0.8rem", color: "#777" }}>
                    Avg: {AVG_VALUES[key]}
                  </span>
                )}
              </div>

              <input
                type="number"
                value={features[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #7C3AED")}
                onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                className="mlp-input"
              />
            </div>
          ))}
        </div>

        {/* RESULT */}
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
                  ? "High Risk of Diabetes"
                  : "Low Risk of Diabetes"}
              </h5>
              <p style={{ marginBottom: 4 }}>
                Based on the provided clinical parameters.
              </p>
              <small>Confidence: {(confidence * 100).toFixed(1)}%</small>
            </>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
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

        {/* Disclaimer moved to the ML Predict layout */}
      </div>
    </div>
  );
};

export default Diabetes;
