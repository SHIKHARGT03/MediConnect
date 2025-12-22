import Prescription from "../../models/Prescription/Prescription.js";
import BookingRequest from "../../models/Booking/BookingRequest.js";
import cloudinary from "../../config/cloudinary.js";
import axios from "axios";
import path from "path";

// ------------------------
// Upload & Create Prescription
// ------------------------
export const uploadPrescription = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { note } = req.body;

    // 1. Validate booking
    const booking = await BookingRequest.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. Validate file
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 3. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mediconnect/prescriptions",
      resource_type: "auto",
    });

    // 4. Save in DB
    const prescription = await Prescription.create({
      bookingId,
      patientId: booking.patientId,
      hospitalId: booking.hospitalId,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      fileType: req.file.mimetype === "application/pdf" ? "pdf" : "jpg",
      note: note || "",
    });

    res.status(201).json({
      message: "Prescription uploaded successfully",
      prescription,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error while uploading prescription" });
  }
};

// ------------------------
// Get Prescription by Booking ID
// ------------------------
export const getPrescriptionByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const prescription = await Prescription.findOne({ bookingId });

    if (!prescription)
      return res.status(404).json({ message: "No prescription found" });

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching prescription" });
  }
};

// stream file proxy (GET /api/prescription/file/:bookingId)
export const streamPrescriptionFile = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const prescription = await Prescription.findOne({ bookingId });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const fileUrl = prescription.fileUrl;
    if (!fileUrl) {
      return res.status(404).json({ message: "No file URL for prescription" });
    }

    // fetch the file from the remote URL as a stream
    const response = await axios.get(fileUrl, {
      responseType: "stream",
      validateStatus: null, // let us handle status codes
    });

    if (response.status >= 400) {
      // bubble up an informative error to the client
      return res
        .status(response.status)
        .send(`Failed to fetch file from storage (status ${response.status})`);
    }

    // set appropriate headers so browser can display inline
    const contentType = response.headers["content-type"] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // try to infer a filename
    const fileName = (prescription.filePublicId ? prescription.filePublicId : path.basename(fileUrl)) + (prescription.fileType === "pdf" ? ".pdf" : "");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    // pipe the remote response stream to the client
    response.data.pipe(res);
  } catch (err) {
    console.error("streamPrescriptionFile error:", err);
    res.status(500).json({ message: "Server error fetching prescription file" });
  }
};

// ------------------------
// Generate signed Cloudinary URL for prescription (GET /api/prescription/signed/:bookingId)
// Useful for raw resources (PDF) where direct access may be restricted.
export const getSignedPrescriptionUrl = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const prescription = await Prescription.findOne({ bookingId });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const publicId = prescription.filePublicId;
    if (!publicId) {
      return res.status(404).json({ message: "No public id for prescription" });
    }

    const resource_type = prescription.fileType === "pdf" ? "raw" : "image";

    // Generate a signed URL using Cloudinary SDK (sign_url true)
    const signedUrl = cloudinary.url(publicId, {
      resource_type,
      type: "upload",
      sign_url: true,
      secure: true,
    });

    return res.json({ url: signedUrl });
  } catch (err) {
    console.error("getSignedPrescriptionUrl error:", err);
    res.status(500).json({ message: "Server error generating signed URL" });
  }
};
