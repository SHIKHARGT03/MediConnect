import { useState } from "react";
import { runDiseasePrediction } from "../../api/mlPrediction.api";

const BrainStroke = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [canSave, setCanSave] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setConfidence(null);
    setCanSave(false);
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    setConfidence(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      if (bookingId) formData.append("bookingId", bookingId);

      const data = await runDiseasePrediction("brain_stroke", formData);

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
      <div>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 700 }}>Brain Stroke Screening</h2>
            <p style={{ color: "#555" }}>
              AI-assisted screening using deep learning on brain scan images
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

        {/* MODEL INFO */}
        <div
          style={{
            background: "#f7f7fb",
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>Deep Learning Model (CNN)</strong>
          <p style={{ marginBottom: 0, color: "#555", fontSize: "0.95rem" }}>
            The uploaded brain scan is analyzed using a convolutional neural
            network trained to detect stroke-related patterns. This tool assists
            clinicians and does not replace diagnosis.
          </p>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: "6px" }}>
            Upload Brain Scan (JPG / PNG)
          </label>

          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          {preview && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "260px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>

        {/* RESULT */}
        <div
          style={{
            minHeight: "110px",
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

          {loading && <span>🧠 Analyzing brain scan using deep learning...</span>}

          {result && (
            <>
              <h5>
                {result === "Stroke"
                  ? "Stroke Detected"
                  : "No Stroke Detected"}
              </h5>
              <p style={{ marginBottom: 4 }}>
                Based on analysis of the uploaded brain scan.
              </p>
              <small>
                Confidence: {(confidence * 100).toFixed(1)}%
              </small>

              {/* LOW CONFIDENCE WARNING */}
              {confidence < 0.5 && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#fff3cd",
                    borderRadius: "6px",
                    color: "#856404",
                    fontSize: "0.9rem",
                  }}
                >
                  ⚠️ <strong>Low Confidence Warning:</strong> The model confidence
                  is below 50%. Results may be unreliable. Please consider
                  further clinical evaluation.
                </div>
              )}
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
            disabled={!image || loading || result}
            onClick={handlePredict}
            className="btn"
            style={{
              backgroundColor:
                image && !result ? "#dc3545" : "#aaa",
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

export default BrainStroke;
