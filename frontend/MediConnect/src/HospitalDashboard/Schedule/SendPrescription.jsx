// src/HospitalDashboard/Schedule/SendPrescription.jsx
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { uploadPrescriptionForBooking } from "../../api/prescription";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];

export default function SendPrescription({
  bookingId,
  open,
  onClose,
  onSuccess, // callback with prescription
  token,    // optional (if your API helper needs token)
  type = "appointment", // "appointment" or "labTest"
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setNote("");
      setError("");
      setSending(false);
    }
  }, [open]);

  if (!open) return null;

  const onFileSelected = (f) => {
    setError("");
    if (!f) {
      setFile(null);
      return;
    }
    if (!allowedTypes.includes(f.type)) {
      setError("Only .pdf and .jpg files are allowed.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("File too large. Max 8 MB.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    onFileSelected(f);
  };

  const handleBrowse = (e) => {
    const f = e.target.files && e.target.files[0];
    onFileSelected(f);
  };

  const handleSend = async () => {
    setError("");
    if (!file) {
      setError("Please select a file before sending.");
      return;
    }
    setSending(true);
    try {
      // uploadPrescriptionForBooking(bookingId, file, note[, token])
      const res = await uploadPrescriptionForBooking(bookingId, file, note, token);
      // expected res: { message, prescription }
      setSending(false);
      if (onSuccess) onSuccess(res.prescription);
      // Minimal UI feedback (replace with toast if you have one)
      window.alert(res.message || "Sent successfully.");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setSending(false);
      const msg = err?.response?.data?.message || err.message || "Upload failed. Try again.";
      setError(msg);
    }
  };

  return (
    <>
      <div className="sp-overlay" onClick={onClose}>
        <div
          className="sp-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Send Prescription"
        >
          <div className="sp-header">
            <div className="sp-title">
              {type === "labTest" ? "Send Lab Report" : "Send Prescription"}
            </div>
            <button className="sp-close" onClick={onClose} aria-label="Close">×</button>
          </div>

          <div
            className="sp-drop"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()} // discourage quick save
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            {!file ? (
              <>
                <div className="sp-drop-txt">Drag & drop PDF or JPG here, or click to browse</div>
                <div className="sp-drop-sub">Allowed: .pdf, .jpg · Max 8 MB</div>
              </>
            ) : (
              <div className="sp-file-row">
                <div className="sp-file-icon">{file.type === "application/pdf" ? "📄" : "🖼️"}</div>
                <div className="sp-file-info">
                  <div className="sp-file-name">{file.name}</div>
                  <div className="sp-file-size">{Math.round(file.size / 1024)} KB</div>
                </div>
                <button
                  className="sp-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={handleBrowse}
              style={{ display: "none" }}
            />
          </div>

          <label className="sp-note-label">Add Note (optional)</label>
          <textarea
            className="sp-note"
            placeholder="e.g. Take after meals - 1 tablet twice a day"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {error && <div className="sp-error">{error}</div>}

          <div className="sp-actions">
            <button className="sp-cancel" onClick={onClose} disabled={sending}>
              Cancel
            </button>
            <button
              className="sp-send"
              onClick={handleSend}
              disabled={!file || sending}
              title={!file ? "Attach a file to enable" : ""}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded styles - keep all CSS in this component file */}
      <style>{`
        /* overlay */
        .sp-overlay {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(0,0,0,0.18);
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 22px;
          pointer-events: auto;
        }

        /* panel positioned top-left */
        .sp-panel {
          width: 540px;             /* wider */
          margin-left: 14px;
          margin-top: 8px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          padding: 16px 18px;      /* slightly more padding */
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          max-height: 80vh;        /* prevent overflow on small screens */
          overflow: auto;
        }

        /* header */
        .sp-header { display:flex; align-items:center; justify-content:space-between; }
        .sp-title { font-weight:700; font-size:1.03rem; color:#1f1f1f; }
        .sp-close { background:none; border:none; font-size:20px; cursor:pointer; }

        /* drop area */
        .sp-drop {
          border: 2px dashed #e8e8f0;
          min-height: 140px;       /* a bit taller for easier drop */
          border-radius: 10px;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
          cursor: pointer;
        }
        .sp-drop-txt{ font-weight:600; color:#333; }
        .sp-drop-sub{ font-size:12px; color:#666; margin-top:6px; }

        /* file preview */
        .sp-file-row { display:flex; align-items:center; gap:12px; width:100%; }
        .sp-file-icon{ font-size:28px; }
        .sp-file-info{ flex:1; text-align:left; }
        .sp-file-name{ font-weight:700; color:#222; }
        .sp-file-size{ font-size:12px; color:#666; margin-top:2px; }
        .sp-remove{ background:#f3f4f6; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; }

        /* note */
        .sp-note-label{ font-weight:600; color:#111; margin-top:6px; }
        .sp-note{
          width:100%;
          min-height:72px;
          padding:8px 10px;
          border-radius:8px;
          border:1px solid #eef0f6;
          resize:vertical;
          font-size:13px;
        }

        /* error */
        .sp-error{ color:#b91c1c; font-size:13px; margin-top:6px; }

        /* actions */
        .sp-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:6px; }
        .sp-cancel{ background:#f3f4f6; color:#111; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; }
        .sp-send{ background:#6f42c1; color:#fff; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:700; }
        .sp-send[disabled], .sp-cancel[disabled] { opacity:0.6; cursor:not-allowed; }

        /* small responsive fix */
        @media (max-width: 480px) {
          .sp-panel { width: 94%; margin-left: 8px; padding: 12px; }
        }
      `}</style>
    </>
  );
}

SendPrescription.propTypes = {
  bookingId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  token: PropTypes.string,
  type: PropTypes.string,
};
