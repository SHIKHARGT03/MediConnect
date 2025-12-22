import express from "express";
import upload from "../../middleware/upload/fileUpload.js";
import {
  uploadPrescription,
  getPrescriptionByBooking,
  streamPrescriptionFile,
  getSignedPrescriptionUrl,
} from "../../controllers/Prescription/prescriptionController.js";

const router = express.Router();

// Hospital uploads prescription
router.post(
  "/upload/:bookingId",
  upload.single("file"),
  uploadPrescription
);

// Patient & hospital fetch prescription
router.get("/:bookingId", getPrescriptionByBooking);

// Stream prescription file
router.get("/stream/:bookingId", streamPrescriptionFile);

// direct proxy to stream the file (avoids client-side 401)
router.get("/file/:bookingId", streamPrescriptionFile);

// Get signed Cloudinary URL (useful for PDFs/raw resources)
router.get("/signed/:bookingId", getSignedPrescriptionUrl);

export default router;
