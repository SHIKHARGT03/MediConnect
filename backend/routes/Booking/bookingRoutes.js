import express from "express";
import {
  createBookingRequest,
  getAllBookingRequests,
  getBookingsForHospital,
  getBookingsForPatient,
  updateBookingStatus,
} from "../../controllers/Booking/bookingController.js";

const router = express.Router();

// Create a new booking request
router.post("/", createBookingRequest);

// Get all bookings (for admin/debug)
router.get("/", getAllBookingRequests);

// Get bookings by hospital ID
router.get("/hospital/:hospitalId", getBookingsForHospital);

// Get bookings by patient ID
router.get("/patient/:patientId", getBookingsForPatient);

// Update booking status
router.put("/:id/status", updateBookingStatus);

export default router;
