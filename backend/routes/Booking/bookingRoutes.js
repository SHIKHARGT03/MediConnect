import express from "express";
import {
  createBookingRequest,
  getAllBookingRequests,
  getBookingsForHospital,
  getBookingsForPatient,
  getBookingById,
  updateBookingStatus,
  getUpcomingBookingsForPatient,
  getPastBookingsForPatient,
  createFollowUpBooking,   
  getHospitalScheduleOverview,
  getHospitalScheduleBookings,
  startVideoConsultation,
  endVideoConsultation
} from "../../controllers/Booking/bookingController.js";

const router = express.Router();

// Create a new booking request
router.post("/", createBookingRequest);

// Get all bookings (admin/debug)
router.get("/", getAllBookingRequests);

// Get bookings by hospital ID
router.get("/hospital/:hospitalId", getBookingsForHospital);

// Get bookings by patient ID (all)
router.get("/patient/:patientId", getBookingsForPatient);

// Get upcoming bookings for patient
router.get("/patient/:patientId/upcoming", getUpcomingBookingsForPatient);

// Get past bookings for patient
router.get("/patient/:patientId/past", getPastBookingsForPatient);

// Get booking by bookingId
router.get("/:bookingId", getBookingById);

// Update booking status (by bookingId)
router.put("/:bookingId/status", updateBookingStatus);

// Create follow-up booking
router.post("/:bookingId/followup", createFollowUpBooking);

// Overview (counts for hero section)
router.get("/:hospitalId/overview", getHospitalScheduleOverview);

// Filtered bookings list
router.get("/:hospitalId/bookings", getHospitalScheduleBookings);

router.put("/:bookingId/start-call", startVideoConsultation);

router.put("/:bookingId/end-call", endVideoConsultation);


export default router;
